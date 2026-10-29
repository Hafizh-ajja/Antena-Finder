import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderIconButton } from "@/components/app-header";
import { Logo } from "@/components/logo";
import { SignalMap } from "@/components/signal-map";
import { PrimaryButton } from "@/components/ui/buttons";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import { SignalIndicator } from "@/components/ui/signal-indicator";
import { StatusBadge } from "@/components/ui/status-badge";
import { colors, radius, space } from "@/constants/theme";
import { CITIES, DATASET_META, City } from "@/data/transmitters";
import { cardinalName, cardinalShort, formatDistance } from "@/lib/geo";
import { useApp } from "@/store/app-state";

export default function PetaScreen() {
  const { position, ranked, selected, selectTransmitter, requestLocation, applyCity, isManual } =
    useApp();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const transmitterMatches = useMemo(() => {
    if (!q) return [];
    return ranked
      .filter((item) => `${item.name} ${item.city} ${item.operator}`.toLowerCase().includes(q))
      .slice(0, 4);
  }, [q, ranked]);

  const cityMatches = useMemo(() => {
    if (!q) return [];
    return CITIES.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(q)).slice(
      0,
      3,
    );
  }, [q]);

  const pickCity = (city: City) => {
    applyCity(city);
    setQuery("");
    Keyboard.dismiss();
  };

  if (!position) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyWrap}>
          <Logo size={52} />
          <Text style={styles.emptyTitle}>Peta sinyal lokal</Text>
          <EmptyState
            icon="map-outline"
            title="Lokasi belum tersedia"
            description="Peta akan menampilkan posisimu dan titik pemancar TV terdekat setelah lokasi aktif. Kamu juga bisa memilih kota secara manual."
            actionLabel="Gunakan lokasi saya"
            onAction={requestLocation}
            secondaryLabel="Pilih kota manual"
            onSecondary={() => router.push("/pilih-kota")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.mapWrap}>
        <SignalMap
          user={position}
          transmitters={ranked}
          selectedId={selected?.id ?? null}
          onSelect={selectTransmitter}
          style={styles.map}
        />

        <View style={styles.topOverlay} pointerEvents="box-none">
          <View style={styles.brandRow}>
            <Logo size={32} />
            <View style={styles.brandText}>
              <Text style={styles.brand}>
                Peta Sinyal <Text style={styles.accent}>Lokal</Text>
              </Text>
              <Text style={styles.brandSub} numberOfLines={1}>
                {isManual ? "Lokasi manual" : "Lokasi GPS"} · {position.label}
              </Text>
            </View>
            <HeaderIconButton
              icon="settings-outline"
              label="Pengaturan"
              onPress={() => router.push("/pengaturan")}
            />
          </View>

          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Cari pemancar atau kota"
            onSubmit={Keyboard.dismiss}
          />

          {q ? (
            <Card style={styles.results} padded={false}>
              {transmitterMatches.length === 0 && cityMatches.length === 0 ? (
                <Text style={styles.noResult}>Tidak ada hasil untuk “{query}”.</Text>
              ) : null}
              {transmitterMatches.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    selectTransmitter(item.id);
                    setQuery("");
                    Keyboard.dismiss();
                  }}
                  style={({ pressed }) => [styles.resultRow, pressed && styles.resultPressed]}
                >
                  <Ionicons name="radio-outline" size={16} color={colors.primary} />
                  <View style={styles.resultText}>
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.resultSub} numberOfLines={1}>
                      {item.city} · {formatDistance(item.distanceKm)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.dim} />
                </Pressable>
              ))}
              {cityMatches.map((city) => (
                <Pressable
                  key={city.id}
                  onPress={() => pickCity(city)}
                  style={({ pressed }) => [styles.resultRow, pressed && styles.resultPressed]}
                >
                  <Ionicons name="location-outline" size={16} color={colors.blue} />
                  <View style={styles.resultText}>
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {city.name}
                    </Text>
                    <Text style={styles.resultSub}>{city.province}</Text>
                  </View>
                  <Text style={styles.cityAction}>Pakai</Text>
                </Pressable>
              ))}
            </Card>
          ) : null}

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: colors.blue }]} />
              <Text style={styles.legendText}>Kamu</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Pemancar TV</Text>
            </View>
            <StatusBadge label={DATASET_META.label} tone="warning" />
          </View>
        </View>

        <View style={styles.bottomPanel}>
          {selected ? (
            <>
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleWrap}>
                  <Text style={styles.panelTitle} numberOfLines={1}>
                    {selected.name}
                  </Text>
                  <Text style={styles.panelSub} numberOfLines={1}>
                    {selected.city} · {selected.operator}
                  </Text>
                </View>
                <StatusBadge
                  label={selected.inRange ? "Dalam radius" : "Di luar radius"}
                  tone={selected.inRange ? "primary" : "warning"}
                />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Jarak</Text>
                  <Text style={styles.statValue}>{formatDistance(selected.distanceKm)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Azimut</Text>
                  <Text style={styles.statValue}>
                    {Math.round(selected.bearing)}° {cardinalShort(selected.bearing)}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Sinyal</Text>
                  <SignalIndicator
                    value={selected.signal.bars}
                    color={selected.signal.color}
                    size="sm"
                  />
                </View>
              </View>

              <Text style={styles.directionText}>
                Antena diarahkan ke {cardinalName(selected.bearing)} ({Math.round(selected.bearing)}°).
                Estimasi: {selected.signal.label.toLowerCase()}.
              </Text>

              <View style={styles.panelActions}>
                <PrimaryButton
                  label="Arahkan antena"
                  icon="compass-outline"
                  onPress={() => router.push("/kompas")}
                  style={{ flex: 1 }}
                />
                <Pressable
                  onPress={() => router.push("/panduan")}
                  accessibilityRole="button"
                  accessibilityLabel="Buka panduan"
                  style={styles.iconAction}
                >
                  <Ionicons name="book-outline" size={18} color={colors.blue} />
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {ranked.slice(0, 8).map((item) => {
                  const active = item.id === selected.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => selectTransmitter(item.id)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text
                        style={[styles.chipText, active && styles.chipTextActive]}
                        numberOfLines={1}
                      >
                        {item.name.replace("MUX ", "")}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <Text style={styles.panelEmpty}>
              Ketuk salah satu marker untuk melihat detail pemancar.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1 },
  map: { flex: 1 },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: space.xl,
    justifyContent: "center",
    gap: space.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.4,
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: space.md,
    gap: space.sm,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  brandText: { flex: 1, minWidth: 0 },
  brand: { color: colors.text, fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  accent: { color: colors.primary },
  brandSub: { color: colors.dim, fontSize: 10, marginTop: 1 },
  results: { overflow: "hidden" },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  resultPressed: { backgroundColor: colors.cardAlt },
  resultText: { flex: 1, minWidth: 0 },
  resultTitle: { color: colors.text, fontSize: 13, fontWeight: "600" },
  resultSub: { color: colors.dim, fontSize: 11 },
  cityAction: { color: colors.blue, fontSize: 11, fontWeight: "700" },
  noResult: { color: colors.muted, fontSize: 12, padding: space.md },
  legendRow: { flexDirection: "row", alignItems: "center", gap: space.md, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  bottomPanel: {
    position: "absolute",
    left: space.md,
    right: space.md,
    bottom: space.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    gap: space.sm,
  },
  panelHeader: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
  panelTitleWrap: { flex: 1, minWidth: 0 },
  panelTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  panelSub: { color: colors.dim, fontSize: 11, marginTop: 1 },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  stat: { flex: 1, gap: 3 },
  statLabel: { color: colors.dim, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  statValue: { color: colors.text, fontSize: 13, fontWeight: "700" },
  statDivider: { width: 1, height: 26, backgroundColor: colors.border, marginHorizontal: 10 },
  directionText: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  panelActions: { flexDirection: "row", gap: space.sm, alignItems: "stretch" },
  iconAction: {
    width: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueSoft,
  },
  chips: { gap: space.sm, paddingTop: 2 },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    maxWidth: 150,
  },
  chipActive: { borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft },
  chipText: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  chipTextActive: { color: colors.primary },
  panelEmpty: { color: colors.muted, fontSize: 12, textAlign: "center", paddingVertical: space.md },
});
