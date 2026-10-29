import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "antennafinder:v1";

export async function loadStored<T>(fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export async function saveStored<T>(value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Penyimpanan lokal tidak selalu tersedia (mode privat / kuota penuh).
  }
}

export async function clearStored(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
}
