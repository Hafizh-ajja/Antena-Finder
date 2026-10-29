import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

const BAR_HEIGHTS = [7, 11, 15, 19];

type SignalIndicatorProps = {
  value: number;
  color?: string;
  label?: string;
  size?: "sm" | "md";
};

export function SignalIndicator({ value, color = colors.primary, label, size = "md" }: SignalIndicatorProps) {
  const scale = size === "sm" ? 0.8 : 1;
  return (
    <View style={styles.row}>
      <View style={styles.bars}>
        {BAR_HEIGHTS.map((height, index) => {
          const active = index < value;
          return (
            <View
              key={height}
              style={{
                width: 4 * scale,
                height: height * scale,
                borderRadius: 2,
                backgroundColor: active ? color : colors.border,
                opacity: active ? 1 : 0.75,
              }}
            />
          );
        })}
      </View>
      {label ? (
        <Text style={[styles.label, { color: value > 0 ? color : colors.dim }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 1 },
});
