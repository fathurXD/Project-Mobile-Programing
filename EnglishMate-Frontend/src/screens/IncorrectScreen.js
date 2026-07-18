import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function IncorrectScreen({ route, navigation }) {
  const { question, selectedAnswer, onNext } = route.params;

  const handleNext = () => {
    navigation.goBack();
    setTimeout(() => onNext(), 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Status Icon */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIcon}>
            <Ionicons name="close-circle" size={56} color={colors.error} />
          </View>
          <Text style={styles.statusTitle}>Not Quite!</Text>
          <Text style={styles.statusSubtitle}>
            Don't worry, even polyglots make mistakes. Keep going!
          </Text>
        </View>

        {/* Answer Detail */}
        <View style={styles.answerCard}>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>YOUR ANSWER</Text>
            <Text style={[styles.answerValue, styles.answerWrong]}>
              {selectedAnswer}
            </Text>
          </View>
          <View style={styles.answerDivider} />
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>CORRECT ANSWER</Text>
            <Text style={[styles.answerValue, styles.answerCorrect]}>
              {question.correctAnswer}
            </Text>
          </View>
        </View>

        {/* Context */}
        <View style={styles.contextCard}>
          <Text style={styles.contextLabel}>CONTEXT</Text>
          <Text style={styles.contextText}>"{question.usageExample}"</Text>
          <Text style={styles.contextTranslation}>{question.usageTranslation}</Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>NEXT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.error,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Answer Card
  answerCard: {
    backgroundColor: colors.errorLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  answerDivider: {
    height: 1,
    backgroundColor: colors.error + '30',
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  answerValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  answerWrong: {
    color: colors.error,
  },
  answerCorrect: {
    color: colors.success,
  },

  // Context Card
  contextCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  contextText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  contextTranslation: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Next Button
  nextBtn: {
    backgroundColor: colors.error,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});