import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import QuizzesList from './pages/user/QuizzesList';
import QuizTaking from './components/Quiz/QuizTaking';
import Results from './pages/user/Results';
import AttemptHistory from './pages/user/AttemptHistory';
import Leaderboard from './pages/user/Leaderboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard';
import Layout from './components/Layout/Layout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="quizzes" element={<QuizzesList />} />
        <Route path="quiz/:id" element={<QuizTaking />} />
        <Route path="results/:attemptId" element={<Results />} />
        <Route path="history" element={<AttemptHistory />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="leaderboard/:quizId" element={<Leaderboard />} />
        {user?.role === 'admin' && (
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        )}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;