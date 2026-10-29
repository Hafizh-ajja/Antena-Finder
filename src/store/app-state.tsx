import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { CITIES, City, TRANSMITTERS, Transmitter } from "@/data/transmitters";
import { bearingDeg, distanceKm } from "@/lib/geo";
import { channelToFrequency, estimateSignal, SignalEstimate } from "@/lib/signal";
import { clearStored, loadStored, saveStored } from "@/lib/storage";
import { useCompass, CompassNorth } from "@/hooks/use-compass";
import { useDeviceLocation, UserPosition } from "@/hooks/use-device-location";

export type AntennaMode = "outdoor" | "indoor";

export type ManualLocation = {
  latitude: number;
  longitude: number;
  label: string;
  cityId?: string;
};

export type Settings = {
  antennaMode: AntennaMode;
  compassNorth: CompassNorth;
  showDegrees: boolean;
  reminders: boolean;
  notifications: boolean;
  manualLocation: ManualLocation | null;
  customTransmitters: Transmitter[];
};

export type ScanRecord = {
  id: string;
  createdAt: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  transmitterId: string | null;
  transmitterName: string;
  transmitterCity: string;
  azimuth: number;
  distanceKm: number;
  channel: number | null;
  frequencyMHz: number | null;
  polarization: "H" | "V" | null;
  signalLabel: string;
  signalBars: number;
};

export type RankedTransmitter = Transmitter & {
  distanceKm: number;
  bearing: number;
  signal: SignalEstimate;
  frequencyMHz: number;
  inRange: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  antennaMode: "outdoor",
  compassNorth: "true",
  showDegrees: true,
  reminders: false,
  notifications: true,
  manualLocation: null,
  customTransmitters: [],
};

type AppState = {
  ready: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => Promise<void>;

  history: ScanRecord[];
  addHistory: (record: ScanRecord) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  lastScan: ScanRecord | null;
  setLastScan: (record: ScanRecord | null) => void;

  position: UserPosition | null;
  devicePosition: UserPosition | null;
  locationStatus: ReturnType<typeof useDeviceLocation>["status"];
  locationError: string | null;
  isManual: boolean;
  requestLocation: () => Promise<void>;
  applyCity: (city: City) => void;
  applyGps: () => void;

  compass: ReturnType<typeof useCompass>;

  ranked: RankedTransmitter[];
  selected: RankedTransmitter | null;
  selectedId: string | null;
  selectTransmitter: (id: string | null) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [lastScan, setLastScan] = useState<ScanRecord | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const device = useDeviceLocation();
  const compass = useCompass(settings.compassNorth);

  // Muat pengaturan & riwayat dari penyimpanan lokal sekali saat startup.
  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadStored<{ settings: Settings; history: ScanRecord[] }>({
        settings: DEFAULT_SETTINGS,
        history: [],
      });
      if (!active) return;
      setSettings({
        ...DEFAULT_SETTINGS,
        ...stored.settings,
        manualLocation: stored.settings?.manualLocation ?? null,
        customTransmitters: stored.settings?.customTransmitters ?? [],
      });
      setHistory(Array.isArray(stored.history) ? stored.history : []);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Simpan setiap perubahan setelah data awal selesai dimuat.
  useEffect(() => {
    if (!ready) return;
    void saveStored({ settings, history });
  }, [ready, settings, history]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAll = useCallback(async () => {
    await clearStored();
    setSettings(DEFAULT_SETTINGS);
    setHistory([]);
    setLastScan(null);
    setSelectedId(null);
  }, []);

  const addHistory = useCallback((record: ScanRecord) => {
    setHistory((prev) => [record, ...prev].slice(0, 50));
  }, []);

  const deleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const applyCity = useCallback(
    (city: City) => {
      updateSettings({
        manualLocation: {
          latitude: city.latitude,
          longitude: city.longitude,
          label: `${city.name}, ${city.province}`,
          cityId: city.id,
        },
      });
    },
    [updateSettings],
  );

  const applyGps = useCallback(() => {
    updateSettings({ manualLocation: null });
  }, [updateSettings]);

  const requestLocation = useCallback(async () => {
    updateSettings({ manualLocation: null });
    await device.request();
  }, [device, updateSettings]);

  const position = useMemo<UserPosition | null>(() => {
    if (settings.manualLocation) {
      return {
        latitude: settings.manualLocation.latitude,
        longitude: settings.manualLocation.longitude,
        accuracy: null,
        label: settings.manualLocation.label,
      };
    }
    return device.position;
  }, [settings.manualLocation, device.position]);

  const allTransmitters = useMemo(
    () => [...TRANSMITTERS, ...settings.customTransmitters],
    [settings.customTransmitters],
  );

  const ranked = useMemo<RankedTransmitter[]>(() => {
    if (!position) return [];
    return allTransmitters
      .map((transmitter) => {
        const distance = distanceKm(position, transmitter);
        const bearing = bearingDeg(position, transmitter);
        const frequencyMHz = channelToFrequency(transmitter.channel);
        return {
          ...transmitter,
          distanceKm: distance,
          bearing,
          frequencyMHz,
          signal: estimateSignal(distance, frequencyMHz, transmitter.erpKw),
          inRange: distance <= transmitter.radiusKm,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allTransmitters, position]);

  // Pilih pemancar terdekat sebagai target awal (fallback saat belum ada pilihan).
  const selected = useMemo(
    () => ranked.find((item) => item.id === selectedId) ?? ranked[0] ?? null,
    [ranked, selectedId],
  );

  const selectTransmitter = useCallback((id: string | null) => setSelectedId(id), []);

  const value = useMemo<AppState>(
    () => ({
      ready,
      settings,
      updateSettings,
      resetAll,
      history,
      addHistory,
      deleteHistory,
      clearHistory,
      lastScan,
      setLastScan,
      position,
      devicePosition: device.position,
      locationStatus: device.status,
      locationError: device.error,
      isManual: Boolean(settings.manualLocation),
      requestLocation,
      applyCity,
      applyGps,
      compass,
      ranked,
      selected,
      selectedId,
      selectTransmitter,
    }),
    [
      ready,
      settings,
      updateSettings,
      resetAll,
      history,
      addHistory,
      deleteHistory,
      clearHistory,
      lastScan,
      position,
      device.position,
      device.status,
      device.error,
      requestLocation,
      applyCity,
      applyGps,
      compass,
      ranked,
      selected,
      selectedId,
      selectTransmitter,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp harus dipakai di dalam AppProvider");
  return context;
}

/** Cari kota dari id (untuk menampilkan lokasi manual yang tersimpan). */
export function findCity(cityId?: string): City | null {
  if (!cityId) return null;
  return CITIES.find((city) => city.id === cityId) ?? null;
}

export const PLATFORM_IS_WEB = Platform.OS === "web";
