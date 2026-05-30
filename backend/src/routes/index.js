const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      quizzes: '/api/quizzes',
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

module.exports = router;