import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { HeaderIconButton } from "@/components/app-header";
import { Logo } from "@/components/logo";
import { SignalCard } from "@/components/signal-card";
import { TransmitterCard } from "@/components/transmitter-card";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { MenuTile } from "@/components/ui/menu-tile";
import { Screen } from "@/components/ui/screen";
import { colors, radius, space } from "@/constants/theme";
import { useApp } from "@/store/app-state";

const MENU = [
  {
    icon: "compass" as const,
    title: "Cari Arah Antena",
    subtitle: "Kompas & azimut pemancar",
    route: "/kompas",
    tone: "primary" as const,
  },
  {
    icon: "map" as const,
    title: "Peta Sinyal Lokal",
    subtitle: "Lihat sebaran pemancar",
    route: "/peta",
    tone: "blue" as const,
  },
  {
    icon: "bulb" as const,
    title: "Tips & Panduan",
    subtitle: "Langkah pemasangan aman",
    route: "/panduan",
    tone: "blue" as const,
  },
  {
    icon: "time" as const,
    title: "Riwayat Scan",
    subtitle: "Hasil pemeriksaan tersimpan",
    route: "/riwayat",
    tone: "blue" as const,
  },
  {
    icon: "settings" as const,
    title: "Pengaturan",
    subtitle: "Lokasi, sensor, preferensi",
    route: "/pengaturan",
    tone: "blue" as const,
  },
];

export default function BerandaScreen() {
  const {
    position,
    locationStatus,
    locationError,
    requestLocation,
    ranked,
    settings,
    selectTransmitter,
    isManual,
    compass,
  } = useApp();
  const [tipsDismissed, setTipsDismissed] = useState(false);

  const locationLabel = position?.label ?? null;
  const showTips = settings.notifications && !tipsDismissed;

  return (
    <Screen>
      <View style={styles.brandRow}>
        <Logo size={42} />
        <View style={styles.brandText}>
          <Text style={styles.brand}>
            Antenna<Text style={styles.accent}>Finder</Text>
          </Text>
          <Text style={styles.brandSub}>Arah tepat, sinyal kuat</Text>
        </View>
        <HeaderIconButton
          icon="settings-outline"
          label="Buka pengaturan"
          onPress={() => router.push("/pengaturan")}
        />
      </View>

      <View style={styles.locationRow}>
        <Pressable
          onPress={() => router.push("/pilih-kota")}
          accessibilityRole="button"
          accessibilityLabel="Ubah lokasi"
          style={({ pressed }) => [styles.locationChip, pressed && { opacity: 0.8 }]}
        >
          <Ionicons name="location" size={15} color={colors.blue} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationLabel ?? "Lokasi belum aktif"}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.dim} />
        </Pressable>
        <Pressable
          onPress={requestLocation}
          accessibilityRole="button"
          accessibilityLabel="Perbarui lokasi GPS"
          style={({ pressed }) => [styles.refreshButton, pressed && { opacity: 0.7 }]}
        >
          {locationStatus === "requesting" ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="navigate" size={16} color={colors.primary} />
          )}
        </Pressable>
      </View>
      {isManual ? (
        <Text style={styles.manualHint}>
          Memakai lokasi manual. Tekan tombol panah untuk kembali ke GPS.
        </Text>
      ) : null}

      <SignalCard
        transmitter={ranked[0] ?? null}
        locationLabel={locationLabel}
        readyToScan={Boolean(position)}
        onScan={() => router.push("/scan")}
      />

      <SectionHeader
        title="Menu cepat"
        subtitle="Semua fitur utama dalam satu tempat"
        action={
          <Pressable onPress={() => router.push("/panduan")} hitSlop={8}>
            <Text style={styles.linkText}>Bantuan</Text>
          </Pressable>
        }
      />
      <View style={styles.grid}>
        {MENU.map((item) => (
          <MenuTile
            key={item.route}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            tone={item.tone}
            onPress={() => router.push(item.route as never)}
            style={styles.gridItem}
          />
        ))}
      </View>

      <SectionHeader
        title="Pemancar terdekat"
        subtitle="Berdasarkan lokasi aktif"
        action={
          ranked.length ? (
            <Pressable onPress={() => router.push("/peta")} hitSlop={8}>
              <Text style={styles.linkText}>Lihat peta</Text>
            </Pressable>
          ) : null
        }
      />

      {position ? (
        <View style={styles.list}>
          {ranked.slice(0, 3).map((transmitter) => (
            <TransmitterCard
              key={transmitter.id}
              transmitter={transmitter}
              onPress={() => {
                selectTransmitter(transmitter.id);
                router.push("/kompas");
              }}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="location-outline"
          title="Aktifkan lokasi untuk mulai"
          description={
            locationError ??
            "AntenaFinder butuh lokasi untuk menghitung jarak dan arah pemancar TV terdekat."
          }
          actionLabel="Gunakan lokasi saya"
          onAction={requestLocation}
          secondaryLabel="Pilih kota manual"
          onSecondary={() => router.push("/pilih-kota")}
        />
      )}

      {locationStatus === "denied" ? (
        <InfoNote tone="warning" title="Izin lokasi ditolak" icon="alert-circle-outline">
          Tanpa izin lokasi, kamu tetap bisa memakai lokasi manual dari daftar kota.
        </InfoNote>
      ) : null}

      {showTips ? (
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <View style={styles.tipsIcon}>
              <Ionicons name="flash" size={16} color={colors.primary} />
            </View>
            <Text style={styles.tipsTitle}>Cek kompas sebelum memutar antena</Text>
            <Pressable
              onPress={() => setTipsDismissed(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Tutup tips"
            >
              <Ionicons name="close" size={16} color={colors.dim} />
            </Pressable>
          </View>
          <Text style={styles.tipsBody}>
            {compass.available
              ? "Pegang HP mendatar dan jauhkan dari logam. Arahkan panah hijau ke pemancar, lalu putar antena searah panah."
              : "Sensor kompas belum aktif. Hadapkan bagian atas HP ke utara, lalu gunakan angka azimut untuk memutar antena."}
          </Text>
          <Pressable onPress={() => router.push("/kompas")} hitSlop={8}>
            <Text style={styles.linkText}>Buka kompas →</Text>
          </Pressable>
        </Card>
      ) : null}

      <InfoNote title="Estimasi, bukan pengukuran RF">
        Kompas hanya membaca orientasi perangkat. Kekuatan sinyal sebenarnya tetap harus
        dibaca dari menu info sinyal di TV atau set-top box.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", gap: space.md, paddingTop: space.sm },
  brandText: { flex: 1, gap: 1 },
  brand: { color: colors.text, fontSize: 19, fontWeight: "700", letterSpacing: -0.4 },
  accent: { color: colors.primary },
  brandSub: { color: colors.dim, fontSize: 11 },
  locationRow: { flexDirection: "row", gap: space.sm, marginTop: space.lg },
  locationChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    height: 42,
    minWidth: 0,
  },
  locationText: { color: colors.text, fontSize: 12, fontWeight: "600", flex: 1 },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  manualHint: { color: colors.dim, fontSize: 11, marginTop: 6, marginLeft: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
  gridItem: { flexBasis: "47%" },
  linkText: { color: colors.blue, fontSize: 12, fontWeight: "600" },
  list: { gap: space.sm },
  tipsCard: { gap: space.sm, marginTop: space.lg },
  tipsHeader: { flexDirection: "row", alignItems: "center", gap: space.sm },
  tipsIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsTitle: { color: colors.text, fontSize: 13, fontWeight: "600", flex: 1 },
  tipsBody: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
