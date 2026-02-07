
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ExpenseInputProps {
    onSubmit: (text: string) => Promise<void>;
}

export const ExpenseInput = ({ onSubmit }: ExpenseInputProps) => {
    const { theme } = useUnistyles();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        await onSubmit(text);
        setText('');
        setLoading(false);
    };

    return (
        <ThemedView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Spent 500 on groceries at BigBazaar"
                placeholderTextColor={theme.colors.dimmed}
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                editable={!loading}
            />
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || !text.trim()}
                style={[styles.button, (!text.trim() || loading) && { opacity: 0.5 }]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.background} size="small" />
                ) : (
                    <IconSymbol name="plus" size={24} color={theme.colors.background} />
                )}
            </TouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create((theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.gap(3),
        paddingHorizontal: theme.gap(2),
        paddingVertical: theme.gap(1),
        marginHorizontal: theme.gap(2),
        marginBottom: theme.gap(2),
        // Shadow for iOS
        shadowColor: theme.colors.typography,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        // Elevation for Android
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
    },
    input: {
        flex: 1,
        color: theme.colors.typography,
        fontSize: 17,
        paddingRight: theme.gap(2),
        paddingVertical: theme.gap(1.5),
    },
    button: {
        backgroundColor: theme.colors.tint,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
