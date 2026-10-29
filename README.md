# AntenaFinder

Aplikasi mobile (Expo / React Native) untuk membantu mengarahkan antena TV ke pemancar DVB-T2 yang paling masuk akal, berdasarkan **lokasi**, **jarak**, dan **azimut** — bukan pengukuran sinyal.

> **Penting:** AntenaFinder **tidak mengukur kekuatan sinyal TV**. Ponsel tidak punya tuner RF. Semua angka sinyal di aplikasi adalah **estimasi** dari model free-space path loss + asumsi redaman, dan dataset pemancar di repo ini adalah **dataset demo** (koordinat/kanal/ERP perkiraan, bukan data resmi operator). Selalu verifikasi dengan kualitas gambar di TV/STB.

---

## Fitur & layar

| Layar | Isi |
| --- | --- |
| **Splash** (`src/app/index.tsx`) | Logo, status pemuatan data lokal, lanjut otomatis ke Beranda. |
| **Beranda** (`(tabs)/beranda`) | Sapaan berbasis waktu, kartu lokasi, pemancar terbaik + sinyal estimasi, aksi cepat (Scan, Kompas, Peta, Panduan), tips. |
| **Peta** (`(tabs)/peta`) | Peta nyata + marker pemancar, garis arah ke target, daftar pemancar terdekat, pencarian, pilih kota manual. Native memakai Google/Apple Maps; web memakai tile OpenStreetMap. |
| **Riwayat** (`(tabs)/riwayat`) | Daftar hasil scan tersimpan, hapus per item / semua, empty state, buka detail. |
| **Profil** (`(tabs)/profil`) | Ringkasan preferensi, pintasan pengaturan, panduan, info versi & batasan. |
| **Kompas** (`src/app/kompas.tsx`) | Kompas SVG dengan heading perangkat, azimut target, selisih derajat, indikator "sudah sejajar", tips pemasangan sesuai mode antena. |
| **Scan** (`src/app/scan.tsx`) | Proses scan bertimer (animasi), lalu membuat `ScanRecord` dari pemancar terbaik. Butuh lokasi; ada fallback pilih kota. |
| **Hasil** (`src/app/hasil.tsx`) | Ringkasan hasil, sinyal estimasi, checklist pemasangan, simpan ke riwayat, buka kompas. |
| **Panduan** (`src/app/panduan.tsx`) | 6 langkah pemasangan antena + bagian keselamatan. |
| **Pengaturan** (`src/app/pengaturan.tsx`) | Lokasi (GPS/kota), utara sejati/magnetik, tampilkan derajat, mode antena indoor/outdoor, kalibrasi kompas, pengingat lokal, reset data. |
| **Pilih kota** (`src/app/pilih-kota.tsx`) | Pencarian 35 kota, pakai lokasi GPS, input manual. |

Navigasi bawah: **Beranda / Peta / Riwayat / Profil** (`src/app/(tabs)/_layout.tsx`).

## Teknologi

- Expo SDK 58, React Native 0.88, React 19, TypeScript
- Expo Router (typed routes) — semua rute di `src/app/`
- `expo-location` (lokasi + heading), `expo-haptics`, `expo-notifications` (pengingat lokal)
- `react-native-maps` (native) dan tile OpenStreetMap (web)
- `react-native-svg` (kompas & ilustrasi), `expo-linear-gradient`
- `@react-native-async-storage/async-storage` untuk pengaturan & riwayat

## Menjalankan

Prasyarat: Node.js LTS, npm, dan aplikasi **Expo Go** di HP (atau emulator/simulator).

```bash
npm install
npx expo start
```

Lalu:

- scan QR dengan Expo Go (Android/iOS), atau tekan `a` / `i` di terminal,
- `npx expo start --web` untuk versi web.

Perintah lain:

```bash
npx expo lint        # ESLint (eslint-config-expo)
npx tsc --noEmit     # typecheck
npx expo export --platform web      # uji bundling produksi web
npx expo export --platform android  # uji bundling native
```

Build/rilis lewat EAS (tanpa Xcode/Android Studio lokal):

```bash
npx eas-cli@latest build --profile preview
```

Tambahkan `eas.json` lebih dulu jika belum ada (`eas build:configure`).

## Konfigurasi & data

- **Tidak ada API key / backend.** Semua perhitungan terjadi di perangkat; lokasi tidak dikirim ke server.
- **Dataset pemancar:** `src/data/transmitters.ts` — 40 situs DVB-T2 (perkiraan) di 35 kota, semuanya `verified: false` dan berlabel "Dataset demo".
  Ganti/tambah entri di `TRANSMITTERS` dan `CITIES` untuk memakai data resmi. Pemancar tambahan buatan pengguna disimpan di `settings.customTransmitters`.
- **Model estimasi:** `src/lib/signal.ts`. Parameter (frekuensi UHF, redaman tambahan, gain antena) bisa disesuaikan di konstanta atas file. Ini model edukasi, bukan model propagasi tersertifikasi.
- **Peta web** memakai tile `tile.openstreetmap.org` (lihat `src/components/signal-map.web.tsx`). Untuk produksi berskala besar, ganti dengan penyedia tile ber-SLA.
- **Penyimpanan lokal:** satu kunci AsyncStorage `antennafinder:v1` (lihat `src/lib/storage.ts`). "Reset data" di Pengaturan menghapusnya.
- **Izin:** lokasi diminta hanya saat dibutuhkan (tombol "Gunakan lokasi saya", scan, atau utara sejati). Notifikasi diminta saat pengingat diaktifkan. Semua fitur punya fallback jika izin ditolak.

## Struktur proyek

```
app.json                     konfigurasi Expo (nama, izin, splash, plugin)
src/app/                     rute Expo Router (layar)
  (tabs)/                    Beranda, Peta, Riwayat, Profil + bottom nav
src/components/              komponen UI & peta (native + .web)
  ui/                        tombol, kartu, badge, search bar, dll.
src/constants/theme.ts       palet, radius, spacing, tipografi
src/data/transmitters.ts     dataset demo pemancar & kota
src/hooks/                   use-device-location, use-compass
src/lib/                     geo, signal, format, storage, reminders
src/store/app-state.tsx      provider global (settings, history, lokasi, kompas)
```

## Batasan perangkat keras & platform

| Hal | Batasan |
| --- | --- |
| Kekuatan sinyal | Tidak diukur. Nilai = estimasi dari jarak, kanal, dan ERP. |
| Kompas | Butuh magnetometer. Di web kompas tidak tersedia; di perangkat tanpa sensor, UI menampilkan status "tidak tersedia". |
| Utara sejati | `trueHeading` hanya valid dengan izin lokasi. Tanpa izin, aplikasi memakai `magHeading` (utara magnetik). |
| Kalibrasi | Bisa dilakukan lewat modal kalibrasi (gerakan angka 8), tetapi akurasi tetap tergantung sensor. |
| Peta | Native: Google Maps (butuh API key untuk build produksi Android sesuai kebijakan Google) / Apple Maps di iOS. Web: OpenStreetMap raster. |
| Pengingat | Notifikasi lokal saja, tidak berjalan di web. |
| TV/STB | Scan channel tetap harus dilakukan di perangkat TV. Nomor kanal di dataset hanya perkiraan. |

## Checklist kualitas

Sudah diverifikasi di repo ini:

- `npx tsc --noEmit` → 0 error
- `npx expo lint` / `npx eslint .` → 0 error, 0 warning
- `npx expo export --platform web` dan `--platform android` → sukses
- Uji klik otomatis di browser (390px & 320px): tab Beranda/Peta/Riwayat/Profil, semua menu, tombol kembali, pilih kota, scan → hasil → simpan → hapus riwayat berjalan tanpa error konsol.

## Troubleshooting

- **Red screen "React Native version mismatch"**: versi paket tidak cocok dengan SDK. Jalankan `npx expo install --fix`, lalu `npx expo start -c`.
- **Metro error "Got unexpected undefined"** setelah mengubah file: hentikan server dan jalankan `npx expo start -c` (hapus cache Metro).
- **Tab bawah tidak merespons**: di SDK 58 props `tabBar` memakai `emitter` + `navigateToTab`, bukan `navigation`. Implementasi ada di `src/components/bottom-navigation.tsx`.
- **Notifikasi/pengingat tidak muncul di web**: memang tidak didukung; pengingat hanya berjalan di build native.

Folder `example/` adalah salinan template lama dan dikecualikan dari TypeScript/ESLint; tidak dipakai aplikasi.
