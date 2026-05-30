import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { quizService } from '../../services/quizService';
import { attemptService } from '../../services/attemptService';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadQuiz = async () => {
    try {
      const data = await attemptService.startAttempt(id);
      setQuiz(data.quiz);
      setTimeLeft(data.quiz.duration * 60);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    const answersArray = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      answersArray.push(answers[i] !== undefined ? answers[i] : -1);
    }
    
    const timeSpent = (quiz.duration * 60) - timeLeft;
    
    try {
      const result = await attemptService.submitAttempt(id, {
        answers: answersArray,
        timeTaken: timeSpent
      });
      toast.success('Quiz submitted successfully');
      navigate(`/results/${result.attempt.id}`);
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
            <div className="bg-white px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold text-primary-600">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h2>
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length} answered
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl text-gray-900 mb-6">{quiz.questions[currentQuestion].question}</h3>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <label key={idx} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={answers[currentQuestion] === idx}
                    onChange={() => handleAnswer(currentQuestion, idx)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              currentQuestion === idx
                ? 'bg-primary-600 text-white'
                : answers[idx] !== undefined
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizTaking;