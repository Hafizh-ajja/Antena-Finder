import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { colors, radius, shadow, space } from "@/constants/theme";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  beranda: "home",
  peta: "map",
  riwayat: "time",
  profil: "person",
};

const LABELS: Record<string, string> = {
  beranda: "Beranda",
  peta: "Peta",
  riwayat: "Riwayat",
  profil: "Profil",
};

/**
 * Bottom tab bar kustom. SDK 58 mengirim `emitter` + `navigateToTab`
 * (bukan `navigation` seperti versi lama).
 */
export function BottomNavigation({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = ICONS[route.name] ?? "ellipse";
        const label = LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = emitter.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        const onLongPress = () => {
          emitter.emit({ type: "tabLongPress", target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Ionicons
                name={focused ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)}
                size={20}
                color={focused ? colors.primary : colors.dim}
              />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space.sm,
    paddingHorizontal: space.sm,
    ...shadow.card,
  },
  item: { flex: 1, alignItems: "center", gap: 3, paddingVertical: 2 },
  pressed: { opacity: 0.75 },
  pill: {
    width: 46,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: { backgroundColor: colors.primarySoft },
  label: { fontSize: 10, fontWeight: "600", color: colors.dim, letterSpacing: 0.2 },
  labelActive: { color: colors.primary },
});
