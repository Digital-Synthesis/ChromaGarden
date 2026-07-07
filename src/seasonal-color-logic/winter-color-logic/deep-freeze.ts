import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const deepFreezePassMap: Map<string, number> = new Map();

/* ---------------------------------------------------------
   JITTER
--------------------------------------------------------- */
function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

/* ---------------------------------------------------------
   DEEP FREEZE — Winter Cinematic Deep
--------------------------------------------------------- */
export function applyWinterDeepFreezeGrade(
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
      base: { exposure: -0.1, contrast: 0.3, temperature: -20, tint: -6, saturation: -4 },
      params: { coldBlackDepth: 0.28, icyBluePunch: 0.18, edgeCrispness: 0.14 },
    },
    {
      label: "Look 2",
      base: { exposure: -0.14, contrast: 0.36, temperature: -26, tint: -10, saturation: -8 },
      params: { coldBlackDepth: 0.34, icyBluePunch: 0.22, edgeCrispness: 0.18 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.08, contrast: 0.26, temperature: -16, tint: -4, saturation: -2 },
      params: { coldBlackDepth: 0.22, icyBluePunch: 0.14, edgeCrispness: 0.1 },
    },
    {
      label: "Look 4",
      base: { exposure: -0.18, contrast: 0.4, temperature: -30, tint: -12, saturation: -10 },
      params: { coldBlackDepth: 0.4, icyBluePunch: 0.26, edgeCrispness: 0.22 },
    },
    {
      label: "Look 5",
      base: { exposure: -0.22, contrast: 0.46, temperature: -34, tint: -14, saturation: -12 },
      params: { coldBlackDepth: 0.48, icyBluePunch: 0.32, edgeCrispness: 0.28 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.06, contrast: 0.22, temperature: -12, tint: -2, saturation: -1 },
      params: { coldBlackDepth: 0.18, icyBluePunch: 0.1, edgeCrispness: 0.08 },
    },
    {
      label: "Look 7",
      base: { exposure: -0.26, contrast: 0.52, temperature: -38, tint: -16, saturation: -14 },
      params: { coldBlackDepth: 0.54, icyBluePunch: 0.38, edgeCrispness: 0.34 },
    },
    {
      label: "Look 8",
      base: { exposure: -0.12, contrast: 0.28, temperature: -18, tint: -6, saturation: -5 },
      params: { coldBlackDepth: 0.24, icyBluePunch: 0.16, edgeCrispness: 0.12 },
    },
    {
      label: "Look 9",
      base: { exposure: -0.3, contrast: 0.58, temperature: -42, tint: -18, saturation: -16 },
      params: { coldBlackDepth: 0.6, icyBluePunch: 0.44, edgeCrispness: 0.4 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (deepFreezePassMap.get(chosen.label) ?? 0) + 1;
  deepFreezePassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.coldBlackDepth = jitter(params.coldBlackDepth, 0.02, preDramaMultiplier);
    params.icyBluePunch = jitter(params.icyBluePunch, 0.02, preDramaMultiplier);
    params.edgeCrispness = jitter(params.edgeCrispness, 0.02, preDramaMultiplier);
  }

  const debug: WinterRecipeDebug = {
    personalityId: "Deep Freeze",
   label: chosen.label,
  pass: currentPass,

  // Keep base for type compatibility
  base,

  params: {
    // ⭐ Base controls exposed for Manual Tweaks
    exposure: base.exposure,
    contrast: base.contrast,
    temperature: base.temperature,
    tint: base.tint,
    saturation: base.saturation,

    // ⭐ Existing creative parameters
    ...params,

    // ⭐ Adaptive metadata
    adaptive: {
      avgLuma: luma,
      shadowPercent: shadows,
      highlightPercent: highlights,
      avgSaturation: sat,
    },
  },
};

  applyWinterHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}