import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING (same system as Summer)
--------------------------------------------------------- */
const coldDaylightPassMap: Map<string, number> = new Map();

/* ---------------------------------------------------------
   JITTER (copied from Summer behavior)
--------------------------------------------------------- */
function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

/* ---------------------------------------------------------
   COLD DAYLIGHT — Classic Winter Sun
--------------------------------------------------------- */
export function applyWinterColdDaylightGrade(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  preDramaMultiplier: number = 1
) {
  if (!originalImageRef.current) return null;

  const analysis = analyzeOriginalImageFromElement(originalImageRef.current);

  const luma = analysis.avgLuma;
  const shadows = analysis.shadowPercent;
  const highlights = analysis.highlightPercent;
  const sat = analysis.avgSaturation;

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.0, contrast: 0.12, temperature: -12, tint: -4, saturation: -6 },
      params: { blueShadowBoost: 0.18, highlightNeutralLift: 0.06, snowCrispness: 0.14 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.05, contrast: 0.16, temperature: -18, tint: -6, saturation: -10 },
      params: { blueShadowBoost: 0.24, highlightNeutralLift: 0.1, snowCrispness: 0.18 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.03, contrast: 0.2, temperature: -20, tint: -8, saturation: -12 },
      params: { blueShadowBoost: 0.28, highlightNeutralLift: 0.12, snowCrispness: 0.22 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.0, contrast: 0.24, temperature: -15, tint: -2, saturation: -4 },
      params: { blueShadowBoost: 0.14, highlightNeutralLift: 0.04, snowCrispness: 0.1 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.08, contrast: 0.28, temperature: -22, tint: -10, saturation: -14 },
      params: { blueShadowBoost: 0.32, highlightNeutralLift: 0.14, snowCrispness: 0.26 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.05, contrast: 0.18, temperature: -10, tint: 0, saturation: -2 },
      params: { blueShadowBoost: 0.1, highlightNeutralLift: 0.02, snowCrispness: 0.08 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.12, contrast: 0.3, temperature: -25, tint: -12, saturation: -16 },
      params: { blueShadowBoost: 0.36, highlightNeutralLift: 0.16, snowCrispness: 0.3 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.02, contrast: 0.22, temperature: -14, tint: -3, saturation: -5 },
      params: { blueShadowBoost: 0.16, highlightNeutralLift: 0.05, snowCrispness: 0.12 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.15, contrast: 0.34, temperature: -28, tint: -14, saturation: -18 },
      params: { blueShadowBoost: 0.4, highlightNeutralLift: 0.18, snowCrispness: 0.34 },
    },
  ];

  /* ---------------------------------------------------------
     PICK LOOK
  --------------------------------------------------------- */
  const chosen = looks[Math.floor(Math.random() * looks.length)];

  /* ---------------------------------------------------------
     PASS LOGIC (identical to Summer)
  --------------------------------------------------------- */
  const currentPass = (coldDaylightPassMap.get(chosen.label) ?? 0) + 1;
  coldDaylightPassMap.set(chosen.label, currentPass);

  /* ---------------------------------------------------------
     MUTATE VALUES ON PASS ≥ 2 (Summer-style jitter)
  --------------------------------------------------------- */
  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    // Base jitter (mirrors Summer intensity)
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    // Param jitter (Winter-specific params, Summer-style amounts)
    params.blueShadowBoost = jitter(params.blueShadowBoost, 0.02, preDramaMultiplier);
    params.highlightNeutralLift = jitter(params.highlightNeutralLift, 0.02, preDramaMultiplier);
    params.snowCrispness = jitter(params.snowCrispness, 0.02, preDramaMultiplier);
  }

  /* ---------------------------------------------------------
     BUILD DEBUG OBJECT
  --------------------------------------------------------- */
  const debug: WinterRecipeDebug = {
    personalityId: "Cold Daylight",
    label: chosen.label,
    pass: currentPass,
    base, // ✅ kept for type compatibility, not used for tweaks
    params: {
      // ⭐ Base controls exposed for Manual Tweaks
      exposure: base.exposure,
      contrast: base.contrast,
      temperature: base.temperature,
      tint: base.tint,
      saturation: base.saturation,

      // ⭐ Existing creative parameters
      ...params,

      // ✅ Adaptive metadata (unchanged)
      adaptive: {
        avgLuma: luma,
        shadowPercent: shadows,
        highlightPercent: highlights,
        avgSaturation: sat,
      },
    },
  };

  /* ---------------------------------------------------------
     APPLY ENGINE
  --------------------------------------------------------- */
  applyWinterHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}