export const colors = {
  bg: "#08172B",
  bgDeep: "#050F1E",
  bgElevated: "#0A1A2F",
  card: "#0B1C32",
  cardAlt: "#10243D",
  border: "#1A3352",
  borderSoft: "#14283F",
  primary: "#16E58A",
  primaryPressed: "#0FCB78",
  primarySoft: "rgba(22, 229, 138, 0.12)",
  primaryBorder: "rgba(22, 229, 138, 0.38)",
  blue: "#329CFF",
  blueSoft: "rgba(50, 156, 255, 0.13)",
  blueBorder: "rgba(50, 156, 255, 0.35)",
  text: "#F1F6FF",
  muted: "#91A8C4",
  dim: "#5F7793",
  danger: "#FF6B7A",
  warning: "#FFC24B",
  onPrimary: "#04241A",
  white: "#FFFFFF",

  // Skala kualitas sinyal (estimasi). Urut dari terbaik ke terburuk.
  good: "#16E58A",
  accent: "#3ED9C0",
  amber: "#FFC24B",
  warn: "#FF9F5A",
  bad: "#FF6B7A",
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 30,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const shadow = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  soft: {
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
} as const;

export const text = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: colors.text,
    letterSpacing: -0.6,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700" as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600" as const,
    color: colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600" as const,
    color: colors.text,
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
    color: colors.dim,
  },
  mono: {
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.muted,
    fontVariant: ["tabular-nums"] as ("tabular-nums")[],
  },
} as const;
