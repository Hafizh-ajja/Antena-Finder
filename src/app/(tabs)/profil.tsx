import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Logo } from "@/components/logo";
import { Card, SectionHeader } from "@/components/ui/card";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { confirmAction, notify } from "@/lib/dialog";
import { formatDistance } from "@/lib/geo";
import { useApp } from "@/store/app-state";

const ROWS = [
  {
    icon: "bulb-outline" as const,
    title: "Tips & Panduan",
    subtitle: "Langkah pemasangan antena yang aman",
    route: "/panduan",
  },
  {
    icon: "settings-outline" as const,
    title: "Pengaturan",
    subtitle: "Lokasi, kompas, dan preferensi",
    route: "/pengaturan",
  },
  {
    icon: "map-outline" as const,
    title: "Peta Sinyal Lokal",
    subtitle: "Lihat posisi pemancar di sekitarmu",
    route: "/peta",
  },
];

export default function ProfilScreen() {
  const { history, ranked, settings, position, compass, resetAll } = useApp();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const showAbout = () => {
    notify(
      "Tentang AntenaFinder",
      "AntenaFinder membantu mengarahkan antena TV outdoor menggunakan data lokasi dan dataset pemancar demo.\n\nAplikasi ini tidak mengukur kekuatan sinyal RF. Gunakan menu info sinyal di TV/STB untuk verifikasi.",
    );
  };

  const confirmReset = () => {
    confirmAction({
      title: "Hapus semua data?",
      message: "Pengaturan, riwayat scan, dan pemancar yang kamu tambahkan akan dihapus dari perangkat.",
      confirmLabel: "Hapus semua",
      onConfirm: () => {
        void resetAll();
      },
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Data lokal & preferensi aplikasi</Text>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Logo size={62} />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.appName}>
            Antenna<Text style={styles.accent}>Finder</Text>
          </Text>
          <Text style={styles.tagline}>Arah yang tepat, sinyal lebih kuat.</Text>
          <View style={styles.badgeRow}>
            <StatusBadge label={`v${version}`} tone="neutral" />
            <StatusBadge
              label={compass.available ? "Kompas aktif" : "Tanpa kompas"}
              tone={compass.available ? "primary" : "warning"}
            />
          </View>
        </View>
      </Card>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Scan tersimpan</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{ranked.length}</Text>
          <Text style={styles.statLabel}>Pemancar terdeteksi</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {ranked[0] ? formatDistance(ranked[0].distanceKm) : "—"}
          </Text>
          <Text style={styles.statLabel}>Terdekat</Text>
        </View>
      </View>

      <SectionHeader title="Menu" subtitle="Kelola aplikasi dan data" />
      <Card padded={false} style={styles.menu}>
        {ROWS.map((row, index) => (
          <Pressable
            key={row.route}
            onPress={() => router.push(row.route as never)}
            accessibilityRole="button"
            accessibilityLabel={row.title}
            style={({ pressed }) => [
              styles.row,
              index === ROWS.length - 1 && styles.rowLast,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name={row.icon} size={18} color={colors.blue} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowSub}>{row.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.dim} />
          </Pressable>
        ))}
      </Card>

      <SectionHeader title="Lokasi & data" />
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lokasi aktif</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {position?.label ?? "Belum aktif"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sumber lokasi</Text>
          <Text style={styles.infoValue}>
            {settings.manualLocation ? "Manual (kota)" : "GPS perangkat"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pemancar kustom</Text>
          <Text style={styles.infoValue}>{settings.customTransmitters.length} titik</Text>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={showAbout} style={styles.infoRow} hitSlop={6}>
          <Text style={styles.infoLabel}>Tentang aplikasi</Text>
          <View style={styles.infoAction}>
            <Text style={styles.infoValue}>v{version}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.dim} />
          </View>
        </Pressable>
      </Card>

      <Pressable
        onPress={confirmReset}
        accessibilityRole="button"
        accessibilityLabel="Hapus semua data lokal"
        style={({ pressed }) => [styles.resetButton, pressed && { opacity: 0.75 }]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.danger} />
        <Text style={styles.resetText}>Hapus semua data lokal</Text>
      </Pressable>

      <InfoNote title="Privasi">
        Lokasi hanya dipakai di perangkat untuk menghitung arah. Tidak ada data yang dikirim ke
        server, dan tidak perlu akun.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: space.sm, marginBottom: space.lg, gap: 2 },
  title: { color: colors.text, fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { color: colors.dim, fontSize: 12 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: space.lg },
  avatarWrap: {
    width: 74,
    height: 74,
    borderRadius: radius.xl,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { flex: 1, gap: 3, minWidth: 0 },
  appName: { color: colors.text, fontSize: 20, fontWeight: "700", letterSpacing: -0.4 },
  accent: { color: colors.primary },
  tagline: { color: colors.muted, fontSize: 11 },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" },
  statsRow: { flexDirection: "row", gap: space.sm, marginTop: space.md },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    gap: 2,
  },
  statValue: { color: colors.primary, fontSize: 18, fontWeight: "700" },
  statLabel: { color: colors.dim, fontSize: 10 },
  menu: { overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  rowLast: { borderBottomWidth: 0 },
  rowPressed: { backgroundColor: colors.cardAlt },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, gap: 1 },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  rowSub: { color: colors.dim, fontSize: 11 },
  infoCard: { gap: 0 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingVertical: 11,
  },
  infoLabel: { color: colors.muted, fontSize: 12 },
  infoValue: { color: colors.text, fontSize: 12, fontWeight: "600", maxWidth: "62%" },
  infoAction: { flexDirection: "row", alignItems: "center", gap: 4 },
  divider: { height: 1, backgroundColor: colors.borderSoft },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    marginTop: space.lg,
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 122, 0.3)",
    backgroundColor: "rgba(255, 107, 122, 0.08)",
  },
  resetText: { color: colors.danger, fontSize: 13, fontWeight: "600" },
});
