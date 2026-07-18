import api from '../constants/api';

// Ambil soal quiz harian
export const getDailyQuiz = async () => {
  const response = await api.get('/quiz/daily');
  return response.data.data;
};

// Simpan hasil quiz
export const saveQuizResult = async (quizId, score, totalQuestions) => {
  const response = await api.post('/quiz/result', {
    quizId,
    score,
    totalQuestions,
  });
  return response.data;
};