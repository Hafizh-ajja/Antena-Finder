import { Alert, Platform } from "react-native";

/**
 * `Alert` bawaan React Native tidak berfungsi di web (no-op), jadi dialog
 * disesuaikan per platform agar tombol hapus/reset tetap bekerja.
 */
export function notify(title: string, message: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function confirmAction({
  title,
  message,
  confirmLabel = "Hapus",
  destructive = true,
  onConfirm,
}: ConfirmOptions) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: "Batal", style: "cancel" },
    { text: confirmLabel, style: destructive ? "destructive" : "default", onPress: onConfirm },
  ]);
}
