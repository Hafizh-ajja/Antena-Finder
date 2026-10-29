import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "@/constants/theme";

type LogoProps = {
  size?: number;
  color?: string;
  accent?: string;
};

export function Logo({ size = 40, color = colors.primary, accent = colors.blue }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="22" fill="rgba(22, 229, 138, 0.08)" />
      <Path
        d="M16 40 L24 30 L32 40"
        stroke={accent}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      <Path d="M24 40V17" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Path d="M18 24H30" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx="24" cy="15" r="2.6" fill={color} />
      <Path
        d="M30.5 10.5a8 8 0 0 1 0 9"
        stroke={accent}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path
        d="M34.5 7a13 13 0 0 1 0 16"
        stroke={accent}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.55}
      />
    </Svg>
  );
}
