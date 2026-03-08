const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Create a new quiz
router.post('/', quizController.createQuiz);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get a single quiz by ID
router.get('/:id', quizController.getQuizById);

// Submit quiz answers
router.post('/:id/submit', quizController.submitQuiz);

module.exports = router;
