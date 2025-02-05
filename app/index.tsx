import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
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
  const { currentBudget, getDailyBudget, getBudgetHealth, getDaysLeft, getSavedBasedOnDailyBudget, getTodaySpent, getTodaysDate } = useBudgetStore();
  const budgetHealth = getBudgetHealth();
  const dailyBudget = getDailyBudget();
  const daysLeft = getDaysLeft();
  const savedBasedOnDailyBudget = getSavedBasedOnDailyBudget();
  const todaySpent = getTodaySpent();
  const todaysDate = getTodaysDate();
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
          <MaterialCommunityIcons name="menu" size={36} color="#fff" marginRight={16} />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>Hello, Budd!</Text>
            <Text style={styles.greetingDate}>{todaysDate}</Text>
          </View>
          <View style={styles.dailyBudgetContent}>
            <Text style={styles.dailyBudgetLabel}>Daily Budget</Text>
            <AnimatedNumber
              value={dailyBudget - todaySpent}
              style={styles.dailyBudgetAmount}
              prefix="₺"
            />
            <Text style={styles.daysLeft}>{daysLeft} days left</Text>
            <Text style={styles.daysLeft}>You have spent <Text style={styles.todaySpent}>{todaySpent}₺</Text> today</Text>
          </View>
        </View>

        {/* Insights Section */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>
          <Text style={styles.insightsText}>You have saved <Text style={styles.insightsAmount}>{savedBasedOnDailyBudget}₺</Text> based on your daily budget so far 😎.</Text>
        </View>

        {/* Budget Categories Grid */}
        <View style={styles.categoriesGridContainer}>
          <Text style={styles.categoriesGridTitle}>Your Plan</Text>
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
        </View>
      </ScrollView>

      {/* FAB stays outside ScrollView to remain fixed */}
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
        <MaterialCommunityIcons name={icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <Text style={styles.cardAmount}>₺{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
    backgroundColor: '#43526E',
    margin: 16,
    borderRadius: 8,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  greetingText: {
    color: '#021a1e',
    fontSize: 24,
    fontWeight: 'bold',
  },
  greetingDate: {
    color: '#021a1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dailyBudgetContent: {
    padding: 20,
    paddingTop: 10,
  },
  dailyBudgetLabel: {
    color: '#fff',
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
    color: '#fff',
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
    backgroundColor: '#43526E',
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
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  insightsAmount: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesGridContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
  },
  categoriesGridTitle: {
    color: '#00BCD4',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00BCD4',
    paddingBottom: 16,
    width: '100%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  budgetCard: {
    backgroundColor: '#43526e',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    padding: 16,
    paddingBottom: 24,
    marginTop: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#909EB6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 12,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
