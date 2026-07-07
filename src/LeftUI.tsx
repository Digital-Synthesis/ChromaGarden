import { useState, useEffect } from "react";
import { SeasonKey } from "./shared/season-types";
import MyLooksDrawer from "./my-looks/MyLooksDrawer";
import type { MyLook } from "./my-looks/myLooksTypes";
import GlitterText from "./shared/glitterText";

interface LeftUIProps {
  t: any;
  theme: any;
  leftTab: "profiles" | "adjustments";
  setLeftTab: (tab: "profiles" | "adjustments") => void;
  profiles: Record<SeasonKey, string[]>;
  activeSeason: SeasonKey;
  activeProfile: string | null;
  onSeasonSelect: (season: SeasonKey) => void;
  onProfileSelect: (profile: string) => void;
  onRandomize: () => void;
  onGenerateVariations: () => void;
  variationsMode: boolean;
  variationProgress: number;
  preDramaValue: number;
  onPreDramaChange: (value: number) => void;
  myLooks: MyLook[];
  selectedMyLookName: string | null;
  appliedMyLookName: string | null;
  onSelectMyLook: (look: MyLook) => void;
  onApplyMyLook: () => void;
  onRefreshLooks: () => Promise<void>;
  onResetAllAdjustments: () => void;
  onRequestRenameMyLook: () => void;
  onDeleteMyLook: (name: string) => Promise<void>;
  profileDrawerOpenTarget:
    | { type: "season"; season: SeasonKey }
    | { type: "blackAndWhite" }
    | { type: "portrait" }
    | null;
  onProfileDrawerOpenHandled: () => void;
}

export default function LeftUI({
  t,
  theme,
  leftTab,
  setLeftTab,
  profiles,
  activeSeason,
  activeProfile,
  onSeasonSelect,
  onProfileSelect,
  onRandomize,
  onGenerateVariations,
  variationsMode,
  variationProgress,
  preDramaValue,
  onPreDramaChange,
  myLooks,
  selectedMyLookName,
  appliedMyLookName,
  onSelectMyLook,
  onApplyMyLook,
  onRefreshLooks,
  onResetAllAdjustments,
  onRequestRenameMyLook,
  onDeleteMyLook,
  profileDrawerOpenTarget,
  onProfileDrawerOpenHandled,
}: LeftUIProps) {
  const [openSeason, setOpenSeason] = useState<SeasonKey | null>("summer");
  const [openBW, setOpenBW] = useState<boolean>(false);

  // NEW — Portrait drawer state
  const [openPortrait, setOpenPortrait] = useState<boolean>(false);

  useEffect(() => {
    if (!profileDrawerOpenTarget) return;

    if (profileDrawerOpenTarget.type === "season") {
      setOpenSeason(profileDrawerOpenTarget.season);
      setOpenBW(false);
      setOpenPortrait(false);
    } else if (profileDrawerOpenTarget.type === "blackAndWhite") {
      setOpenBW(true);
      setOpenSeason(null);
      setOpenPortrait(false);
    } else if (profileDrawerOpenTarget.type === "portrait") {
      setOpenPortrait(true);
      setOpenSeason(null);
      setOpenBW(false);
    }

    onProfileDrawerOpenHandled();
  }, [profileDrawerOpenTarget, onProfileDrawerOpenHandled]);

  const [basicOpen, setBasicOpen] = useState<boolean>(true);
  const [toneOpen, setToneOpen] = useState<boolean>(false);
  const [colorBalanceOpen, setColorBalanceOpen] = useState<boolean>(false);
  const [colorIntensityOpen, setColorIntensityOpen] = useState<boolean>(false);
  const [presenceOpen, setPresenceOpen] = useState<boolean>(false);
  const [curvesOpen, setCurvesOpen] = useState<boolean>(false);
  const [creativeCurvesOpen, setCreativeCurvesOpen] = useState<boolean>(false);

  const nudge = (
    value: number,
    step: number,
    min: number,
    max: number,
    setter: (v: number) => void
  ) => {
    const next = Math.min(max, Math.max(min, value + step));
    setter(next);
  };

  const handleSeasonClick = (season: SeasonKey) => {
    const next = openSeason === season ? null : season;
    setOpenSeason(next);
    onSeasonSelect(season);
  };

  /* ---------------------------------------------------------
     SHARED SLIDER
  --------------------------------------------------------- */
  const renderSlider = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    min: number,
    max: number,
    step: number
  ) => {
    return (
      <div style={{ marginBottom: "1.0rem" }}>
        <div
          style={{
            marginBottom: "0.35rem",
            color: theme.textPrimary,
            fontWeight: 600,
          }}
        >
          {label}
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            color: theme.textMuted,
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            userSelect: "none",
          }}
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() => nudge(value, -step, min, max, onChange)}
          >
            –
          </span>
          <span>|</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => nudge(value, +step, min, max, onChange)}
          >
            +
          </span>
        </div>

        <div
          style={{
            marginTop: "0.25rem",
            fontSize: "0.8rem",
            color: theme.textMuted,
            textAlign: "center",
            letterSpacing: "0.03em",
          }}
        >
          {value.toFixed(2)}
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------
     RENDER SEASON
  --------------------------------------------------------- */
  const renderSeason = (season: SeasonKey, label: string) => {
    const isOpen = openSeason === season;
    const seasonProfiles = profiles[season] || [];

    return (
      <div key={season} style={{ marginBottom: "1rem" }}>
        <button
          style={{
            ...t.button,
            width: "100%",
            textAlign: "left",
            border: `1px solid ${isOpen ? theme.accent : theme.border}`,
            color: isOpen ? theme.accent : theme.textPrimary,
            borderRadius: isOpen ? "6px 6px 0 0" : "6px",
            borderBottomColor: isOpen ? theme.border : theme.border,
          }}
          onClick={() => handleSeasonClick(season)}
        >
          {label}
        </button>

        <div
          style={{
            overflow: "hidden",
            transition: "max-height 0.28s ease-out, opacity 0.28s ease-out",
            maxHeight: isOpen ? "500px" : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              padding: "0.6rem",
              transform: isOpen ? "translateY(0)" : "translateY(-8px)",
              transition: "transform 0.28s ease-out",
            }}
          >
            {seasonProfiles.map((profile, index) => (
              <button
                key={profile}
                onClick={() => onProfileSelect(profile)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  padding: "0.45rem 0.6rem",
                  borderRadius: "6px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: t.button.backgroundColor,
                  color: theme.textPrimary,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  cursor: "pointer",
                  marginBottom: index < seasonProfiles.length - 1 ? "0.5rem" : 0,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      activeSeason === season &&
                        activeProfile === profile
                        ? theme.accent
                        : theme.textMuted,
                    boxShadow:
                      activeSeason === season &&
                        activeProfile === profile
                        ? `0 0 6px ${theme.accent}`
                        : "none",
                    transition: "0.15s ease",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "0.8rem",
                    textAlign: "left",
                  }}
                >
                  {profile}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------
     B&W PROFILES
  --------------------------------------------------------- */
  const renderBWProfiles = () => {
    const isOpen = openBW;
    const isActiveStrong = activeProfile === "Strong";
    const isActiveCurvy = activeProfile === "Curvy";

    return (
      <div style={{ marginBottom: "1rem" }}>
        <button
          style={{
            ...t.button,
            width: "100%",
            textAlign: "left",
            border: `1px solid ${isOpen ? theme.accent : theme.border}`,
            color: isOpen ? theme.accent : theme.textPrimary,
            borderRadius: isOpen ? "6px 6px 0 0" : "6px",
            borderBottomColor: isOpen ? theme.border : theme.border,
          }}
          onClick={() => setOpenBW((v) => !v)}
        >
          Profiles
        </button>

        <div
          style={{
            overflow: "hidden",
            transition: "max-height 0.28s ease-out, opacity 0.28s ease-out",
            maxHeight: isOpen ? "300px" : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              padding: "0.6rem",
            }}
          >
            {/* Strong */}
            <button
              onClick={() => onProfileSelect("Strong")}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: t.button.backgroundColor,
                color: theme.textPrimary,
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isActiveStrong
                    ? theme.accent
                    : theme.textMuted,
                  boxShadow: isActiveStrong
                    ? `0 0 6px ${theme.accent}`
                    : "none",
                }}
              />
              <span style={{ fontSize: "0.8rem" }}>
                Strong - Consistent Filmic
              </span>
            </button>

            {/* Curvy */}
            <button
              onClick={() => onProfileSelect("Curvy")}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: t.button.backgroundColor,
                color: theme.textPrimary,
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isActiveCurvy
                    ? theme.accent
                    : theme.textMuted,
                  boxShadow: isActiveCurvy
                    ? `0 0 6px ${theme.accent}`
                    : "none",
                }}
              />
              <span style={{ fontSize: "0.8rem" }}>Curvy</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------
     PORTRAIT PROFILES — Human Essence (NEW)
  --------------------------------------------------------- */
  const renderPortraitProfiles = () => {
    const isOpen = openPortrait;
    const isActiveHumanEssence = activeProfile === "Human Essence";

    return (
      <div style={{ marginBottom: "1rem" }}>
        <button
          style={{
            ...t.button,
            width: "100%",
            textAlign: "left",
            border: `1px solid ${isOpen ? theme.accent : theme.border}`,
            color: isOpen ? theme.accent : theme.textPrimary,
            borderRadius: isOpen ? "6px 6px 0 0" : "6px",
            borderBottomColor: isOpen ? theme.border : theme.border,
          }}
          onClick={() => setOpenPortrait((v) => !v)}
        >
          Profiles
        </button>

        <div
          style={{
            overflow: "hidden",
            transition: "max-height 0.28s ease-out, opacity 0.28s ease-out",
            maxHeight: isOpen ? "300px" : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              padding: "0.6rem",
            }}
          >
            {/* Human Essence — single full-width button */}
            <button
              onClick={() => {
                onSeasonSelect("portrait");          // <-- REQUIRED FIX
                onProfileSelect("Human Essence");    // <-- REQUIRED FIX
              }}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: t.button.backgroundColor,
                color: theme.textPrimary,
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isActiveHumanEssence
                    ? theme.accent
                    : theme.textMuted,
                  boxShadow: isActiveHumanEssence
                    ? `0 0 6px ${theme.accent}`
                    : "none",
                  transition: "0.15s ease",
                }}
              />
              <span style={{ fontSize: "0.8rem" }}>Human Essence</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------
     VARIATIONS BUTTON LABEL
  --------------------------------------------------------- */
  const getVariationsButtonLabel = () => {
    if (!activeProfile) return "Explore 9 Looks";
    if (!variationsMode) return "Explore 9 Looks";
    if (variationProgress >= 100) return "Explore 9 More…";
    return `Generating… ${variationProgress}%`;
  };

  const isGeneratingVariations =
    variationsMode && variationProgress < 100;
  const isMyLookApplied = Boolean(appliedMyLookName);

  const isButtonDisabled =
    !activeProfile || isGeneratingVariations || isMyLookApplied;

  const explore9Tooltip =
    isMyLookApplied && !isGeneratingVariations
      ? "9-grid disabled when My Looks are applied"
      : undefined;

  const renderPreDramaSlider = () => {
    const min = 0;
    const max = 9;
    const step = 0.1;
    const fill = ((preDramaValue - min) / (max - min)) * 100;
    const multiplier = 1 + preDramaValue;

    return (
      <div style={{ marginBottom: "2.4rem" }}>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1rem",
          }}
        >
          <GlitterText style={{ 
            fontSize: "1.08rem",
            whiteSpace: "nowrap"        // ← This forces it to one line
          }}>
            Pre-Drama Intensity
          </GlitterText>

          {/* Engine Icon */}
          <svg 
            width="26" 
            height="26" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginTop: "2px" }}
          >
            <rect x="3" y="7" width="18" height="12" rx="2" stroke="#ffb74d" strokeWidth="1.6"/>
            <rect x="6" y="3" width="3" height="6" rx="0.5" stroke="#ffb74d" strokeWidth="1.4"/>
            <rect x="11" y="3" width="3" height="6" rx="0.5" stroke="#ffb74d" strokeWidth="1.4"/>
            <rect x="16" y="3" width="3" height="6" rx="0.5" stroke="#ffb74d" strokeWidth="1.4"/>
            <circle cx="19" cy="13" r="3" stroke="#ffb74d" strokeWidth="1.3"/>
            <path d="M8 13 L16 13" stroke="#ffb74d" strokeWidth="1.1"/>
            <circle cx="8" cy="17" r="1.8" fill="#ffb74d"/>
          </svg>

          <span style={{ 
            color: theme.textMuted, 
            fontSize: "0.9rem",
            fontWeight: 500 
          }}>
            {multiplier.toFixed(1)}×
          </span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={preDramaValue}
          onChange={(e) => onPreDramaChange(Number(e.target.value))}
          style={{
            width: "100%",
            WebkitAppearance: "none",
            height: "6px",
            borderRadius: "4px",
            background: `linear-gradient(to right, ${theme.accent} 0%, ${theme.accent} ${fill}%, ${theme.border} ${fill}%, ${theme.border} 100%)`,
            outline: "none",
            cursor: "pointer",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            color: theme.textMuted,
            fontSize: "0.82rem",
            letterSpacing: "0.05em",
            userSelect: "none",
          }}
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              nudge(preDramaValue, -step, min, max, onPreDramaChange)
            }
          >
            –
          </span>
          <span>|</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              nudge(preDramaValue, +step, min, max, onPreDramaChange)
            }
          >
            +
          </span>
        </div>

        <div
          style={{
            marginTop: "0.35rem",
            fontSize: "0.8rem",
            color: theme.textMuted,
            letterSpacing: "0.03em",
          }}
        >
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------
     MAIN RENDER
  --------------------------------------------------------- */
  return (
    <div
      style={{
        ...t.leftSidebar,
        marginLeft: "0px",           // ← pull LeftUI tighter to the left edge
        paddingLeft: "8px",           // ← keep a tiny bit of internal padding so content doesn't touch the edge
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: `${theme.border} transparent`,
      }}
    >
      {/* PREMIUM CENTERED GLITTER TITLE - WORKSPACE CONTROLS */}
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
            whiteSpace: "nowrap",                    // ← Forces single line
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
            letterSpacing: "0.18em",          // slightly tighter
            fontSize: "1.02rem",              // slightly smaller to fit on one line
          }}
        >
          WORKSPACE CONTROLS
        </span>
      </div>

      {/* TAB BAR */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <div
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            flex: 1,
            textAlign: "center",
            color: leftTab === "profiles" ? theme.accent : theme.textMuted,
            borderBottom:
              leftTab === "profiles"
                ? `2px solid ${theme.accent}`
                : "2px solid transparent",
          }}
          onClick={() => setLeftTab("profiles")}
        >
          Color Profiles
        </div>

        <div
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            flex: 1,
            textAlign: "center",
            color: leftTab === "adjustments" ? theme.accent : theme.textMuted,
            borderBottom:
              leftTab === "adjustments"
                ? `2px solid ${theme.accent}`
                : "2px solid transparent",
          }}
          onClick={() => setLeftTab("adjustments")}
        >
          Adjustments
        </div>
      </div>

      {/* PROFILES TAB */}
      {leftTab === "profiles" && (
        <>
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

          <button
            style={{
              ...t.buttonAccent,
              width: "100%",
              marginBottom: "0.75rem",
            }}
            onClick={onRandomize}
            disabled={!activeProfile}
          >
            Randomize Look
          </button>

          <button
            style={{
              ...t.buttonAccent,
              width: "100%",
              marginBottom: "1.25rem",
              backgroundColor: isButtonDisabled
                ? "rgba(255,255,255,0.05)"
                : t.buttonAccent.backgroundColor,
              opacity: isButtonDisabled ? 0.4 : 1,
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
            }}
            title={explore9Tooltip}
            onClick={() => !isButtonDisabled && onGenerateVariations()}
          >
            {getVariationsButtonLabel()}
          </button>

          {renderPreDramaSlider()}

          {/* === GLITTER METALLIC SECTION HEADER === */}
          <div
            style={{
              ...t.sectionLabel,
              position: "relative",
              display: "inline-block",
              marginTop: "1.35rem",
              marginBottom: "0.45rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
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
                letterSpacing: "0.20em",
              }}
            >
              Season Profiles
            </span>

            <style>{`
    @keyframes glitterFlow {
      0%   { background-position: 0% 50%, 0% 0%, 100% 100%, 0% 50%; }
      100% { background-position: 300% 50%, 200% 200%, 0% 0%, 220% 220%; }
    }
  `}</style>
          </div>
          {renderSeason("summer", "Summer")}
          {renderSeason("spring", "Spring")}
          {renderSeason("autumn", "Autumn")}
          {renderSeason("winter", "Winter")}

          {/* === 14-COLOR CYCLING METALLIC PULSE - Black & White === */}
          <div
            style={{
              ...t.sectionLabel,
              position: "relative",
              display: "inline-block",
              marginTop: "1.35rem",
              marginBottom: "0.45rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
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
                letterSpacing: "0.20em",
              }}
            >
              Black & White
            </span>

            <style>{`
    @keyframes glitterFlow {
      0%   { background-position: 0% 50%, 0% 0%, 100% 100%, 0% 50%; }
      100% { background-position: 300% 50%, 200% 200%, 0% 0%, 220% 220%; }
    }
  `}</style>
          </div>
          {renderBWProfiles()}

          <div
            style={{
              ...t.sectionLabel,
              position: "relative",
              display: "inline-block",
              marginTop: "1.35rem",
              marginBottom: "0.45rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
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
                letterSpacing: "0.20em",
              }}
            >
              Portrait
            </span>

            <style>{`
    @keyframes glitterFlow {
      0%   { background-position: 0% 50%, 0% 0%, 100% 100%, 0% 50%; }
      100% { background-position: 300% 50%, 200% 200%, 0% 0%, 220% 220%; }
    }
  `}</style>
          </div>
          {renderPortraitProfiles()}

          <div
            style={{
              ...t.sectionLabel,
              position: "relative",
              display: "inline-block",
              marginTop: "1.35rem",
              marginBottom: "0.45rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
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
                letterSpacing: "0.20em",
              }}
            >
              My Looks Library
            </span>

            <style>{`
    @keyframes glitterFlow {
      0%   { background-position: 0% 50%, 0% 0%, 100% 100%, 0% 50%; }
      100% { background-position: 300% 50%, 200% 200%, 0% 0%, 220% 220%; }
    }
  `}</style>
          </div>
          <MyLooksDrawer
            t={t}
            theme={theme}
            looks={myLooks}
            selectedLookName={selectedMyLookName}
            onSelectLook={onSelectMyLook}
            onApplyLook={onApplyMyLook}
            onRefreshLooks={onRefreshLooks}
            onRequestRenameMyLook={onRequestRenameMyLook}
            onDeleteMyLook={onDeleteMyLook}
          />
        </>
      )}

      {/* ADJUSTMENTS TAB */}
      {leftTab === "adjustments" && (
        <>
          {/* CUSTOM THUMB */}
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

          {/* BASIC */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setBasicOpen((v) => !v)}
            >
              <GlitterText>Basic Exposure</GlitterText>
              <span>{basicOpen ? "▾" : "▸"}</span>
            </div>

            {basicOpen && (
              <div style={{ marginTop: "1.25rem" }}>   {/* ← This is the key change */}
                {renderSlider(
                  "Exposure",
                  t.exposureValue ?? 0,
                  t.onExposureChange,
                  -5,
                  5,
                  0.1
                )}
                {renderSlider(
                  "Contrast",
                  t.contrastValue ?? 0,
                  t.onContrastChange,
                  -1,
                  1,
                  0.05
                )}
              </div>
            )}
          </div>

          {/* TONE */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setToneOpen((v) => !v)}
            >
              <GlitterText>Tone Curve</GlitterText>
              <span>{toneOpen ? "▾" : "▸"}</span>
            </div>

            {toneOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Highlights",
                  t.highlightsValue ?? 0,
                  t.onHighlightsChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Whites",
                  t.whitesValue ?? 0,
                  t.onWhitesChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Blacks",
                  t.blacksValue ?? 0,
                  t.onBlacksChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          {/* COLOR BALANCE */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setColorBalanceOpen((v) => !v)}
            >
              <GlitterText>Color Balance</GlitterText>
              <span>{colorBalanceOpen ? "▾" : "▸"}</span>
            </div>

            {colorBalanceOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Temperature",
                  t.temperatureValue ?? 0,
                  t.onTemperatureChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Tint",
                  t.tintValue ?? 0,
                  t.onTintChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          {/* COLOR INTENSITY */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setColorIntensityOpen((v) => !v)}
            >
              <GlitterText>Color Intensity</GlitterText>
              <span>{colorIntensityOpen ? "▾" : "▸"}</span>
            </div>

            {colorIntensityOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Vibrance",
                  t.vibranceValue ?? 0,
                  t.onVibranceChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          {/* PRESENCE */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setPresenceOpen((v) => !v)}
            >
              <GlitterText>Presence</GlitterText>
              <span>{presenceOpen ? "▾" : "▸"}</span>
            </div>

            {presenceOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Clarity",
                  t.clarityValue ?? 0,
                  t.onClarityChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Texture",
                  t.textureValue ?? 0,
                  t.onTextureChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Dehaze",
                  t.dehazeValue ?? 0,
                  t.onDehazeChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          {/* COMMON CURVES */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setCurvesOpen((v) => !v)}
            >
              <GlitterText>Common Curves</GlitterText>
              <span>{curvesOpen ? "▾" : "▸"}</span>
            </div>

            {curvesOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Parametric Curve",
                  t.parametricCurveValue ?? 0,
                  t.onParametricCurveChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "RGB Composite",
                  t.rgbCompositeValue ?? 0,
                  t.onRgbCompositeChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Red Channel",
                  t.rgbRValue ?? 0,
                  t.onRgbRChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Green Channel",
                  t.rgbGValue ?? 0,
                  t.onRgbGChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Blue Channel",
                  t.rgbBValue ?? 0,
                  t.onRgbBChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          {/* CREATIVE CURVES */}
          <div
            style={{
              backgroundColor: theme.panelBackground,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: "0.5rem",
                color: theme.textPrimary,
                fontWeight: 600,
              }}
              onClick={() => setCreativeCurvesOpen((v) => !v)}
            >
              <GlitterText>Creative Curves</GlitterText>
              <span>{creativeCurvesOpen ? "▾" : "▸"}</span>
            </div>

            {creativeCurvesOpen && (
              <div style={{ marginTop: "1.25rem" }}>
                {renderSlider(
                  "Filmic Toe",
                  t.filmicToeValue ?? 0,
                  t.onFilmicToeChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Filmic Shoulder",
                  t.filmicShoulderValue ?? 0,
                  t.onFilmicShoulderChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Highlight Rolloff",
                  t.highlightRolloffValue ?? 0,
                  t.onHighlightRolloffChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Shadow Lift",
                  t.shadowLiftValue ?? 0,
                  t.onShadowLiftChange,
                  -1,
                  1,
                  0.01
                )}
                {renderSlider(
                  "Color Separation",
                  t.colorSeparationValue ?? 0,
                  t.onColorSeparationChange,
                  -1,
                  1,
                  0.01
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            style={{
              ...t.buttonAccent,
              width: "100%",
              marginBottom: "1rem",
            }}
            onClick={onResetAllAdjustments}
          >
            Reset All Adjustments
          </button>
        </>
      )}
    </div>
  );
}