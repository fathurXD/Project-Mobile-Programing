import api from '../constants/api';

// Ambil profil terbaru dari server
export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data.data;
};

// Update profil user
export const updateUserProfile = async (name, email, phone) => {
  const response = await api.put('/user/profile/update', { name, email, phone });
  return response.data;
};