import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBudgetStore from '../store';
import { Transaction } from '../types';


export default function TransactionsScreen() {
  const transactions = useBudgetStore((state) => state.transactions);
  const currentBudget = useBudgetStore((state) => state.currentBudget);

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getCategoryIcon = (categoryId: string) => {
    const category = currentBudget?.categories.find(cat => cat.id === categoryId);
    return category?.icon || 'cash';
  };

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={getCategoryIcon(transaction.category)}
          size={24}
          color="#00BCD4"
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>
          {transaction.description || 'No description'}
        </Text>
        <Text style={styles.categoryName}>
          {currentBudget?.categories.find(cat => cat.id === transaction.category)?.name}
        </Text>
      </View>
      <Text style={styles.amount}>₺{transaction.amount.toFixed(2)}</Text>
    </View>
  );

  const renderDateGroup = ({ item }: { item: [string, Transaction[]] }) => {
    const [date, dayTransactions] = item;
    const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
      <View style={styles.dateGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.dateTotal}>₺{total.toFixed(2)}</Text>
        </View>
        {dayTransactions.map((transaction) => (
          <Pressable
            key={transaction.id}
            style={({ pressed }) => [
              styles.transactionWrapper,
              pressed && styles.pressed,
            ]}
          >
            {renderTransaction({ item: transaction })}
          </Pressable>
        ))}
      </View>
    );
  };

  const groupedArray = Object.entries(groupedTransactions).sort((a, b) => 
    new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>This Month's Spending:</Text>
        <Text style={styles.summaryAmount}>
          ₺{transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={groupedArray}
        renderItem={renderDateGroup}
        keyExtractor={([date]) => date}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  summary: {
    backgroundColor: '#5D7298',
    padding: 20,
    marginBottom: 8,
    borderRadius: 8,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  summaryAmount: {
    color: '#00BCD4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  dateTotal: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionWrapper: {
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  transactionCard: {
    backgroundColor: '#43526E',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
  },
  amount: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 