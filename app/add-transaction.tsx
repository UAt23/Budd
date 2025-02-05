import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBudgetStore from '../store';


export default function AddTransaction() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const addTransaction = useBudgetStore((state) => state.addTransaction);

  const categories = [
    { id: 'rent', name: 'Rent', icon: 'home' },
    { id: 'creditCard', name: 'Credit Card', icon: 'credit-card' },
    { id: 'savings', name: 'Savings', icon: 'piggy-bank' },
    { id: 'groceries', name: 'Groceries', icon: 'cart' },
    { id: 'entertainment', name: 'Entertainment', icon: 'gamepad-variant' },
    { id: 'transport', name: 'Transport', icon: 'bus' },
  ];

  const handleSave = () => {
    if (!amount || !category) return;

    addTransaction({
      amount: parseFloat(amount),
      description,
      category,
    });
    
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount (₺)</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#fff"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="What's this for?"
          placeholderTextColor="#fff"
        />
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryCard,
              category === cat.id && styles.selectedCategory,
            ]}
            onPress={() => setCategory(cat.id)}
          >
            <MaterialCommunityIcons
              name={cat.icon}
              size={24}
              color={category === cat.id ? '#fff' : '#00BCD4'}
            />
            <Text
              style={[
                styles.categoryText,
                category === cat.id && styles.selectedCategoryText,
              ]}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#00BCD4',
    fontSize: 16,
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#43526E',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    color: '#fff',
  },
  descriptionInput: {
    backgroundColor: '#43526E',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#43526E',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#00BCD4',
  },
  categoryText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 