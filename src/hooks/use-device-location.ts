import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

export type UserPosition = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  label: string;
};

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "error";

async function resolveLabel(point: { latitude: number; longitude: number }) {
  if (Platform.OS === "web") return "Lokasi saat ini";
  try {
    const [place] = await Location.reverseGeocodeAsync(point);
    const parts = [place?.district, place?.city ?? place?.subregion, place?.region]
      .filter((part): part is string => Boolean(part))
      .slice(0, 2);
    return parts.length ? parts.join(", ") : "Lokasi saat ini";
  } catch {
    return "Lokasi saat ini";
  }
}

/**
 * Membaca posisi perangkat hanya ketika diminta (tidak otomatis saat app dibuka).
 * Izin lokasi diminta tepat saat pengguna menekan tombol lokasi.
 */
export function useDeviceLocation() {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const labelRef = useRef<string | null>(null);

  const stopWatch = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
  }, []);

  const request = useCallback(async () => {
    setStatus("requesting");
    setError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setStatus("denied");
        return;
      }

      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 1000 * 60 * 10,
        requiredAccuracy: 2000,
      });

      if (lastKnown) {
        const label = labelRef.current ?? (await resolveLabel(lastKnown.coords));
        labelRef.current = label;
        setPosition({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
          accuracy: lastKnown.coords.accuracy ?? null,
          label,
        });
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const label = labelRef.current ?? (await resolveLabel(current.coords));
      labelRef.current = label;
      setPosition({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        accuracy: current.coords.accuracy ?? null,
        label,
      });
      setStatus("granted");

      if (!watchRef.current) {
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50,
          },
          (next) => {
            setPosition((prev) => ({
              latitude: next.coords.latitude,
              longitude: next.coords.longitude,
              accuracy: next.coords.accuracy ?? null,
              label: prev?.label ?? labelRef.current ?? "Lokasi saat ini",
            }));
          },
        );
      }
    } catch {
      setStatus("error");
      setError(
        "Lokasi tidak bisa dibaca. Pastikan GPS aktif, lalu coba lagi atau pilih kota secara manual.",
      );
    }
  }, []);

  useEffect(() => stopWatch, [stopWatch]);

  return { position, status, error, request, stopWatch };
}
