import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { saveQuizResult } from '../services/quizService';

export default function ScoreScreen({ route, navigation }) {
  const { score, totalQuestions, quizId } = route.params;
  const isPerfect = score === totalQuestions;
  const percentage = Math.round((score / totalQuestions) * 100);
  const xpEarned = score * 2;

  useEffect(() => {
    // Simpan hasil quiz ke backend
    if (quizId) {
      saveQuizResult(quizId, score, totalQuestions)
        .catch(err => console.error('Gagal simpan hasil quiz:', err));
    }
  }, []);

  const getStars = () => percentage === 100 ? 3 : percentage >= 60 ? 2 : 1;

  const getMessage = () =>
    percentage === 100 ? 'Perfect Score!' : percentage >= 60 ? 'Great Job!' : 'Keep Practicing!';

  const getSubMessage = () =>
    percentage === 100
      ? "Your accuracy was 100% in this session. You've earned the 'Quick Learner' bonus badge!"
      : percentage >= 60
        ? 'Good work! Review the ones you missed and try again.'
        : "Don't give up! Practice makes perfect. Try again!";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { borderColor: isPerfect ? colors.primary : colors.success }]}>
            <Text style={styles.scoreText}>{score}/{totalQuestions}</Text>
            <Text style={styles.scoreLabel}>CORRECT</Text>
          </View>
        </View>

        <Text style={styles.messageTitle}>{getMessage()}</Text>
        <Text style={styles.messageSubtitle}>{getSubMessage()}</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3].map((star) => (
            <Ionicons key={star} name="star" size={32}
              color={star <= getStars() ? '#FFD700' : colors.border} />
          ))}
        </View>

        <View style={styles.xpCard}>
          <View style={styles.xpLeft}>
            <Text style={styles.xpLabel}>XP EARNED</Text>
            <Text style={styles.xpValue}>+{xpEarned} XP</Text>
          </View>
          <View style={styles.xpIcon}>
            <Ionicons name="flash" size={24} color={colors.white} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            navigation.replace('Quiz');
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 40, alignItems: 'center' },
  scoreSection: { marginBottom: 24 },
  scoreCircle: {
    width: 130, height: 130, borderRadius: 65, borderWidth: 6,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  scoreText: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.5, marginTop: 2 },
  messageTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  messageSubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 8 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  xpCard: {
    width: '100%', backgroundColor: colors.primary, borderRadius: 16,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  xpLeft: { gap: 4 },
  xpLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 },
  xpValue: { fontSize: 28, fontWeight: '800', color: colors.white },
  xpIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  continueBtn: {
    width: '100%', backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  continueBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12 },
  retryBtnText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});