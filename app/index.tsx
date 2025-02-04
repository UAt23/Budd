import { Text, View, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBudgetStore from "../store";
import { BudgetCategory } from '../types';
import AnimatedNumber from '../components/AnimatedNumber';
import { Animated } from 'react-native';
import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { currentBudget, getDailyBudget, getBudgetHealth, getDaysLeft, getSavedBasedOnDailyBudget, getTodaySpent } = useBudgetStore();
  const budgetHealth = getBudgetHealth();
  const dailyBudget = getDailyBudget();
  const daysLeft = getDaysLeft();
  const savedBasedOnDailyBudget = getSavedBasedOnDailyBudget();
  const todaySpent = getTodaySpent();
  const healthAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(healthAnimation, {
      toValue: budgetHealth,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [budgetHealth]);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginLeft: 16 }}
        >
          <MaterialCommunityIcons name="menu" size={24} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Budget Health Section */}
      <View style={styles.healthSection}>
        <View style={styles.healthHeader}>
          <Text style={styles.healthTitle}>BUDGET HEALTH</Text>
          <AnimatedNumber
            value={budgetHealth}
            style={styles.healthScore}
          />
        </View>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                transform: [{
                  scaleX: healthAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 1],
                  })
                }]
              }
            ]} 
          />
        </View>
      </View>

      {/* Daily Budget Section */}
      <View style={styles.dailyBudgetContainer}>
        <Text style={styles.dailyBudgetLabel}>Daily Budget</Text>
        <AnimatedNumber
          value={dailyBudget - todaySpent}
          style={styles.dailyBudgetAmount}
          prefix="₺"
        />
        <Text style={styles.daysLeft}>{daysLeft} days left</Text>
        <Text style={styles.daysLeft}>You have spent <Text style={styles.todaySpent}>{todaySpent}₺</Text> today</Text>
      </View>

      {/* Insights Section */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <Text style={styles.insightsText}>You have saved <Text style={styles.insightsAmount}>{savedBasedOnDailyBudget}₺</Text> based on your daily budget so far 😎.</Text>
      </View>

      {/* Budget Categories Grid */}
      <View style={styles.categoriesGrid}>
        {currentBudget?.categories.map((category) => (
          <BudgetCard
            key={category.id}
            title={category.name}
            amount={category.allocated.toString()}
            icon={category.icon}
          />
        ))}
      </View>

      {/* Updated FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/add-transaction')}
      >
        <View style={styles.fabContent}>
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
}

interface BudgetCardProps {
  title: string;
  amount: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

function BudgetCard({ title, amount, icon }: BudgetCardProps) {
  return (
    <View style={styles.budgetCard}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#00BCD4" />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardAmount}>₺{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  healthSection: {
    padding: 16,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthTitle: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  healthScore: {
    color: '#00BCD4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BCD4',
    borderRadius: 2,
  },
  dailyBudgetContainer: {
    backgroundColor: '#121212',
    margin: 16,
    padding: 20,
    borderRadius: 8,
  },
  dailyBudgetLabel: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  dailyBudgetAmount: {
    color: '#00BCD4',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  daysLeft: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  todaySpent: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysLeftAmount: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightsContainer: {
    backgroundColor: '#121212',
    margin: 16,
    padding: 20,
    borderRadius: 8,
  },
  insightsTitle: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  insightsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  insightsAmount: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  budgetCard: {
    backgroundColor: '#121212',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardAmount: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
  fabContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
