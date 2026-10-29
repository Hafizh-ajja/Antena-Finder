import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, space, text } from "@/constants/theme";
import { PrimaryButton, SecondaryButton } from "./buttons";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  style?: ViewStyle;
};

export function EmptyState({
  icon = "map-outline",
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.box, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color={colors.blue} />
      </View>
      <Text style={[text.h3, styles.title]}>{title}</Text>
      <Text style={[text.body, styles.desc]}>{description}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <SecondaryButton label={secondaryLabel} onPress={onSecondary} style={styles.action} />
      ) : null}
    </View>
  );
}

export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} />
      <Text style={text.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    paddingVertical: space.xxl,
    paddingHorizontal: space.lg,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xs,
  },
  title: { textAlign: "center" },
  desc: { textAlign: "center", maxWidth: 320 },
  action: { marginTop: space.md },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: space.xxl,
  },
});
