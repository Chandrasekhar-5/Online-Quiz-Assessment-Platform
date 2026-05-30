import api from './api';

export const attemptService = {
  startAttempt: async (quizId) => {
    const response = await api.get(`/attempts/quizzes/${quizId}/start`);
    return response.data;
  },

  submitAttempt: async (quizId, data) => {
    const response = await api.post(`/attempts/quizzes/${quizId}/submit`, data);
    return response.data;
  },

  getUserAttempts: async (params = {}) => {
    const response = await api.get('/attempts/my-attempts', { params });
    return response.data;
  },

  getAttemptDetails: async (attemptId) => {
    const response = await api.get(`/attempts/attempts/${attemptId}`);
    return response.data;
  },

  getLeaderboard: async (quizId, limit = 10) => {
    const response = await api.get(`/attempts/leaderboard/${quizId}`, { params: { limit } });
    return response.data;
  },

  getUserStatistics: async () => {
    const response = await api.get('/attempts/my-statistics');
    return response.data;
  }
};

// changed file name