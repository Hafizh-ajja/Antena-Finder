import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type StepItemProps = {
  index: number;
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  last?: boolean;
};

export function StepItem({ index, title, description, icon, last = false }: StepItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={styles.badge}>
          {icon ? (
            <Ionicons name={icon} size={17} color={colors.primary} />
          ) : (
            <Text style={styles.badgeText}>{index}</Text>
          )}
        </View>
        {!last ? <View style={styles.line} /> : null}
      </View>
      <View style={[styles.body, last && { paddingBottom: 0 }]}>
        <Text style={styles.stepLabel}>LANGKAH {index}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.md },
  rail: { alignItems: "center", width: 36 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 6,
    borderRadius: 2,
  },
  body: { flex: 1, paddingBottom: space.xl, gap: 3 },
  stepLabel: {
    color: colors.dim,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  title: { color: colors.text, fontSize: 15, fontWeight: "600" },
  desc: { color: colors.muted, fontSize: 13, lineHeight: 20 },
});
