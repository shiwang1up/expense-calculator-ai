import { ThemedText } from '../../components/themed-text';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { Expense } from '../../services/ExpenseService';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Animated, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native-unistyles';

interface ExpenseItemProps {
    expense: Expense;
    onDelete?: (id: string) => Promise<void>;
}

const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
};

const getCurrencySymbol = (currency: string) => {
    switch (currency.toUpperCase()) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'JPY': return '¥';
        case 'INR': return '₹';
        default: return currency;
    }
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ExpenseItem = ({ expense, onDelete }: ExpenseItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (onDelete) {
                            setIsDeleting(true);
                            try {
                                await onDelete(expense.id);
                            } catch {
                                Alert.alert('Error', 'Failed to delete expense');
                                setIsDeleting(false);
                            }
                        }
                    },
                },
            ]
        );
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <AnimatedTouchableOpacity onPress={handleDelete} style={[styles.deleteAction, { transform: [{ translateX }] }]}>
                <View style={styles.deleteActionContent}>
                    <IconSymbol name="trash" size={24} color="white" />
                    <ThemedText style={styles.deleteText}>Delete</ThemedText>
                </View>
            </AnimatedTouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <ThemedText style={styles.emoji}>{expense.emoji}</ThemedText>
                </View>
                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <ThemedText style={styles.category} numberOfLines={1}>{expense.category}</ThemedText>
                        <ThemedText style={styles.amount}>{getCurrencySymbol(expense.currency || 'INR')}{expense.amount}</ThemedText>
                    </View>
                    <ThemedText style={styles.description} numberOfLines={1}>
                        {expense.merchant ? `${expense.merchant} • ` : ''}{expense.description || expense.title}
                    </ThemedText>
                    <ThemedText style={styles.time}>{formatRelativeTime(expense.date)}</ThemedText>
                </View>
                {isDeleting && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create((theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.gap(1.5),
        backgroundColor: theme.colors.card,
        borderRadius: 10,
        borderRightWidth: 2,
        borderRightColor: theme.colors.foreground,
        paddingHorizontal: theme.gap(1.5),
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.gap(2),
    },
    emoji: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        marginRight: theme.gap(1),
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.typography,
        flex: 1,
        marginRight: theme.gap(1),
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.typography,
    },
    description: {
        fontSize: 14,
        color: theme.colors.dimmed,
        marginBottom: 2,
    },
    time: {
        fontSize: 12,
        color: theme.colors.dimmed,
        opacity: 0.8,
    },
    deleteAction: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 100,
        borderRadius: 20
    },
    deleteActionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%", // Center within the width
    },
    deleteText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
