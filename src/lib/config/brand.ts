/**
 * Hertz Brand Design Tokens - Premium Corporate
 * STRICT: Primary CTA #FFCC00, text #434244 / #58595B, black #000000
 * Use yellow sparingly: CTA buttons, key highlights, pricing emphasis only.
 */

export const brand = {
  colors: {
    primary: "#FFCC00", // CTA only
    black: "#000000",
    textDark: "#434244",
    textMedium: "#58595B",
    textMuted: "#808285",
    white: "#FFFFFF",
    background: "#FFFFFF",
    backgroundSubtle: "#FAFAFA",
    border: "#E5E5E5",
  },
  spacing: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },
  typography: {
    hero: { fontSize: "48px", lineHeight: 1.15, fontWeight: 700 },
    h1: { fontSize: "36px", lineHeight: 1.2, fontWeight: 700 },
    h2: { fontSize: "28px", lineHeight: 1.25, fontWeight: 700 },
    h3: { fontSize: "22px", lineHeight: 1.3, fontWeight: 600 },
    h4: { fontSize: "18px", lineHeight: 1.35, fontWeight: 600 },
    body: { fontSize: "16px", lineHeight: 1.5, fontWeight: 400 },
    bodySm: { fontSize: "14px", lineHeight: 1.45, fontWeight: 400 },
    caption: { fontSize: "12px", lineHeight: 1.4, fontWeight: 400 },
  },
  radius: {
    none: "0",
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    card: "0 2px 8px rgba(0,0,0,0.06)",
    elevated: "0 4px 16px rgba(0,0,0,0.08)",
  },
  layout: {
    container: "1280px",
    containerNarrow: "960px",
    headerHeight: "72px",
    mobileHeaderHeight: "56px",
  },
  button: {
    primary: "bg-[#FFCC00] text-black font-bold",
    secondary: "bg-white text-black font-semibold border-2 border-black",
    height: "48px",
    heightDesktop: "44px",
  },
  breakpoints: {
    desktop: 1024,
  },
} as const;
