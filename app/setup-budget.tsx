import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBudgetStore from '../store';
import { BudgetCategory } from '../types';


export default function SetupBudget() {
  const router = useRouter();
  const [income, setIncome] = useState('');
  const [step, setStep] = useState(0);
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const { setBudget } = useBudgetStore();

  const defaultCategories: BudgetCategory[] = [
    { id: 'rent', name: 'Rent', icon: 'home', allocated: 0, spent: 0 },
    { id: 'creditCard', name: 'Credit Card', icon: 'credit-card', allocated: 0, spent: 0 },
    { id: 'savings', name: 'Savings', icon: 'piggy-bank', allocated: 0, spent: 0 },
    { id: 'groceries', name: 'Groceries', icon: 'cart', allocated: 0, spent: 0 },
    { id: 'entertainment', name: 'Entertainment', icon: 'gamepad-variant', allocated: 0, spent: 0 },
    { id: 'transport', name: 'Transport', icon: 'bus', allocated: 0, spent: 0 },
  ];

  const handleComplete = () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const categories = defaultCategories.map(cat => ({
      ...cat,
      allocated: parseFloat(allocations[cat.id] || '0'),
    }));

    setBudget({
      income: parseFloat(income),
      categories,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    router.replace('/');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to Budd!</Text>
            <Text style={styles.subtitle}>Let's set up your monthly budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What's your monthly income?</Text>
              <TextInput
                style={styles.input}
                value={income}
                onChangeText={setIncome}
                keyboardType="numeric"
                placeholder="₺0"
                placeholderTextColor="#666"
              />
            </View>
            <Pressable
              style={[styles.button, !income && styles.buttonDisabled]}
              onPress={() => income && setStep(1)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        );

      case 1:
        return (
          <ScrollView style={styles.stepContainer}>
            <Text style={styles.title}>Allocate Your Budget</Text>
            <Text style={styles.subtitle}>
              Available: ₺{(parseFloat(income) - Object.values(allocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)).toFixed(2)}
            </Text>
            {defaultCategories.map((category) => (
              <View key={category.id} style={styles.categoryInput}>
                <View style={styles.categoryHeader}>
                  <MaterialCommunityIcons name={category.icon} size={24} color="#00BCD4" />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                </View>
                <TextInput
                  style={styles.allocationInput}
                  value={allocations[category.id] || ''}
                  onChangeText={(value) => setAllocations(prev => ({ ...prev, [category.id]: value }))}
                  keyboardType="numeric"
                  placeholder="₺0"
                  placeholderTextColor="#666"
                />
              </View>
            ))}
            <Pressable style={styles.button} onPress={handleComplete}>
              <Text style={styles.buttonText}>Complete Setup</Text>
            </Pressable>
          </ScrollView>
        );
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#00BCD4',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#00BCD4',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryInput: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  allocationInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 18,
  },
}); 