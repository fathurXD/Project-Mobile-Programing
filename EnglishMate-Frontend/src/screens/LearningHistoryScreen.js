import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getLearningHistory } from '../services/progressService';

const courseConfig = {
  Writing:   { icon: '✍️', color: '#E8F4FD', accentColor: '#2196F3' },
  Listening: { icon: '🎧', color: '#FFF3E0', accentColor: '#FF9800' },
  Reading:   { icon: '📖', color: '#F3E5F5', accentColor: '#9C27B0' },
  Quiz:      { icon: '🎯', color: '#E8F5E9', accentColor: '#4CAF50' },
};

export default function LearningHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');

  const filters = ['Semua', 'Writing', 'Listening', 'Reading', 'Quiz'];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getLearningHistory();
      setHistory(data);
    } catch (err) {
      console.error('Gagal load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = filter === 'Semua'
    ? history
    : history.filter(item => item.course_type === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScorePercentage = (score, total) => {
    if (!total || total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage === 100) return colors.success;
    if (percentage >= 60) return '#FF9800';
    return colors.error;
  };

  const getActivityIcon = (item) => {
    const config = courseConfig[item.course_type] || courseConfig.Quiz;
    return config;
  };

  const getTotalStats = () => {
    const totalXp = history.reduce((sum, item) => sum + (item.xp_earned || 0), 0);
    const totalSessions = history.length;
    const completed = history.filter(item => item.is_completed).length;
    return { totalXp, totalSessions, completed };
  };

  const stats = getTotalStats();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Belajar</Text>
        <TouchableOpacity onPress={loadHistory} style={styles.refreshBtn}>
          <Ionicons name="refresh-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Summary Cards */}
        {!isLoading && history.length > 0 && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>📚</Text>
              <Text style={styles.summaryValue}>{stats.totalSessions}</Text>
              <Text style={styles.summaryLabel}>Total Sesi</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>✅</Text>
              <Text style={styles.summaryValue}>{stats.completed}</Text>
              <Text style={styles.summaryLabel}>Selesai</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryEmoji}>⚡</Text>
              <Text style={styles.summaryValue}>{stats.totalXp}</Text>
              <Text style={styles.summaryLabel}>Total XP</Text>
            </View>
          </View>
        )}

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* History List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Memuat riwayat belajar...</Text>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>
              {filter === 'Semua'
                ? 'Belum ada riwayat belajar'
                : `Belum ada riwayat ${filter}`}
            </Text>
            <Text style={styles.emptySubtitle}>
              Mulai belajar untuk melihat riwayat di sini!
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startBtnText}>Mulai Belajar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              {filteredHistory.length} aktivitas
            </Text>
            {filteredHistory.map((item, index) => {
              const config = getActivityIcon(item);
              const percentage = getScorePercentage(item.score, item.total_exercises);
              const scoreColor = getScoreColor(percentage);

              return (
                <View key={`${item.activity_type}-${index}`} style={styles.historyCard}>
                  {/* Left Icon */}
                  <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
                    <Text style={styles.iconEmoji}>{config.icon}</Text>
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.chapter_title}
                      </Text>
                      <View style={[
                        styles.scoreBadge,
                        { backgroundColor: scoreColor + '20' },
                      ]}>
                        <Text style={[styles.scoreText, { color: scoreColor }]}>
                          {percentage}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardMeta}>
                      <View style={[
                        styles.typeBadge,
                        { backgroundColor: config.accentColor + '15' },
                      ]}>
                        <Text style={[
                          styles.typeBadgeText,
                          { color: config.accentColor },
                        ]}>
                          {item.course_type}
                        </Text>
                      </View>
                      {item.is_completed ? (
                        <View style={styles.completedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color={colors.success}
                          />
                          <Text style={styles.completedText}>Selesai</Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Score Bar */}
                    <View style={styles.scoreBarContainer}>
                      <View style={styles.scoreBarTrack}>
                        <View style={[
                          styles.scoreBarFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: scoreColor,
                          },
                        ]} />
                      </View>
                      <Text style={styles.scoreDetail}>
                        {item.score}/{item.total_exercises} benar
                      </Text>
                    </View>

                    {/* XP & Date */}
                    <View style={styles.cardFooter}>
                      <View style={styles.xpBadge}>
                        <Ionicons name="flash" size={12} color={colors.primary} />
                        <Text style={styles.xpText}>+{item.xp_earned} XP</Text>
                      </View>
                      <Text style={styles.dateText}>
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 24 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
    paddingVertical: 16, borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16, fontWeight: '700', color: colors.textPrimary,
  },
  refreshBtn: { padding: 4 },

  container: { flex: 1, paddingHorizontal: 20 },

  // Summary
  summaryRow: {
    flexDirection: 'row', gap: 10,
    paddingTop: 20, marginBottom: 16,
  },
  summaryCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  summaryEmoji: { fontSize: 22 },
  summaryValue: {
    fontSize: 20, fontWeight: '800', color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 10, color: colors.textSecondary,
    fontWeight: '600', textAlign: 'center',
  },

  // Filter
  filterScroll: { marginBottom: 16 },
  filterContainer: { paddingVertical: 8, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 13, fontWeight: '600', color: colors.textSecondary,
  },
  filterTabTextActive: { color: colors.white },

  // Loading
  loadingContainer: {
    alignItems: 'center', paddingVertical: 60, gap: 12,
  },
  loadingText: { fontSize: 14, color: colors.textSecondary },

  // Empty
  emptyContainer: {
    alignItems: 'center', paddingVertical: 60, gap: 10,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: {
    fontSize: 16, fontWeight: '700', color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },
  startBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
  },
  startBtnText: {
    color: colors.white, fontSize: 14, fontWeight: '700',
  },

  // Section Label
  sectionLabel: {
    fontSize: 12, color: colors.textHint,
    fontWeight: '600', marginBottom: 12,
  },

  // History Card
  historyCard: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: 16, padding: 14, marginBottom: 10,
    gap: 12, borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  iconEmoji: { fontSize: 22 },
  cardContent: { flex: 1, gap: 6 },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 8,
  },
  cardTitle: {
    fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  scoreText: { fontSize: 12, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  completedText: { fontSize: 11, color: colors.success, fontWeight: '600' },

  // Score Bar
  scoreBarContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  scoreBarTrack: {
    flex: 1, height: 6, backgroundColor: colors.border,
    borderRadius: 3, overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreDetail: { fontSize: 11, color: colors.textHint, minWidth: 60 },

  // Card Footer
  cardFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center',
    gap: 3, backgroundColor: colors.primaryLight,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  xpText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  dateText: { fontSize: 11, color: colors.textHint },
});