import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  style?: ViewStyle;
};

export function StatTile({ label, value, hint, accent = colors.primary, style }: StatTileProps) {
  return (
    <View style={[styles.tile, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {hint ? (
        <Text style={styles.hint} numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.dim,
  },
  value: { fontSize: 19, fontWeight: "700", letterSpacing: -0.3 },
  hint: { fontSize: 11, lineHeight: 15, color: colors.dim },
});
