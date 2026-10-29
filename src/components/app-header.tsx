import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "@/constants/theme";
import { goBackOr } from "@/lib/navigation";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
};

export function AppHeader({ title, subtitle, onBack, right, large = false }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.textWrap}>
        <Text style={large ? styles.largeTitle : styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function HeaderIconButton({
  icon,
  onPress,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

export function BackHeader(props: Omit<AppHeaderProps, "onBack">) {
  return <AppHeader {...props} onBack={() => goBackOr()} />;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    minHeight: 48,
  },
  textWrap: { flex: 1, gap: 1 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700", letterSpacing: -0.2 },
  largeTitle: { color: colors.text, fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { color: colors.dim, fontSize: 12 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
});
