export type GeoPoint = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371.0088;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Normalize any angle to the 0–360 range. */
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Shortest signed rotation (in degrees) needed to go from `from` to `to`, within -180..180. */
export function shortestAngle(from: number, to: number): number {
  return normalizeDeg(to - from + 180) - 180;
}

/** Great-circle distance in kilometers between two points. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing (azimuth from true north) from `a` to `b`, in degrees 0–360. */
export function bearingDeg(a: GeoPoint, b: GeoPoint): number {
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return normalizeDeg(toDeg(Math.atan2(y, x)));
}

const CARDINALS = [
  "Utara",
  "Timur Laut",
  "Timur",
  "Tenggara",
  "Selatan",
  "Barat Daya",
  "Barat",
  "Barat Laut",
] as const;

/** Indonesian cardinal direction, e.g. 125° → "Tenggara". */
export function cardinalName(deg: number): string {
  const index = Math.round(normalizeDeg(deg) / 45) % 8;
  return CARDINALS[index];
}

/** Short compass label, e.g. 125° → "TG". */
export function cardinalShort(deg: number): string {
  const labels = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  return labels[Math.round(normalizeDeg(deg) / 45) % 8];
}

/** 850 m → "850 m", 12.4 km → "12,4 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km)} km`;
}

export function formatCoord(value: number, axis: "lat" | "lon"): string {
  const suffix =
    axis === "lat" ? (value >= 0 ? "LU" : "LS") : value >= 0 ? "BT" : "BB";
  return `${Math.abs(value).toFixed(4).replace(".", ",")}° ${suffix}`;
}
