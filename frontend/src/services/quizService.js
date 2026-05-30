import api from './api';

export const quizService = {
  getAllQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  getQuizById: async (id, includeAnswers = false) => {
    const params = includeAnswers ? { details: 'true' } : {};
    const response = await api.get(`/quizzes/${id}`, { params });
    return response.data;
  },

  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/quizzes/categories');
    return response.data;
  },

  getAdminQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes/admin', { params });
    return response.data;
  }
};