import api from '../constants/api';

// Ambil semua courses
export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data.data;
};

// Ambil chapters berdasarkan courseId
export const getChaptersByCourse = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/chapters`);
  return response.data.data;
};

// Ambil exercises berdasarkan chapterId
export const getExercisesByChapter = async (chapterId) => {
  const response = await api.get(`/courses/chapters/${chapterId}/exercises`);
  return response.data.data;
};

// Simpan progress latihan
export const saveProgress = async (chapterId, score, totalExercises, xpEarned) => {
  const response = await api.post('/progress/save', {
    chapterId,
    score,
    totalExercises,
    xpEarned,
  });
  return response.data;
};