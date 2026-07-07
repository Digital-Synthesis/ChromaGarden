import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const forestShadePassMap: Map<string, number> = new Map();

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
   FOREST SHADE — Winter Woods
--------------------------------------------------------- */
export function applyWinterForestShadeGrade(
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
      base: { exposure: -0.05, contrast: 0.1, temperature: -18, tint: -6, saturation: -4 },
      params: { coolShadowDepth: 0.22, greenBlueCast: 0.14, warmHighlightLift: 0.06 },
    },
    {
      label: "Look 2",
      base: { exposure: -0.08, contrast: 0.14, temperature: -22, tint: -10, saturation: -8 },
      params: { coolShadowDepth: 0.28, greenBlueCast: 0.18, warmHighlightLift: 0.08 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.03, contrast: 0.08, temperature: -14, tint: -4, saturation: -2 },
      params: { coolShadowDepth: 0.18, greenBlueCast: 0.1, warmHighlightLift: 0.04 },
    },
    {
      label: "Look 4",
      base: { exposure: -0.1, contrast: 0.16, temperature: -26, tint: -12, saturation: -10 },
      params: { coolShadowDepth: 0.32, greenBlueCast: 0.22, warmHighlightLift: 0.1 },
    },
    {
      label: "Look 5",
      base: { exposure: -0.12, contrast: 0.2, temperature: -30, tint: -14, saturation: -12 },
      params: { coolShadowDepth: 0.38, greenBlueCast: 0.26, warmHighlightLift: 0.12 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.02, contrast: 0.06, temperature: -10, tint: -2, saturation: -1 },
      params: { coolShadowDepth: 0.14, greenBlueCast: 0.08, warmHighlightLift: 0.03 },
    },
    {
      label: "Look 7",
      base: { exposure: -0.15, contrast: 0.24, temperature: -34, tint: -16, saturation: -14 },
      params: { coolShadowDepth: 0.44, greenBlueCast: 0.3, warmHighlightLift: 0.14 },
    },
    {
      label: "Look 8",
      base: { exposure: -0.06, contrast: 0.12, temperature: -20, tint: -8, saturation: -6 },
      params: { coolShadowDepth: 0.24, greenBlueCast: 0.16, warmHighlightLift: 0.07 },
    },
    {
      label: "Look 9",
      base: { exposure: -0.18, contrast: 0.28, temperature: -38, tint: -18, saturation: -16 },
      params: { coolShadowDepth: 0.5, greenBlueCast: 0.34, warmHighlightLift: 0.16 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (forestShadePassMap.get(chosen.label) ?? 0) + 1;
  forestShadePassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.coolShadowDepth = jitter(params.coolShadowDepth, 0.02, preDramaMultiplier);
    params.greenBlueCast = jitter(params.greenBlueCast, 0.02, preDramaMultiplier);
    params.warmHighlightLift = jitter(params.warmHighlightLift, 0.02, preDramaMultiplier);
  }

  const debug: WinterRecipeDebug = {
    personalityId: "Forest Shade",
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