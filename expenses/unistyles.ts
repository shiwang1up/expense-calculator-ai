import { StyleSheet } from "react-native-unistyles";

const lightTheme = {
  colors: {
    background: "#F5F5F7", // Slightly cooler/modern background
    foreground: "#FFFFFF", // Pure white for cards
    typography: "#000000",
    dimmed: "#86868B",
    tint: "#007AFF", // Apple-like blue or a brand color
    activeTint: "#000000",
    link: "#007AFF",
    accents: {
      banana: "#FFD60A",
      pumpkin: "#FF9F0A",
      apple: "#FF375F",
      grass: "#34C759",
      storm: "#5856D6",
    },
    // New additions for card/shadows
    card: "#FFFFFF",
    hairline: "#E1E1E1",
  },
  gap: (v: number) => v * 8,
} as const;

const darkTheme = {
  colors: {
    background: "#000000",
    foreground: "#1C1C1E", // Apple dark gray
    typography: "#FFFFFF",
    dimmed: "#98989D",
    tint: "#0A84FF",
    activeTint: "#FFFFFF",
    link: "#0A84FF",
    accents: {
      banana: "#FFD60A",
      pumpkin: "#FF9F0A",
      apple: "#FF375F",
      grass: "#30D158",
      storm: "#5E5CE6",
    },
    card: "#1C1C1E",
    hairline: "#38383A",
  },
  gap: (v: number) => v * 8,
} as const;

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: appThemes,
  breakpoints,
});
