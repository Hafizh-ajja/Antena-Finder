import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { colors, radius, space } from "@/constants/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onSubmit?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Cari kota atau pemancar",
  style,
  onSubmit,
}: SearchBarProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Ionicons name="search" size={18} color={colors.blue} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
        >
          <Ionicons name="close-circle" size={18} color={colors.dim} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    height: 50,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 0,
  },
});
