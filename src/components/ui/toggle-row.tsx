import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type ToggleRowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
};

export function ToggleRow({
  icon,
  title,
  description,
  value,
  onValueChange,
  disabled,
  last,
}: ToggleRowProps) {
  return (
    <View style={[styles.row, last && styles.last]}>
      {icon ? (
        <View style={styles.icon}>
          <Ionicons name={icon} size={18} color={colors.blue} />
        </View>
      ) : null}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryBorder }}
        thumbColor={value ? colors.primary : colors.dim}
        ios_backgroundColor={colors.border}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  last: { borderBottomWidth: 0 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: 14, fontWeight: "600" },
  description: { color: colors.dim, fontSize: 12, lineHeight: 17 },
});
