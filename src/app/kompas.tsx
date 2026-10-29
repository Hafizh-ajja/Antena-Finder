import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { AntennaCompass } from "@/components/antenna-compass";
import { BackHeader } from "@/components/app-header";
import { CalibrationModal } from "@/components/calibration-modal";
import { SecondaryButton } from "@/components/ui/buttons";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { cardinalName, cardinalShort, formatDistance, shortestAngle } from "@/lib/geo";
import { polarizationAdvice } from "@/lib/signal";
import { useApp } from "@/store/app-state";

export default function KompasScreen() {
  const {
    position,
    ranked,
    selected,
    selectTransmitter,
    compass,
    requestLocation,
    settings,
    isManual,
  } = useApp();
  const { width } = useWindowDimensions();
  const [calibrating, setCalibrating] = useState(false);

  const size = Math.min(width - 56, 336);
  const bearing = selected?.bearing ?? 0;
  const delta = compass.heading == null ? 0 : shortestAngle(compass.heading, bearing);
  const aligned = compass.heading != null && Math.abs(delta) <= 5;

  const instruction = useMemo(() => {
    if (!selected) return "Pilih pemancar terlebih dahulu untuk melihat arah antena.";
    if (compass.heading == null)
      return `Kompas tidak tersedia. Hadapkan bagian atas HP ke utara, lalu arahkan antena ke ${Math.round(
        bearing,
      )}° (${cardinalName(bearing)}).`;
    if (aligned) return `Tepat! Antena sudah menghadap ${selected.name}.`;
    const amount = Math.round(Math.abs(delta));
    return delta > 0
      ? `Putar antena ${amount}° searah jarum jam (ke kanan).`
      : `Putar antena ${amount}° berlawanan arah jarum jam (ke kiri).`;
  }, [aligned, bearing, compass.heading, delta, selected]);

  if (!position) {
    return (
      <Screen>
        <BackHeader title="Cari Arah Antena" />
        <EmptyState
          icon="compass-outline"
          title="Lokasi dibutuhkan"
          description="Arah antena dihitung dari posisimu ke titik pemancar. Aktifkan GPS atau pilih kota manual dulu."
          actionLabel="Gunakan lokasi saya"
          onAction={requestLocation}
          secondaryLabel="Pilih kota manual"
          onSecondary={() => router.push("/pilih-kota")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader
        title="Cari Arah Antena"
        subtitle={selected ? selected.name : "Pilih pemancar target"}
        right={
          <Pressable
            onPress={() => setCalibrating(true)}
            accessibilityRole="button"
            accessibilityLabel="Kalibrasi kompas"
            style={styles.headerAction}
          >
            <Ionicons name="refresh" size={16} color={colors.blue} />
          </Pressable>
        }
      />

      <View style={styles.badgeRow}>
        {compass.available ? (
          <StatusBadge label="Kompas aktif" tone="primary" icon={<Ionicons name="compass" size={12} color={colors.primary} />} />
        ) : compass.checked ? (
          <StatusBadge
            label="Kompas tidak tersedia"
            tone="warning"
            icon={<Ionicons name="alert-circle-outline" size={12} color={colors.warning} />}
          />
        ) : (
          <StatusBadge
            label="Memeriksa sensor"
            tone="neutral"
            icon={<Ionicons name="ellipsis-horizontal" size={12} color={colors.muted} />}
          />
        )}
        <StatusBadge
          label={isManual ? "Lokasi manual" : "Lokasi GPS"}
          tone="blue"
          icon={<Ionicons name="location-outline" size={12} color={colors.blue} />}
        />
      </View>

      <Card variant="accent" style={styles.dialCard}>
        <AntennaCompass
          size={size}
          heading={compass.heading}
          targetBearing={bearing}
          accent={aligned ? colors.primary : colors.blue}
          center={
            <View style={styles.center}>
              <Text style={styles.centerValue}>
                {settings.showDegrees ? `${Math.round(bearing)}°` : cardinalShort(bearing)}
              </Text>
              <Text style={styles.centerLabel}>{cardinalShort(bearing)}</Text>
            </View>
          }
        />
        <Text style={styles.headingNow}>
          {compass.heading == null
            ? "Arah HP tidak terdeteksi"
            : settings.showDegrees
              ? `HP menghadap ${Math.round(compass.heading)}° ${cardinalShort(compass.heading)}`
              : `HP menghadap ${cardinalShort(compass.heading)}`}
        </Text>
      </Card>

      <Card style={[styles.instruction, aligned && styles.instructionAligned]}>
        <View style={[styles.instructionIcon, aligned && { backgroundColor: colors.primarySoft }]}>
          <Ionicons
            name={aligned ? "checkmark" : delta > 0 ? "arrow-redo" : "arrow-undo"}
            size={18}
            color={aligned ? colors.primary : colors.blue}
          />
        </View>
        <Text style={styles.instructionText}>{instruction}</Text>
      </Card>

      {selected ? (
        <>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Jarak</Text>
              <Text style={styles.statValue}>{formatDistance(selected.distanceKm)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Arah</Text>
              <Text style={styles.statValue}>{cardinalName(selected.bearing)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Polarisasi</Text>
              <Text style={styles.statValue}>{selected.polarization === "H" ? "Horizontal" : "Vertikal"}</Text>
            </View>
          </View>

          <InfoNote icon="git-compare-outline" title="Cara memutar antena">
            {settings.antennaMode === "indoor"
              ? "Mode antena indoor: tempatkan antena dekat jendela yang menghadap pemancar dan hindari dinding beton atau logam. "
              : "Mode antena outdoor: pasang setinggi mungkin dan bebas dari pohon atau bangunan. "}
            {polarizationAdvice(selected.polarization)} Putar perlahan 5–10° per langkah,
            lalu berhenti dan cek kualitas gambar di TV/STB sebelum melanjutkan.
          </InfoNote>
        </>
      ) : null}

      <SectionHeader
        title="Pilih pemancar"
        subtitle="Target terdekat diurutkan dari jarak"
        action={
          <Pressable onPress={() => router.push("/peta")} hitSlop={8}>
            <Text style={styles.link}>Lihat peta</Text>
          </Pressable>
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {ranked.slice(0, 10).map((item) => {
          const active = item.id === selected?.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => selectTransmitter(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipTitle, active && styles.chipTitleActive]} numberOfLines={1}>
                {item.name.replace("MUX ", "")}
              </Text>
              <Text style={styles.chipSub}>
                {formatDistance(item.distanceKm)} · {Math.round(item.bearing)}°
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <InfoNote tone="warning" icon="information-circle-outline" title="Kompas ≠ pengukur sinyal">
        Kompas hanya menunjukkan orientasi HP. Aplikasi tidak mengukur kekuatan sinyal RF.
        Kualitas sinyal nyata dibaca dari menu informasi sinyal di TV atau set-top box.
      </InfoNote>

      <SecondaryButton
        label={settings.showDegrees ? "Sembunyikan derajat di kompas" : "Tampilkan derajat di kompas"}
        icon="options-outline"
        onPress={() => router.push("/pengaturan")}
      />

      <CalibrationModal visible={calibrating} onClose={() => setCalibrating(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: { flexDirection: "row", gap: space.sm, flexWrap: "wrap", marginBottom: space.md },
  dialCard: { alignItems: "center", paddingVertical: space.lg, gap: space.sm },
  center: { alignItems: "center", justifyContent: "center" },
  centerValue: { color: colors.text, fontSize: 27, fontWeight: "700", letterSpacing: -0.8 },
  centerLabel: { color: colors.muted, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 },
  headingNow: { color: colors.dim, fontSize: 11, marginTop: 2 },
  instruction: { flexDirection: "row", alignItems: "center", gap: space.md, marginTop: space.md },
  instructionAligned: { borderColor: colors.primaryBorder },
  instructionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    marginTop: space.md,
  },
  stat: { flex: 1, gap: 2 },
  statLabel: { color: colors.dim, fontSize: 9, fontWeight: "700", letterSpacing: 0.9 },
  statValue: { color: colors.text, fontSize: 13, fontWeight: "700" },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 8 },
  link: { color: colors.blue, fontSize: 12, fontWeight: "600" },
  chips: { gap: space.sm, paddingBottom: space.md },
  chip: {
    minWidth: 118,
    maxWidth: 170,
    paddingHorizontal: space.md,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: 2,
  },
  chipActive: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  chipTitle: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  chipTitleActive: { color: colors.primary },
  chipSub: { color: colors.dim, fontSize: 10 },
});
