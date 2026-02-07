import { ExpenseInput } from '../../components/home/ExpenseInput';
import { ExpenseList } from '../../components/home/ExpenseList';
import { SuccessFeedback } from '../../components/home/SuccessFeedback';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useExpenses } from '../../hooks/useExpenses';
import { Expense, ExpenseService } from '@/services/ExpenseService';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export default function HomeScreen() {
  const { expenses, refetch } = useExpenses();
  const [lastAddedExpense, setLastAddedExpense] = useState<Expense | null>(null);

  const handleAddExpense = async (text: string) => {
    try {
      const newExpense = await ExpenseService.addExpense(text);
      if (newExpense) {
        setLastAddedExpense(newExpense);
        await refetch();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await ExpenseService.deleteExpense(id);
      await refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
      throw error;
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
          expenses={expenses}
          onRefresh={refetch}
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
