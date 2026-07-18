import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import LearningHistoryScreen from '../screens/LearningHistoryScreen';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Quiz Screens
import QuizScreen from '../screens/QuizScreen';
import CorrectScreen from '../screens/CorrectScreen';
import IncorrectScreen from '../screens/IncorrectScreen';
import ScoreScreen from '../screens/ScoreScreen';

// Course Screens
import CourseChapterScreen from '../screens/CourseChapterScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CourseExerciseScreen from '../screens/CourseExerciseScreen';
import ListeningExerciseScreen from '../screens/ListeningExerciseScreen';
import ReadingExerciseScreen from '../screens/ReadingExerciseScreen';

// Other Screens
import EditProfileScreen from '../screens/EditProfileScreen';
import ArticleListScreen from '../screens/ArticleListScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textHint,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main"              component={MainTabs} />
            <Stack.Screen name="Quiz"              component={QuizScreen} />
            <Stack.Screen name="Correct"           component={CorrectScreen} />
            <Stack.Screen name="Incorrect"         component={IncorrectScreen} />
            <Stack.Screen name="Score"             component={ScoreScreen} />
            <Stack.Screen name="CourseChapter"     component={CourseChapterScreen} />
            <Stack.Screen name="CourseDetail"      component={CourseDetailScreen} />
            <Stack.Screen name="CourseExercise"    component={CourseExerciseScreen} />
            <Stack.Screen name="ListeningExercise" component={ListeningExerciseScreen} />
            <Stack.Screen name="ReadingExercise"   component={ReadingExerciseScreen} />
            <Stack.Screen name="EditProfile"       component={EditProfileScreen} />
            <Stack.Screen name="ArticleList"       component={ArticleListScreen} />
            <Stack.Screen name="ArticleDetail"     component={ArticleDetailScreen} />
            <Stack.Screen name="LearningHistory" component={LearningHistoryScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"    component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}