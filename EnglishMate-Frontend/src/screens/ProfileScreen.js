import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, Alert, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import { getUserStats } from '../services/progressService';

const menuItems = [
  { id: '1', title: 'Edit Profil',       icon: 'person-outline',           color: colors.primary },
  { id: '2', title: 'Riwayat Belajar',   icon: 'time-outline',             color: '#FF9800' },
  { id: '3', title: 'Pengaturan',         icon: 'settings-outline',         color: '#607D8B' },
  { id: '4', title: 'Bantuan',            icon: 'help-circle-outline',      color: '#4CAF50' },
  { id: '5', title: 'Tentang Aplikasi',   icon: 'information-circle-outline', color: '#9C27B0' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh stats setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await getUserStats();
      setStats(data);
    } catch (err) {
      console.error('Gagal load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah kamu yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.title === 'Edit Profil') {
      navigation.navigate('EditProfile');
    } else if (item.title === 'Riwayat Belajar') {
      navigation.navigate('LearningHistory');
    } else {
      Alert.alert(item.title, 'Fitur ini akan segera hadir!');
    }
  };

  // Tentukan level badge
  const getLevelInfo = (level) => {
    switch (level) {
      case 'Intermediate': return { emoji: '🌿', color: '#2196F3' };
      case 'Advanced':     return { emoji: '🌳', color: '#9C27B0' };
      default:             return { emoji: '🌱', color: colors.primary };
    }
  };

  const currentLevel = stats?.level || user?.level || 'Beginner';
  const levelInfo = getLevelInfo(currentLevel);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity onPress={loadStats} style={styles.refreshBtn}>
            <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Avatar & Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={colors.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          {user?.phone ? (
            <Text style={styles.userPhone}>📱 {user.phone}</Text>
          ) : null}

          {/* Level Badge */}
          <View style={[styles.levelBadge, { backgroundColor: levelInfo.color + '20', borderColor: levelInfo.color + '40' }]}>
            <Text style={[styles.levelBadgeText, { color: levelInfo.color }]}>
              {levelInfo.emoji} {currentLevel}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        {isLoading ? (
          <View style={styles.statsLoading}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.statsLoadingText}>Memuat statistik...</Text>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{stats?.streak || 0}</Text>
              <Text style={styles.statLabel}>Hari Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{stats?.totalXp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{stats?.quizCompleted || 0}</Text>
              <Text style={styles.statLabel}>Quiz Selesai</Text>
            </View>
          </View>
        )}

        {/* Progress Chapter */}
        {!isLoading && stats ? (
          <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <Text style={styles.progressCardTitle}>📚 Chapter Selesai</Text>
              <Text style={styles.progressCardValue}>
                {stats.chaptersCompleted || 0} Chapter
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[
                styles.progressBarFill,
                { width: `${Math.min(((stats.chaptersCompleted || 0) / 9) * 100, 100)}%` },
              ]} />
            </View>
            <Text style={styles.progressCardSub}>
              {stats.chaptersCompleted || 0} dari 9 chapter telah diselesaikan
            </Text>
          </View>
        ) : null}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>EnglishMate v1.0.0</Text>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: {
    paddingTop: 20, paddingBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  refreshBtn: { padding: 4 },

  // Profile Card
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.surface, justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: colors.border,
  },
  avatarImage: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: colors.border,
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary, justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: colors.white,
  },
  userName: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  userEmail: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  userPhone: { fontSize: 12, color: colors.textSecondary, marginBottom: 10 },
  levelBadge: {
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, marginTop: 6,
  },
  levelBadgeText: { fontSize: 12, fontWeight: '700' },

  // Stats Loading
  statsLoading: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 20, marginBottom: 16,
  },
  statsLoadingText: { fontSize: 13, color: colors.textSecondary },

  // Stats Row
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  // Progress Card
  progressCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border, gap: 8,
  },
  progressCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  progressCardTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  progressCardValue: { fontSize: 14, fontWeight: '700', color: colors.primary },
  progressBarTrack: {
    height: 8, backgroundColor: colors.border,
    borderRadius: 4, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: colors.primary, borderRadius: 4,
  },
  progressCardSub: { fontSize: 11, color: colors.textSecondary },

  // Menu
  menuSection: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 16, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconContainer: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  menuTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.error, marginBottom: 16,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: colors.error },

  // Version
  versionText: { textAlign: 'center', fontSize: 12, color: colors.textHint, marginBottom: 8 },
});