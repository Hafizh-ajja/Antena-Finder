import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, shadow, space, text } from "@/constants/theme";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "raised" | "accent";
  padded?: boolean;
};

export function Card({ children, style, variant = "default", padded = true }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        variant === "raised" && styles.raised,
        variant === "accent" && styles.accent,
        style,
      ]}
    >
      {children}
    </View>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionText}>
        <Text style={text.h3}>{title}</Text>
        {subtitle ? <Text style={[text.small, styles.sectionSubtitle]}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: { padding: space.lg },
  raised: { backgroundColor: colors.cardAlt },
  accent: { borderColor: colors.primaryBorder, backgroundColor: colors.cardAlt },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md,
    gap: space.md,
  },
  sectionText: { flex: 1, gap: 2 },
  sectionSubtitle: { marginTop: 2 },
});
