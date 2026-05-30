import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { Clock, Award, Eye } from 'lucide-react';

const AttemptHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAttempts();
  }, [currentPage]);

  const loadAttempts = async () => {
    setLoading(true);
    try {
      const data = await attemptService.getUserAttempts({ page: currentPage, limit: 10 });
      setAttempts(data.attempts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading history...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attempt History</h1>
        <p className="text-gray-600 mt-1">Review your past quiz attempts</p>
      </div>

      {attempts.length === 0 ? (
        <div className="card text-center py-12">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No attempts yet</h3>
          <p className="text-gray-500 mt-1">Start taking quizzes to see your history</p>
          <Link to="/quizzes" className="btn-primary mt-4 inline-block">Browse Quizzes</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {attempt.quiz.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{attempt.quiz.category}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        Score: {attempt.score}/{attempt.totalQuestions}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {Math.round(attempt.percentage)}%
                      </div>
                      <div className="text-xs text-gray-500">Percentage</div>
                    </div>
                    <Link
                      to={`/results/${attempt._id}`}
                      className="btn-outline flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-outline disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-outline disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttemptHistory;