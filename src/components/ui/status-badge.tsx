import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius } from "@/constants/theme";

type Tone = "primary" | "blue" | "warning" | "danger" | "neutral";

const TONES: Record<Tone, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.primarySoft, border: colors.primaryBorder, text: colors.primary },
  blue: { bg: colors.blueSoft, border: colors.blueBorder, text: colors.blue },
  warning: { bg: "rgba(255, 194, 75, 0.12)", border: "rgba(255, 194, 75, 0.35)", text: colors.warning },
  danger: { bg: "rgba(255, 107, 122, 0.12)", border: "rgba(255, 107, 122, 0.32)", text: colors.danger },
  neutral: { bg: "rgba(255, 255, 255, 0.06)", border: colors.border, text: colors.muted },
};

type StatusBadgeProps = {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function StatusBadge({ label, tone = "neutral", icon, style }: StatusBadgeProps) {
  const palette = TONES[tone];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette.bg, borderColor: palette.border },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    flexShrink: 1,
  },
});
