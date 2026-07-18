const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'EnglishMate API berjalan dengan baik! 🚀' });
});

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/courses',  require('./routes/courseRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/quiz',     require('./routes/quizRoutes'));
app.use('/api/user',     require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});