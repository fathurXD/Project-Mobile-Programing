import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.60:5000/api'; // ganti dengan IP Anda

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  return api.defaults.headers.common['Authorization'];
};

export default api;