import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getChaptersByCourse } from '../services/courseService';

const courseConfig = {
  Writing:   { icon: '✍️', color: '#E8F4FD', accentColor: '#2196F3', description: 'Pelajari cara menulis dalam bahasa Inggris.' },
  Listening: { icon: '🎧', color: '#FFF3E0', accentColor: '#FF9800', description: 'Latih kemampuan mendengar bahasa Inggris.' },
  Reading:   { icon: '📖', color: '#F3E5F5', accentColor: '#9C27B0', description: 'Tingkatkan pemahaman membaca bahasa Inggris.' },
};

export default function CourseChapterScreen({ route, navigation }) {
  const { courseId, courseType } = route.params;
  const config = courseConfig[courseType];

  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const data = await getChaptersByCourse(courseId);
      setChapters(data);
      setError(null);
    } catch (err) {
      console.error('Error load chapters:', err);
      setError('Gagal memuat data. Cek koneksi internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { backgroundColor: config.accentColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{config.icon}</Text>
          <Text style={styles.headerTitle}>{courseType}</Text>
          <Text style={styles.headerDesc}>{config.description}</Text>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>PILIH CHAPTER</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={config.accentColor} />
            <Text style={styles.loadingText}>Memuat chapter...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="wifi-outline" size={40} color={colors.textHint} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { borderColor: config.accentColor }]} onPress={loadChapters}>
              <Text style={[styles.retryText, { color: config.accentColor }]}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          chapters.map((chapter, index) => (
            <TouchableOpacity
              key={chapter.chapter_id}
              style={[styles.chapterCard, chapter.is_locked && styles.chapterCardLocked]}
              onPress={() => {
                if (!chapter.is_locked) {
                  navigation.navigate('CourseDetail', {
                    courseType,
                    chapterId: chapter.chapter_id,
                    chapterData: chapter,
                  });
                }
              }}
              activeOpacity={chapter.is_locked ? 1 : 0.7}
            >
              <View style={[
                styles.chapterNumber,
                { backgroundColor: chapter.is_locked ? colors.border : config.accentColor },
              ]}>
                {chapter.is_locked
                  ? <Ionicons name="lock-closed" size={16} color={colors.textHint} />
                  : <Text style={styles.chapterNumberText}>{index + 1}</Text>
                }
              </View>

              <View style={styles.chapterInfo}>
                <Text style={[styles.chapterTitle, chapter.is_locked && styles.chapterTitleLocked]}>
                  {chapter.title}
                </Text>
                <Text style={styles.chapterDesc} numberOfLines={2}>
                  {chapter.description}
                </Text>
                <View style={styles.chapterMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textHint} />
                  <Text style={styles.chapterDuration}>{chapter.duration_minutes} menit</Text>
                  {chapter.is_completed ? (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                      <Text style={styles.completedText}>Selesai</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {!chapter.is_locked && (
                <Ionicons name="chevron-forward" size={20} color={colors.textHint} />
              )}
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 16, paddingBottom: 28, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start', padding: 4 },
  headerContent: { alignItems: 'center' },
  headerIcon: { fontSize: 40, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white, marginBottom: 6 },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textSecondary,
    letterSpacing: 1.5, marginBottom: 14,
  },
  loadingContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  errorContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  errorText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  retryBtn: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  retryText: { fontSize: 14, fontWeight: '700' },
  chapterCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 16,
    padding: 16, marginBottom: 12, borderWidth: 1.5,
    borderColor: colors.border, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  chapterCardLocked: { opacity: 0.6, backgroundColor: colors.surface },
  chapterNumber: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
  },
  chapterNumberText: { fontSize: 16, fontWeight: '800', color: colors.white },
  chapterInfo: { flex: 1, gap: 4 },
  chapterTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  chapterTitleLocked: { color: colors.textSecondary },
  chapterDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  chapterMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  chapterDuration: { fontSize: 11, color: colors.textHint, fontWeight: '600' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 8 },
  completedText: { fontSize: 11, color: colors.success, fontWeight: '600' },
});