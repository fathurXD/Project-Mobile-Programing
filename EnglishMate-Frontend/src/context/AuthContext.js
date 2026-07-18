import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApp, setIsLoadingApp] = useState(true); // loading saat pertama buka app

  // ── Cek token tersimpan saat app pertama dibuka ──
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser  = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);

        // Refresh stats dari server
        try {
          const response = await api.get('/progress/stats');
          const stats = response.data.data;
          setUser(prev => ({
            ...prev,
            totalXp: stats.totalXp,
            streak:  stats.streak,
            level:   stats.level,
          }));
        } catch (e) {
          console.log('Gagal refresh stats:', e.message);
        }
      }
    } catch (error) {
      console.error('Gagal load stored auth:', error);
    } finally {
      setIsLoadingApp(false);
    }
  };

  // ── Login ──
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      const userObj = {
        id:      userData.id,
        name:    userData.name,
        email:   userData.email,
        phone:   userData.phone,
        avatar:  userData.avatar,
        level:   userData.level,
        totalXp: userData.totalXp,
        streak:  userData.streak,
      };

      // Simpan ke AsyncStorage
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userObj));

      setToken(newToken);
      setAuthToken(newToken);
      setUser(userObj);

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Gagal terhubung ke server.';
      return { success: false, message };
    }
  };

  // ── Register ──
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Gagal terhubung ke server.';
      return { success: false, message };
    }
  };

  // ── Logout ──
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Gagal hapus storage:', error);
    }
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  // ── Update Profile (ke database) ──
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const response = await api.put('/user/profile/update', {
        name:  updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
      });

      const updatedUser = {
        ...user,
        name:   response.data.data.name,
        email:  response.data.data.email,
        phone:  response.data.data.phone,
        avatar: updatedData.avatar ?? user?.avatar,
      };

      // Update AsyncStorage dengan data terbaru
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Gagal update profil.';
      return { success: false, message };
    }
  };

  // ── Refresh Stats (XP, streak, level) ──
  const refreshStats = async () => {
    try {
      const response = await api.get('/progress/stats');
      const stats = response.data.data;

      setUser(prev => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          totalXp: stats.totalXp,
          streak:  stats.streak,
          level:   stats.level,
        };
        // Update juga di storage
        AsyncStorage.setItem('user', JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    } catch (error) {
      console.error('Gagal refresh stats:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, isLoadingApp,
      login, register, logout,
      updateProfile, refreshStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);