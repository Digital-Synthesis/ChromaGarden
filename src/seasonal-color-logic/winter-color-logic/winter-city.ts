import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const winterCityPassMap: Map<string, number> = new Map();

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
   WINTER CITY — Urban Winter
--------------------------------------------------------- */
export function applyWinterCityGrade(
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
      base: { exposure: 0.0, contrast: 0.1, temperature: -6, tint: -2, saturation: -4 },
      params: { steelBlueShift: 0.1, concreteNeutralLift: 0.06, urbanShadowControl: 0.08 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.04, contrast: 0.14, temperature: -10, tint: -4, saturation: -6 },
      params: { steelBlueShift: 0.14, concreteNeutralLift: 0.1, urbanShadowControl: 0.12 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.02, contrast: 0.08, temperature: -4, tint: -1, saturation: -2 },
      params: { steelBlueShift: 0.08, concreteNeutralLift: 0.04, urbanShadowControl: 0.06 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.06, contrast: 0.18, temperature: -12, tint: -6, saturation: -8 },
      params: { steelBlueShift: 0.18, concreteNeutralLift: 0.12, urbanShadowControl: 0.14 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.1, contrast: 0.22, temperature: -16, tint: -8, saturation: -10 },
      params: { steelBlueShift: 0.22, concreteNeutralLift: 0.16, urbanShadowControl: 0.18 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.01, contrast: 0.06, temperature: -2, tint: 0, saturation: -1 },
      params: { steelBlueShift: 0.06, concreteNeutralLift: 0.03, urbanShadowControl: 0.04 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.12, contrast: 0.26, temperature: -20, tint: -10, saturation: -12 },
      params: { steelBlueShift: 0.26, concreteNeutralLift: 0.2, urbanShadowControl: 0.22 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.02, contrast: 0.12, temperature: -8, tint: -3, saturation: -5 },
      params: { steelBlueShift: 0.12, concreteNeutralLift: 0.08, urbanShadowControl: 0.1 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.15, contrast: 0.3, temperature: -24, tint: -12, saturation: -14 },
      params: { steelBlueShift: 0.3, concreteNeutralLift: 0.24, urbanShadowControl: 0.26 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (winterCityPassMap.get(chosen.label) ?? 0) + 1;
  winterCityPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.steelBlueShift = jitter(params.steelBlueShift, 0.02, preDramaMultiplier);
    params.concreteNeutralLift = jitter(params.concreteNeutralLift, 0.02, preDramaMultiplier);
    params.urbanShadowControl = jitter(params.urbanShadowControl, 0.02, preDramaMultiplier);
  }

  const debug: WinterRecipeDebug = {
    personalityId: "Winter City",
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