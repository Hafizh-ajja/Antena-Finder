import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type InfoNoteProps = {
  title?: string;
  children: React.ReactNode;
  tone?: "info" | "warning";
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export function InfoNote({
  title,
  children,
  tone = "info",
  icon = "information-circle-outline",
  style,
}: InfoNoteProps) {
  const isWarning = tone === "warning";
  return (
    <View
      style={[
        styles.note,
        {
          backgroundColor: isWarning ? "rgba(255, 194, 75, 0.08)" : colors.blueSoft,
          borderColor: isWarning ? "rgba(255, 194, 75, 0.28)" : colors.blueBorder,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color={isWarning ? colors.warning : colors.blue} />
      <View style={styles.body}>
        {title ? (
          <Text style={[styles.title, isWarning && { color: colors.warning }]}>{title}</Text>
        ) : null}
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  body: { flex: 1, gap: 3 },
  title: { color: colors.blue, fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  text: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
