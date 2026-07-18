const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

router.get('/daily',  auth, quizController.getDailyQuiz);
router.post('/result', auth, quizController.saveQuizResult);

module.exports = router;