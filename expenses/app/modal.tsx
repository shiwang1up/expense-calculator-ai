import { Link } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={stylesheet.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={stylesheet.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
}));
