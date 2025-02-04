import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  allocated: number;
  spent: number;
}

export interface MonthlyBudget {
  income: number;
  categories: BudgetCategory[];
  startDate: string;
  endDate: string;
}

export interface BudgetStoreState {
  transactions: Transaction[];
  currentBudget: MonthlyBudget | null;
}

export default interface Types {
  BudgetStoreState: BudgetStoreState;
}