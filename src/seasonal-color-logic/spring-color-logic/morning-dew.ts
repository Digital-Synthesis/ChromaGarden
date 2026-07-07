import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const morningDewPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringMorningDewGrade(
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

  /* ---------------------------------------------------------
     MORNING DEW — STRONG CREATIVE SEPARATION
     Cool, misty, low-contrast, desaturated, soft morning air
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.02, contrast: -0.08, temperature: -6, tint: -2, saturation: -8 },
      params: { mistDensity: 0.32, dewLift: 0.22, coolAir: 0.18 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.03, contrast: -0.07, temperature: -5, tint: -1, saturation: -9 },
      params: { mistDensity: 0.34, dewLift: 0.24, coolAir: 0.2 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.00, contrast: -0.09, temperature: -7, tint: -3, saturation: -7 },
      params: { mistDensity: 0.30, dewLift: 0.20, coolAir: 0.16 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.04, contrast: -0.06, temperature: -4, tint: -1, saturation: -10 },
      params: { mistDensity: 0.36, dewLift: 0.26, coolAir: 0.22 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.05, contrast: -0.05, temperature: -3, tint: 0, saturation: -11 },
      params: { mistDensity: 0.38, dewLift: 0.28, coolAir: 0.24 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.02, contrast: -0.10, temperature: -8, tint: -4, saturation: -6 },
      params: { mistDensity: 0.28, dewLift: 0.18, coolAir: 0.14 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.06, contrast: -0.04, temperature: -2, tint: 1, saturation: -12 },
      params: { mistDensity: 0.40, dewLift: 0.30, coolAir: 0.26 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.01, contrast: -0.07, temperature: -5, tint: -2, saturation: -9 },
      params: { mistDensity: 0.33, dewLift: 0.23, coolAir: 0.19 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.07, contrast: -0.03, temperature: -1, tint: 2, saturation: -13 },
      params: { mistDensity: 0.42, dewLift: 0.32, coolAir: 0.28 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (morningDewPassMap.get(chosen.label) ?? 0) + 1;
  morningDewPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  /* ---------------------------------------------------------
     PASS 2+ — STRONGER JITTER FOR HUMAN-VISIBLE SHIFTS
  --------------------------------------------------------- */
  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.03, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.04, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 3, preDramaMultiplier);
    base.tint = jitter(base.tint, 2, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 3, preDramaMultiplier);

    params.mistDensity = jitter(params.mistDensity, 0.04, preDramaMultiplier);
    params.dewLift = jitter(params.dewLift, 0.04, preDramaMultiplier);
    params.coolAir = jitter(params.coolAir, 0.04, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Morning Dew",
label: chosen.label,
  pass: currentPass,

  // Keep base for type compatibility (RightUI ignores base.* for seasonal)
  base,

  params: {
    // ⭐ Base controls exposed for Manual Tweaks
    exposure: base.exposure,
    contrast: base.contrast,
    temperature: base.temperature,
    tint: base.tint,
    saturation: base.saturation,

    // ⭐ Existing creative parameters (unchanged)
    ...params,

    // ⭐ Adaptive metadata (unchanged)
    adaptive: {
      avgLuma: luma,
      shadowPercent: shadows,
      highlightPercent: highlights,
      avgSaturation: sat,
    },
  },
};

  applySpringHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}