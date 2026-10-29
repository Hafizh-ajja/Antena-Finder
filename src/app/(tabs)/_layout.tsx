import { Tabs } from "expo-router/js-tabs";
import React from "react";
import { BottomNavigation } from "@/components/bottom-navigation";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNavigation {...props} />}>
      <Tabs.Screen name="beranda" options={{ title: "Beranda" }} />
      <Tabs.Screen name="peta" options={{ title: "Peta" }} />
      <Tabs.Screen name="riwayat" options={{ title: "Riwayat" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
    </Tabs>
  );
}
