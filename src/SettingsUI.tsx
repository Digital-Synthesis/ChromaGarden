import type React from "react";
import type { ThemeName } from "./theme/theme";

interface SettingsUIProps {
  theme: {
    panelBackground: string;
    border: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    buttonBackground: string;
  };
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  onClose: () => void;
}

const cardBaseStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: "180px",
  maxWidth: "220px",
  padding: "0.9rem 1rem",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  transition:
    "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
};

export default function SettingsUI({
  theme,
  themeName,
  setThemeName,
  onClose,
}: SettingsUIProps) {
  const seasonalThemes: {
    id: ThemeName;
    label: string;
    subtitle: string;
    swatchA: string;
    swatchB: string;
  }[] = [
    {
      id: "cinematicDark",
      label: "Default",
      subtitle: "Original dark gold cinematic interface.",
      swatchA: "#ffb74d",
      swatchB: "#1f1a12",
    },
    {
      id: "slateGrey",
      label: "Winter",
      subtitle: "Cool, crisp, neutral steel tones.",
      swatchA: "#8ea0b2",
      swatchB: "#3a3f47",
    },
    {
      id: "warmGlow",
      label: "Summer",
      subtitle: "Warm cinematic gold and amber accents.",
      swatchA: "#ff9d4d",
      swatchB: "#4a3a2a",
    },
    {
      id: "desertSand",
      label: "Autumn",
      subtitle: "Deep copper and muted sand framing.",
      swatchA: "#d8b47a",
      swatchB: "#3a3224",
    },
    {
      id: "forestGreen",
      label: "Spring",
      subtitle: "Soft greens with fresh contrast accents.",
      swatchA: "#4caf7a",
      swatchB: "#1f3d2b",
    },
  ];

  return (
    <div
      style={{
        width: "70%",
        maxWidth: "900px",
        minWidth: "640px",
        maxHeight: "80%",
        borderRadius: "14px",
        padding: "20px 22px",
        backgroundColor: theme.panelBackground,
        border: `1px solid ${theme.border}`,
        boxShadow:
          "0 22px 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "0.75rem",
        }}
      >
        <button
          style={{
            padding: "0.4rem 0.7rem",
            backgroundColor: theme.buttonBackground,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            color: theme.textPrimary,
            cursor: "pointer",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
          onClick={onClose}
        >
          ← Back to Workspace
        </button>

        <div
          style={{
            fontSize: "0.9rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: theme.textMuted,
          }}
        >
          Settings
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Seasonal UI Themes */}
        <section>
          <div
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: theme.textMuted,
              marginBottom: "0.5rem",
            }}
          >
            Seasonal UI Themes
          </div>

          <div
            style={{
              fontSize: "0.9rem",
              color: theme.textPrimary,
              marginBottom: "0.75rem",
              opacity: 0.9,
            }}
          >
            Choose how the interface frames your grading workspace. These themes
            adjust only the UI chrome—never the image preview or interior text.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {seasonalThemes.map((option) => {
              const isActive = themeName === option.id;

              return (
                <div
                  key={option.id}
                  style={{
                    ...cardBaseStyle,
                    backgroundColor: theme.buttonBackground,
                    border: isActive
                      ? `1px solid ${theme.accent}`
                      : `1px solid ${theme.border}`,
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(0,0,0,0.9), 0 0 22px rgba(255,183,77,0.35)"
                      : "0 0 0 1px rgba(0,0,0,0.7)",
                    transform: isActive ? "translateY(-1px)" : "none",
                  }}
                  onClick={() => setThemeName(option.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: theme.textPrimary,
                      }}
                    >
                      {option.label}
                    </div>
                    {isActive && (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: theme.accent,
                        }}
                      >
                        Active
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: theme.textMuted,
                    }}
                  >
                    {option.subtitle}
                  </div>

                  <div
                    style={{
                      marginTop: "0.4rem",
                      display: "flex",
                      gap: "0.35rem",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "18px",
                        borderRadius: "999px",
                        background: `linear-gradient(135deg, ${option.swatchA}, ${option.swatchB})`,
                        boxShadow:
                          "0 0 0 1px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.9)",
                      }}
                    />
                    <div
                      style={{
                        width: "26px",
                        height: "18px",
                        borderRadius: "999px",
                        backgroundColor: option.swatchA,
                        boxShadow:
                          "0 0 0 1px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.9)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Future settings placeholder */}
        <section>
          <div
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: theme.textMuted,
              marginBottom: "0.5rem",
            }}
          >
            Upcoming Controls
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: theme.textMuted,
              maxWidth: "520px",
            }}
          >
            Additional workspace preferences, export defaults, and engine
            options will appear here as Chroma Garden evolves.
          </div>
        </section>

        {/* === NEW: About / Branding Section === */}
        <section>
          <div
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: theme.textMuted,
              marginBottom: "0.5rem",
            }}
          >
            About Chroma Garden
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: theme.textPrimary,
              lineHeight: 1.5,
            }}
          >
            Chroma Garden is a generative color-grading engine created by{" "}
            <strong>Digital Synthesis</strong>.
          </div>
          <div style={{ marginTop: "1rem" }}>
            <a
              href="https://www.etsy.com/shop/digitalsynthesis"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.accent,
                textDecoration: "none",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Visit Digital Synthesis on Etsy →
            </a>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              opacity: 0.5,
              color: theme.textMuted,
            }}
          >
            Version 0.1.0
          </div>
        </section>
      </div>
    </div>
  );
}
