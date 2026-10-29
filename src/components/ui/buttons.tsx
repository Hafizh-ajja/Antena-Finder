import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, shadow, space } from "@/constants/theme";

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
  fullWidth = true,
  style,
  testID,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive) }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        fullWidth && styles.fullWidth,
        pressed && !inactive && styles.primaryPressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={colors.onPrimary} /> : null}
          <Text style={styles.primaryLabel}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
  fullWidth = true,
  style,
  testID,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive) }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondary,
        fullWidth && styles.fullWidth,
        pressed && !inactive && styles.secondaryPressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.blue} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={colors.blue} /> : null}
          <Text style={styles.secondaryLabel}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: space.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    ...shadow.glow,
  },
  primaryPressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.99 }] },
  primaryLabel: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  secondary: {
    backgroundColor: "transparent",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    paddingVertical: 14,
    paddingHorizontal: space.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  secondaryPressed: { backgroundColor: colors.blueSoft },
  secondaryLabel: {
    color: colors.blue,
    fontSize: 15,
    fontWeight: "600",
  },
  fullWidth: { width: "100%" },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  disabled: { opacity: 0.45 },
});
