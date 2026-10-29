import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { confirmAction } from "@/lib/dialog";
import { cardinalShort, formatDistance } from "@/lib/geo";
import { formatDateTime } from "@/lib/format";
import { useApp } from "@/store/app-state";

export default function RiwayatScreen() {
  const { history, deleteHistory, clearHistory } = useApp();

  const confirmClear = () => {
    confirmAction({
      title: "Hapus semua riwayat?",
      message: "Semua hasil pemeriksaan yang tersimpan akan dihapus.",
      onConfirm: clearHistory,
    });
  };

  const confirmDelete = (id: string, name: string) => {
    confirmAction({
      title: "Hapus hasil ini?",
      message: `Pemeriksaan untuk ${name} akan dihapus dari perangkat.`,
      onConfirm: () => deleteHistory(id),
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Riwayat Scan</Text>
          <Text style={styles.subtitle}>
            {history.length
              ? `${history.length} pemeriksaan tersimpan di perangkat`
              : "Belum ada pemeriksaan tersimpan"}
          </Text>
        </View>
        {history.length ? (
          <Pressable
            onPress={confirmClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Hapus semua riwayat"
            style={({ pressed }) => [styles.clearButton, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="trash-outline" size={14} color={colors.danger} />
            <Text style={styles.clearText}>Hapus</Text>
          </Pressable>
        ) : null}
      </View>

      {history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="Riwayat masih kosong"
          description="Setelah menjalankan scan dan menyimpan hasilnya, pemeriksaan akan muncul di sini agar mudah dibandingkan."
          actionLabel="Mulai Scan"
          onAction={() => router.push("/scan")}
        />
      ) : (
        <View style={styles.list}>
          {history.map((item) => (
            <View key={item.id} style={styles.item}>
              <Pressable
                onPress={() => router.push({ pathname: "/hasil", params: { id: item.id } })}
                accessibilityRole="button"
                accessibilityLabel={`Buka hasil ${item.transmitterName}`}
                style={({ pressed }) => [styles.itemMain, pressed && styles.itemPressed]}
              >
                <View style={styles.azimuth}>
                  <Text style={styles.azimuthValue}>{Math.round(item.azimuth)}°</Text>
                  <Text style={styles.azimuthDir}>{cardinalShort(item.azimuth)}</Text>
                </View>

                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.transmitterName}
                  </Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {item.transmitterCity} · {formatDistance(item.distanceKm)}
                  </Text>
                  <Text style={styles.itemDate}>{formatDateTime(item.createdAt)}</Text>
                  <View style={styles.itemBadges}>
                    <StatusBadge label={`Est. ${item.signalLabel}`} tone="blue" />
                    {item.channel ? <Text style={styles.channel}>CH {item.channel}</Text> : null}
                  </View>
                </View>
              </Pressable>

              <View style={styles.itemActions}>
                <Pressable
                  onPress={() => confirmDelete(item.id, item.transmitterName)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Hapus hasil"
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={15} color={colors.dim} />
                </Pressable>
                <Ionicons name="chevron-forward" size={16} color={colors.dim} />
              </View>
            </View>
          ))}
        </View>
      )}

      <InfoNote icon="phone-portrait-outline" title="Tersimpan lokal">
        Riwayat disimpan di penyimpanan perangkat (AsyncStorage) dan tidak dikirim ke server.
        Menghapus data aplikasi akan menghapus riwayat ini.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingTop: space.sm,
    marginBottom: space.lg,
  },
  headerText: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { color: colors.dim, fontSize: 12 },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: space.md,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 122, 0.3)",
    backgroundColor: "rgba(255, 107, 122, 0.1)",
  },
  clearText: { color: colors.danger, fontSize: 11, fontWeight: "700" },
  list: { gap: space.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  itemMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    minWidth: 0,
  },
  itemPressed: { backgroundColor: colors.cardAlt },
  azimuth: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  azimuthValue: { color: colors.primary, fontSize: 15, fontWeight: "700" },
  azimuthDir: { color: colors.primary, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  itemBody: { flex: 1, gap: 1, minWidth: 0 },
  itemTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  itemMeta: { color: colors.dim, fontSize: 11 },
  itemDate: { color: colors.dim, fontSize: 10, marginTop: 2 },
  itemBadges: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 },
  channel: { color: colors.muted, fontSize: 10, fontWeight: "700" },
  itemActions: { alignItems: "center", gap: space.sm, paddingRight: space.md },
  deleteButton: { padding: 4 },
});
