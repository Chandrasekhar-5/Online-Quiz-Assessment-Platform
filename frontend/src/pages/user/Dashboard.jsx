import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsData, quizzesData] = await Promise.all([
        attemptService.getUserStatistics(),
        quizService.getAllQuizzes({ limit: 5 })
      ]);
      setStatistics(statsData.statistics);
      setRecentAttempts(statsData.recentAttempts);
      setRecentQuizzes(quizzesData.quizzes);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Track your quiz performance and continue learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-gray-500 text-sm">Total Attempts</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{statistics?.totalAttempts || 0}</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm">Average Score</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">{Math.round(statistics?.averageScore || 0)}%</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm">Best Score</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{Math.round(statistics?.bestScore || 0)}%</div>
        </div>
        <div className="card">
          <div className="text-gray-500 text-sm">Quizzes Taken</div>
          <div className="text-3xl font-bold text-secondary-600 mt-2">{statistics?.uniqueQuizzes || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attempts</h2>
          {recentAttempts.length === 0 ? (
            <p className="text-gray-500">No attempts yet. Start a quiz to see your results!</p>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <Link
                  key={attempt._id}
                  to={`/results/${attempt._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{attempt.quiz.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">{Math.round(attempt.percentage)}%</div>
                      <div className="text-sm text-gray-500">{attempt.score}/{attempt.totalQuestions}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Quizzes</h2>
          {recentQuizzes.length === 0 ? (
            <p className="text-gray-500">No quizzes available yet.</p>
          ) : (
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <Link
                  key={quiz._id}
                  to={`/quiz/${quiz._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">{quiz.category} • {quiz.duration} mins</p>
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">Start Quiz</button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;