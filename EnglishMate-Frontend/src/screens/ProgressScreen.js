import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import colors from '../constants/colors';
import { getUserStats } from '../services/progressService';

const DAILY_GOAL = 20;

function ProgressBar({ progress, color = colors.primary }) {
  return (
    <View style={styles.progressBarTrack}>
      <View style={[styles.progressBarFill, {
        width: `${Math.min(progress * 100, 100)}%`,
        backgroundColor: color,
      }]} />
    </View>
  );
}

export default function ProgressScreen() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (err) {
      console.error('Error load stats:', err);
      setError('Gagal memuat data progress.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelProgress = (level) => {
    if (level === 'Beginner') return 0.4;
    if (level === 'Intermediate') return 0.7;
    return 1.0;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dailyXp = stats?.totalXp % DAILY_GOAL || 0;
  const dailyProgress = dailyXp / DAILY_GOAL;

  // Buat streak 7 hari
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const streakHistory = stats?.streakHistory || [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress Learning</Text>
          <Text style={styles.headerSubtitle}>Cek progress belajarmu dan raih materi baru!</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadStats}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Level Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level</Text>
              <Text style={styles.sectionSubtitle}>Kejari levelmu selanjutnya!</Text>

              {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                const isActive = stats?.level === level;
                const isDone = (
                  (level === 'Beginner' && ['Intermediate', 'Advanced'].includes(stats?.level)) ||
                  (level === 'Intermediate' && stats?.level === 'Advanced')
                );
                return (
                  <View key={level} style={[styles.levelCard, isActive && styles.levelCardActive]}>
                    <View style={styles.levelCardLeft}>
                      <Text style={styles.levelIcon}>
                        {isDone ? '✅' : isActive ? '🌱' : '🔒'}
                      </Text>
                      <View style={styles.levelInfo}>
                        <Text style={[styles.levelTitle, !isActive && !isDone && styles.levelTitleInactive]}>
                          {level}
                        </Text>
                        <Text style={styles.levelDesc}>
                          {isActive ? 'Kamu sedang di level ini!'
                            : isDone ? 'Level ini sudah selesai!'
                              : 'Selesaikan level sebelumnya'}
                        </Text>
                        {isActive && (
                          <View style={styles.levelProgressContainer}>
                            <ProgressBar progress={getLevelProgress(level)} />
                            <Text style={styles.levelProgressText}>
                              {Math.round(getLevelProgress(level) * 100)}% selesai
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Streak Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Progress Bar</Text>
              <Text style={styles.sectionSubtitle}>Jangan lupakan streak harianmu!</Text>

              <View style={styles.progressCard}>
                <View style={styles.streakRow}>
                  {days.map((day, index) => {
                    const isActive = index < (stats?.streak || 0) % 7;
                    return (
                      <View key={day} style={styles.streakDayContainer}>
                        <View style={[styles.streakDot, isActive && styles.streakDotActive]}>
                          {isActive && <Ionicons name="checkmark" size={12} color={colors.white} />}
                        </View>
                        <Text style={styles.streakDayLabel}>{day}</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.streakDivider} />
                <Text style={styles.streakInfo}>
                  🔥 Streak <Text style={styles.streakHighlight}>{stats?.streak || 0} hari</Text> berturut-turut!
                </Text>
              </View>
            </View>

            {/* Daily Goal Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Goal</Text>
              <Text style={styles.sectionSubtitle}>Targetkan XP harianmu!</Text>

              <View style={styles.dailyGoalCard}>
                <View style={styles.dailyGoalLeft}>
                  <Text style={styles.dailyGoalLabel}>DAILY GOAL</Text>
                  <Text style={styles.dailyGoalXP}>
                    {dailyXp}/{DAILY_GOAL} <Text style={styles.dailyGoalUnit}>xp</Text>
                  </Text>
                  <ProgressBar progress={dailyProgress} />
                  <Text style={styles.dailyGoalRemaining}>
                    {Math.max(DAILY_GOAL - dailyXp, 0)} XP lagi untuk mencapai target!
                  </Text>
                </View>
                <View style={styles.dailyGoalCircle}>
                  <Ionicons name="flash" size={28} color={colors.primary} />
                  <Text style={styles.dailyGoalPercent}>
                    {Math.round(Math.min(dailyProgress * 100, 100))}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistik</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>⚡</Text>
                  <Text style={styles.statValue}>{stats?.totalXp || 0}</Text>
                  <Text style={styles.statLabel}>Total XP</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>🎯</Text>
                  <Text style={styles.statValue}>{stats?.quizCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Quiz Selesai</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>📚</Text>
                  <Text style={styles.statValue}>{stats?.chaptersCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Chapter Selesai</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  header: { paddingTop: 20, paddingBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: colors.textSecondary, marginBottom: 14 },
  errorContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  errorText: { fontSize: 14, color: colors.textSecondary },
  retryBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 10,
  },
  retryText: { fontSize: 14, fontWeight: '700', color: colors.white },
  levelCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1.5, borderColor: colors.border,
  },
  levelCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  levelCardLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 12 },
  levelIcon: { fontSize: 24, marginTop: 2 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  levelTitleInactive: { color: colors.textSecondary },
  levelDesc: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
  levelProgressContainer: { gap: 4 },
  levelProgressText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  progressBarTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: colors.border,
  },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  streakDayContainer: { alignItems: 'center', gap: 6 },
  streakDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  streakDotActive: { backgroundColor: colors.primary },
  streakDayLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  streakDivider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  streakInfo: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  streakHighlight: { color: colors.primary, fontWeight: '700' },
  dailyGoalCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: colors.primary,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  dailyGoalLeft: { flex: 1, marginRight: 16, gap: 6 },
  dailyGoalLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1 },
  dailyGoalXP: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  dailyGoalUnit: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  dailyGoalRemaining: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  dailyGoalCircle: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 3, borderColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', gap: 2,
  },
  dailyGoalPercent: { fontSize: 12, fontWeight: '700', color: colors.primary },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
});