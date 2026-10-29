import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { BackHeader } from "@/components/app-header";
import { CalibrationModal } from "@/components/calibration-modal";
import { SecondaryButton } from "@/components/ui/buttons";
import { Card, SectionHeader } from "@/components/ui/card";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatusBadge } from "@/components/ui/status-badge";
import { ToggleRow } from "@/components/ui/toggle-row";
import { colors, radius, space } from "@/constants/theme";
import { DATASET_META } from "@/data/transmitters";
import { confirmAction, notify } from "@/lib/dialog";
import { disableDailyReminder, enableDailyReminder } from "@/lib/reminders";
import { AntennaMode, useApp } from "@/store/app-state";

const MODES: { key: AntennaMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "outdoor", label: "Outdoor", icon: "home-outline" },
  { key: "indoor", label: "Indoor", icon: "business-outline" },
];

export default function PengaturanScreen() {
  const {
    settings,
    updateSettings,
    position,
    locationStatus,
    requestLocation,
    isManual,
    compass,
    resetAll,
    history,
  } = useApp();
  const [calibrating, setCalibrating] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);

  const version = Constants.expoConfig?.version ?? "1.0.0";

  const toggleReminders = async (value: boolean) => {
    if (!value) {
      await disableDailyReminder();
      updateSettings({ reminders: false });
      return;
    }

    setReminderBusy(true);
    const result = await enableDailyReminder();
    setReminderBusy(false);

    if (result.ok) {
      updateSettings({ reminders: true });
      notify("Pengingat aktif", "Kamu akan diingatkan setiap hari pukul 18.00 waktu lokal.");
      return;
    }

    if (result.reason === "web") {
      notify(
        "Hanya di aplikasi mobile",
        "Pengingat lokal membutuhkan notifikasi perangkat dan tidak tersedia di versi web.",
      );
    } else if (result.reason === "permission") {
      notify(
        "Izin notifikasi ditolak",
        "Aktifkan izin notifikasi untuk AntenaFinder di pengaturan sistem, lalu coba lagi.",
      );
    } else {
      notify("Gagal mengaktifkan pengingat", "Coba lagi beberapa saat lagi.");
    }
  };

  const confirmReset = () => {
    confirmAction({
      title: "Hapus semua data lokal?",
      message: `Pengaturan dan ${history.length} riwayat scan akan dihapus dari perangkat.`,
      onConfirm: () => {
        void resetAll();
        notify("Data dihapus", "Pengaturan dikembalikan ke default.");
      },
    });
  };

  const showDataset = () => {
    notify(DATASET_META.label, DATASET_META.description);
  };

  return (
    <Screen>
      <BackHeader title="Pengaturan" subtitle="Lokasi, kompas, dan preferensi" />

      <SectionHeader title="Lokasi" subtitle="Dipakai untuk menghitung arah pemancar" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Lokasi aktif</Text>
            <Text style={styles.rowValue} numberOfLines={2}>
              {position?.label ?? "Belum ada lokasi"}
            </Text>
          </View>
          <StatusBadge
            label={isManual ? "Manual" : "GPS"}
            tone={isManual ? "blue" : "primary"}
          />
        </View>

        <View style={styles.actionsRow}>
          <SecondaryButton
            label={locationStatus === "requesting" ? "Mencari..." : "Gunakan GPS"}
            icon="navigate-outline"
            onPress={requestLocation}
            loading={locationStatus === "requesting"}
            style={{ flex: 1 }}
          />
          <SecondaryButton
            label="Pilih kota"
            icon="map-outline"
            onPress={() => router.push("/pilih-kota")}
            style={{ flex: 1 }}
          />
        </View>

        {locationStatus === "denied" ? (
          <Text style={styles.hint}>
            Izin lokasi ditolak. Buka pengaturan sistem untuk mengizinkan, atau gunakan lokasi
            manual dari daftar kota.
          </Text>
        ) : null}
      </Card>

      <SectionHeader title="Sensor kompas" subtitle="Hanya membaca orientasi perangkat" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Status sensor</Text>
            <Text style={styles.rowValue}>
              {compass.available
                ? `Aktif · akurasi ${["tidak diketahui", "rendah", "sedang", "tinggi"][compass.accuracy] ?? "—"}`
                : compass.checked
                  ? "Tidak tersedia di perangkat ini"
                  : "Memeriksa sensor..."}
            </Text>
          </View>
          <StatusBadge
            label={compass.available ? "Aktif" : "Tidak aktif"}
            tone={compass.available ? "primary" : "warning"}
          />
        </View>
        <SecondaryButton
          label="Kalibrasi kompas"
          icon="compass-outline"
          onPress={() => setCalibrating(true)}
        />
      </Card>

      <SectionHeader title="Tampilan kompas" />
      <Card style={styles.card}>
        <ToggleRow
          icon="options-outline"
          title="Tampilkan derajat"
          description="Tampilkan angka azimut pada kompas dan panduan arah."
          value={settings.showDegrees}
          onValueChange={(value) => updateSettings({ showDegrees: value })}
        />
        <ToggleRow
          icon="compass-outline"
          title="Gunakan utara sejati"
          description="Matikan untuk memakai utara magnetik dari sensor HP."
          value={settings.compassNorth === "true"}
          onValueChange={(value) =>
            updateSettings({ compassNorth: value ? "true" : "magnetic" })
          }
          last
        />
      </Card>

      <SectionHeader title="Jenis antena" subtitle="Memengaruhi rekomendasi pemasangan" />
      <Card style={styles.card}>
        <View style={styles.segment}>
          {MODES.map((mode) => {
            const active = settings.antennaMode === mode.key;
            return (
              <Pressable
                key={mode.key}
                onPress={() => updateSettings({ antennaMode: mode.key })}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.segmentItem, active && styles.segmentActive]}
              >
                <Ionicons
                  name={mode.icon}
                  size={16}
                  color={active ? colors.onPrimary : colors.muted}
                />
                <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                  {mode.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hint}>
          {settings.antennaMode === "outdoor"
            ? "Antena luar ruangan: arahkan bebas tanpa penghalang dan setinggi mungkin."
            : "Antena dalam ruangan: redaman dinding lebih besar, tempatkan dekat jendela menghadap pemancar."}
        </Text>
      </Card>

      <SectionHeader title="Pengingat" />
      <Card style={styles.card}>
        <ToggleRow
          icon="notifications-outline"
          title="Pengingat harian"
          description={
            reminderBusy
              ? "Meminta izin notifikasi..."
              : "Ingatkan memeriksa kualitas sinyal setiap pukul 18.00."
          }
          value={settings.reminders}
          onValueChange={toggleReminders}
          disabled={reminderBusy}
        />
        <ToggleRow
          icon="bulb-outline"
          title="Tips di beranda"
          description="Tampilkan kartu tips singkat di halaman beranda."
          value={settings.notifications}
          onValueChange={(value) => updateSettings({ notifications: value })}
          last
        />
        {reminderBusy ? (
          <View style={styles.busyRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.hint}>Menunggu izin notifikasi...</Text>
          </View>
        ) : null}
      </Card>

      <SectionHeader title="Informasi aplikasi" />
      <Card style={styles.card}>
        <InfoRow label="Versi aplikasi" value={`v${version}`} />
        <InfoRow label="Dataset pemancar" value={DATASET_META.label} onPress={showDataset} />
        <InfoRow label="Penyimpanan" value="Lokal (AsyncStorage)" />
        <InfoRow label="Kompas" value="expo-location heading" />
        <InfoRow label="Peta" value="Google/Apple · OSM di web" />
      </Card>

      <InfoNote tone="warning" title="Keterbatasan perangkat keras">
        {DATASET_META.channelDisclaimer} Aplikasi tidak dapat mengukur level sinyal RF dari
        antena tanpa perangkat pengukur khusus.
      </InfoNote>

      <Pressable
        onPress={confirmReset}
        accessibilityRole="button"
        accessibilityLabel="Hapus semua data lokal"
        style={({ pressed }) => [styles.reset, pressed && { opacity: 0.75 }]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.danger} />
        <Text style={styles.resetText}>Hapus semua data lokal</Text>
      </Pressable>

      <CalibrationModal visible={calibrating} onClose={() => setCalibrating(false)} />
    </Screen>
  );
}

function InfoRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.infoRow}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueWrap}>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
        {onPress ? <Ionicons name="chevron-forward" size={14} color={colors.dim} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { color: colors.dim, fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
  rowValue: { color: colors.text, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  actionsRow: { flexDirection: "row", gap: space.sm },
  hint: { color: colors.dim, fontSize: 11, lineHeight: 17 },
  busyRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: radius.sm,
  },
  segmentActive: { backgroundColor: colors.primary },
  segmentLabel: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  segmentLabelActive: { color: colors.onPrimary },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  infoLabel: { color: colors.muted, fontSize: 12 },
  infoValueWrap: { flexDirection: "row", alignItems: "center", gap: 4, maxWidth: "60%" },
  infoValue: { color: colors.text, fontSize: 12, fontWeight: "600" },
  reset: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 122, 0.3)",
    backgroundColor: "rgba(255, 107, 122, 0.08)",
  },
  resetText: { color: colors.danger, fontSize: 13, fontWeight: "600" },
});
