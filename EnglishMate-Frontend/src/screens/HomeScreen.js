import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import articleData from '../constants/articleData';

const courseList = [
  { id: 1, title: 'Writing',   icon: '✍️', color: '#E8F4FD' },
  { id: 2, title: 'Listening', icon: '🎧', color: '#FFF3E0' },
  { id: 3, title: 'Reading',   icon: '📖', color: '#F3E5F5' },
];

export default function HomeScreen({ navigation }) {
  const { user, refreshStats } = useAuth();

  // Refresh stats setiap kali Home difokuskan
  useFocusEffect(
    useCallback(() => {
      refreshStats();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colors.textSecondary} />
              </View>
            )}
            <View>
              <Text style={styles.greeting}>Selamat Datang,</Text>
              <Text style={styles.userName}>{user?.name || 'Pengguna'}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* XP Banner */}
        <View style={styles.xpBanner}>
          <View style={styles.xpItem}>
            <Text style={styles.xpEmoji}>⚡</Text>
            <Text style={styles.xpValue}>{user?.totalXp || 0}</Text>
            <Text style={styles.xpLabel}>Total XP</Text>
          </View>
          <View style={styles.xpDivider} />
          <View style={styles.xpItem}>
            <Text style={styles.xpEmoji}>🔥</Text>
            <Text style={styles.xpValue}>{user?.streak || 0}</Text>
            <Text style={styles.xpLabel}>Hari Streak</Text>
          </View>
          <View style={styles.xpDivider} />
          <View style={styles.xpItem}>
            <Text style={styles.xpEmoji}>🌱</Text>
            <Text style={styles.xpValue}>{user?.level || 'Beginner'}</Text>
            <Text style={styles.xpLabel}>Level</Text>
          </View>
        </View>

        {/* Information Page */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Information Page</Text>
              <Text style={styles.sectionSubtitle}>Dapatkan berita terkini bahasa inggris disini!</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ArticleList')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoScroll}>
            {articleData.slice(0, 3).map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.infoCard}
                onPress={() => navigation.navigate('ArticleDetail', { articleId: article.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.infoImagePlaceholder, { backgroundColor: article.color }]}>
                  <Ionicons name={article.icon} size={28} color={article.accentColor} />
                </View>
                <Text style={styles.infoCardTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Start Course */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Course</Text>
          <Text style={styles.sectionSubtitle}>Mulai perjalanan bahasa inggris kamu sekarang!</Text>
          <View style={styles.courseGrid}>
            {courseList.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseCard, { backgroundColor: course.color }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CourseChapter', {
                  courseId: course.id,
                  courseType: course.title,
                })}
              >
                <Text style={styles.courseIcon}>{course.icon}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Quiz */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Quiz</Text>
          <Text style={styles.sectionSubtitle}>Mainkan quiz harian dan dapatkan point!</Text>
          <TouchableOpacity
            style={styles.quizBanner}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Quiz')}
          >
            <View style={styles.quizBannerContent}>
              <Text style={styles.quizBannerEmoji}>🎯</Text>
              <View>
                <Text style={styles.quizBannerTitle}>QUIZ</Text>
                <Text style={styles.quizBannerSub}>Hari ini: Vocabulary</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 16, paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.surface, justifyContent: 'center',
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  avatarImage: { width: 42, height: 42, borderRadius: 21 },
  greeting: { fontSize: 12, color: colors.textSecondary },
  userName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 6 },

  xpBanner: {
    flexDirection: 'row', backgroundColor: colors.primary,
    borderRadius: 16, padding: 16, marginBottom: 24,
    alignItems: 'center', justifyContent: 'space-around',
  },
  xpItem: { alignItems: 'center', gap: 4 },
  xpEmoji: { fontSize: 20 },
  xpValue: { fontSize: 16, fontWeight: '800', color: colors.white },
  xpLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  xpDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },

  section: { marginBottom: 24 },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: colors.textSecondary },
  seeAllText: { fontSize: 12, fontWeight: '700', color: colors.primary, marginTop: 2 },

  infoScroll: { marginHorizontal: -4 },
  infoCard: {
    width: 130, marginHorizontal: 4, borderRadius: 12,
    backgroundColor: colors.surface, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  infoImagePlaceholder: { width: '100%', height: 80, justifyContent: 'center', alignItems: 'center' },
  infoCardTitle: { fontSize: 11, color: colors.textPrimary, fontWeight: '600', padding: 8 },

  courseGrid: { flexDirection: 'row', gap: 12 },
  courseCard: {
    flex: 1, borderRadius: 16, paddingVertical: 20,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  courseIcon: { fontSize: 28 },
  courseTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  quizBanner: {
    backgroundColor: colors.primary, borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  quizBannerContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  quizBannerEmoji: { fontSize: 32 },
  quizBannerTitle: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: 2 },
  quizBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});