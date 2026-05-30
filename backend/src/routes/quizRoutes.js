const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getCategories,
  getAdminQuizzes
} = require('../controllers/quizController');
const { authenticate, authorizeAdmin, optionalAuth } = require('../middlewares/authMiddleware');

const quizValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }),
  body('description').notEmpty().withMessage('Description is required').isLength({ min: 10, max: 500 }),
  body('duration').isInt({ min: 1, max: 180 }).withMessage('Duration must be between 1 and 180 minutes'),
  body('category').notEmpty().withMessage('Category is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
];

router.post('/', authenticate, authorizeAdmin, quizValidation, createQuiz);
router.get('/', optionalAuth, getAllQuizzes);
router.get('/categories', getCategories);
router.get('/admin', authenticate, authorizeAdmin, getAdminQuizzes);
router.get('/:id', optionalAuth, getQuizById);
router.put('/:id', authenticate, authorizeAdmin, updateQuiz);
router.delete('/:id', authenticate, authorizeAdmin, deleteQuiz);

module.exports = router;