import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";
import { AppProvider } from "@/store/app-state";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="kompas" />
          <Stack.Screen name="scan" options={{ animation: "fade" }} />
          <Stack.Screen name="hasil" />
          <Stack.Screen name="panduan" />
          <Stack.Screen
            name="pengaturan"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="pilih-kota"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
