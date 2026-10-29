import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntennaCompass } from "@/components/antenna-compass";
import { BackHeader } from "@/components/app-header";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatTile } from "@/components/ui/stat-tile";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { notify } from "@/lib/dialog";
import { cardinalName, cardinalShort, formatDistance } from "@/lib/geo";
import { formatDateTime } from "@/lib/format";
import { polarizationAdvice } from "@/lib/signal";
import { useApp } from "@/store/app-state";

const SIGNAL_COLORS = [colors.bad, colors.warn, colors.warning, colors.accent, colors.primary];

export default function HasilScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { history, lastScan, addHistory } = useApp();
  const [justSaved, setJustSaved] = useState(false);

  const record = params.id ? history.find((item) => item.id === params.id) ?? null : lastScan;
  const isSaved = Boolean(record && (history.some((item) => item.id === record.id) || justSaved));

  if (!record) {
    return (
      <Screen>
        <BackHeader title="Hasil Pemeriksaan" />
        <EmptyState
          icon="document-text-outline"
          title="Belum ada hasil scan"
          description="Jalankan scan terlebih dahulu untuk mendapatkan rekomendasi arah antena dan checklist perbaikan."
          actionLabel="Mulai Scan"
          onAction={() => router.replace("/scan")}
          secondaryLabel="Kembali ke beranda"
          onSecondary={() => router.replace("/beranda")}
        />
      </Screen>
    );
  }

  const save = () => {
    if (isSaved) return;
    addHistory(record);
    setJustSaved(true);
    notify("Hasil disimpan", "Pemeriksaan ini tersimpan di tab Riwayat dan bisa dibuka lagi kapan saja.");
  };

  const checklist = [
    {
      icon: "compass-outline" as const,
      title: `Arahkan antena ke ${Math.round(record.azimuth)}° (${cardinalName(record.azimuth)})`,
      detail:
        "Gunakan kompas sebagai panduan. Putar antena bertahap 5–10° dan berhenti untuk mengecek gambar.",
    },
    {
      icon: "git-compare-outline" as const,
      title:
        record.polarization === "V"
          ? "Pasang elemen antena tegak (vertikal)"
          : "Pasang elemen antena mendatar (horizontal)",
      detail: record.polarization
        ? polarizationAdvice(record.polarization)
        : "Cek polarisasi pemancar sebelum memasang antena.",
    },
    {
      icon: "trending-up-outline" as const,
      title: "Naikkan posisi antena",
      detail:
        "Minimal 3 meter di atas atap dan bebas dari pohon, bangunan, atau atap seng di depan antena.",
    },
    {
      icon: "refresh-outline" as const,
      title: "Scan ulang channel di TV/STB",
      detail:
        "Setelah antena diputar, jalankan auto tuning agar channel digital yang hilang terdaftar ulang.",
    },
    {
      icon: "link-outline" as const,
      title: "Periksa kabel dan konektor",
      detail:
        "Ganti kabel coaxial yang terkelupas, pastikan konektor F kencang, dan hindari sambungan di luar ruangan.",
    },
    ...(record.distanceKm > 45
      ? [
          {
            icon: "hardware-chip-outline" as const,
            title: "Pertimbangkan penguat sinyal",
            detail: `Jarak ke pemancar ${formatDistance(
              record.distanceKm,
            )}. Antena penguat atau penguat mast bisa membantu bila kabel panjang.`,
          },
        ]
      : []),
  ];

  return (
    <Screen>
      <BackHeader title="Hasil Pemeriksaan" subtitle={record.locationLabel} />

      <View style={styles.badgeRow}>
        <StatusBadge
          label={isSaved ? "Tersimpan" : "Belum disimpan"}
          tone={isSaved ? "primary" : "neutral"}
          icon={
            <Ionicons
              name={isSaved ? "checkmark-circle" : "save-outline"}
              size={12}
              color={isSaved ? colors.primary : colors.muted}
            />
          }
        />
        <StatusBadge
          label="Estimasi arah"
          tone="blue"
          icon={<Ionicons name="analytics-outline" size={12} color={colors.blue} />}
        />
      </View>

      <Card variant="accent" style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>Rekomendasi arah antena</Text>
            <Text style={styles.heroValue}>
              {Math.round(record.azimuth)}°{" "}
              <Text style={styles.heroCardinal}>{cardinalShort(record.azimuth)}</Text>
            </Text>
            <Text style={styles.heroDir}>{cardinalName(record.azimuth)}</Text>
            <Text style={styles.heroMeta} numberOfLines={2}>
              {record.transmitterName} · {formatDistance(record.distanceKm)}
            </Text>
          </View>
          <AntennaCompass
            size={128}
            heading={null}
            targetBearing={record.azimuth}
            accent={colors.primary}
          />
        </View>
        <Text style={styles.heroDate}>Diperiksa {formatDateTime(record.createdAt)}</Text>
      </Card>

      <SectionHeader title="Ringkasan" subtitle="Data yang dipakai untuk rekomendasi" />
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <StatTile label="Jarak" value={formatDistance(record.distanceKm)} hint="ke pemancar" />
          <StatTile
            label="Kanal UHF"
            value={record.channel ? `CH ${record.channel}` : "—"}
            hint="perkiraan"
            accent={colors.blue}
          />
        </View>
        <View style={styles.gridRow}>
          <StatTile
            label="Frekuensi"
            value={record.frequencyMHz ? `${record.frequencyMHz} MHz` : "—"}
            hint="center frequency"
            accent={colors.blue}
          />
          <StatTile
            label="Polarisasi"
            value={record.polarization ?? "—"}
            hint={record.polarization === "H" ? "horizontal" : "vertikal"}
          />
        </View>
        <View style={styles.gridRow}>
          <StatTile
            label="Estimasi sinyal"
            value={record.signalLabel}
            hint={`${record.signalBars}/4 bar · estimasi`}
            accent={SIGNAL_COLORS[record.signalBars] ?? colors.muted}
          />
          <StatTile
            label="Lokasi"
            value={`${record.latitude.toFixed(2)}, ${record.longitude.toFixed(2)}`}
            hint="koordinat pemeriksaan"
            accent={colors.muted}
          />
        </View>
      </View>

      <SectionHeader title="Checklist perbaikan" subtitle="Kerjakan berurutan dari atas" />
      <Card style={styles.checklist}>
        {checklist.map((item, index) => (
          <View key={item.title} style={[styles.checkRow, index === checklist.length - 1 && styles.checkRowLast]}>
            <View style={styles.checkIcon}>
              <Ionicons name={item.icon} size={16} color={colors.primary} />
            </View>
            <View style={styles.checkText}>
              <Text style={styles.checkTitle}>{item.title}</Text>
              <Text style={styles.checkDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </Card>

      <InfoNote tone="warning" title="Bukan hasil pengukuran sinyal">
        Angka “{record.signalLabel}” adalah estimasi dari jarak, kanal, dan daya pancar — bukan
        level sinyal yang diterima antenamu. Verifikasi lewat menu info sinyal di TV/STB.
      </InfoNote>

      <View style={styles.actions}>
        <PrimaryButton
          label={isSaved ? "Tersimpan di riwayat" : "Simpan Hasil"}
          icon={isSaved ? "checkmark" : "bookmark-outline"}
          onPress={save}
          disabled={isSaved}
        />
        <View style={styles.secondaryRow}>
          <SecondaryButton
            label="Scan Ulang"
            icon="refresh-outline"
            onPress={() => router.replace("/scan")}
            style={{ flex: 1 }}
          />
          <SecondaryButton
            label="Buka Kompas"
            icon="compass-outline"
            onPress={() => router.replace("/kompas")}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: "row", gap: space.sm, flexWrap: "wrap", marginBottom: space.md },
  hero: { gap: space.md },
  heroTop: { flexDirection: "row", alignItems: "center", gap: space.sm },
  heroText: { flex: 1, minWidth: 0 },
  heroLabel: { color: colors.muted, fontSize: 11, fontWeight: "600", letterSpacing: 0.4 },
  heroValue: { color: colors.text, fontSize: 40, fontWeight: "700", letterSpacing: -1.4, marginTop: 2 },
  heroCardinal: { color: colors.primary, fontSize: 26, fontWeight: "700" },
  heroDir: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  heroMeta: { color: colors.muted, fontSize: 11, marginTop: 6, lineHeight: 16 },
  heroDate: { color: colors.dim, fontSize: 10 },
  grid: { gap: space.sm },
  gridRow: { flexDirection: "row", gap: space.sm },
  checklist: { gap: 0, paddingVertical: space.sm },
  checkRow: {
    flexDirection: "row",
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  checkRowLast: { borderBottomWidth: 0 },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { flex: 1, gap: 2 },
  checkTitle: { color: colors.text, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  checkDetail: { color: colors.muted, fontSize: 11, lineHeight: 17 },
  actions: { gap: space.md, marginTop: space.lg },
  secondaryRow: { flexDirection: "row", gap: space.md },
});
