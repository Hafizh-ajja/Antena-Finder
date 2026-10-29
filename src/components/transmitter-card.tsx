import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, space } from "@/constants/theme";
import { cardinalShort, formatDistance } from "@/lib/geo";
import type { RankedTransmitter } from "@/store/app-state";
import { SignalIndicator } from "./ui/signal-indicator";

type TransmitterCardProps = {
  transmitter: RankedTransmitter;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function TransmitterCard({
  transmitter,
  selected = false,
  onPress,
  style,
}: TransmitterCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${transmitter.name}, ${formatDistance(transmitter.distanceKm)}`}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && onPress ? styles.pressed : null,
        style,
      ]}
    >
      <View style={[styles.bearing, selected && styles.bearingSelected]}>
        <Ionicons
          name="navigate"
          size={20}
          color={selected ? colors.onPrimary : colors.blue}
          style={{ transform: [{ rotate: `${transmitter.bearing}deg` }] }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {transmitter.name}
          </Text>
          {selected ? <Ionicons name="checkmark-circle" size={16} color={colors.primary} /> : null}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {transmitter.city} · {transmitter.operator}
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>{formatDistance(transmitter.distanceKm)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.stat}>
            {Math.round(transmitter.bearing)}° {cardinalShort(transmitter.bearing)}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.stat}>CH {transmitter.channel}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <SignalIndicator
          value={transmitter.signal.bars}
          color={transmitter.signal.color}
          size="sm"
        />
        <Text style={[styles.signalLabel, { color: transmitter.signal.color }]}>
          {transmitter.signal.label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: space.md,
  },
  selected: { borderColor: colors.primaryBorder, backgroundColor: colors.cardAlt },
  pressed: { opacity: 0.82 },
  bearing: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  bearingSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  body: { flex: 1, gap: 2, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { color: colors.text, fontSize: 14, fontWeight: "600", flexShrink: 1 },
  meta: { color: colors.dim, fontSize: 11 },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  stat: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  dot: { color: colors.dim, fontSize: 10 },
  right: { alignItems: "flex-end", gap: 4, paddingLeft: 4 },
  signalLabel: { fontSize: 10, fontWeight: "700" },
});
