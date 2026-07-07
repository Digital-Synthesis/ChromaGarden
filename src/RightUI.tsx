import React from "react";
import {
  POST_DRAMA_MIN,
  POST_DRAMA_MAX,
  POST_DRAMA_STEP,
  type PostDramaValue,
} from "./drama-sliders/post-drama/post-drama";
import GlitterText from "./shared/glitterText";
import { getTweakableKeysFromDebug, isDuplicateParamsMetaKey } from "./manual-tweaks/tweakableKeys";

type RightTab = "data" | "export";

interface RightUIProps {
  t: any;
  theme: {
    accent: string;
    textMuted: string;
    textPrimary: string;
    border: string;
    panelBackground: string;
  };
  rightTab: RightTab;
  setRightTab: (tab: RightTab) => void;
  activeProfile: string | null;
  originalImageProfile: any | null;
  debugData: any | null;
  activeRecipeDebug: any | null;
  variationsMode: boolean;
  variations: {
    id: number;
    src: string;
    debug: any;
    locked: boolean;
  }[];
  selectedVariationIndex: number | null;
  onSelectVariationIndex: (index: number) => void;
  onPromoteSelectedVariation: () => void;
  postDrama: PostDramaValue;
  setPostDrama: (value: PostDramaValue) => void;
  onExport: () => void;
  onSaveLook: () => void;
  manualTweaks: Record<string, number>;
  setManualTweaks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onResetManualTweaks: () => void;
  profileChangedSinceLastRecipe: boolean;
}

export default function RightUI({
  t,
  theme,
  rightTab,
  setRightTab,
  activeProfile,
  originalImageProfile,
  debugData,
  activeRecipeDebug,
  variationsMode,
  variations,
  selectedVariationIndex,
  onSelectVariationIndex,
  onPromoteSelectedVariation,
  postDrama,
  setPostDrama,
  onExport,
  onSaveLook,
  manualTweaks,
  setManualTweaks,
  onResetManualTweaks,
  profileChangedSinceLastRecipe,
}: RightUIProps) {
  const [analysisOpen, setAnalysisOpen] = React.useState(true);
  const [recipeOpen, setRecipeOpen] = React.useState(true);
  const [tweaksOpen, setTweaksOpen] = React.useState(true);

  const canUseManualTweaks = React.useMemo(() => {
    if (!activeRecipeDebug || profileChangedSinceLastRecipe) return false;
    return getTweakableKeysFromDebug(activeRecipeDebug, activeProfile).size > 0;
  }, [activeRecipeDebug, profileChangedSinceLastRecipe, activeProfile]);

  const manualTweaksDrawerLocked = !canUseManualTweaks || variationsMode;

  React.useEffect(() => {
    if (manualTweaksDrawerLocked) setTweaksOpen(false);
  }, [manualTweaksDrawerLocked]);

  const fmt = (v: any) =>
    typeof v === "number" ? v.toFixed(8) : String(v);

  /* ---------------------------------------------------------
     FLATTEN OBJECT
  --------------------------------------------------------- */
  const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
    let out: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === "object") {
            Object.assign(out, flattenObject(item, `${fullKey}[${index}]`));
          } else {
            out[`${fullKey}[${index}]`] = item;
          }
        });
        return;
      }

      if (value && typeof value === "object") {
        Object.assign(out, flattenObject(value, fullKey));
        return;
      }

      out[fullKey] = value;
    });

    return out;
  };

  /* ---------------------------------------------------------
     ORIGINAL IMAGE ANALYSIS
  --------------------------------------------------------- */
  const renderGroupedAnalysis = () => {
    if (!originalImageProfile) {
      return (
        <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
          Load an image to analyze luminance, color cast, saturation, edges, and
          skin detection.
        </div>
      );
    }

    const p = originalImageProfile;

    const section = (label: string) => (
      <div
        style={{
          fontWeight: 600,
          marginBottom: "0.25rem",
          marginTop: "0.75rem",
          color: theme.textPrimary,
        }}
      >
        {label}
      </div>
    );

    const line = (label: string, value: any) => (
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.05rem",
          margin: "0.15rem 0",
        }}
      >
        {label}: {fmt(value)}
      </div>
    );

    return (
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: theme.textPrimary,
        }}
      >
        {section("Luminance")}
        {line("avgLuma", p.avgLuma)}
        {line("minLuma", p.minLuma)}
        {line("maxLuma", p.maxLuma)}
        {line("contrast", p.contrast)}

        {section("Tone Distribution")}
        {line("shadowPercent", p.shadowPercent)}
        {line("midtonePercent", p.midtonePercent)}
        {line("highlightPercent", p.highlightPercent)}

        {section("Color")}
        {line("avgA", p.avgA)}
        {line("avgB", p.avgB)}
        {line("colorCastLabel", p.colorCastLabel)}

        {section("Saturation")}
        {line("avgSaturation", p.avgSaturation)}
        {line("maxSaturation", p.maxSaturation)}
        {line("lowSatPercent", p.lowSatPercent)}
        {line("highSatPercent", p.highSatPercent)}

        {section("Edges & Skin")}
        {line("edgeDensity", p.edgeDensity)}
        {line("skinPixelPercent", p.skinPixelPercent)}
        {line("hasSkin", p.hasSkin)}
      </div>
    );
  };

  /* ---------------------------------------------------------
     ACTIVE RECIPE RAW DATA
  --------------------------------------------------------- */
  const renderFlatRecipeData = () => {
    if (!debugData) {
      return (
        <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
          {activeProfile
            ? "Click Randomize Look or Explore 9 Looks to produce recipe data."
            : "Select a profile to begin."}
        </div>
      );
    }

    const flattened = flattenObject(debugData);
    const visibleEntries = Object.entries(flattened).filter(
      ([key]) => !isDuplicateParamsMetaKey(key)
    );

    return (
      <div>
        {visibleEntries.map(([key, value]) => (
          <div
            key={key}
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.05rem",
              margin: "0.15rem 0",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: theme.textPrimary,
            }}
          >
            {key}: {fmt(value)}
          </div>
        ))}
      </div>
    );
  };

  /* ---------------------------------------------------------
     VARIATION SELECTORS
  --------------------------------------------------------- */
  const renderVariationSelectors = () => {
    if (!variationsMode) return null;

    return (
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          border: `1px solid ${theme.border}`,
          borderRadius: "6px",
          backgroundColor: theme.panelBackground,
        }}
      >
        <div
          style={{
            marginBottom: "0.5rem",
            color: theme.textPrimary,
            fontWeight: 600,
          }}
        >
          Select Grade
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "6px",
          }}
        >
          {variations.map((v, index) => {
            const isSelected = selectedVariationIndex === index;

            return (
              <button
                key={v.id}
                onClick={() => onSelectVariationIndex(index)}
                style={{
                  padding: "0.4rem 0.5rem",
                  borderRadius: "6px",
                  border: `1px solid ${isSelected ? theme.accent : theme.border
                    }`,
                  backgroundColor: isSelected
                    ? "rgba(255,255,255,0.08)"
                    : t.button.backgroundColor,
                  color: theme.textPrimary,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Grade {index + 1}
              </button>
            );
          })}
        </div>

        <button
          style={{
            ...t.buttonAccent,
            width: "100%",
            marginTop: "0.75rem",
          }}
          onClick={onPromoteSelectedVariation}
          disabled={
            selectedVariationIndex == null ||
            !variations[selectedVariationIndex] ||
            !variations[selectedVariationIndex].src
          }
        >
          Promote Selected Grade
        </button>
      </div>
    );
  };

  /* ---------------------------------------------------------
     MANUAL TWEAKS — CURVY‑READY AUTO‑DETECTION
     - Seasonal: numeric params.* (excluding adaptive + meta)
     - Curvy B&W: numeric base.* (exposure, contrast, brightness)
  --------------------------------------------------------- */
  const renderManualTweaks = () => {
    if (!debugData) return null;

    const flattened = flattenObject(debugData);

    const entries = Object.entries(flattened).filter(([key, value]) => {
      const isNumeric = typeof value === "number";

      if (!isNumeric) return false;

      const isSeasonParam =
        key.startsWith("params.") &&
        !key.includes("adaptive") &&
        !key.endsWith("personalityId") &&
        !key.endsWith("label") &&
        !key.endsWith("pass") &&
        key !== "params.index";

      // ✅ B&W base tweaks:
      //    - Strong: all base.*
      //    - Curvy: only base.brightness
      const isBWBase =
        key.startsWith("base.") &&
        (
          activeProfile === "Strong" ||
          (activeProfile === "Curvy" && key === "base.brightness")
        );

      // ✅ Curvy curve amounts: curves[n].amount → exposed as tweakable
      const isCurvyCurve =
        activeProfile === "Curvy" &&
        key.startsWith("curves[") &&
        key.endsWith("].amount");

      return isSeasonParam || isBWBase || isCurvyCurve;
    });

    if (entries.length === 0) {
      return (
        <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
          No tweakable parameters detected for this profile.
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <style>
          {`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: ${theme.accent};
              border: 2px solid #000;
              box-shadow: 0 0 6px ${theme.accent};
              cursor: pointer;
              margin-top: -5px;
            }

            input[type="range"]::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: ${theme.accent};
              border: 2px solid #000;
              box-shadow: 0 0 6px ${theme.accent};
              cursor: pointer;
            }
          `}
        </style>

        {entries.map(([key]) => {
          let niceName = key
            .replace("params.", "")
            .replace("base.", "")
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          // 🧠 Human‑friendly names for Curvy curve sliders
          if (activeProfile === "Curvy") {
            const curveLabelMap: Record<string, string> = {
              "curves[0].amount": "Highlight Detail",
              "curves[1].amount": "Highlight Range",
              "curves[2].amount": "Global Tone",
              "curves[3].amount": "Highlight Focus",
            };

            if (curveLabelMap[key]) niceName = curveLabelMap[key];
          }

          const currentTweak =
            manualTweaks[key] !== undefined ? manualTweaks[key] : 0;

          const atMax = currentTweak >= 1.5;
          const atMin = currentTweak <= -1.5;

          return (
            <div key={key}>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: theme.textPrimary,
                  marginBottom: "0.35rem",
                  fontWeight: 500,
                }}
              >
                {niceName}
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  style={{
                    ...t.button,
                    padding: "0.35rem 0.7rem",
                    minWidth: "32px",
                    opacity: atMin ? 0.4 : 1,
                  }}
                  onClick={() => {
                    if (!atMin) {
                      const newVal = Math.max(-1.5, currentTweak - 0.3);
                      setManualTweaks((prev) => ({
                        ...prev,
                        [key]: newVal,
                      }));
                    }
                  }}
                  disabled={atMin}
                >
                  –
                </button>

                <input
                  type="range"
                  min={-1.5}
                  max={1.5}
                  step={0.3}
                  value={currentTweak}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setManualTweaks((prev) => ({
                      ...prev,
                      [key]: val,
                    }));
                  }}
                  style={{
                    flex: 1,
                    WebkitAppearance: "none",
                    height: "6px",
                    borderRadius: "4px",
                    background: theme.border,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />

                <button
                  style={{
                    ...t.button,
                    padding: "0.35rem 0.7rem",
                    minWidth: "32px",
                    opacity: atMax ? 0.4 : 1,
                  }}
                  onClick={() => {
                    if (!atMax) {
                      const newVal = Math.min(1.5, currentTweak + 0.3);
                      setManualTweaks((prev) => ({
                        ...prev,
                        [key]: newVal,
                      }));
                    }
                  }}
                  disabled={atMax}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "4px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color:
                    currentTweak > 0
                      ? "#ffb74d"
                      : currentTweak < 0
                        ? "#ff6b6b"
                        : theme.textMuted,
                }}
              >
                {currentTweak >= 0 ? "+" : ""}
                {currentTweak.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ---------------------------------------------------------
     MAIN RENDER
  --------------------------------------------------------- */
  return (
    <div
      style={{
        ...t.rightSidebar,
        marginRight: "-8px",      // ← pulls the entire RightUI tighter to the right edge
        paddingRight: "8px",      // ← keeps a tiny internal buffer so content doesn't touch the window edge
      }}
    >
      {/* PREMIUM CENTERED GLITTER TITLE - OUTPUT & DATA */}
      <div
        style={{
          ...t.sectionLabel,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.35rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            background: `
        linear-gradient(90deg, 
          #c0d0e0 0%, 
          #f0f4ff 25%, 
          #c0d0e0 50%, 
          #f0f4ff 75%, 
          #c0d0e0 100%
        ),
        radial-gradient(circle, rgba(255,255,255,0.95) 0.8px, transparent 0) 15% 40%,
        radial-gradient(circle, rgba(255,255,255,0.85) 0.6px, transparent 0) 70% 25%,
        radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 0) 35% 75%
      `,
            backgroundSize: "300% 100%, 200% 200%, 180% 180%, 220% 220%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "glitterFlow 7s linear infinite",
            fontWeight: 600,
            letterSpacing: "0.18em",
            fontSize: "1.02rem",
          }}
        >
          OUTPUT & DATA
        </span>
      </div>

      {profileChangedSinceLastRecipe && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.65rem 0.75rem",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.panelBackground,
            color: theme.textMuted,
            fontSize: "0.82rem",
            lineHeight: 1.35,
          }}
        >
          Profile changed. Generate a new look to update the recipe.
        </div>
      )}

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <div
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            flex: 1,
            textAlign: "center",
            color: rightTab === "data" ? theme.accent : theme.textMuted,
            borderBottom:
              rightTab === "data"
                ? `2px solid ${theme.accent}`
                : "2px solid transparent",
          }}
          onClick={() => setRightTab("data")}
        >
          Data & Tweaks
        </div>

        <div
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            flex: 1,
            textAlign: "center",
            color: rightTab === "export" ? theme.accent : theme.textMuted,
            borderBottom:
              rightTab === "export"
                ? `2px solid ${theme.accent}`
                : "2px solid transparent",
          }}
          onClick={() => setRightTab("export")}
        >
          Exports
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.border} transparent`,
        }}
      >
        {rightTab === "data" && (
          <>
            {/* Original Image Analysis */}
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: theme.panelBackground,
              }}
            >
              <div
                style={{
                  marginBottom: "0.5rem",
                  color: theme.textPrimary,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setAnalysisOpen(!analysisOpen)}
              >
                <GlitterText>Original Image Analysis</GlitterText>
                <span>{analysisOpen ? "▾" : "▸"}</span>
              </div>

              {analysisOpen && renderGroupedAnalysis()}
            </div>

            {/* Active Recipe Raw Data */}
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: theme.panelBackground,
              }}
            >
              <div
                style={{
                  marginBottom: "0.5rem",
                  color: theme.textPrimary,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setRecipeOpen(!recipeOpen)}
              >
                <GlitterText>Active Recipe Raw Data</GlitterText>
                <span>{recipeOpen ? "▾" : "▸"}</span>
              </div>

              {recipeOpen && renderFlatRecipeData()}

              {/* PostDrama */}
              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.85rem",
                  }}
                >
                  <GlitterText style={{ fontSize: "1.08rem" }}>
                    Post-Drama Intensity
                  </GlitterText>

                  <span style={{ 
                    color: theme.textMuted, 
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    marginLeft: "auto"   // pushes it further right
                  }}>
                    {postDrama.toFixed(1)}×
                  </span>
                </div>

                {/* Standard slider */}
                <input
                  type="range"
                  min={POST_DRAMA_MIN}
                  max={POST_DRAMA_MAX}
                  step={POST_DRAMA_STEP}
                  value={postDrama}
                  onChange={(e) =>
                    setPostDrama(Number(e.target.value) as PostDramaValue)
                  }
                  style={{
                    width: "100%",
                    WebkitAppearance: "none",
                    height: "6px",
                    borderRadius: "4px",
                    background: theme.border,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />

                {/* Pixel Dispersion Gradient Box */}
                <div style={{ marginTop: "14px" }}>
                  <canvas
                    ref={(canvas) => {
                      if (!canvas) return;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;

                      const width = 340;
                      const height = 32;
                      canvas.width = width;
                      canvas.height = height;

                      let raf: number;
                      const draw = () => {
                        ctx.clearRect(0, 0, width, height);

                        const progress = Math.max(0, Math.min(1, (postDrama - POST_DRAMA_MIN) / (POST_DRAMA_MAX - POST_DRAMA_MIN)));

                        const grad = ctx.createLinearGradient(0, 0, width, 0);
                        grad.addColorStop(0, "#4cc9b0");
                        grad.addColorStop(progress, "#a0f0ff");
                        grad.addColorStop(1, "#1a1a1a");
                        ctx.fillStyle = grad;
                        ctx.fillRect(0, 0, width, height);

                        // Pixel dispersion
                        ctx.fillStyle = "rgba(160, 240, 255, 0.75)";
                        const particleCount = Math.floor(progress * 180) + 40;

                        for (let i = 0; i < particleCount; i++) {
                          const x = Math.random() * width;
                          const y = Math.random() * height;
                          const size = Math.random() * 2.8 + 0.8;
                          ctx.fillRect(x, y, size, size);
                        }

                        raf = requestAnimationFrame(draw);
                      };

                      draw();

                      return () => cancelAnimationFrame(raf);
                    }}
                    style={{
                      width: "100%",
                      height: "32px",
                      borderRadius: "6px",
                      display: "block",
                    }}
                  />
                </div>

                {/* Restored - | + controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                    color: theme.textMuted,
                    fontSize: "0.8rem",
                  }}
                >
                  <span>–</span>
                  <span>|</span>
                  <span>+</span>
                </div>
              </div>
            </div>

            {renderVariationSelectors()}

            {/* MANUAL TWEAKS */}
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: theme.panelBackground,
                opacity: manualTweaksDrawerLocked ? 0.45 : 1,
              }}
            >
              <div
                title={
                  !canUseManualTweaks && !variationsMode
                    ? "Manual Tweaks become available after generating a look."
                    : undefined
                }
                style={{
                  marginBottom: "0.5rem",
                  color: theme.textPrimary,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: manualTweaksDrawerLocked ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (manualTweaksDrawerLocked) return;
                  setTweaksOpen(!tweaksOpen);
                }}
              >
                <GlitterText>Manual Tweaks</GlitterText>
                <span>{tweaksOpen ? "▾" : "▸"}</span>
              </div>

              {variationsMode && (
                <div
                  style={{
                    color: theme.textMuted,
                    fontSize: "0.82rem",
                    marginBottom: tweaksOpen ? "0.5rem" : 0,
                  }}
                >
                  Disabled while Explore 9 Looks is active.
                </div>
              )}

              {tweaksOpen && canUseManualTweaks && renderManualTweaks()}
            </div>

            <button
              style={{
                ...t.buttonAccent,
                width: "100%",
                marginTop: "0.75rem",
                opacity: manualTweaksDrawerLocked ? 0.45 : 1,
              }}
              onClick={onResetManualTweaks}
              disabled={manualTweaksDrawerLocked}
            >
              Reset All Tweaks
            </button>
          </>
        )}
        {rightTab === "export" && (
          <>
            {/* Extra spacing between tab header and first card */}
            <div style={{ marginTop: "1.25rem" }} />

            {/* ────── SAVE TO DISK CARD ────── */}
            <div
              style={{
                position: "relative",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                padding: "1.8rem 1.25rem 1.25rem",
                marginBottom: "1.5rem",
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            >
              {/* Centered title */}
              <div
                style={{
                  position: "absolute",
                  top: "-11px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: theme.panelBackground,
                  padding: "0 22px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: theme.textPrimary,
                  whiteSpace: "nowrap",
                }}
              >
                Save to Disk
              </div>

              {/* Summary - clean hanging indent without moving the bullet */}
              <div style={{ marginTop: "8px", paddingLeft: "1.6em", fontSize: "0.82rem", color: theme.textMuted, lineHeight: 1.55 }}>
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Full-resolution original image<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Current grade + all adjustments applied<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Original aspect ratio preserved<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                PNG or JPEG (your choice on save)
              </div>
              <div style={{ marginTop: "12px", fontSize: "0.78rem", opacity: 0.65 }}>
                The exported file will contain your exact current creative grade.
              </div>

              <button
                style={{ ...t.buttonAccent, width: "100%", marginTop: "1.25rem" }}
                onClick={onExport}
              >
                Save / Export
              </button>
            </div>

            {/* ────── SAVE TO MY LOOKS CARD ────── */}
            <div
              style={{
                position: "relative",
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                padding: "1.8rem 1.25rem 1.25rem",
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            >
              {/* Centered title */}
              <div
                style={{
                  position: "absolute",
                  top: "-11px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: theme.panelBackground,
                  padding: "0 22px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: theme.textPrimary,
                  whiteSpace: "nowrap",
                }}
              >
                Save to My Looks
              </div>

              {/* Summary - clean hanging indent */}
              <div style={{ marginTop: "8px", paddingLeft: "1.6em", fontSize: "0.82rem", color: theme.textMuted, lineHeight: 1.55 }}>
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Saves the complete current grade state<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Includes recipe, adjustments, manual tweaks, drama settings<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Creates a thumbnail preview<br />
                <span style={{ display: "inline-block", width: "1.6em", marginLeft: "-1.6em" }}>•</span>
                Can be loaded back later with Apply Look
              </div>

              <button
                style={{ ...t.buttonAccent, width: "100%", marginTop: "1.25rem" }}
                onClick={onSaveLook}
              >
                Save Look
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}