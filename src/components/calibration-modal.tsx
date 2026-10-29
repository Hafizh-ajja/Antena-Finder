import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, text } from "@/constants/theme";
import { PrimaryButton, SecondaryButton } from "./ui/buttons";
import { StepItem } from "./ui/step-item";

type CalibrationModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CalibrationModal({ visible, onClose }: CalibrationModalProps) {
  const [step, setStep] = useState(0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="compass-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={text.h3}>Kalibrasi kompas</Text>
              <Text style={text.small}>Lakukan saat kompas terlihat melenceng.</Text>
            </View>
          </View>

          <View style={styles.steps}>
            <StepItem
              index={1}
              icon="phone-portrait-outline"
              title="Jauhkan dari logam"
              description="Jauhkan HP dari magnet, speaker, casing berlogam, dan barang elektronik."
            />
            <StepItem
              index={2}
              icon="infinite-outline"
              title="Gerakkan membentuk angka 8"
              description="Putar HP perlahan membentuk angka 8 sebanyak 3–4 kali di udara."
            />
            <StepItem
              index={3}
              icon="checkmark-done-outline"
              title="Bandingkan dengan Utara asli"
              description="Cek apakah huruf U pada kompas menunjuk ke utara sebenarnya. Ulangi bila masih melenceng."
              last
            />
          </View>

          <View style={styles.actions}>
            <SecondaryButton
              label={step === 0 ? "Tandai sudah dicoba" : "Sudah, ulangi"}
              icon="refresh-outline"
              onPress={() => setStep((prev) => prev + 1)}
              fullWidth={false}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              label="Selesai"
              icon="checkmark"
              onPress={onClose}
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>
          {step > 0 ? (
            <Text style={[text.small, styles.footnote]}>
              Kalibrasi dicoba {step}× pada sesi ini. Bila arah masih tidak stabil, kompas
              perangkat mungkin perlu diperbaiki di setelan sistem.
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2, 8, 18, 0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.xl,
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  titleRow: { flexDirection: "row", gap: space.md, alignItems: "center" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  steps: { marginTop: space.xs },
  actions: { flexDirection: "row", gap: space.md },
  footnote: { textAlign: "center" },
});
