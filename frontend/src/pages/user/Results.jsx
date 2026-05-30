import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';

const Results = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    try {
      const data = await attemptService.getAttemptDetails(attemptId);
      setAttempt(data.attempt);
    } catch (error) {
      console.error('Failed to load attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading results...</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Attempt not found</p>
        <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 inline-block">Go to Dashboard</Link>
      </div>
    );
  }

  const isPassed = attempt.percentage >= 60;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="text-center">
          <div className={`inline-flex p-3 rounded-full ${isPassed ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
            <span className="text-3xl">{isPassed ? '🏆' : '📝'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPassed ? 'Congratulations!' : 'Quiz Completed'}
          </h1>
          <p className="text-gray-600">
            You scored {attempt.score} out of {attempt.totalQuestions}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{Math.round(attempt.percentage)}%</div>
            <div className="text-sm text-gray-500 mt-1">Score Percentage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{attempt.correctAnswers}</div>
            <div className="text-sm text-gray-500 mt-1">Correct Answers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-600">
              <span>⏱️</span>
              <span>{Math.floor(attempt.timeTaken / 60)}:{String(attempt.timeTaken % 60).padStart(2, '0')}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Time Taken</div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Link to="/dashboard" className="btn-outline">
            Back to Dashboard
          </Link>
          <Link to={`/quiz/${attempt.quiz._id}`} className="btn-primary flex items-center gap-2">
            <span>🔄</span>
            Retake Quiz
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Question Review</h2>
        <div className="space-y-4">
          {attempt.answers.map((answer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">
                  Question {index + 1}: {answer.question}
                </h3>
                {answer.isCorrect ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="text-red-500 text-xl">✗</span>
                )}
              </div>
              <div className="space-y-2">
                {answer.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      optIndex === answer.correctAnswer
                        ? 'bg-green-50 border border-green-200'
                        : optIndex === answer.selectedOption && !answer.isCorrect
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <span className="text-sm text-gray-700">{option}</span>
                      {optIndex === answer.correctAnswer && (
                        <span className="text-xs text-green-600 ml-auto">Correct Answer</span>
                      )}
                      {optIndex === answer.selectedOption && !answer.isCorrect && (
                        <span className="text-xs text-red-600 ml-auto">Your Answer</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;