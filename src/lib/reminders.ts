import { Platform } from "react-native";

const CHANNEL_ID = "antenna-reminders";

export type ReminderResult = { ok: boolean; reason?: "web" | "permission" | "error" };

/**
 * Pengingat lokal (bukan push/remote). Dijadwalkan setiap hari pukul 18.00.
 * Di web tidak tersedia — pemanggil harus menampilkan penjelasan.
 */
export async function enableDailyReminder(): Promise<ReminderResult> {
  if (Platform.OS === "web") return { ok: false, reason: "web" };

  try {
    const Notifications = await import("expo-notifications");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== "granted") return { ok: false, reason: "permission" };

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Pengingat pemeriksaan antena",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Cek kualitas sinyal TV",
        body: "Luangkan 5 menit untuk memeriksa arah antena dan channel yang hilang.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 18,
        minute: 0,
        channelId: CHANNEL_ID,
      },
    });

    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function disableDailyReminder(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const Notifications = await import("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // abaikan
  }
}
