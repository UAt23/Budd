import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, MonthlyBudget, BudgetCategory } from '../types';

interface BudgetStore {
  transactions: Transaction[];
  currentBudget: MonthlyBudget | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  setBudget: (budget: MonthlyBudget) => void;
  updateCategory: (categoryId: string, amount: number) => void;
  getDailyBudget: () => number;
  getBudgetHealth: () => number;
}

const defaultCategories: BudgetCategory[] = [
  { id: 'rent', name: 'Rent', icon: 'home', allocated: 0, spent: 0 },
  { id: 'creditCard', name: 'Credit Card', icon: 'credit-card', allocated: 0, spent: 0 },
  { id: 'savings', name: 'Savings', icon: 'piggy-bank', allocated: 0, spent: 0 },
  { id: 'groceries', name: 'Groceries', icon: 'cart', allocated: 0, spent: 0 },
  { id: 'entertainment', name: 'Entertainment', icon: 'gamepad-variant', allocated: 0, spent: 0 },
  { id: 'transport', name: 'Transport', icon: 'bus', allocated: 0, spent: 0 },
];

const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      currentBudget: null,

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          currentBudget: state.currentBudget
            ? {
                ...state.currentBudget,
                categories: state.currentBudget.categories.map((cat) =>
                  cat.id === transaction.category
                    ? { ...cat, spent: cat.spent + transaction.amount }
                    : cat
                ),
              }
            : null,
        }));
      },

      setBudget: (budget) => {
        set({ currentBudget: budget });
      },

      updateCategory: (categoryId, amount) => {
        set((state) => ({
          currentBudget: state.currentBudget
            ? {
                ...state.currentBudget,
                categories: state.currentBudget.categories.map((cat) =>
                  cat.id === categoryId
                    ? { ...cat, allocated: amount }
                    : cat
                ),
              }
            : null,
        }));
      },

      getDailyBudget: () => {
        const { currentBudget } = get();
        if (!currentBudget) return 0;

        const totalAllocated = currentBudget.categories.reduce(
          (sum, cat) => sum + cat.allocated,
          0
        );
        const remainingBudget = currentBudget.income - totalAllocated;
        
        const start = new Date(currentBudget.startDate);
        const end = new Date(currentBudget.endDate);
        const daysInMonth = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        return remainingBudget / daysInMonth;
      },

      getBudgetHealth: () => {
        const { currentBudget } = get();
        if (!currentBudget) return 0;

        const totalSpent = currentBudget.categories.reduce(
          (sum, cat) => sum + cat.spent,
          0
        );
        const totalAllocated = currentBudget.categories.reduce(
          (sum, cat) => sum + cat.allocated,
          0
        );

        if (totalAllocated === 0) return 100;
        return Math.max(0, Math.min(100, 100 - (totalSpent / totalAllocated) * 100));
      },
    }),
    {
      name: 'budget-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useBudgetStore;