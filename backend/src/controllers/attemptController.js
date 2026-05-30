const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const existingAttempt = await Attempt.findOne({
      user: userId,
      quiz: quizId,
      status: 'completed'
    });

    const attempt = {
      user: userId,
      quiz: quizId,
      answers: [],
      score: 0,
      totalQuestions: quiz.questions.length,
      correctAnswers: 0,
      percentage: 0,
      timeTaken: 0,
      status: 'in_progress'
    };

    res.json({
      message: 'Attempt started',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        category: quiz.category,
        questions: quiz.questions.map(q => ({
          id: q._id,
          question: q.question,
          options: q.options
        }))
      },
      existingAttempt: existingAttempt || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctCount = 0;
    const formattedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;

      formattedAnswers.push({
        questionId: question._id,
        question: question.question,
        selectedOption: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        options: question.options
      });
    });

    const totalQuestions = quiz.questions.length;
    const score = correctCount;
    const percentage = (correctCount / totalQuestions) * 100;

    const attempt = new Attempt({
      user: userId,
      quiz: quizId,
      answers: formattedAnswers,
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      percentage: percentage,
      timeTaken: timeTaken,
      status: 'completed'
    });

    await attempt.save();

    quiz.totalAttempts += 1;
    const totalScoreSum = (quiz.averageScore * (quiz.totalAttempts - 1)) + percentage;
    quiz.averageScore = totalScoreSum / quiz.totalAttempts;
    await quiz.save();

    res.json({
      message: 'Quiz submitted successfully',
      attempt: {
        id: attempt._id,
        score: score,
        totalQuestions: totalQuestions,
        correctAnswers: correctCount,
        percentage: percentage,
        timeTaken: timeTaken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const attempts = await Attempt.find({ user: userId, status: 'completed' })
      .populate('quiz', 'title description category')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attempt.countDocuments({ user: userId, status: 'completed' });

    res.json({
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.userId;

    const attempt = await Attempt.findOne({ _id: attemptId, user: userId })
      .populate('quiz', 'title description category duration');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.json({ attempt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await Attempt.find({ quiz: quizId, status: 'completed' })
      .populate('user', 'name email')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(parseInt(limit));

    const quiz = await Quiz.findById(quizId).select('title');

    res.json({
      quiz: quiz,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userName: entry.user.name,
        userEmail: entry.user.email,
        score: entry.score,
        totalQuestions: entry.totalQuestions,
        percentage: entry.percentage,
        timeTaken: entry.timeTaken,
        completedAt: entry.completedAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalAttempts = await Attempt.countDocuments({ user: userId, status: 'completed' });
    
    const averageScore = await Attempt.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$percentage' } } }
    ]);

    const bestScore = await Attempt.findOne({ user: userId, status: 'completed' })
      .sort({ percentage: -1 });

    const totalQuizzes = await Attempt.distinct('quiz', { user: userId, status: 'completed' });

    const recentAttempts = await Attempt.find({ user: userId, status: 'completed' })
      .populate('quiz', 'title')
      .sort({ completedAt: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalAttempts,
        averageScore: averageScore[0]?.avg || 0,
        bestScore: bestScore?.percentage || 0,
        uniqueQuizzes: totalQuizzes.length
      },
      recentAttempts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
  getUserAttempts,
  getAttemptDetails,
  getLeaderboard,
  getUserStatistics
};