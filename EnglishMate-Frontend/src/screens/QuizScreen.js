import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getDailyQuiz } from '../services/quizService';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({ navigation }) {
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const data = await getDailyQuiz();
      if (data.length === 0) {
        Alert.alert('Info', 'Tidak ada soal quiz untuk hari ini.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setQuizData(data);
    } catch (err) {
      console.error('Error load quiz:', err);
      Alert.alert('Error', 'Gagal memuat soal quiz.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat soal quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (quizData.length === 0) return null;

  const currentQuestion = quizData[currentIndex];
  const totalQuestions = quizData.length;
  const progress = currentIndex / totalQuestions;

  const handleSelectAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correct_answer;
    if (isCorrect) setScore(prev => prev + 1);

    navigation.navigate(isCorrect ? 'Correct' : 'Incorrect', {
      question: {
        correctAnswer: currentQuestion.correct_answer,
        usageExample: currentQuestion.usage_example || '',
        usageTranslation: '',
      },
      selectedAnswer: answer,
      currentIndex,
      totalQuestions,
      onNext: () => handleNext(isCorrect, answer),
    });
  };

  const handleNext = (wasCorrect, answer) => {
    const newScore = wasCorrect ? score + 1 : score;
    const newAnswers = [...answers, { answer, isCorrect: wasCorrect }];

    if (currentIndex + 1 >= totalQuestions) {
      navigation.replace('Score', {
        score: newScore,
        totalQuestions,
        quizId: quizData[0].quiz_id,
        answers: newAnswers,
      });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      navigation.navigate('Quiz');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
          <Text style={styles.questionCounter}>{currentIndex + 1}/{totalQuestions}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>VOCABULARY QUIZ</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <Text style={styles.questionHint}>Pilih jawaban yang benar di bawah ini.</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[styles.optionBtn, selectedAnswer === option && styles.optionBtnSelected]}
              onPress={() => handleSelectAnswer(option)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionLabel, selectedAnswer === option && styles.optionLabelSelected]}>
                <Text style={[styles.optionLabelText, selectedAnswer === option && styles.optionLabelTextSelected]}>
                  {OPTION_LABELS[index]}
                </Text>
              </View>
              <Text style={[styles.optionText, selectedAnswer === option && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  closeBtn: { padding: 4 },
  progressBarContainer: { flex: 1 },
  progressBarTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  questionCounter: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, minWidth: 36, textAlign: 'right' },
  questionContainer: { marginBottom: 36 },
  questionLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 1.5, marginBottom: 12 },
  questionText: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, lineHeight: 34, marginBottom: 10 },
  questionHint: { fontSize: 13, color: colors.textSecondary },
  optionsContainer: { gap: 12 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white, gap: 14,
  },
  optionBtnSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionLabel: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  optionLabelSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionLabelText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  optionLabelTextSelected: { color: colors.white },
  optionText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  optionTextSelected: { color: colors.primary },
});