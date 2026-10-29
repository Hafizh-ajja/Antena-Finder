import { colors } from "@/constants/theme";

/**
 * Estimasi kasar kekuatan sinyal DVB-T2.
 *
 * Ini BUKAN pengukuran. Nilai dihitung dari free-space path loss + asumsi
 * redaman lingkungan, tinggi antena, dan penguatan antena penerima. Gunakan
 * hanya sebagai perbandingan antar pemancar, bukan angka absolut.
 */

const UHF_START_MHZ = 470;
const EXTRA_LOSS_DB = 22; // redaman bangunan/vegetasi/tinggi antena
const RX_ANTENNA_GAIN_DBI = 10; // antena Yagi UHF typical

export function channelToFrequency(channel: number): number {
  return UHF_START_MHZ + (channel - 14) * 8 + 4;
}

export type SignalBars = 0 | 1 | 2 | 3 | 4;

export type SignalEstimate = {
  dbm: number;
  bars: SignalBars;
  label: string;
  color: string;
  hint: string;
};

export function estimateSignal(
  distance: number,
  frequencyMHz: number,
  erpKw: number,
): SignalEstimate {
  const d = Math.max(distance, 0.05);
  const fspl =
    20 * Math.log10(d) + 20 * Math.log10(frequencyMHz) + 32.44;
  const erpDbm = 10 * Math.log10(Math.max(erpKw, 0.01) * 1e6);
  const dbm = erpDbm + RX_ANTENNA_GAIN_DBI - fspl - EXTRA_LOSS_DB;

  if (dbm >= -60) {
    return {
      dbm,
      bars: 4,
      label: "Sangat kuat",
      color: colors.good,
      hint: "Peluang besar langsung dapat sinyal.",
    };
  }
  if (dbm >= -70) {
    return {
      dbm,
      bars: 3,
      label: "Kuat",
      color: colors.accent,
      hint: "Seharusnya cukup untuk semua channel.",
    };
  }
  if (dbm >= -80) {
    return {
      dbm,
      bars: 2,
      label: "Cukup",
      color: colors.amber,
      hint: "Bisa masuk, tapi kualitas gambar bisa terputus-putus.",
    };
  }
  if (dbm >= -90) {
    return {
      dbm,
      bars: 1,
      label: "Lemah",
      color: colors.warn,
      hint: "Perlu antena lebih tinggi atau penguat sinyal.",
    };
  }
  return {
    dbm,
    bars: 0,
    label: "Sangat lemah",
    color: colors.bad,
    hint: "Kemungkinan besar tidak dapat sinyal dari arah ini.",
  };
}

/** Perkiraan polarisasi optimum berdasarkan polarisasi pemancar. */
export function polarizationAdvice(polarization: "H" | "V"): string {
  return polarization === "H"
    ? "Pasang elemen antena mendatar (horizontal) — sejajar tanah."
    : "Pasang elemen antena tegak (vertikal) — berdiri ke atas.";
}
