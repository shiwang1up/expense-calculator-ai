import { Text, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        type === 'default' ? stylesheet.default : undefined,
        type === 'title' ? stylesheet.title : undefined,
        type === 'defaultSemiBold' ? stylesheet.defaultSemiBold : undefined,
        type === 'subtitle' ? stylesheet.subtitle : undefined,
        type === 'link' ? stylesheet.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.typography,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.typography,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    color: theme.colors.typography,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.typography,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: theme.colors.link,
  },
}));
