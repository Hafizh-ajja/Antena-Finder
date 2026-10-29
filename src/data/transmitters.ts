export type Polarization = "H" | "V";

export type Transmitter = {
  id: string;
  name: string;
  operator: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  /** Kanal UHF (perkiraan, verifikasi di lapangan). */
  channel: number;
  /** Daya pancar efektif (ERP) dalam kW, perkiraan. */
  erpKw: number;
  polarization: Polarization;
  /** Radius layanan tipikal dalam km, perkiraan. */
  radiusKm: number;
  verified: boolean;
};

const t = (
  id: string,
  name: string,
  operator: string,
  city: string,
  province: string,
  latitude: number,
  longitude: number,
  channel: number,
  erpKw: number,
  polarization: Polarization,
  radiusKm: number,
): Transmitter => ({
  id,
  name,
  operator,
  city,
  province,
  latitude,
  longitude,
  channel,
  erpKw,
  polarization,
  radiusKm,
  verified: false,
});

/**
 * Dataset demo situs pemancar DVB-T2 Indonesia.
 *
 * Koordinat adalah perkiraan lokasi menara utama di tiap kota, BUKAN hasil
 * survei. Kanal, ERP, dan polarisasi juga perkiraan. Jangan dianggap sebagai
 * data resmi — verifikasi ke operator/Kominfo sebelum memutar antena.
 */
export const TRANSMITTERS: Transmitter[] = [
  // DKI Jakarta
  t("tvri-jkt", "TVRI Jakarta", "TVRI", "Jakarta Pusat", "DKI Jakarta", -6.2186, 106.8026, 39, 12, "H", 55),
  t("rcti-jkt", "MUX RCTI Jakarta", "RCTI / iNews / MNC", "Jakarta Barat", "DKI Jakarta", -6.1949, 106.7701, 41, 15, "H", 52),
  t("sctv-jkt", "MUX SCTV Jakarta", "SCTV / Indosiar", "Jakarta Barat", "DKI Jakarta", -6.1539, 106.7316, 45, 15, "H", 52),
  t("trans-jkt", "MUX Trans Jakarta", "Trans TV / Trans7", "Jakarta Barat", "DKI Jakarta", -6.2182, 106.7318, 43, 12, "H", 48),
  t("metro-jkt", "MUX Metro TV Jakarta", "Metro TV / Magna", "Jakarta Pusat", "DKI Jakarta", -6.187, 106.8568, 47, 10, "H", 46),

  // Jawa Barat
  t("tvri-bdg", "TVRI Bandung", "TVRI", "Bandung", "Jawa Barat", -6.8745, 107.6178, 39, 10, "H", 45),
  t("rcti-bdg", "MUX RCTI Bandung", "RCTI / iNews / MNC", "Bandung", "Jawa Barat", -6.902, 107.6185, 41, 12, "H", 42),
  t("tvri-crb", "TVRI Cirebon", "TVRI", "Cirebon", "Jawa Barat", -6.732, 108.5523, 39, 8, "H", 34),

  // Jawa Timur
  t("tvri-sby", "TVRI Surabaya", "TVRI", "Surabaya", "Jawa Timur", -7.2906, 112.7306, 39, 10, "H", 45),
  t("rcti-sby", "MUX RCTI Surabaya", "RCTI / iNews / MNC", "Surabaya", "Jawa Timur", -7.245, 112.69, 41, 12, "H", 42),
  t("tvri-mlg", "TVRI Malang", "TVRI", "Malang", "Jawa Timur", -7.9666, 112.6326, 39, 8, "H", 32),

  // Jawa Tengah & DIY
  t("tvri-smg", "TVRI Semarang", "TVRI", "Semarang", "Jawa Tengah", -7.0051, 110.4381, 39, 10, "H", 45),
  t("rcti-smg", "MUX RCTI Semarang", "RCTI / iNews / MNC", "Semarang", "Jawa Tengah", -7.05, 110.4, 41, 12, "H", 40),
  t("tvri-soc", "TVRI Surakarta", "TVRI", "Surakarta", "Jawa Tengah", -7.5666, 110.8166, 39, 8, "H", 32),
  t("tvri-yog", "TVRI Yogyakarta", "TVRI", "Yogyakarta", "DI Yogyakarta", -7.7828, 110.3671, 39, 8, "H", 38),
  t("rcti-yog", "MUX RCTI Yogyakarta", "RCTI / iNews / MNC", "Yogyakarta", "DI Yogyakarta", -7.81, 110.4, 41, 10, "H", 35),

  // Sumatera
  t("tvri-mdn", "TVRI Medan", "TVRI", "Medan", "Sumatera Utara", 3.5952, 98.6722, 39, 10, "H", 45),
  t("rcti-mdn", "MUX RCTI Medan", "RCTI / iNews / MNC", "Medan", "Sumatera Utara", 3.58, 98.65, 41, 12, "H", 42),
  t("tvri-plm", "TVRI Palembang", "TVRI", "Palembang", "Sumatera Selatan", -2.9761, 104.7754, 39, 10, "H", 45),
  t("rcti-plm", "MUX RCTI Palembang", "RCTI / iNews / MNC", "Palembang", "Sumatera Selatan", -2.99, 104.75, 41, 10, "H", 40),
  t("tvri-pdg", "TVRI Padang", "TVRI", "Padang", "Sumatera Barat", -0.9471, 100.4172, 39, 8, "H", 35),
  t("tvri-pku", "TVRI Pekanbaru", "TVRI", "Pekanbaru", "Riau", 0.5071, 101.4478, 39, 8, "H", 35),
  t("tvri-djb", "TVRI Jambi", "TVRI", "Jambi", "Jambi", -1.6101, 103.6131, 39, 8, "H", 30),
  t("tvri-bks", "TVRI Bengkulu", "TVRI", "Bengkulu", "Bengkulu", -3.8004, 102.2655, 39, 8, "H", 30),
  t("tvri-tkg", "TVRI Lampung", "TVRI", "Bandar Lampung", "Lampung", -5.4292, 105.261, 39, 8, "H", 35),
  t("tvri-btm", "TVRI Batam", "TVRI", "Batam", "Kepulauan Riau", 1.13, 104.03, 39, 8, "H", 30),

  // Kalimantan
  t("tvri-bpp", "TVRI Balikpapan", "TVRI", "Balikpapan", "Kalimantan Timur", -1.2379, 116.8529, 39, 8, "H", 36),
  t("tvri-smd", "TVRI Samarinda", "TVRI", "Samarinda", "Kalimantan Timur", -0.5022, 117.1536, 39, 8, "H", 32),
  t("tvri-bjm", "TVRI Banjarmasin", "TVRI", "Banjarmasin", "Kalimantan Selatan", -3.3186, 114.5944, 39, 8, "H", 34),
  t("tvri-ptk", "TVRI Pontianak", "TVRI", "Pontianak", "Kalimantan Barat", -0.0263, 109.3425, 39, 8, "H", 34),

  // Sulawesi & Indonesia Timur
  t("tvri-mks", "TVRI Makassar", "TVRI", "Makassar", "Sulawesi Selatan", -5.1477, 119.4327, 39, 10, "H", 45),
  t("rcti-mks", "MUX RCTI Makassar", "RCTI / iNews / MNC", "Makassar", "Sulawesi Selatan", -5.16, 119.45, 41, 10, "H", 40),
  t("tvri-mdo", "TVRI Manado", "TVRI", "Manado", "Sulawesi Utara", 1.4748, 124.8421, 39, 8, "H", 34),
  t("tvri-plw", "TVRI Palu", "TVRI", "Palu", "Sulawesi Tengah", -0.8917, 119.8707, 39, 8, "H", 30),
  t("tvri-dps", "TVRI Bali", "TVRI", "Denpasar", "Bali", -8.6705, 115.2126, 39, 8, "H", 38),
  t("rcti-dps", "MUX RCTI Bali", "RCTI / iNews / MNC", "Denpasar", "Bali", -8.65, 115.22, 41, 10, "H", 35),
  t("tvri-ami", "TVRI NTB", "TVRI", "Mataram", "Nusa Tenggara Barat", -8.5833, 116.1167, 39, 8, "H", 32),
  t("tvri-koe", "TVRI Kupang", "TVRI", "Kupang", "Nusa Tenggara Timur", -10.1772, 123.607, 39, 8, "H", 30),
  t("tvri-amb", "TVRI Ambon", "TVRI", "Ambon", "Maluku", -3.6954, 128.1814, 39, 8, "H", 30),
  t("tvri-djj", "TVRI Jayapura", "TVRI", "Jayapura", "Papua", -2.5337, 140.7181, 39, 8, "H", 30),
];

export type City = {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
};

export const CITIES: City[] = [
  { id: "jakarta", name: "Jakarta", province: "DKI Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { id: "tangerang", name: "Tangerang", province: "Banten", latitude: -6.1781, longitude: 106.63 },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat", latitude: -6.2383, longitude: 106.9756 },
  { id: "depok", name: "Depok", province: "Jawa Barat", latitude: -6.4025, longitude: 106.7942 },
  { id: "bogor", name: "Bogor", province: "Jawa Barat", latitude: -6.5971, longitude: 106.806 },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", latitude: -6.9175, longitude: 107.6191 },
  { id: "cirebon", name: "Cirebon", province: "Jawa Barat", latitude: -6.732, longitude: 108.5523 },
  { id: "tasikmalaya", name: "Tasikmalaya", province: "Jawa Barat", latitude: -7.3274, longitude: 108.2207 },
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", latitude: -6.9932, longitude: 110.4203 },
  { id: "surakarta", name: "Surakarta (Solo)", province: "Jawa Tengah", latitude: -7.5755, longitude: 110.8243 },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", latitude: -7.2575, longitude: 112.7521 },
  { id: "malang", name: "Malang", province: "Jawa Timur", latitude: -7.9666, longitude: 112.6326 },
  { id: "medan", name: "Medan", province: "Sumatera Utara", latitude: 3.5952, longitude: 98.6722 },
  { id: "padang", name: "Padang", province: "Sumatera Barat", latitude: -0.9471, longitude: 100.4172 },
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau", latitude: 0.5071, longitude: 101.4478 },
  { id: "jambi", name: "Jambi", province: "Jambi", latitude: -1.6101, longitude: 103.6131 },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", latitude: -2.9761, longitude: 104.7754 },
  { id: "bengkulu", name: "Bengkulu", province: "Bengkulu", latitude: -3.8004, longitude: 102.2655 },
  { id: "lampung", name: "Bandar Lampung", province: "Lampung", latitude: -5.4292, longitude: 105.261 },
  { id: "batam", name: "Batam", province: "Kepulauan Riau", latitude: 1.13, longitude: 104.03 },
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat", latitude: -0.0263, longitude: 109.3425 },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan", latitude: -3.3186, longitude: 114.5944 },
  { id: "palangkaraya", name: "Palangka Raya", province: "Kalimantan Tengah", latitude: -2.2086, longitude: 113.9165 },
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur", latitude: -1.2379, longitude: 116.8529 },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur", latitude: -0.5022, longitude: 117.1536 },
  { id: "manado", name: "Manado", province: "Sulawesi Utara", latitude: 1.4748, longitude: 124.8421 },
  { id: "palu", name: "Palu", province: "Sulawesi Tengah", latitude: -0.8917, longitude: 119.8707 },
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", latitude: -5.1477, longitude: 119.4327 },
  { id: "kendari", name: "Kendari", province: "Sulawesi Tenggara", latitude: -3.9985, longitude: 122.513 },
  { id: "denpasar", name: "Denpasar", province: "Bali", latitude: -8.6705, longitude: 115.2126 },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat", latitude: -8.5833, longitude: 116.1167 },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur", latitude: -10.1772, longitude: 123.607 },
  { id: "ambon", name: "Ambon", province: "Maluku", latitude: -3.6954, longitude: 128.1814 },
  { id: "jayapura", name: "Jayapura", province: "Papua", latitude: -2.5337, longitude: 140.7181 },
];

export const DATASET_META = {
  label: "Dataset demo",
  description:
    "Koordinat menara, kanal, dan daya pancar adalah perkiraan komunitas, bukan data resmi operator. Verifikasi sebelum memutar antena.",
  channelDisclaimer:
    "Nomor kanal & frekuensi bersifat perkiraan. Setelah antena diarahkan, lakukan scan ulang channel di TV/STB.",
};
