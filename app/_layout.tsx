import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBudgetStore from '../store';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Stack } from 'expo-router';
import SplashScreen from '../components/SplashScreen';

function CustomDrawerContent(props) {
  const currentBudget = useBudgetStore((state) => state.currentBudget);
  const totalSpent = currentBudget?.categories.reduce((sum, cat) => sum + cat.spent, 0) || 0;

  return (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Budd</Text>
        <Text style={styles.drawerSubtitle}>Game-style Budgeting</Text>
      </View>
      
      {currentBudget && (
        <View style={styles.budgetSummary}>
          <Text style={styles.summaryLabel}>Monthly Income</Text>
          <Text style={styles.summaryAmount}>₺{currentBudget.income.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryAmount}>₺{totalSpent.toLocaleString()}</Text>
        </View>
      )}

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentBudget = useBudgetStore((state) => state.currentBudget);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Add your initialization tasks here
        // await loadStoredData();
        // await initializeStore();
        // etc...
        
        // Add minimum display time of 2 seconds
        await new Promise(resolve => setTimeout(resolve, 3200));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Handle initialization error
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isLoading && !currentBudget) {
      router.replace('/setup-budget');
    }
  }, [currentBudget, isLoading, router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#121212',
            width: 300,
          },
          drawerActiveTintColor: '#00BCD4',
          drawerInactiveTintColor: '#666',
          drawerLabelStyle: {
            marginLeft: 8,
          },
          drawerType: 'slide',
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Budget Overview',
            drawerLabel: 'Overview',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet" size={size} color={color}/>
            ),
          }}
        />
        <Drawer.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            drawerLabel: 'Transactions',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="categories"
          options={{
            title: 'Categories',
            drawerLabel: 'Categories',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shape" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerLabel: 'Settings',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="add-transaction"
          options={{
            title: "Add Transaction",
            drawerItemStyle: { height: 0 },
          }}
        />
        <Drawer.Screen
          name="setup-budget"
          options={{
            title: "Setting Up Budget",
            drawerItemStyle: { height: 0 },
          }}
        />
      </Drawer>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: 36,
    backgroundColor: '#121212',
  },
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  drawerTitle: {
    color: '#00BCD4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  budgetSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryAmount: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});
