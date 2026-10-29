import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BackHeader } from "@/components/app-header";
import { PrimaryButton } from "@/components/ui/buttons";
import { Card, SectionHeader } from "@/components/ui/card";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatusBadge } from "@/components/ui/status-badge";
import { StepItem } from "@/components/ui/step-item";
import { colors, radius, space } from "@/constants/theme";

const STEPS = [
  {
    title: "Periksa lokasi dan arah pemancar",
    description:
      "Cari tahu menara pemancar terdekat dan azimutnya. Gunakan menu Peta atau kompas di aplikasi ini sebagai titik awal.",
    icon: "map-outline" as const,
  },
  {
    title: "Arahkan antena secara bertahap",
    description:
      "Putar antena 5–10° per langkah. Berhenti di setiap posisi, lalu cek kualitas gambar sebelum melanjutkan.",
    icon: "compass-outline" as const,
  },
  {
    title: "Periksa kualitas sinyal di TV/STB",
    description:
      "Buka menu informasi sinyal pada TV atau set-top box. Catat level sinyal dan kualitas gambar di tiap posisi antena.",
    icon: "tv-outline" as const,
  },
  {
    title: "Periksa kabel dan konektor",
    description:
      "Pastikan kabel coaxial tidak terkelupas, konektor F kencang, dan tidak ada sambungan terbuka yang terkena hujan.",
    icon: "link-outline" as const,
  },
  {
    title: "Lakukan scan ulang channel",
    description:
      "Setelah posisi terbaik ditemukan, jalankan auto tuning di TV/STB agar channel digital yang hilang terdaftar kembali.",
    icon: "refresh-outline" as const,
  },
  {
    title: "Simpan hasil pemeriksaan",
    description:
      "Simpan hasil scan di aplikasi. Bandingkan dengan hasil berikutnya saat cuaca atau posisi antena berubah.",
    icon: "bookmark-outline" as const,
  },
];

const SAFETY = [
  "Jangan memasang antena saat hujan, petir, atau atap sedang basah.",
  "Matikan TV dan set-top box dari listrik sebelum memindahkan kabel.",
  "Gunakan tangga stabil dan minta bantuan orang lain saat bekerja di ketinggian.",
  "Jauhkan tiang antena dari kabel listrik dan pohon besar.",
  "Kencangkan tiang serta baut antena agar tidak roboh saat angin kencang.",
  "Pasang grounding bila daerahmu sering dilanda petir.",
];

const MISTAKES = [
  "Mengarahkan antena ke pusat kota, bukan ke menara pemancar.",
  "Kabel terlalu panjang atau konektor longgar sehingga sinyal melemah.",
  "Antena dipasang di dalam atap berbahan metal.",
  "Lupa melakukan scan ulang channel setelah memutar antena.",
];

export default function PanduanScreen() {
  return (
    <Screen>
      <BackHeader title="Tips & Panduan" subtitle="Pemasangan antena TV outdoor" />

      <Card variant="accent" style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <Ionicons name="bulb" size={22} color={colors.primary} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Enam langkah menuju sinyal stabil</Text>
            <Text style={styles.heroSub}>
              Ikuti berurutan. Setiap perubahan posisi antena sebaiknya diikuti pengecekan
              kualitas gambar.
            </Text>
          </View>
        </View>
        <View style={styles.badgeRow}>
          <StatusBadge label="6 langkah" tone="primary" />
          <StatusBadge label="Aman & bertahap" tone="blue" />
        </View>
      </Card>

      <SectionHeader title="Langkah pemasangan" />
      <Card style={styles.steps}>
        {STEPS.map((step, index) => (
          <StepItem
            key={step.title}
            index={index + 1}
            title={step.title}
            description={step.description}
            icon={step.icon}
            last={index === STEPS.length - 1}
          />
        ))}
      </Card>

      <SectionHeader title="Keselamatan" subtitle="Wajib dibaca sebelum naik ke atap" />
      <Card style={styles.listCard}>
        {SAFETY.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Ionicons name="shield-checkmark" size={14} color={colors.warning} />
            </View>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </Card>

      <SectionHeader title="Kesalahan umum" />
      <Card style={styles.listCard}>
        {MISTAKES.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={[styles.bulletIcon, styles.bulletIconDanger]}>
              <Ionicons name="close" size={14} color={colors.danger} />
            </View>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </Card>

      <InfoNote tone="warning" title="Kompas bukan alat ukur sinyal">
        Aplikasi ini membantu menentukan arah berdasarkan koordinat pemancar. Kualitas sinyal
        nyata hanya bisa dibaca dari perangkat TV, set-top box, atau alat ukur RF.
      </InfoNote>

      <PrimaryButton
        label="Mulai cek arah antena"
        icon="compass-outline"
        onPress={() => router.push("/kompas")}
      />
      <InfoNote icon="information-circle-outline">
        Data pemancar pada aplikasi ini adalah dataset demo. Selalu verifikasi kanal dan lokasi
        menara ke operator atau sumber resmi.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: space.md },
  heroRow: { flexDirection: "row", gap: space.md, alignItems: "flex-start" },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: { flex: 1, gap: 4 },
  heroTitle: { color: colors.text, fontSize: 16, fontWeight: "700", lineHeight: 22 },
  heroSub: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  badgeRow: { flexDirection: "row", gap: space.sm, flexWrap: "wrap" },
  steps: { paddingBottom: 0 },
  listCard: { gap: space.md },
  bulletRow: { flexDirection: "row", gap: space.md, alignItems: "flex-start" },
  bulletIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255, 194, 75, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  bulletIconDanger: { backgroundColor: "rgba(255, 107, 122, 0.12)" },
  bulletText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18, paddingTop: 4 },
});
