
import { ThemedView } from '../../components/themed-view';
import { IconSymbol } from '../../components/ui/icon-symbol';
import React, { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface ExpenseInputProps {
    onSubmit: (text: string) => Promise<void>;
}

const PLACEHOLDERS = [
    "Spent 1,200 on dinner at The Golden Spoon",
    "Paid 50 for an Uber to the office",
    "Spent 450 on weekend movie tickets",
    "Spent 2,500 on weekly restock at Reliance Fresh",
    "Paid 1,500 for the monthly water bill",
    "Spent 300 on a dental checkup",
    "Spent 1,800 on a new pair of sneakers",
    "Paid 100 for a notebook and pens",
    "Spent 600 on pizza delivery",
    "Spent 200 on a pharmacy run",
];

export const ExpenseInput = ({ onSubmit }: ExpenseInputProps) => {
    const { theme } = useUnistyles();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        await onSubmit(text);
        setText('');
        setLoading(false);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
                {!text && (
                    <Animated.Text
                        key={placeholderIndex}
                        entering={SlideInRight}
                        exiting={SlideOutLeft}
                        style={[styles.input, { position: 'absolute', color: theme.colors.dimmed, width: '100%' }]}
                        numberOfLines={1}
                    >
                        {PLACEHOLDERS[placeholderIndex]}
                    </Animated.Text>
                )}
                <TextInput
                    style={styles.input}
                    // placeholder is handled by Animated.Text
                    placeholderTextColor="transparent"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    editable={!loading}
                />
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || !text.trim()}
                style={[styles.button, (!text.trim() || loading) && { opacity: 0.5 }]}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.background} size="small" />
                ) : (
                    <IconSymbol name="paperplane.fill" size={24} color={theme.colors.tint} />
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
        padding: 7,
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
