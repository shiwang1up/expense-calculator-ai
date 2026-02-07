
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExpenseGroup } from '@/services/ExpenseService';
import React, { useState } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseListProps {
    expenses: ExpenseGroup[];
    onRefresh: () => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
}

export const ExpenseList = ({ expenses, onRefresh, onDelete }: ExpenseListProps) => {
    const { theme } = useUnistyles();

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
    };

    return (
        <SectionList
            sections={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ExpenseItem expense={item} onDelete={onDelete} />}
            renderSectionHeader={({ section: { date } }) => (
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.headerText}>{date}</ThemedText>
                </ThemedView>
            )}
            renderSectionFooter={() => <View style={styles.separator} />}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={[styles.listContent, expenses.length === 0 && styles.emptyContainer]}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={
                <View style={styles.emptyState}>
                    <ThemedText style={styles.emptyText}>No expenses yet. Add your first one!</ThemedText>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create((theme) => ({
    listContent: {
        paddingBottom: theme.gap(4),
    },
    header: {
        paddingHorizontal: theme.gap(2),
        paddingVertical: theme.gap(1),
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.hairline,
    },
    headerText: {
        fontSize: 13,
        color: theme.colors.dimmed,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.hairline,
        marginLeft: theme.gap(2) + 40 + theme.gap(2), // Indent to match text start (icon width + margins)
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.gap(4),
    },
    emptyText: {
        color: theme.colors.dimmed,
        fontSize: 16,
        textAlign: 'center',
    },
}));
