const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  selectedOption: {
    type: Number,
    required: true,
    min: -1,
    max: 3
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  options: [String]
});

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Time taken in seconds'
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'abandoned'],
    default: 'completed'
  }
}, {
  timestamps: true
});


attemptSchema.index({ user: 1, quiz: 1 });
attemptSchema.index({ quiz: 1, percentage: -1 });
attemptSchema.index({ completedAt: -1 });


attemptSchema.statics.getRankForAttempt = async function(quizId, score) {
  const higherScores = await this.countDocuments({
    quiz: quizId,
    score: { $gt: score },
    status: 'completed'
  });
  return higherScores + 1;
};

module.exports = mongoose.model('Attempt', attemptSchema);