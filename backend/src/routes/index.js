const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const quizRoutes = require('./quizRoutes');
const attemptRoutes = require('./attemptRoutes');

router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/attempts', attemptRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      quizzes: '/api/quizzes',
      attempts: '/api/attempts'
    }
  });
});

module.exports = router;