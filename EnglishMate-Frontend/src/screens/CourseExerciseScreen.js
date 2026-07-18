import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { saveProgress } from '../services/courseService';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const courseConfig = {
  Writing:   { accentColor: '#2196F3' },
  Listening: { accentColor: '#FF9800' },
  Reading:   { accentColor: '#9C27B0' },
};

export default function CourseExerciseScreen({ route, navigation }) {
  const { courseType, chapterId, exercises = [] } = route.params;
  const config = courseConfig[courseType] || { accentColor: colors.primary };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Jika tidak ada soal
  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={48} color={colors.textHint} />
          <Text style={styles.emptyText}>Belum ada soal latihan</Text>
          <TouchableOpacity
            style={[styles.backHomeBtn, { backgroundColor: config.accentColor }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backHomeBtnText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = currentIndex / exercises.length;

  const handleSelectAnswer = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentExercise.correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    const isLast = currentIndex + 1 >= exercises.length;

    if (isLast) {
      const finalScore = selectedAnswer === currentExercise.correct_answer ? score + 1 : score;
      const xpEarned = finalScore * 5;

      // Simpan progress ke backend
      setIsSaving(true);
      try {
        await saveProgress(chapterId, finalScore, exercises.length, xpEarned);
      } catch (err) {
        console.error('Gagal simpan progress:', err);
      } finally {
        setIsSaving(false);
      }

      setIsFinished(true);
      setScore(finalScore);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const getOptionStyle = (option) => {
    if (!isAnswered) return styles.optionBtn;
    if (option === currentExercise.correct_answer) return [styles.optionBtn, styles.optionCorrect];
    if (option === selectedAnswer) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDimmed];
  };

  const getOptionLabelStyle = (option) => {
    if (!isAnswered) return styles.optionLabel;
    if (option === currentExercise.correct_answer) return [styles.optionLabel, styles.optionLabelCorrect];
    if (option === selectedAnswer) return [styles.optionLabel, styles.optionLabelWrong];
    return styles.optionLabel;
  };

  // ── Finish Screen ──
  if (isFinished) {
    const percentage = Math.round((score / exercises.length) * 100);
    const xpEarned = score * 5;

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.finishContainer}>
          <View style={[styles.finishCircle, { borderColor: config.accentColor }]}>
            <Text style={styles.finishScore}>{score}/{exercises.length}</Text>
            <Text style={styles.finishLabel}>BENAR</Text>
          </View>

          <Text style={styles.finishTitle}>
            {percentage === 100 ? '🎉 Sempurna!' : percentage >= 60 ? '👍 Bagus!' : '💪 Terus Berlatih!'}
          </Text>
          <Text style={styles.finishSubtitle}>
            Kamu menjawab benar {score} dari {exercises.length} soal.
          </Text>

          <View style={[styles.xpCard, { backgroundColor: config.accentColor }]}>
            <Text style={styles.xpLabel}>XP EARNED</Text>
            <Text style={styles.xpValue}>+{xpEarned} XP</Text>
          </View>

          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: config.accentColor }]}
            onPress={() => navigation.navigate('CourseChapter', { courseType })}
          >
            <Text style={styles.finishBtnText}>Kembali ke Chapter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setScore(0);
              setIsFinished(false);
            }}
          >
            <Ionicons name="refresh" size={16} color={config.accentColor} />
            <Text style={[styles.retryText, { color: config.accentColor }]}>Ulangi Latihan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Exercise Screen ──
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => Alert.alert('Keluar?', 'Progress latihan akan hilang.', [
              { text: 'Batal', style: 'cancel' },
              { text: 'Keluar', onPress: () => navigation.goBack() },
            ])}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {
              width: `${progress * 100}%`,
              backgroundColor: config.accentColor,
            }]} />
          </View>
          <Text style={styles.counter}>{currentIndex + 1}/{exercises.length}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionLabel, { color: config.accentColor }]}>
            {courseType.toUpperCase()} EXERCISE
          </Text>
          <Text style={styles.questionText}>{currentExercise.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {(currentExercise.options || []).map((option, index) => (
            <TouchableOpacity
              key={option}
              style={getOptionStyle(option)}
              onPress={() => handleSelectAnswer(option)}
              activeOpacity={0.7}
            >
              <View style={getOptionLabelStyle(option)}>
                <Text style={styles.optionLabelText}>{OPTION_LABELS[index]}</Text>
              </View>
              <Text style={styles.optionText} numberOfLines={2}>{option}</Text>
              {isAnswered && option === currentExercise.correct_answer && (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              )}
              {isAnswered && option === selectedAnswer && option !== currentExercise.correct_answer && (
                <Ionicons name="close-circle" size={20} color={colors.error} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation + Next */}
        {isAnswered && (
          <View style={[
            styles.explanationCard,
            selectedAnswer === currentExercise.correct_answer
              ? styles.explanationCorrect
              : styles.explanationWrong,
          ]}>
            <Text style={styles.explanationTitle}>
              {selectedAnswer === currentExercise.correct_answer ? '✅ Benar!' : '❌ Kurang Tepat!'}
            </Text>
            <Text style={styles.explanationText}>{currentExercise.explanation}</Text>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: config.accentColor }]}
              onPress={handleNext}
              disabled={isSaving}
            >
              <Text style={styles.nextBtnText}>
                {isSaving ? 'Menyimpan...' : currentIndex + 1 >= exercises.length ? 'Lihat Hasil' : 'Lanjut'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  backHomeBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  backHomeBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },

  // Top Bar
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  closeBtn: { padding: 4 },
  progressTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  counter: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, minWidth: 36, textAlign: 'right' },

  // Question
  questionContainer: { marginBottom: 28 },
  questionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  questionText: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, lineHeight: 30 },

  // Options
  optionsContainer: { gap: 10 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white, gap: 12,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionDimmed: { opacity: 0.5 },
  optionLabel: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  optionLabelCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  optionLabelWrong: { backgroundColor: colors.error, borderColor: colors.error },
  optionLabelText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  // Explanation
  explanationCard: { marginTop: 16, borderRadius: 14, padding: 16, borderWidth: 1, gap: 8 },
  explanationCorrect: { backgroundColor: colors.successLight, borderColor: colors.success + '40' },
  explanationWrong: { backgroundColor: colors.errorLight, borderColor: colors.error + '40' },
  explanationTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  explanationText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 10, paddingVertical: 12, marginTop: 4,
  },
  nextBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },

  // Finish Screen
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  finishCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 5,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  finishScore: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  finishLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.5 },
  finishTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  finishSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  xpCard: { width: '100%', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 16, gap: 4 },
  xpLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 },
  xpValue: { fontSize: 28, fontWeight: '800', color: colors.white },
  finishBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  finishBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  retryText: { fontSize: 14, fontWeight: '600' },
});