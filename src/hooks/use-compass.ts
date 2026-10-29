import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

export type CompassNorth = "true" | "magnetic";

export type CompassState = {
  heading: number | null;
  accuracy: number;
  available: boolean;
  checked: boolean;
};

const UNSUPPORTED: CompassState = {
  heading: null,
  accuracy: 0,
  available: false,
  checked: true,
};

/**
 * Kompas perangkat. Ini hanya menunjukkan ORIENTASI perangkat, bukan
 * kekuatan sinyal TV. Butuh izin lokasi untuk true heading di iOS.
 */
export function useCompass(north: CompassNorth) {
  const [state, setState] = useState<CompassState>(() =>
    Platform.OS === "web"
      ? UNSUPPORTED
      : { heading: null, accuracy: 0, available: false, checked: false },
  );

  const northRef = useRef(north);
  const lastUpdate = useRef(0);

  // Simpan preferensi utara tanpa menulis ref saat render.
  useEffect(() => {
    northRef.current = north;
  }, [north]);

  useEffect(() => {
    // Kompas tidak tersedia di web — jangan berlangganan sensor.
    if (Platform.OS === "web") return;

    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setState((prev) =>
          prev.heading === null ? UNSUPPORTED : { ...prev, checked: true },
        );
      }
    }, 4000);

    (async () => {
      try {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled || cancelled) {
          if (!cancelled) setState(UNSUPPORTED);
          return;
        }

        subscription = await Location.watchHeadingAsync((reading) => {
          const now = Date.now();
          if (now - lastUpdate.current < 90) return;
          lastUpdate.current = now;

          const useTrue = northRef.current === "true" && reading.trueHeading >= 0;
          setState({
            heading: useTrue ? reading.trueHeading : reading.magHeading,
            accuracy: reading.accuracy,
            available: true,
            checked: true,
          });
        });
      } catch {
        if (!cancelled) setState(UNSUPPORTED);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription?.remove();
    };
  }, []);

  return state;
}
