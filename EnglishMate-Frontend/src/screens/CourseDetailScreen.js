import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getExercisesByChapter } from '../services/courseService';

const courseConfig = {
  Writing:   { accentColor: '#2196F3', icon: '✍️' },
  Listening: { accentColor: '#FF9800', icon: '🎧' },
  Reading:   { accentColor: '#9C27B0', icon: '📖' },
};

export default function CourseDetailScreen({ route, navigation }) {
  const { courseType, chapterId, chapterData } = route.params;
  const config = courseConfig[courseType];

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await getExercisesByChapter(chapterId);
      setExercises(data);
    } catch (err) {
      console.error('Error load exercises:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = () => {
    if (courseType === 'Listening') {
      navigation.navigate('ListeningExercise', {
        courseType,
        chapterId,
        exercises,
      });
    } else if (courseType === 'Reading') {
      navigation.navigate('ReadingExercise', {
        courseType,
        chapterId,
        exercises,
        chapterData: {
          ...chapterData,
          reading_text: chapterData?.reading_text || chapterData?.readingText || '',
        },
      });
    } else {
      navigation.navigate('CourseExercise', {
        courseType,
        chapterId,
        exercises,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chapterData?.title || 'Detail Chapter'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: config.accentColor + '20' }]}>
          <Text style={styles.badgeIcon}>{config.icon}</Text>
          <Text style={[styles.badgeText, { color: config.accentColor }]}>
            {courseType} Course
          </Text>
        </View>

        {/* Introduction */}
        {chapterData?.introduction ? (
          <View style={styles.introCard}>
            <Text style={styles.introLabel}>PENDAHULUAN</Text>
            <Text style={styles.introText}>{chapterData.introduction}</Text>
          </View>
        ) : null}

        {/* Reading Text (khusus Reading course) */}
        {courseType === 'Reading' && (chapterData?.reading_text || chapterData?.readingText) ? (
          <View style={styles.readingCard}>
            <Text style={styles.readingLabel}>TEKS BACAAN</Text>
            <Text style={styles.readingText}>
              {chapterData?.reading_text || chapterData?.readingText}
            </Text>
          </View>
        ) : null}

        {/* Sections dari database */}
        {chapterData?.sections?.length > 0 ? (
          chapterData.sections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={[styles.sectionNumberBadge, { backgroundColor: config.accentColor }]}>
                <Text style={styles.sectionNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))
        ) : (
          // Tampilkan pesan jika tidak ada materi
          <View style={styles.noMaterialCard}>
            <Ionicons name="book-outline" size={32} color={colors.textHint} />
            <Text style={styles.noMaterialText}>
              Materi akan segera tersedia
            </Text>
          </View>
        )}

        {/* Info Jumlah Soal */}
        {isLoading ? (
          <ActivityIndicator
            color={config.accentColor}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <View style={[
            styles.exerciseInfoCard,
            { borderColor: config.accentColor + '40' },
          ]}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={config.accentColor}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseInfoTitle}>Latihan Soal</Text>
              <Text style={styles.exerciseInfoSub}>
                {exercises.length} soal tersedia
              </Text>
            </View>
            {exercises.length > 0 && (
              <View style={[
                styles.exerciseCountBadge,
                { backgroundColor: config.accentColor },
              ]}>
                <Text style={styles.exerciseCountText}>
                  {exercises.length}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Start Exercise Button */}
        <TouchableOpacity
          style={[
            styles.exerciseBtn,
            { backgroundColor: config.accentColor },
            (isLoading || exercises.length === 0) && styles.exerciseBtnDisabled,
          ]}
          onPress={handleStartExercise}
          disabled={isLoading || exercises.length === 0}
          activeOpacity={0.85}
        >
          <Ionicons name="pencil" size={20} color={colors.white} />
          <Text style={styles.exerciseBtnText}>
            {isLoading
              ? 'Memuat soal...'
              : exercises.length === 0
                ? 'Belum ada soal'
                : `Mulai Latihan (${exercises.length} Soal)`}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16, fontWeight: '700', color: colors.textPrimary,
    flex: 1, textAlign: 'center', marginHorizontal: 8,
  },

  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    gap: 6, marginBottom: 20,
  },
  badgeIcon: { fontSize: 14 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  introCard: {
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  introLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textSecondary,
    letterSpacing: 1.5, marginBottom: 8,
  },
  introText: { fontSize: 14, color: colors.textPrimary, lineHeight: 22 },

  // Reading text card
  readingCard: {
    backgroundColor: '#F3E5F5', borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 1.5, borderColor: '#9C27B040',
  },
  readingLabel: {
    fontSize: 10, fontWeight: '700', color: '#9C27B0',
    letterSpacing: 1.5, marginBottom: 8,
  },
  readingText: { fontSize: 13, color: colors.textPrimary, lineHeight: 22 },

  sectionCard: {
    backgroundColor: colors.white, borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  sectionNumberBadge: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  sectionNumber: { fontSize: 13, fontWeight: '800', color: colors.white },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  sectionBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },

  noMaterialCard: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 24, marginBottom: 16, borderWidth: 1,
    borderColor: colors.border, gap: 8,
  },
  noMaterialText: { fontSize: 13, color: colors.textHint, fontStyle: 'italic' },

  exerciseInfoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, marginBottom: 16, borderWidth: 1.5,
  },
  exerciseInfoTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  exerciseInfoSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  exerciseCountBadge: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  exerciseCountText: { fontSize: 14, fontWeight: '800', color: colors.white },

  exerciseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 14, paddingVertical: 16, marginTop: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 8, elevation: 4,
  },
  exerciseBtnDisabled: { opacity: 0.6 },
  exerciseBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});