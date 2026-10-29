import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntennaIllustration } from "@/components/antenna-illustration";
import { Logo } from "@/components/logo";
import { PrimaryButton } from "@/components/ui/buttons";
import { colors, radius, space } from "@/constants/theme";

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={[colors.bgElevated, colors.bg, colors.bgDeep]}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <Logo size={34} />
            <Text style={styles.brandSmall}>
              Antenna<Text style={styles.accent}>Finder</Text>
            </Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Logo size={74} />
            </View>
            <Text style={styles.title}>
              Antenna<Text style={styles.accent}>Finder</Text>
            </Text>
            <Text style={styles.tagline}>Arah yang tepat, sinyal lebih kuat.</Text>
            <Text style={styles.description}>
              Temukan arah antena TV outdoor, atasi channel digital yang hilang, dan
              pahami penyebab sinyal lemah di rumahmu.
            </Text>
          </View>

          <AntennaIllustration width={300} />

          <View style={styles.actions}>
            <PrimaryButton
              label="Mulai"
              icon="arrow-forward"
              onPress={() => router.replace("/beranda")}
            />
            <Pressable
              onPress={() => router.push("/panduan")}
              accessibilityRole="button"
              accessibilityLabel="Lihat tutorial"
              style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
            >
              <Ionicons name="play-circle-outline" size={18} color={colors.blue} />
              <Text style={styles.linkText}>Lihat Tutorial</Text>
            </Pressable>
            <Text style={styles.footnote}>
              Tanpa akun · Pengaturan & riwayat disimpan di perangkat
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.xxl,
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingTop: space.sm },
  brandSmall: { color: colors.text, fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  accent: { color: colors.primary },
  hero: { alignItems: "center", gap: space.sm, marginTop: space.lg },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: "rgba(22, 229, 138, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(22, 229, 138, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: space.sm,
  },
  tagline: { color: colors.primary, fontSize: 15, fontWeight: "600" },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 320,
    marginTop: 4,
  },
  actions: { gap: space.md, marginTop: "auto" },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: space.sm,
  },
  linkPressed: { opacity: 0.7 },
  linkText: { color: colors.blue, fontSize: 14, fontWeight: "600" },
  footnote: { color: colors.dim, fontSize: 11, textAlign: "center" },
});
