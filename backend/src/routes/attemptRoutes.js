const express = require('express');
const router = express.Router();
const {
  startAttempt,
  submitAttempt,
  getUserAttempts,
  getAttemptDetails,
  getLeaderboard,
  getUserStatistics
} = require('../controllers/attemptController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/quizzes/:quizId/start', startAttempt);
router.post('/quizzes/:quizId/submit', submitAttempt);
router.get('/my-attempts', getUserAttempts);
router.get('/attempts/:attemptId', getAttemptDetails);
router.get('/leaderboard/:quizId', getLeaderboard);
router.get('/my-statistics', getUserStatistics);

module.exports = router;