import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function CorrectScreen({ route, navigation }) {
  const { question, onNext } = route.params;

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
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={styles.statusTitle}>Correct!</Text>
          <Text style={styles.statusSubtitle}>
            {question.correctAnswer} literally translates to{' '}
            <Text style={styles.highlight}>{question.correctAnswer}</Text> in English.
            It is a common noun and one of the most essential words for early learners.
          </Text>
        </View>

        {/* Usage Example */}
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>USAGE EXAMPLE</Text>
          <View style={styles.exampleContent}>
            <View style={styles.exampleImagePlaceholder}>
              <Ionicons name="book-outline" size={24} color={colors.textHint} />
            </View>
            <View style={styles.exampleTextContainer}>
              <Text style={styles.exampleText}>"{question.usageExample}"</Text>
              <Text style={styles.exampleTranslation}>{question.usageTranslation}</Text>
            </View>
          </View>
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
    marginBottom: 32,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 12,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  exampleCard: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  exampleContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  exampleImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleTextContainer: {
    flex: 1,
  },
  exampleText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  exampleTranslation: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  nextBtn: {
    backgroundColor: colors.success,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.success,
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