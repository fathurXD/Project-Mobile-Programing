const db = require('../config/db');

const saveProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chapterId, score, totalExercises, xpEarned } = req.body;
    const isCompleted = score === totalExercises;

    const [existing] = await db.query(
      'SELECT * FROM user_progress WHERE user_id = ? AND chapter_id = ?',
      [userId, chapterId]
    );

    if (existing.length > 0) {
      if (score > existing[0].score) {
        await db.query(
          `UPDATE user_progress
           SET score = ?, xp_earned = ?, is_completed = ?, completed_at = ?
           WHERE user_id = ? AND chapter_id = ?`,
          [score, xpEarned, isCompleted, isCompleted ? new Date() : null, userId, chapterId]
        );
      }
    } else {
      await db.query(
        `INSERT INTO user_progress
         (user_id, chapter_id, score, total_exercises, xp_earned, is_completed, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, chapterId, score, totalExercises, xpEarned, isCompleted, isCompleted ? new Date() : null]
      );
    }

    await db.query(
      'UPDATE users SET total_xp = total_xp + ? WHERE user_id = ?',
      [xpEarned, userId]
    );

    const today = new Date().toISOString().split('T')[0];
    const [streakExist] = await db.query(
      'SELECT * FROM streaks WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (streakExist.length === 0) {
      await db.query(
        'INSERT INTO streaks (user_id, date, is_completed, xp_earned) VALUES (?, ?, TRUE, ?)',
        [userId, today, xpEarned]
      );
      await db.query(
        'UPDATE users SET streak = streak + 1, last_active = ? WHERE user_id = ?',
        [today, userId]
      );
    }

    res.json({ success: true, message: 'Progress berhasil disimpan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [progress] = await db.query(
      `SELECT up.*, c.title as chapter_title, co.type as course_type
       FROM user_progress up
       JOIN chapters c ON up.chapter_id = c.chapter_id
       JOIN courses co ON c.course_id = co.course_id
       WHERE up.user_id = ?`,
      [userId]
    );
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [[user]] = await db.query(
      'SELECT total_xp, streak, level FROM users WHERE user_id = ?',
      [userId]
    );

    const [[quizCount]] = await db.query(
      'SELECT COUNT(*) as total FROM quiz_results WHERE user_id = ?',
      [userId]
    );

    const [[completedChapters]] = await db.query(
      'SELECT COUNT(*) as total FROM user_progress WHERE user_id = ? AND is_completed = TRUE',
      [userId]
    );

    const [streaks] = await db.query(
      `SELECT date, is_completed FROM streaks
       WHERE user_id = ? ORDER BY date DESC LIMIT 7`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        totalXp:           user.total_xp,
        streak:            user.streak,
        level:             user.level,
        quizCompleted:     quizCount.total,
        chaptersCompleted: completedChapters.total,
        streakHistory:     streaks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = { saveProgress, getUserProgress, getUserStats };

// Ambil riwayat belajar lengkap
const getLearningHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Ambil riwayat latihan course
    const [courseHistory] = await db.query(
      `SELECT 
        up.progress_id,
        up.score,
        up.total_exercises,
        up.xp_earned,
        up.is_completed,
        up.completed_at,
        up.created_at,
        c.title as chapter_title,
        co.type as course_type,
        'exercise' as activity_type
       FROM user_progress up
       JOIN chapters c ON up.chapter_id = c.chapter_id
       JOIN courses co ON c.course_id = co.course_id
       WHERE up.user_id = ?
       ORDER BY up.created_at DESC`,
      [userId]
    );

    // Ambil riwayat quiz harian
    const [quizHistory] = await db.query(
      `SELECT 
        qr.result_id,
        qr.score,
        qr.total_questions as total_exercises,
        qr.xp_earned,
        qr.played_at as created_at,
        'Daily Quiz' as chapter_title,
        'Quiz' as course_type,
        'quiz' as activity_type
       FROM quiz_results qr
       WHERE qr.user_id = ?
       ORDER BY qr.played_at DESC`,
      [userId]
    );

    // Gabungkan dan urutkan berdasarkan tanggal
    const allHistory = [...courseHistory, ...quizHistory].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({ success: true, data: allHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = { saveProgress, getUserProgress, getUserStats, getLearningHistory };