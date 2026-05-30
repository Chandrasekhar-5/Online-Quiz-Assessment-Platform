const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');


router.use('/auth', authRoutes);


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
      quizzes: '/api/quizzes (coming soon)',
      users: '/api/users (coming soon)',
      admin: '/api/admin (coming soon)'
    }
  });
});

module.exports = router;