import type React from "react";

/* ---------------------------------------------------------
   THEME DEFINITIONS — CLEAN, SAFE, NO COLOR WASHES
--------------------------------------------------------- */

export type ThemeName =
  | "cinematicDark"
  | "slateGrey"
  | "warmGlow"
  | "desertSand"
  | "forestGreen";

const baseTheme = {
  appBackground: "#050505",
  sidebarBackground: "#111",
  headerTint: "rgba(255,183,77,0.12)",
  panelBackground: "#0d0d0d",
  accent: "#ffb74d",
  border: "#262626",
  previewFrameBorder: "#1f1f1f",
  buttonBackground: "#151515",
  buttonHover: "#1c1c1c",
  textPrimary: "#f2f2f2",
  textMuted: "#9a9a9a",
};

export const themes = {
  cinematicDark: { ...baseTheme },
  slateGrey: {
    ...baseTheme,
    accent: "#8ea0b2",
    border: "#2a2f33",
    headerTint: "rgba(120,130,140,0.18)",
    sidebarBackground: "#121416",
    previewFrameBorder: "#3a3f47",
  },
  warmGlow: {
    ...baseTheme,
    accent: "#ff9d4d",
    border: "#3a2a1a",
    headerTint: "rgba(255,152,0,0.18)",
    sidebarBackground: "#1a120c",
    previewFrameBorder: "#4a3a2a",
  },
  desertSand: {
    ...baseTheme,
    accent: "#d8b47a",
    border: "#3a3224",
    headerTint: "rgba(200,160,90,0.18)",
    sidebarBackground: "#1a1710",
    previewFrameBorder: "#c9a66b",
  },
  forestGreen: {
    ...baseTheme,
    accent: "#4caf7a",
    border: "#1a3326",
    headerTint: "rgba(60,120,80,0.18)",
    sidebarBackground: "#0f1a14",
    previewFrameBorder: "#1f3d2b",
  },
};

/* ---------------------------------------------------------
   BASE STYLES
--------------------------------------------------------- */

const noiseTexture =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.04'/></svg>\")";

const baseStyles: { [key: string]: React.CSSProperties } = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    padding: "0.9rem 1.75rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.05rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderBottom: "1px solid",
  },
  headerBadge: {
    padding: "0.15rem 0.5rem",
    borderRadius: "999px",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    border: "1px solid",
  },
  layout: {
    display: "flex",
    flex: 1,
    minHeight: 0,
  },
  leftSidebar: {
    width: "260px",
    padding: "1rem",
    borderRight: "1px solid",
    display: "flex",
    flexDirection: "column",
  },
  rightSidebar: {
    width: "280px",
    padding: "1rem",
    borderLeft: "1px solid",
    display: "flex",
    flexDirection: "column",
  },
  panelTitle: {
    marginBottom: "0.5rem",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  },
  sectionLabel: {
    marginTop: "0.25rem",
    marginBottom: "0.25rem",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  },
  button: {
    padding: "0.5rem 0.75rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.85rem",
    textAlign: "left",
    marginBottom: "0.35rem",
    border: "1px solid",
  },
  buttonAccent: {
    padding: "0.55rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    marginBottom: "0.35rem",
    border: "1px solid",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.8), 0 6px 16px rgba(0,0,0,0.85), 0 0 18px rgba(255,183,77,0.35)",
  },
  divider: {
    height: "1px",
    margin: "1rem 0",
  },

  /* FIXED: Smoother, longer radial gradients to eliminate banding */
  preview: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",           // solid cinematic dark
    backgroundImage: `${noiseTexture}`,
    position: "relative",
  },

  previewInnerFrame: {
    width: "88%",
    height: "86%",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    backgroundColor: "#0a0a0a",           // solid cinematic dark
    backgroundImage: `${noiseTexture}`,
    border: "1px solid",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.9)",
  },

  previewPlaceholder: {
    width: "80%",
    height: "80%",
    border: "1px dashed",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    opacity: 0.55,
    fontSize: "0.9rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};

/* ---------------------------------------------------------
   THEMED STYLE GENERATOR
--------------------------------------------------------- */

export function getStyles(theme: (typeof themes)[ThemeName]) {
  return {
    ...baseStyles,
    layout: { ...baseStyles.layout },
    app: { ...baseStyles.app, backgroundColor: theme.appBackground, color: theme.textPrimary },
    header: {
      ...baseStyles.header,
      borderBottom: `1px solid ${theme.border}`,
      background: `radial-gradient(circle at 0% 0%, ${theme.headerTint}, transparent 55%)`,
    },
    headerBadge: {
      ...baseStyles.headerBadge,
      border: `1px solid ${theme.accent}`,
      color: theme.textPrimary,
      background: `linear-gradient(135deg, ${theme.accent}33, ${theme.accent}55)`,
    },
    leftSidebar: {
      ...baseStyles.leftSidebar,
      backgroundColor: theme.sidebarBackground,
      borderRight: `1px solid ${theme.border}`,
      color: theme.textPrimary,
    },
    rightSidebar: {
      ...baseStyles.rightSidebar,
      backgroundColor: theme.sidebarBackground,
      borderLeft: `1px solid ${theme.border}`,
      color: theme.textPrimary,
    },
    panelTitle: { ...baseStyles.panelTitle, color: theme.textMuted },
    sectionLabel: { ...baseStyles.sectionLabel, color: theme.textMuted },
    button: {
      ...baseStyles.button,
      backgroundColor: theme.buttonBackground,
      border: `1px solid ${theme.border}`,
      color: theme.textPrimary,
    },
    buttonAccent: {
      ...baseStyles.buttonAccent,
      backgroundColor: theme.buttonBackground,
      border: `1px solid ${theme.accent}`,
      color: theme.textPrimary,
    },
    divider: { ...baseStyles.divider, backgroundColor: theme.border },

    /* Apply real theme colors to preview */
    preview: { 
      ...baseStyles.preview, 
      backgroundColor: theme.appBackground 
    },
    previewInnerFrame: {
      ...baseStyles.previewInnerFrame,
      border: `1px solid ${theme.previewFrameBorder}`,
    },

    previewPlaceholder: {
      ...baseStyles.previewPlaceholder,
      border: `1px dashed ${theme.border}`,
    },
    placeholderText: { ...baseStyles.placeholderText, color: theme.textMuted },
  };
}