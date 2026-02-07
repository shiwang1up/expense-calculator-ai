import { ExpenseInput } from '@/components/home/ExpenseInput';
import { ExpenseList } from '@/components/home/ExpenseList';
import { SuccessFeedback } from '@/components/home/SuccessFeedback';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Expense, ExpenseGroup, ExpenseService } from '@/services/ExpenseService';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const [expenseGroups, setExpenseGroups] = useState<ExpenseGroup[]>([]);
  const [lastAddedExpense, setLastAddedExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    try {
      const data = ExpenseService.getExpensesGroupedByDate();
      setExpenseGroups(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (text: string) => {
    try {
      const newExpense = await ExpenseService.addExpense(text);
      if (newExpense) {
        setLastAddedExpense(newExpense);
        await fetchExpenses();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await ExpenseService.deleteExpense(id);
      await fetchExpenses();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
      throw error; // Re-throw to let ExpenseItem handle the error state
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.headerTitle}>AI Expense Tracker</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Add expenses in plain English</ThemedText>
        </ThemedView>

        {lastAddedExpense && (
          <SuccessFeedback
            expense={lastAddedExpense}
            onDismiss={() => setLastAddedExpense(null)}
          />
        )}

        <ExpenseInput onSubmit={handleAddExpense} />

        <ExpenseList
          expenses={expenseGroups}
          onRefresh={fetchExpenses}
          onDelete={handleDeleteExpense}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingTop: theme.gap(2),
  },
  headerContainer: {
    paddingHorizontal: theme.gap(2),
    marginBottom: theme.gap(3),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: theme.gap(0.5),
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.dimmed,
  },
}));
