import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { goBackOr } from "@/lib/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { BackHeader } from "@/components/app-header";
import { SecondaryButton } from "@/components/ui/buttons";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { colors, radius, space } from "@/constants/theme";
import { cardinalShort } from "@/lib/geo";
import { ScanRecord, useApp } from "@/store/app-state";

const STEPS = [
  {
    label: "Memeriksa perangkat",
    detail: "Membaca ketersediaan sensor dan izin lokasi.",
    icon: "phone-portrait-outline" as const,
  },
  {
    label: "Mencari data pemancar",
    detail: "Mencocokkan kota dengan dataset pemancar demo.",
    icon: "radio-outline" as const,
  },
  {
    label: "Membaca orientasi kompas",
    detail: "Mengambil arah hadap perangkat (bila tersedia).",
    icon: "compass-outline" as const,
  },
  {
    label: "Menghitung arah & jarak",
    detail: "Menghitung azimut dan jarak ke pemancar terdekat.",
    icon: "analytics-outline" as const,
  },
  {
    label: "Menyiapkan rekomendasi",
    detail: "Menyusun checklist perbaikan penerimaan sinyal.",
    icon: "checkmark-done-outline" as const,
  },
];

const RADAR = 220;

export default function ScanScreen() {
  const { position, ranked, compass, requestLocation, setLastScan } = useApp();
  const [step, setStep] = useState(-1);
  const startedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [sweep] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));

  const hasPosition = Boolean(position);

  const finishRef = useRef<() => void>(() => {});
  const buildRecord = useCallback((): ScanRecord | null => {
    if (!position) return null;
    const nearest = ranked[0] ?? null;
    return {
      id: `scan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      locationLabel: position.label,
      latitude: position.latitude,
      longitude: position.longitude,
      transmitterId: nearest?.id ?? null,
      transmitterName: nearest?.name ?? "Data pemancar belum tersedia",
      transmitterCity: nearest?.city ?? "-",
      azimuth: nearest ? Math.round(nearest.bearing) : 0,
      distanceKm: nearest ? Number(nearest.distanceKm.toFixed(2)) : 0,
      channel: nearest?.channel ?? null,
      frequencyMHz: nearest ? Math.round(nearest.frequencyMHz) : null,
      polarization: nearest?.polarization ?? null,
      signalLabel: nearest?.signal.label ?? "Tidak diketahui",
      signalBars: nearest?.signal.bars ?? 0,
    };
  }, [position, ranked]);

  useEffect(() => {
    finishRef.current = () => {
      const record = buildRecord();
      if (!record) return;
      setLastScan(record);
      router.replace("/hasil");
    };
  }, [buildRecord, setLastScan]);

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    sweepLoop.start();
    pulseLoop.start();
    return () => {
      sweepLoop.stop();
      pulseLoop.stop();
    };
  }, [pulse, sweep]);

  const start = useCallback(() => {
    if (startedRef.current || !hasPosition) return;
    startedRef.current = true;
    setStep(0);
    [700, 1500, 2400, 3300, 4200].forEach((delay, index) => {
      timers.current.push(setTimeout(() => setStep(index), delay));
    });
    timers.current.push(setTimeout(() => finishRef.current(), 4900));
  }, [hasPosition]);

  useEffect(() => {
    start();
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [start]);

  const cancel = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    goBackOr();
  };

  const rotate = sweep.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.05] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  if (!position) {
    return (
      <Screen>
        <BackHeader title="Proses Scan" subtitle="Lokasi diperlukan sebelum memindai" />
        <EmptyState
          icon="location-outline"
          title="Lokasi belum aktif"
          description="Scan membutuhkan lokasi untuk mencari pemancar TV terdekat dan menghitung arah antena."
          actionLabel="Gunakan lokasi saya"
          onAction={requestLocation}
          secondaryLabel="Pilih kota manual"
          onSecondary={() => router.push("/pilih-kota")}
        />
        <InfoNote style={{ marginTop: space.lg }} title="Tanpa pengukuran RF">
          Scan ini tidak mengukur kekuatan sinyal. Hasilnya adalah perhitungan arah dan jarak
          berdasarkan lokasi, bukan pembacaan level sinyal dari antena.
        </InfoNote>
      </Screen>
    );
  }

  const progress = Math.max(0, Math.min(1, (step + 1) / STEPS.length));

  return (
    <Screen>
      <BackHeader title="Proses Scan" subtitle={position.label} />

      <Card variant="accent" style={styles.radarCard}>
        <View style={styles.radar}>
          {[0.42, 0.66, 0.9].map((scale) => (
            <View
              key={scale}
              style={[
                styles.ring,
                {
                  width: RADAR * scale,
                  height: RADAR * scale,
                  borderRadius: RADAR,
                },
              ]}
            />
          ))}
          <Animated.View
            style={[
              styles.pulse,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />
          <Animated.View style={[styles.sweep, { transform: [{ rotate }] }]}>
            <View style={styles.sweepLine} />
          </Animated.View>
          <View style={styles.radarCenter}>
            <Text style={styles.radarValue}>
              {compass.heading == null ? "—" : `${Math.round(compass.heading)}°`}
            </Text>
            <Text style={styles.radarLabel}>
              {compass.heading == null ? "TANPA KOMPAS" : cardinalShort(compass.heading)}
            </Text>
          </View>
        </View>
        <Text style={styles.radarTitle}>Memindai lingkungan sekitar</Text>
        <Text style={styles.radarSub}>
          {step < STEPS.length - 1
            ? STEPS[Math.max(step, 0)].detail
            : "Menyelesaikan perhitungan arah antena."}
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      </Card>

      <Card style={styles.stepCard}>
        {STEPS.map((item, index) => {
          const done = step > index;
          const active = step === index;
          return (
            <View key={item.label} style={styles.stepRow}>
              <View
                style={[
                  styles.stepIcon,
                  done && styles.stepIconDone,
                  active && styles.stepIconActive,
                ]}
              >
                <Ionicons
                  name={done ? "checkmark" : item.icon}
                  size={15}
                  color={done ? colors.onPrimary : active ? colors.primary : colors.dim}
                />
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepLabel, (done || active) && styles.stepLabelActive]}>
                  {item.label}
                </Text>
                {active ? <Text style={styles.stepDetail}>{item.detail}</Text> : null}
              </View>
              {active ? <View style={styles.activeDot} /> : null}
            </View>
          );
        })}
      </Card>

      <InfoNote tone="warning" title="Scan ini bukan pengukuran RF">
        AntenaFinder tidak membaca level sinyal dari antena. Kualitas gambar dan angka
        kekuatan sinyal harus dicek langsung di TV atau set-top box.
      </InfoNote>

      <SecondaryButton label="Batal" icon="close" onPress={cancel} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  radarCard: { alignItems: "center", gap: space.sm, paddingVertical: space.xl },
  radar: {
    width: RADAR,
    height: RADAR,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pulse: {
    position: "absolute",
    width: RADAR * 0.9,
    height: RADAR * 0.9,
    borderRadius: RADAR,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sweep: {
    position: "absolute",
    width: RADAR,
    height: RADAR,
    alignItems: "center",
  },
  sweepLine: {
    width: 2,
    height: RADAR / 2 - 6,
    backgroundColor: colors.primary,
    opacity: 0.55,
    borderRadius: 1,
  },
  radarCenter: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  radarValue: { color: colors.text, fontSize: 22, fontWeight: "700", letterSpacing: -0.5 },
  radarLabel: { color: colors.dim, fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  radarTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  radarSub: { color: colors.muted, fontSize: 12, textAlign: "center", maxWidth: 280 },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginTop: space.sm,
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
  stepCard: { gap: 2, marginTop: space.md },
  stepRow: { flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: 9 },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconActive: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  stepIconDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepText: { flex: 1, gap: 1 },
  stepLabel: { color: colors.dim, fontSize: 13, fontWeight: "600" },
  stepLabelActive: { color: colors.text },
  stepDetail: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
});
