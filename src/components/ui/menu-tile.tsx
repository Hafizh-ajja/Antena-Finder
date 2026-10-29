import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type MenuTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  tone?: "primary" | "blue";
  style?: ViewStyle;
};

export function MenuTile({ icon, title, subtitle, onPress, tone = "blue", style }: MenuTileProps) {
  const accent = tone === "primary" ? colors.primary : colors.blue;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed, style]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: tone === "primary" ? colors.primarySoft : colors.blueSoft,
            borderColor: tone === "primary" ? colors.primaryBorder : colors.blueBorder,
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={accent} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 0,
    minHeight: 124,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    gap: 6,
  },
  pressed: { backgroundColor: colors.cardAlt },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  title: { color: colors.text, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  subtitle: { color: colors.dim, fontSize: 11, lineHeight: 15 },
});
