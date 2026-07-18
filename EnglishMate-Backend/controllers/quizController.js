const db = require('../config/db');

const getDailyQuiz = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Coba ambil soal untuk hari ini dulu
    let [quizzes] = await db.query(
      'SELECT * FROM daily_quizzes WHERE available_date = ?',
      [today]
    );

    // Jika tidak ada soal untuk hari ini, ambil semua soal yang tersedia
    if (quizzes.length === 0) {
      [quizzes] = await db.query(
        'SELECT * FROM daily_quizzes ORDER BY quiz_id ASC'
      );

      // Update tanggal soal ke hari ini agar tersedia
      if (quizzes.length > 0) {
        await db.query(
          'UPDATE daily_quizzes SET available_date = ?',
          [today]
        );
      }
    }

    const parsed = quizzes.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

const saveQuizResult = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { quizId, score, totalQuestions } = req.body;
    const xpEarned = score * 2;

    await db.query(
      'INSERT INTO quiz_results (user_id, quiz_id, score, total_questions, xp_earned) VALUES (?, ?, ?, ?, ?)',
      [userId, quizId, score, totalQuestions, xpEarned]
    );

    await db.query(
      'UPDATE users SET total_xp = total_xp + ? WHERE user_id = ?',
      [xpEarned, userId]
    );

    res.json({
      success: true,
      message: 'Hasil quiz berhasil disimpan',
      xpEarned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = { getDailyQuiz, saveQuizResult };