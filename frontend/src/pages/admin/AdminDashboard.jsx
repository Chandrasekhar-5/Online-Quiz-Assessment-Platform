import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import CreateQuizModal from '../../components/Admin/CreateQuizModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadQuizzes();
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

  const loadQuizzes = async () => {
    try {
      const { quizService } = await import('../../services/quizService');
      const data = await quizService.getAdminQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage quizzes, users, and view platform analytics</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
            </div>
            <div className="text-4xl opacity-50">👥</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalQuizzes || 0}</p>
            </div>
            <div className="text-4xl opacity-50">📋</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAttempts || 0}</p>
            </div>
            <div className="text-4xl opacity-50">📊</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Quizzes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeQuizzes || 0}</p>
            </div>
            <div className="text-4xl opacity-50">✅</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Quizzes</h2>
        {quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes created yet. Click "Create New Quiz" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{quiz.category} • {quiz.duration} mins</p>
                <p className="text-sm text-gray-500 mt-2">{quiz.questions?.length || 0} questions</p>
                <div className="flex gap-2 mt-3">
                  <button className="text-blue-600 text-sm hover:underline">Edit</button>
                  <button className="text-red-600 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                        className="bg-blue-600 h-2 rounded-full"
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
                    user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateQuizModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onQuizCreated={() => {
          loadQuizzes();
          loadDashboard();
        }}
      />
    </div>
  );
};

export default AdminDashboard;