import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import articleData from '../constants/articleData';

export default function ArticleDetailScreen({ route, navigation }) {
  const { articleId } = route.params;
  const article = articleData.find(a => a.id === articleId);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Artikel</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero Illustration */}
        <View style={[styles.heroBox, { backgroundColor: article.color }]}>
          <Ionicons name={article.icon} size={64} color={article.accentColor} />
        </View>

        {/* Category & Meta */}
        <View style={[styles.categoryBadge, { backgroundColor: article.color }]}>
          <Text style={[styles.categoryText, { color: article.accentColor }]}>
            {article.category}
          </Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textHint} />
          <Text style={styles.metaText}>{article.date}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Ionicons name="time-outline" size={13} color={colors.textHint} />
          <Text style={styles.metaText}>{article.readTime}</Text>
        </View>

        {/* Summary */}
        <View style={[styles.summaryBox, { borderLeftColor: article.accentColor }]}>
          <Text style={styles.summaryText}>{article.summary}</Text>
        </View>

        {/* Content Sections */}
        {article.content.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionHeading, { color: article.accentColor }]}>
              {section.heading}
            </Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        {/* Back to list button */}
        <TouchableOpacity
          style={[styles.backToListBtn, { borderColor: article.accentColor }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle-outline" size={18} color={article.accentColor} />
          <Text style={[styles.backToListText, { color: article.accentColor }]}>
            Kembali ke Daftar Artikel
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  headerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  heroBox: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 18,
  },
  metaText: {
    fontSize: 12,
    color: colors.textHint,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textHint,
    marginHorizontal: 4,
  },

  summaryBox: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 21,
  },

  section: {
    marginBottom: 22,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 23,
  },

  backToListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  backToListText: {
    fontSize: 14,
    fontWeight: '700',
  },
});