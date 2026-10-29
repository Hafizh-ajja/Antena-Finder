import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { BackHeader } from "@/components/app-header";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNote } from "@/components/ui/info-note";
import { Screen } from "@/components/ui/screen";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { CITIES, City } from "@/data/transmitters";
import { distanceKm, formatDistance } from "@/lib/geo";
import { goBackOr } from "@/lib/navigation";
import { useApp } from "@/store/app-state";

export default function PilihKotaScreen() {
  const { devicePosition, settings, applyCity, applyGps, requestLocation, locationStatus } = useApp();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? CITIES.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(q))
      : CITIES;
    return [...list].sort((a, b) => {
      if (!devicePosition) return a.name.localeCompare(b.name);
      return (
        distanceKm(devicePosition, a) - distanceKm(devicePosition, b)
      );
    });
  }, [devicePosition, query]);

  const choose = (city: City) => {
    applyCity(city);
    Keyboard.dismiss();
    goBackOr();
  };

  return (
    <Screen>
      <BackHeader title="Pilih Lokasi" subtitle="Cari kota atau pakai GPS perangkat" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Cari nama kota atau provinsi"
        onSubmit={Keyboard.dismiss}
      />

      <Pressable
        onPress={() => {
          requestLocation();
          goBackOr();
        }}
        accessibilityRole="button"
        accessibilityLabel="Gunakan lokasi GPS"
        style={({ pressed }) => [styles.gpsRow, pressed && { opacity: 0.8 }]}
      >
        <View style={styles.gpsIcon}>
          {locationStatus === "requesting" ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Ionicons name="navigate" size={18} color={colors.onPrimary} />
          )}
        </View>
        <View style={styles.gpsText}>
          <Text style={styles.gpsTitle}>Gunakan lokasi GPS</Text>
          <Text style={styles.gpsSub}>
            {devicePosition?.label ?? "Izinkan akses lokasi saat tombol ini ditekan"}
          </Text>
        </View>
        {!settings.manualLocation ? (
          <StatusBadge label="Aktif" tone="primary" />
        ) : (
          <Ionicons name="chevron-forward" size={16} color={colors.dim} />
        )}
      </Pressable>

      {settings.manualLocation ? (
        <Pressable
          onPress={() => {
            applyGps();
            goBackOr();
          }}
          style={styles.clearManual}
          accessibilityRole="button"
          accessibilityLabel="Matikan lokasi manual"
        >
          <Ionicons name="close-circle-outline" size={14} color={colors.blue} />
          <Text style={styles.clearManualText}>Matikan lokasi manual</Text>
        </Pressable>
      ) : null}

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Daftar kota</Text>
        <Text style={styles.sectionCount}>{filtered.length} kota</Text>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Kota tidak ditemukan"
          description={`Tidak ada kota yang cocok dengan “${query}”. Coba kata kunci lain atau gunakan GPS.`}
          actionLabel="Gunakan GPS"
          onAction={() => {
            requestLocation();
            goBackOr();
          }}
        />
      ) : (
        <View style={styles.list}>
          {filtered.map((city) => {
            const active = settings.manualLocation?.cityId === city.id;
            const distance = devicePosition ? distanceKm(devicePosition, city) : null;
            return (
              <Pressable
                key={city.id}
                onPress={() => choose(city)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.cityRow,
                  active && styles.cityRowActive,
                  pressed && { opacity: 0.82 },
                ]}
              >
                <View style={[styles.cityIcon, active && styles.cityIconActive]}>
                  <Ionicons
                    name="location-outline"
                    size={17}
                    color={active ? colors.onPrimary : colors.blue}
                  />
                </View>
                <View style={styles.cityText}>
                  <Text style={styles.cityName}>{city.name}</Text>
                  <Text style={styles.cityProvince}>{city.province}</Text>
                </View>
                {distance != null ? (
                  <Text style={styles.cityDistance}>{formatDistance(distance)}</Text>
                ) : null}
                {active ? (
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                ) : (
                  <Ionicons name="chevron-forward" size={15} color={colors.dim} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      <InfoNote icon="information-circle-outline">
        Lokasi manual memakai titik pusat kota. Untuk hasil terbaik, gunakan GPS agar jarak dan
        azimut dihitung dari posisi rumahmu.
      </InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gpsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginTop: space.md,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  gpsIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  gpsText: { flex: 1, gap: 2, minWidth: 0 },
  gpsTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  gpsSub: { color: colors.muted, fontSize: 11 },
  clearManual: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: space.sm,
    paddingVertical: 4,
  },
  clearManualText: { color: colors.blue, fontSize: 12, fontWeight: "600" },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: space.xl,
    marginBottom: space.md,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  sectionCount: { color: colors.dim, fontSize: 11 },
  list: { gap: space.sm },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cityRowActive: { borderColor: colors.primaryBorder, backgroundColor: colors.cardAlt },
  cityIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cityIconActive: { backgroundColor: colors.primary },
  cityText: { flex: 1, minWidth: 0, gap: 1 },
  cityName: { color: colors.text, fontSize: 13, fontWeight: "600" },
  cityProvince: { color: colors.dim, fontSize: 11 },
  cityDistance: { color: colors.muted, fontSize: 11, fontWeight: "600" },
});
