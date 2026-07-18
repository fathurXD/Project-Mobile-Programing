import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import colors from '../constants/colors';
import { saveProgress } from '../services/courseService';

export default function ListeningExerciseScreen({ route, navigation }) {
  const { chapterId, exercises = [] } = route.params;

  const course = {
    accentColor: '#FF9800',
    icon: '🎧',
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Jika tidak ada soal
  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons name="headset-outline" size={48} color={colors.textHint} />
          <Text style={styles.emptyText}>Belum ada soal listening</Text>
          <TouchableOpacity
            style={[styles.backBtn2, { backgroundColor: course.accentColor }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtn2Text}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = currentIndex / exercises.length;

  // Ambil teks audio dari field database
  const audioText = currentExercise.audio_text || currentExercise.audioText || '';
  const hint = currentExercise.hint || '';
  const correctAnswer = currentExercise.correct_answer || currentExercise.correctAnswer || '';
  const explanation = currentExercise.explanation || '';

  useEffect(() => {
    setTimeout(() => playAudio(), 800);
    return () => Speech.stop();
  }, [currentIndex]);

  const playAudio = async () => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    setPlayCount(prev => prev + 1);
    Speech.speak(audioText, {
      language: 'en-US',
      rate: 0.8,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const playSlower = () => {
    if (isSpeaking) Speech.stop();
    setIsSpeaking(true);
    setPlayCount(prev => prev + 1);
    Speech.speak(audioText, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const normalizeText = (text) =>
    text.toLowerCase().trim().replace(/[.,!?']/g, '');

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Oops!', 'Tulis jawabanmu dulu ya!');
      return;
    }
    const correct = normalizeText(userAnswer) === normalizeText(correctAnswer);
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore(prev => prev + 1);
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleNext = async () => {
    const isLast = currentIndex + 1 >= exercises.length;

    if (isLast) {
      const finalScore = isCorrect ? score + 1 : score;
      const xpEarned = finalScore * 5;

      setIsSaving(true);
      try {
        await saveProgress(chapterId, finalScore, exercises.length, xpEarned);
      } catch (err) {
        console.error('Gagal simpan progress:', err);
      } finally {
        setIsSaving(false);
      }

      setScore(finalScore);
      setIsFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(false);
      setPlayCount(0);
    }
  };

  const handleClose = () => {
    Speech.stop();
    Alert.alert('Keluar?', 'Progress latihan akan hilang.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', onPress: () => navigation.goBack() },
    ]);
  };

  // ── Finish Screen ──
  if (isFinished) {
    const percentage = Math.round((score / exercises.length) * 100);
    const xpEarned = score * 5;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.finishContainer}>
          <View style={[styles.finishCircle, { borderColor: course.accentColor }]}>
            <Text style={styles.finishScore}>{score}/{exercises.length}</Text>
            <Text style={styles.finishLabel}>BENAR</Text>
          </View>
          <Text style={styles.finishTitle}>
            {percentage === 100 ? '🎉 Sempurna!' : percentage >= 60 ? '👍 Bagus!' : '💪 Terus Berlatih!'}
          </Text>
          <Text style={styles.finishSubtitle}>
            Kamu berhasil mendengar dan menulis {score} dari {exercises.length} kalimat dengan benar.
          </Text>
          <View style={[styles.xpCard, { backgroundColor: course.accentColor }]}>
            <Text style={styles.xpLabel}>XP EARNED</Text>
            <Text style={styles.xpValue}>+{xpEarned} XP</Text>
          </View>
          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: course.accentColor }]}
            onPress={() => navigation.navigate('CourseChapter', {
              courseId: 2,
              courseType: 'Listening',
            })}
          >
            <Text style={styles.finishBtnText}>Kembali ke Chapter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setCurrentIndex(0);
              setUserAnswer('');
              setIsAnswered(false);
              setIsCorrect(false);
              setScore(0);
              setIsFinished(false);
              setPlayCount(0);
            }}
          >
            <Ionicons name="refresh" size={16} color={course.accentColor} />
            <Text style={[styles.retryText, { color: course.accentColor }]}>Ulangi Latihan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Exercise Screen ──
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {
                width: `${progress * 100}%`,
                backgroundColor: course.accentColor,
              }]} />
            </View>
            <Text style={styles.counter}>{currentIndex + 1}/{exercises.length}</Text>
          </View>

          {/* Label */}
          <Text style={[styles.exerciseLabel, { color: course.accentColor }]}>
            LISTENING EXERCISE
          </Text>
          <Text style={styles.instruction}>
            Dengarkan audio lalu ketik kalimat yang kamu dengar
          </Text>

          {/* Audio Player Card */}
          <View style={styles.audioCard}>
            <TouchableOpacity
              style={[
                styles.playBtn,
                {
                  backgroundColor: isSpeaking ? course.accentColor : colors.white,
                  borderColor: course.accentColor,
                },
              ]}
              onPress={playAudio}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSpeaking ? 'stop-circle' : 'play-circle'}
                size={64}
                color={isSpeaking ? colors.white : course.accentColor}
              />
            </TouchableOpacity>

            <Text style={styles.playStatus}>
              {isSpeaking
                ? 'Sedang memutar...'
                : playCount === 0
                  ? 'Tekan untuk mendengarkan'
                  : `Diputar ${playCount}x`}
            </Text>

            <View style={styles.audioActions}>
              <TouchableOpacity
                style={styles.audioActionBtn}
                onPress={playAudio}
                disabled={isSpeaking}
              >
                <View style={[styles.audioActionIcon, { backgroundColor: course.accentColor + '20' }]}>
                  <Ionicons name="refresh" size={20} color={course.accentColor} />
                </View>
                <Text style={styles.audioActionLabel}>Ulangi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.audioActionBtn}
                onPress={playSlower}
                disabled={isSpeaking}
              >
                <View style={[styles.audioActionIcon, { backgroundColor: '#9C27B020' }]}>
                  <Ionicons name="hourglass-outline" size={20} color="#9C27B0" />
                </View>
                <Text style={styles.audioActionLabel}>Lebih Lambat</Text>
              </TouchableOpacity>
            </View>

            {hint ? (
              <View style={styles.hintRow}>
                <Ionicons name="bulb-outline" size={14} color={colors.textHint} />
                <Text style={styles.hintText}>Hint: {hint}</Text>
              </View>
            ) : null}
          </View>

          {/* Answer Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>✏️ Tuliskan kalimat yang kamu dengar:</Text>
            <TextInput
              style={[
                styles.textInput,
                isAnswered && isCorrect && styles.textInputCorrect,
                isAnswered && !isCorrect && styles.textInputWrong,
              ]}
              placeholder="Ketik jawabanmu di sini..."
              placeholderTextColor={colors.textHint}
              value={userAnswer}
              onChangeText={setUserAnswer}
              multiline
              editable={!isAnswered}
              autoCapitalize="none"
            />

            {!isAnswered && (
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: course.accentColor }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Periksa Jawaban</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {/* Feedback */}
          {isAnswered && (
            <View style={[
              styles.feedbackCard,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}>
              <Text style={styles.feedbackTitle}>
                {isCorrect ? '✅ Tepat Sekali!' : '❌ Kurang Tepat!'}
              </Text>

              {!isCorrect && (
                <View style={styles.answerComparison}>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Jawabanmu:</Text>
                    <Text style={[styles.answerRowValue, { color: colors.error }]}>
                      {userAnswer}
                    </Text>
                  </View>
                  <View style={styles.answerDivider} />
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Jawaban benar:</Text>
                    <Text style={[styles.answerRowValue, { color: colors.success }]}>
                      {correctAnswer}
                    </Text>
                  </View>
                </View>
              )}

              <Text style={styles.feedbackExplanation}>{explanation}</Text>

              <TouchableOpacity
                style={styles.replayAfterAnswer}
                onPress={playAudio}
              >
                <Ionicons name="volume-high-outline" size={16} color={course.accentColor} />
                <Text style={[styles.replayAfterAnswerText, { color: course.accentColor }]}>
                  Dengarkan lagi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: course.accentColor }]}
                onPress={handleNext}
                disabled={isSaving}
              >
                <Text style={styles.nextBtnText}>
                  {isSaving
                    ? 'Menyimpan...'
                    : currentIndex + 1 >= exercises.length
                      ? 'Lihat Hasil'
                      : 'Lanjut'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  backBtn2: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  backBtn2Text: { color: colors.white, fontSize: 14, fontWeight: '700' },

  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  closeBtn: { padding: 4 },
  progressTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  counter: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, minWidth: 36, textAlign: 'right' },

  exerciseLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  instruction: { fontSize: 14, color: colors.textSecondary, marginBottom: 24, lineHeight: 20 },

  audioCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 24, borderWidth: 1,
    borderColor: colors.border, gap: 12,
  },
  playBtn: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15,
    shadowRadius: 10, elevation: 4,
  },
  playStatus: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  audioActions: { flexDirection: 'row', gap: 20, marginTop: 4 },
  audioActionBtn: { alignItems: 'center', gap: 6 },
  audioActionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  audioActionLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  hintRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.white, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border,
  },
  hintText: { fontSize: 12, color: colors.textHint, fontStyle: 'italic' },

  inputSection: { gap: 12, marginBottom: 8 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  textInput: {
    borderWidth: 2, borderColor: colors.border, borderRadius: 14,
    padding: 16, fontSize: 15, color: colors.textPrimary,
    backgroundColor: colors.white, minHeight: 80, textAlignVertical: 'top', lineHeight: 22,
  },
  textInputCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  textInputWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, paddingVertical: 15,
  },
  submitBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },

  feedbackCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10, marginTop: 4 },
  feedbackCorrect: { backgroundColor: colors.successLight, borderColor: colors.success + '50' },
  feedbackWrong: { backgroundColor: colors.errorLight, borderColor: colors.error + '50' },
  feedbackTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  answerComparison: { backgroundColor: colors.white, borderRadius: 10, padding: 12, gap: 6 },
  answerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  answerDivider: { height: 1, backgroundColor: colors.border },
  answerRowLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', minWidth: 110 },
  answerRowValue: { fontSize: 13, fontWeight: '700', flex: 1, textAlign: 'right' },
  feedbackExplanation: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  replayAfterAnswer: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 4 },
  replayAfterAnswerText: { fontSize: 13, fontWeight: '600' },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, paddingVertical: 14, marginTop: 4,
  },
  nextBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },

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