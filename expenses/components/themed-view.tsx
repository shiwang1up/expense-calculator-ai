import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  return <View style={[stylesheet.container, style]} {...otherProps} />;
}

const stylesheet = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));
