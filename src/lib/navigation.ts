import { router, type Href } from "expo-router";

/**
 * Kembali ke layar sebelumnya. Kalau layar dibuka langsung (deep link atau
 * refresh di web) sehingga tidak ada history, buka `fallback` agar pengguna
 * tidak terjebak.
 */
export function goBackOr(fallback: Href = "/beranda") {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
}
