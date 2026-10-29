import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { colors, radius, space } from "@/constants/theme";
import { formatDistance } from "@/lib/geo";
import type { RankedTransmitter } from "@/store/app-state";
import { PrimaryButton } from "./ui/buttons";
import { StatusBadge } from "./ui/status-badge";
import { SignalIndicator } from "./ui/signal-indicator";

type SignalCardProps = {
  transmitter: RankedTransmitter | null;
  locationLabel: string | null;
  readyToScan: boolean;
  onScan: () => void;
};

export function SignalCard({ transmitter, locationLabel, readyToScan, onScan }: SignalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.radar} pointerEvents="none">
        <Svg width={190} height={190}>
          {[34, 58, 84].map((r) => (
            <Circle
              key={r}
              cx={95}
              cy={95}
              r={r}
              stroke={colors.primary}
              strokeWidth={1}
              opacity={0.1}
            />
          ))}
          <Line x1={95} y1={95} x2={95} y2={11} stroke={colors.primary} strokeWidth={2} opacity={0.22} />
          <Circle cx={95} cy={95} r={3} fill={colors.primary} opacity={0.5} />
        </Svg>
      </View>

      <View style={styles.content}>
        <StatusBadge
          label={readyToScan ? "Siap memandu" : "Butuh lokasi"}
          tone={readyToScan ? "primary" : "warning"}
          icon={
            <Ionicons
              name={readyToScan ? "radio-outline" : "location-outline"}
              size={12}
              color={readyToScan ? colors.primary : colors.warning}
            />
          }
        />

        <Text style={styles.title}>Cari arah antena terbaik</Text>
        <Text style={styles.subtitle}>
          {transmitter
            ? `Pemancar terdekat: ${transmitter.name} · ${formatDistance(transmitter.distanceKm)} dari lokasimu.`
            : "Aktifkan lokasi atau pilih kota untuk menghitung arah pemancar TV terdekat."}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location" size={14} color={colors.blue} />
          <Text style={styles.meta} numberOfLines={1}>
            {locationLabel ?? "Lokasi belum ditentukan"}
          </Text>
        </View>

        {transmitter ? (
          <View style={styles.signalRow}>
            <SignalIndicator
              value={transmitter.signal.bars}
              color={transmitter.signal.color}
            />
            <Text style={[styles.signalText, { color: transmitter.signal.color }]}>
              {transmitter.signal.label} (estimasi)
            </Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Mulai Scan"
          icon="scan-outline"
          onPress={onScan}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: space.xl,
    overflow: "hidden",
  },
  radar: { position: "absolute", top: -50, right: -48, opacity: 0.9 },
  content: { gap: space.sm },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 2,
    maxWidth: "92%",
  },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, maxWidth: "94%" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  meta: { color: colors.blue, fontSize: 12, fontWeight: "600", flex: 1 },
  signalRow: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 2 },
  signalText: { fontSize: 12, fontWeight: "600" },
  button: { marginTop: space.sm },
});
