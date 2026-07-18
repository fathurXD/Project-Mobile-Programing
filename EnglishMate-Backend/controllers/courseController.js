const db = require('../config/db');

// GET semua courses
const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// GET chapters berdasarkan course
const getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const [chapters] = await db.query(
      `SELECT c.*,
        CASE WHEN up.is_completed = 1 THEN 1 ELSE 0 END as is_completed,
        COALESCE(up.score, 0) as user_score,
        COALESCE(up.xp_earned, 0) as user_xp
       FROM chapters c
       LEFT JOIN user_progress up ON c.chapter_id = up.chapter_id AND up.user_id = ?
       WHERE c.course_id = ?
       ORDER BY c.order_number ASC`,
      [userId, courseId]
    );

    // Ambil sections per chapter
    const chaptersWithSections = await Promise.all(
      chapters.map(async (chapter) => {
        const [sections] = await db.query(
          'SELECT * FROM chapter_sections WHERE chapter_id = ? ORDER BY order_number ASC',
          [chapter.chapter_id]
        );
        return { ...chapter, sections };
      })
    );

    res.json({ success: true, data: chaptersWithSections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// GET exercises berdasarkan chapter
const getExercisesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const [exercises] = await db.query(
      'SELECT * FROM exercises WHERE chapter_id = ? ORDER BY order_number ASC',
      [chapterId]
    );

    // Parse JSON options
    const parsed = exercises.map(ex => ({
      ...ex,
      options: ex.options ? JSON.parse(ex.options) : null,
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = { getCourses, getChaptersByCourse, getExercisesByChapter };