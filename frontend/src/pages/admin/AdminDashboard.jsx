import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, FileText, Activity, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
      setRecentAttempts(data.recentAttempts);
      setCategoryStats(data.categoryStats);
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of platform statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
            </div>
            <Users size={40} className="text-primary-500 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalQuizzes || 0}</p>
            </div>
            <FileText size={40} className="text-secondary-500 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAttempts || 0}</p>
            </div>
            <Activity size={40} className="text-accent-500 opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Quizzes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeQuizzes || 0}</p>
            </div>
            <CheckCircle size={40} className="text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Categories</h2>
          {categoryStats.length === 0 ? (
            <p className="text-gray-500">No categories available</p>
          ) : (
            <div className="space-y-3">
              {categoryStats.map((cat) => (
                <div key={cat._id} className="flex justify-between items-center">
                  <span className="text-gray-700">{cat._id}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(cat.count / stats.totalQuizzes) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500">No users yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h2>
          {recentAttempts.length === 0 ? (
            <p className="text-gray-500">No attempts yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quiz</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Percentage</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{attempt.user?.name || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{attempt.quiz?.title || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{attempt.score}/{attempt.totalQuestions}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="font-semibold text-primary-600">{Math.round(attempt.percentage)}%</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;