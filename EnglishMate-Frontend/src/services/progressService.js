import api from '../constants/api';

export const getUserStats = async () => {
  const response = await api.get('/progress/stats');
  return response.data.data;
};

export const getUserProgress = async () => {
  const response = await api.get('/progress');
  return response.data.data;
};

// Tambahkan fungsi baru ini
export const getLearningHistory = async () => {
  const response = await api.get('/progress/history');
  return response.data.data;
};