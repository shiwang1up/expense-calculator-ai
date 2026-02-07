
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Expense } from '@/services/ExpenseService';
import React, { useEffect } from 'react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface SuccessFeedbackProps {
    expense: Expense;
    onDismiss: () => void;
}

export const SuccessFeedback = ({ expense, onDismiss }: SuccessFeedbackProps) => {
    const { theme } = useUnistyles();

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText style={styles.successTitle}>Expense Added! 🎉</ThemedText>
            </ThemedView>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.amount}>₹{expense.amount}</ThemedText>
                <ThemedText style={styles.detail}>{expense.category}</ThemedText>
                {expense.merchant && (
                    <ThemedText style={styles.subDetail}>at {expense.merchant}</ThemedText>
                )}
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create((theme) => ({
    container: {
        backgroundColor: theme.colors.accents.grass, // Green for success
        borderRadius: theme.gap(2),
        padding: theme.gap(2),
        marginHorizontal: theme.gap(2),
        marginBottom: theme.gap(2),
        // Shadow
        shadowColor: theme.colors.typography,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        backgroundColor: 'transparent',
        marginBottom: theme.gap(1),
    },
    successTitle: {
        color: '#FFFFFF', // Constant white for better contrast on green
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        backgroundColor: 'transparent',
    },
    amount: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detail: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    subDetail: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
}));
