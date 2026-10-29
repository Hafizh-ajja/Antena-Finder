import React from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "@/constants/theme";

type Props = { width?: number };

export function AntennaIllustration({ width = 300 }: Props) {
  const height = width * 0.78;
  return (
    <Svg width={width} height={height} viewBox="0 0 320 250">
      <Defs>
        <RadialGradient id="skyGlow" cx="50%" cy="35%" r="65%">
          <Stop offset="0" stopColor={colors.blue} stopOpacity="0.22" />
          <Stop offset="1" stopColor={colors.bg} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0C2740" />
          <Stop offset="1" stopColor="#071527" />
        </LinearGradient>
      </Defs>

      <Circle cx="160" cy="100" r="120" fill="url(#skyGlow)" />

      {[
        [46, 44, 1.6],
        [82, 26, 1.2],
        [128, 52, 1],
        [206, 34, 1.4],
        [250, 62, 1.1],
        [286, 40, 1.5],
        [274, 106, 1],
        [24, 92, 1.2],
        [182, 20, 1],
      ].map(([cx, cy, r], index) => (
        <Circle key={index} cx={cx} cy={cy} r={r} fill={colors.text} opacity={0.5} />
      ))}

      <Circle cx="252" cy="56" r="26" fill={colors.blue} opacity={0.08} />
      <Circle cx="252" cy="56" r="17" fill={colors.blue} opacity={0.16} />
      <Circle cx="252" cy="56" r="11" fill="#DCEBFF" opacity={0.85} />

      <G>
        <Path d="M0 214 Q 80 188 160 204 T 320 196 L320 250 L0 250 Z" fill="url(#ground)" />
        <Path
          d="M0 214 Q 80 188 160 204 T 320 196"
          stroke={colors.border}
          strokeWidth="1.4"
          fill="none"
          opacity={0.8}
        />

        <Rect x="66" y="168" width="82" height="46" rx="5" fill="#0D2440" stroke={colors.border} />
        <Path d="M56 170 L107 136 L158 170 Z" fill="#122B47" stroke={colors.border} />
        <Rect x="86" y="184" width="16" height="14" rx="2" fill={colors.primary} opacity={0.5} />
        <Rect x="114" y="184" width="16" height="14" rx="2" fill={colors.blue} opacity={0.4} />

        <Path d="M107 136 L107 78" stroke={colors.text} strokeWidth="3" strokeLinecap="round" />
        <Path d="M92 104 L122 96" stroke={colors.text} strokeWidth="2.2" strokeLinecap="round" />
        <Path d="M90 118 L124 109" stroke={colors.text} strokeWidth="2.2" strokeLinecap="round" />
        <Path d="M94 131 L120 124" stroke={colors.text} strokeWidth="2.2" strokeLinecap="round" />
        <Circle cx="107" cy="75" r="3.4" fill={colors.primary} />

        <Path
          d="M118 70a12 12 0 0 1 0 10"
          stroke={colors.primary}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <Path
          d="M128 63a21 21 0 0 1 0 24"
          stroke={colors.primary}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.7}
        />
        <Path
          d="M138 56a31 31 0 0 1 0 38"
          stroke={colors.primary}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.4}
        />
      </G>
    </Svg>
  );
}
