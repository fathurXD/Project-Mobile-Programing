const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

router.get('/',                              auth, courseController.getCourses);
router.get('/:courseId/chapters',            auth, courseController.getChaptersByCourse);
router.get('/chapters/:chapterId/exercises', auth, courseController.getExercisesByChapter);

module.exports = router;