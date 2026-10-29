import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { colors } from "@/constants/theme";

type AntennaCompassProps = {
  size: number;
  heading: number | null;
  targetBearing: number;
  accent?: string;
  center?: React.ReactNode;
};

const TICKS = Array.from({ length: 72 }, (_, index) => index * 5);
const CARDINALS = [
  { deg: 0, label: "U" },
  { deg: 90, label: "T" },
  { deg: 180, label: "S" },
  { deg: 270, label: "B" },
];

export function AntennaCompass({
  size,
  heading,
  targetBearing,
  accent = colors.primary,
  center,
}: AntennaCompassProps) {
  const c = size / 2;
  const rOuter = c - 12;
  const rTick = rOuter - 4;
  const rLabel = rOuter - 40;

  const roseRotation = heading == null ? 0 : -heading;
  const needleRotation = heading == null ? targetBearing : targetBearing - heading;

  const ticks = useMemo(() => {
    return TICKS.map((deg) => {
      const major = deg % 30 === 0;
      const medium = deg % 15 === 0;
      const length = major ? 13 : medium ? 8 : 4;
      return (
        <G key={deg} transform={`rotate(${deg} ${c} ${c})`}>
          <Line
            x1={c}
            y1={c - rTick}
            x2={c}
            y2={c - rTick + length}
            stroke={major ? colors.muted : colors.border}
            strokeWidth={major ? 1.8 : 1}
            strokeLinecap="round"
            opacity={major ? 0.95 : 0.7}
          />
        </G>
      );
    });
  }, [c, rTick]);

  const labels = useMemo(() => {
    return CARDINALS.map((item) => {
      const rad = ((item.deg - 90) * Math.PI) / 180;
      const x = c + Math.cos(rad) * rLabel;
      const y = c + Math.sin(rad) * rLabel + 5;
      const isNorth = item.deg === 0;
      return (
        <SvgText
          key={item.deg}
          x={x}
          y={y}
          fill={isNorth ? colors.primary : colors.muted}
          fontSize={isNorth ? 17 : 15}
          fontWeight="700"
          textAnchor="middle"
        >
          {item.label}
        </SvgText>
      );
    });
  }, [c, rLabel]);

  const aligned =
    heading != null && Math.abs(((targetBearing - heading + 540) % 360) - 180) <= 5;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="dialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={accent} stopOpacity="0.16" />
            <Stop offset="0.72" stopColor={accent} stopOpacity="0.04" />
            <Stop offset="1" stopColor={accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={c} cy={c} r={rOuter} fill="url(#dialGlow)" />
        <Circle
          cx={c}
          cy={c}
          r={rOuter}
          stroke={aligned ? colors.primary : colors.border}
          strokeWidth={aligned ? 2 : 1.2}
          opacity={aligned ? 0.9 : 1}
        />
        <Circle cx={c} cy={c} r={rOuter - 30} stroke={colors.borderSoft} strokeWidth={1} />

        <G transform={`rotate(${roseRotation} ${c} ${c})`}>{ticks}</G>
        <G transform={`rotate(${roseRotation} ${c} ${c})`}>{labels}</G>

        <G transform={`rotate(${needleRotation} ${c} ${c})`}>
          <Line
            x1={c}
            y1={c - 26}
            x2={c}
            y2={c - rOuter + 62}
            stroke={accent}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.28}
          />
          <Path
            d={`M ${c} ${c - rOuter + 30} L ${c - 12} ${c - rOuter + 64} L ${c} ${
              c - rOuter + 56
            } L ${c + 12} ${c - rOuter + 64} Z`}
            fill={accent}
          />
          <Circle cx={c} cy={c - rOuter + 22} r={5.5} fill={accent} />
          <Circle cx={c} cy={c - rOuter + 22} r={11} stroke={accent} strokeWidth={1} opacity={0.35} />
        </G>

        <Circle cx={c} cy={c} r={30} fill={colors.bg} stroke={colors.border} strokeWidth={1.2} />
        <Circle cx={c} cy={c} r={3.5} fill={accent} />
      </Svg>

      <View style={styles.overlay} pointerEvents="none">
        {center}
      </View>

      {/* Penanda tetap di bagian atas: arah hadap perangkat */}
      <View style={styles.topMarker}>
        <PathLike />
      </View>
    </View>
  );
}

function PathLike() {
  return (
    <Svg width={14} height={10} viewBox="0 0 14 10">
      <Path d="M7 10L0 0h14L7 10Z" fill={colors.blue} opacity={0.85} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  topMarker: {
    position: "absolute",
    top: -2,
    alignItems: "center",
  },
});
