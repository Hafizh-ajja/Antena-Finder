import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { colors, radius } from "@/constants/theme";
import type { RankedTransmitter } from "@/store/app-state";

type SignalMapProps = {
  user: { latitude: number; longitude: number } | null;
  transmitters: RankedTransmitter[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  style?: ViewStyle;
};

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0A1A2F" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6E8AA8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#08172B" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#16304F" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#54718F" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0C2436" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#14283F" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0D1E33" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7C93AD" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#10243D" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#061527" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3F6383" }] },
];

const FALLBACK = { latitude: -2.5, longitude: 118, latitudeDelta: 12, longitudeDelta: 12 };

export function SignalMap({ user, transmitters, selectedId, onSelect, style }: SignalMapProps) {
  const mapRef = useRef<MapView>(null);

  const initialRegion = user
    ? {
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: 0.9,
        longitudeDelta: 0.9,
      }
    : FALLBACK;

  const userLat = user?.latitude;
  const userLon = user?.longitude;

  useEffect(() => {
    if (userLat == null || userLon == null) return;
    mapRef.current?.animateToRegion(
      {
        latitude: userLat,
        longitude: userLon,
        latitudeDelta: 0.9,
        longitudeDelta: 0.9,
      },
      600,
    );
  }, [userLat, userLon]);

  return (
    <View style={[styles.wrap, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        customMapStyle={DARK_STYLE}
        toolbarEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsUserLocation={false}
      >
        {user ? (
          <Marker coordinate={user} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={styles.userRing}>
              <View style={styles.userDot} />
            </View>
          </Marker>
        ) : null}

        {user && selectedId
          ? transmitters
              .filter((item) => item.id === selectedId)
              .map((item) => (
                <Circle
                  key={`circle-${item.id}`}
                  center={{ latitude: item.latitude, longitude: item.longitude }}
                  radius={item.radiusKm * 1000}
                  strokeColor="rgba(22, 229, 138, 0.4)"
                  fillColor="rgba(22, 229, 138, 0.06)"
                  strokeWidth={1}
                />
              ))
          : null}

        {transmitters.map((item) => {
          const active = item.id === selectedId;
          return (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.latitude, longitude: item.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => onSelect(item.id)}
              tracksViewChanges={false}
            >
              <View style={[styles.marker, active && styles.markerActive]}>
                <Text style={[styles.markerText, active && styles.markerTextActive]}>TV</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.attribution}>
        <Text style={styles.attributionText}>Peta: Google / Apple</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: colors.bgElevated },
  userRing: {
    width: 26,
    height: 26,
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
  marker: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.cardAlt,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  markerActive: { backgroundColor: colors.primary, transform: [{ scale: 1.15 }] },
  markerText: { color: colors.primary, fontSize: 10, fontWeight: "800" },
  markerTextActive: { color: colors.onPrimary },
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
