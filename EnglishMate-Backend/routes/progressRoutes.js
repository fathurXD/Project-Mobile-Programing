const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const progressController = require('../controllers/progressController');

router.get('/',        auth, progressController.getUserProgress);
router.get('/stats',   auth, progressController.getUserStats);
router.post('/save',   auth, progressController.saveProgress);
router.get('/history', auth, progressController.getLearningHistory);

module.exports = router;