import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { saveProgress } from '../services/courseService';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function ReadingExerciseScreen({ route, navigation }) {
  const { chapterId, exercises = [], chapterData } = route.params;

  const course = { accentColor: '#9C27B0' };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={48} color={colors.textHint} />
          <Text style={styles.emptyText}>Belum ada soal reading</Text>
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

  // Support field dari database
  const exerciseType = currentExercise.type;
  const isMultipleChoice = exerciseType === 'multiple_choice';
  const correctAnswer = currentExercise.correct_answer || currentExercise.correctAnswer || '';
  const explanation = currentExercise.explanation || '';
  const options = currentExercise.options || [];
  const sentence = currentExercise.sentence || '';
  const hint = currentExercise.hint || '';
  const readingText = chapterData?.reading_text || chapterData?.readingText || '';

  const normalizeText = (text) =>
    text.toLowerCase().trim().replace(/[.,!?']/g, '');

  const handleSelectAnswer = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore(prev => prev + 1);
  };

  const handleSubmitFill = () => {
    if (!fillAnswer.trim()) {
      Alert.alert('Oops!', 'Isi jawabanmu dulu ya!');
      return;
    }
    const correct = normalizeText(fillAnswer) === normalizeText(correctAnswer);
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore(prev => prev + 1);
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
      setSelectedAnswer(null);
      setFillAnswer('');
      setIsAnswered(false);
      setIsCorrect(false);
      setIsTextExpanded(true);
    }
  };

  const getOptionStyle = (option) => {
    if (!isAnswered) return selectedAnswer === option ? [styles.optionBtn, styles.optionSelected] : styles.optionBtn;
    if (option === correctAnswer) return [styles.optionBtn, styles.optionCorrect];
    if (option === selectedAnswer) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDimmed];
  };

  const getOptionLabelStyle = (option) => {
    if (!isAnswered) return selectedAnswer === option ? [styles.optionLabel, styles.optionLabelSelected] : styles.optionLabel;
    if (option === correctAnswer) return [styles.optionLabel, styles.optionLabelCorrect];
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
          <View style={[styles.finishCircle, { borderColor: course.accentColor }]}>
            <Text style={styles.finishScore}>{score}/{exercises.length}</Text>
            <Text style={styles.finishLabel}>BENAR</Text>
          </View>
          <Text style={styles.finishTitle}>
            {percentage === 100 ? '🎉 Sempurna!' : percentage >= 60 ? '👍 Bagus!' : '💪 Terus Berlatih!'}
          </Text>
          <Text style={styles.finishSubtitle}>
            Kamu menjawab benar {score} dari {exercises.length} soal.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{exercises.filter(e => e.type === 'multiple_choice').length}</Text>
              <Text style={styles.statLabel}>Pilihan Ganda</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✏️</Text>
              <Text style={styles.statValue}>{exercises.filter(e => e.type === 'fill_blank').length}</Text>
              <Text style={styles.statLabel}>Fill in Blank</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>{xpEarned}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: course.accentColor }]}
            onPress={() => navigation.navigate('CourseChapter', {
              courseId: 3,
              courseType: 'Reading',
            })}
          >
            <Text style={styles.finishBtnText}>Kembali ke Chapter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setFillAnswer('');
              setIsAnswered(false);
              setIsCorrect(false);
              setScore(0);
              setIsFinished(false);
              setIsTextExpanded(true);
            }}
          >
            <Ionicons name="refresh" size={16} color={course.accentColor} />
            <Text style={[styles.retryText, { color: course.accentColor }]}>Ulangi Latihan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Screen ──
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                backgroundColor: course.accentColor,
              }]} />
            </View>
            <Text style={styles.counter}>{currentIndex + 1}/{exercises.length}</Text>
          </View>

          {/* Badge */}
          <View style={styles.typeBadgeRow}>
            <View style={[
              styles.typeBadge,
              { backgroundColor: isMultipleChoice ? '#2196F320' : '#FF980020' },
            ]}>
              <Ionicons
                name={isMultipleChoice ? 'list' : 'create-outline'}
                size={14}
                color={isMultipleChoice ? '#2196F3' : '#FF9800'}
              />
              <Text style={[
                styles.typeBadgeText,
                { color: isMultipleChoice ? '#2196F3' : '#FF9800' },
              ]}>
                {isMultipleChoice ? 'Pilihan Ganda' : 'Fill in the Blank'}
              </Text>
            </View>
            <Text style={[styles.exerciseLabel, { color: course.accentColor }]}>
              READING EXERCISE
            </Text>
          </View>

          {/* Reading Text Card */}
          {readingText ? (
            <View style={styles.readingCard}>
              <TouchableOpacity
                style={styles.readingCardHeader}
                onPress={() => setIsTextExpanded(!isTextExpanded)}
                activeOpacity={0.7}
              >
                <View style={styles.readingCardHeaderLeft}>
                  <Ionicons name="book-outline" size={18} color={course.accentColor} />
                  <Text style={[styles.readingCardTitle, { color: course.accentColor }]}>
                    Teks Bacaan
                  </Text>
                </View>
                <Ionicons
                  name={isTextExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textHint}
                />
              </TouchableOpacity>
              {isTextExpanded
                ? <Text style={styles.readingText}>{readingText}</Text>
                : <Text style={styles.readingCollapsed}>Ketuk untuk membaca teks...</Text>
              }
            </View>
          ) : null}

          {/* Question */}
          <View style={styles.questionContainer}>
            {isMultipleChoice ? (
              <>
                <Text style={styles.questionText}>{currentExercise.question}</Text>
                <View style={styles.optionsContainer}>
                  {options.map((option, index) => (
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
                      {isAnswered && option === correctAnswer && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                      )}
                      {isAnswered && option === selectedAnswer && option !== correctAnswer && (
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fillInstruction}>
                  {currentExercise.instruction || 'Lengkapi kalimat berdasarkan teks di atas:'}
                </Text>
                <View style={styles.sentenceContainer}>
                  <Text style={styles.sentenceText}>
                    {sentence.split('___').map((part, index, arr) => (
                      <Text key={index}>
                        <Text style={styles.sentencePart}>{part}</Text>
                        {index < arr.length - 1 && (
                          <Text style={[
                            styles.blankSpace,
                            isAnswered && isCorrect && styles.blankCorrect,
                            isAnswered && !isCorrect && styles.blankWrong,
                          ]}>
                            {isAnswered ? ` ${correctAnswer} ` : ' _______ '}
                          </Text>
                        )}
                      </Text>
                    ))}
                  </Text>
                </View>

                {hint ? (
                  <View style={styles.hintRow}>
                    <Ionicons name="bulb-outline" size={14} color={colors.textHint} />
                    <Text style={styles.hintText}>Hint: {hint}</Text>
                  </View>
                ) : null}

                <TextInput
                  style={[
                    styles.fillInput,
                    isAnswered && isCorrect && styles.fillInputCorrect,
                    isAnswered && !isCorrect && styles.fillInputWrong,
                  ]}
                  placeholder="Ketik jawabanmu..."
                  placeholderTextColor={colors.textHint}
                  value={fillAnswer}
                  onChangeText={setFillAnswer}
                  editable={!isAnswered}
                  autoCapitalize="none"
                />

                {!isAnswered && (
                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: course.accentColor }]}
                    onPress={handleSubmitFill}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.submitBtnText}>Periksa Jawaban</Text>
                    <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Feedback */}
          {isAnswered && (
            <View style={[
              styles.feedbackCard,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}>
              <Text style={styles.feedbackTitle}>
                {isCorrect ? '✅ Benar!' : '❌ Kurang Tepat!'}
              </Text>

              {!isCorrect && !isMultipleChoice && (
                <View style={styles.answerComparison}>
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Jawabanmu:</Text>
                    <Text style={[styles.answerRowValue, { color: colors.error }]}>{fillAnswer}</Text>
                  </View>
                  <View style={styles.answerDivider} />
                  <View style={styles.answerRow}>
                    <Text style={styles.answerRowLabel}>Jawaban benar:</Text>
                    <Text style={[styles.answerRowValue, { color: colors.success }]}>{correctAnswer}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.feedbackExplanation}>{explanation}</Text>

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

  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  closeBtn: { padding: 4 },
  progressTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  counter: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, minWidth: 36, textAlign: 'right' },

  typeBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  typeBadgeText: { fontSize: 12, fontWeight: '700' },
  exerciseLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },

  readingCard: {
    backgroundColor: '#F3E5F5', borderRadius: 16, padding: 16,
    marginBottom: 20, borderWidth: 1.5, borderColor: '#9C27B040',
  },
  readingCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  readingCardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  readingCardTitle: { fontSize: 13, fontWeight: '700' },
  readingText: { fontSize: 13, color: colors.textPrimary, lineHeight: 22, marginTop: 4 },
  readingCollapsed: { fontSize: 12, color: colors.textHint, fontStyle: 'italic' },

  questionContainer: { gap: 14, marginBottom: 8 },
  questionText: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, lineHeight: 26 },

  optionsContainer: { gap: 10 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white, gap: 12,
  },
  optionSelected: { borderColor: '#9C27B0', backgroundColor: '#F3E5F5' },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionDimmed: { opacity: 0.5 },
  optionLabel: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  optionLabelSelected: { backgroundColor: '#9C27B0', borderColor: '#9C27B0' },
  optionLabelCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  optionLabelWrong: { backgroundColor: colors.error, borderColor: colors.error },
  optionLabelText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  fillInstruction: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  sentenceContainer: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  sentenceText: { fontSize: 16, lineHeight: 28 },
  sentencePart: { color: colors.textPrimary, fontWeight: '600' },
  blankSpace: { color: colors.primary, fontWeight: '800', textDecorationLine: 'underline' },
  blankCorrect: { color: colors.success },
  blankWrong: { color: colors.error },
  hintRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.white, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, borderWidth: 1,
    borderColor: colors.border, alignSelf: 'flex-start',
  },
  hintText: { fontSize: 12, color: colors.textHint, fontStyle: 'italic' },
  fillInput: {
    borderWidth: 2, borderColor: colors.border, borderRadius: 12,
    padding: 14, fontSize: 15, color: colors.textPrimary, backgroundColor: colors.white,
  },
  fillInputCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  fillInputWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, paddingVertical: 15,
  },
  submitBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },

  feedbackCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  feedbackCorrect: { backgroundColor: colors.successLight, borderColor: colors.success + '50' },
  feedbackWrong: { backgroundColor: colors.errorLight, borderColor: colors.error + '50' },
  feedbackTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  answerComparison: { backgroundColor: colors.white, borderRadius: 10, padding: 12, gap: 6 },
  answerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  answerDivider: { height: 1, backgroundColor: colors.border },
  answerRowLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', minWidth: 110 },
  answerRowValue: { fontSize: 13, fontWeight: '700', flex: 1, textAlign: 'right' },
  feedbackExplanation: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
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
  finishSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  statIcon: { fontSize: 18 },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  finishBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  finishBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  retryText: { fontSize: 14, fontWeight: '600' },
});