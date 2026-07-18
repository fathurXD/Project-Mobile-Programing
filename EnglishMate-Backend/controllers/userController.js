const db = require('../config/db');

// GET profile user
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [[user]] = await db.query(
      'SELECT user_id, name, email, phone, avatar, level, total_xp, streak FROM users WHERE user_id = ?',
      [userId]
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// UPDATE profile user
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi' });
    }

    // Cek apakah email sudah dipakai user lain
    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
      [email, userId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah digunakan akun lain' });
    }

    await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?',
      [name, email, phone || null, userId]
    );

    // Ambil data terbaru
    const [[updatedUser]] = await db.query(
      'SELECT user_id, name, email, phone, avatar, level, total_xp, streak FROM users WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

module.exports = { getProfile, updateProfile };