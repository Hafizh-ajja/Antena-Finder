import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius } from "@/constants/theme";
import type { RankedTransmitter } from "@/store/app-state";

type SignalMapProps = {
  user: { latitude: number; longitude: number } | null;
  transmitters: RankedTransmitter[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  style?: ViewStyle;
};

const TILE = 256;
const MIN_ZOOM = 5;
const MAX_ZOOM = 16;

function project(latitude: number, longitude: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const x = ((longitude + 180) / 360) * scale;
  const sinLat = Math.sin((latitude * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

/**
 * Fallback peta untuk web memakai tile OpenStreetMap asli (bukan gambar statis).
 * Di perangkat native, `signal-map.tsx` memakai Google Maps / Apple Maps.
 */
export function SignalMap({ user, transmitters, selectedId, onSelect, style }: SignalMapProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState<{
    center: { latitude: number; longitude: number };
    zoom: number;
  } | null>(null);

  // Posisi pengguna selalu jadi pusat default; `view` hanya menyimpan
  // pergeseran/zoom manual sehingga tidak perlu sinkronisasi lewat effect.
  const userLat = user?.latitude;
  const userLon = user?.longitude;
  const userCenter = useMemo(
    () =>
      userLat != null && userLon != null
        ? { latitude: userLat, longitude: userLon }
        : { latitude: -2.5, longitude: 118 },
    [userLat, userLon],
  );
  const center = view?.center ?? userCenter;
  const zoom = view?.zoom ?? (user ? 10 : 5);

  const zoomBy = (delta: number) => {
    setView({
      center,
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)),
    });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const frame = useMemo(() => {
    if (!size.width || !size.height) {
      return { tiles: [] as { key: string; uri: string; left: number; top: number }[], topLeft: { x: 0, y: 0 } };
    }
    const centerPoint = project(center.latitude, center.longitude, zoom);
    const topLeft = {
      x: centerPoint.x - size.width / 2,
      y: centerPoint.y - size.height / 2,
    };
    const count = 2 ** zoom;
    const minX = Math.floor(topLeft.x / TILE);
    const maxX = Math.floor((topLeft.x + size.width) / TILE);
    const minY = Math.floor(topLeft.y / TILE);
    const maxY = Math.floor((topLeft.y + size.height) / TILE);

    const tiles: { key: string; uri: string; left: number; top: number }[] = [];
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        if (y < 0 || y >= count) continue;
        const wrappedX = ((x % count) + count) % count;
        tiles.push({
          key: `${zoom}-${x}-${y}`,
          uri: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE - topLeft.x,
          top: y * TILE - topLeft.y,
        });
      }
    }
    return { tiles, topLeft };
  }, [center.latitude, center.longitude, size.height, size.width, zoom]);

  const toScreen = (latitude: number, longitude: number) => {
    const point = project(latitude, longitude, zoom);
    return {
      left: point.x - frame.topLeft.x,
      top: point.y - frame.topLeft.y,
    };
  };

  return (
    <View style={[styles.wrap, style]} onLayout={onLayout}>
      <View style={styles.tileLayer} pointerEvents="none">
        {frame.tiles.map((tile) => (
          <Image
            key={tile.key}
            source={{ uri: tile.uri }}
            style={{ position: "absolute", left: tile.left, top: tile.top, width: TILE, height: TILE }}
          />
        ))}
      </View>

      {user ? (
        <View style={[styles.userWrap, toScreen(user.latitude, user.longitude)]} pointerEvents="none">
          <View style={styles.userRing}>
            <View style={styles.userDot} />
          </View>
        </View>
      ) : null}

      {transmitters.map((item) => {
        const position = toScreen(item.latitude, item.longitude);
        if (
          position.left < -40 ||
          position.top < -40 ||
          position.left > size.width + 40 ||
          position.top > size.height + 40
        ) {
          return null;
        }
        const active = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            accessibilityRole="button"
            accessibilityLabel={item.name}
            style={[styles.markerWrap, position]}
          >
            <View style={[styles.marker, active && styles.markerActive]}>
              <Text style={[styles.markerText, active && styles.markerTextActive]}>TV</Text>
            </View>
          </Pressable>
        );
      })}

      <View style={styles.controls}>
        <Pressable
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Perbesar peta"
          onPress={() => zoomBy(1)}
        >
          <Ionicons name="add" size={18} color={colors.text} />
        </Pressable>
        <Pressable
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Perkecil peta"
          onPress={() => zoomBy(-1)}
        >
          <Ionicons name="remove" size={18} color={colors.text} />
        </Pressable>
        <Pressable
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke lokasi saya"
          onPress={() => {
            if (user) {
              setView({
                center: { latitude: user.latitude, longitude: user.longitude },
                zoom: 10,
              });
            }
          }}
        >
          <Ionicons name="locate" size={18} color={colors.blue} />
        </Pressable>
      </View>

      <View style={styles.attribution}>
        <Text style={styles.attributionText}>© OpenStreetMap</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: "#0A1A2F" },
  tileLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    filter: "invert(1) hue-rotate(180deg) brightness(0.72) saturate(0.55)",
  } as never,
  userWrap: { position: "absolute" },
  userRing: {
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    borderRadius: 13,
    backgroundColor: "rgba(50, 156, 255, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(50, 156, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  userDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  markerWrap: { position: "absolute" },
  marker: {
    minWidth: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.cardAlt,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  markerActive: { backgroundColor: colors.primary },
  markerText: { color: colors.primary, fontSize: 10, fontWeight: "800" },
  markerTextActive: { color: colors.onPrimary },
  controls: {
    position: "absolute",
    right: 12,
    top: 12,
    gap: 8,
  },
  controlButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: "rgba(11, 28, 50, 0.92)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  attribution: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(5, 15, 30, 0.72)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attributionText: { color: colors.dim, fontSize: 9 },
});
