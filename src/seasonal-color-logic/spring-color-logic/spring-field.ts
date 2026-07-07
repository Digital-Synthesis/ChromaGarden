import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const springFieldPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringFieldGrade(
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
     SPRING FIELD — STRONG CREATIVE SEPARATION
     Fresh greens, airy exposure, yellow-green pastel shift,
     open-field brightness, lively spring energy
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.18, contrast: 0.04, temperature: 8, tint: -2, saturation: 12 },
      params: { greenFreshness: 0.34, fieldAir: 0.26, pastelShift: 0.18 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.20, contrast: 0.05, temperature: 9, tint: -1, saturation: 14 },
      params: { greenFreshness: 0.36, fieldAir: 0.28, pastelShift: 0.2 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.16, contrast: 0.03, temperature: 7, tint: -3, saturation: 10 },
      params: { greenFreshness: 0.32, fieldAir: 0.24, pastelShift: 0.16 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.22, contrast: 0.06, temperature: 10, tint: 0, saturation: 16 },
      params: { greenFreshness: 0.38, fieldAir: 0.3, pastelShift: 0.22 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.24, contrast: 0.07, temperature: 11, tint: 1, saturation: 18 },
      params: { greenFreshness: 0.40, fieldAir: 0.32, pastelShift: 0.24 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.14, contrast: 0.02, temperature: 6, tint: -4, saturation: 9 },
      params: { greenFreshness: 0.30, fieldAir: 0.22, pastelShift: 0.14 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.26, contrast: 0.08, temperature: 12, tint: 2, saturation: 20 },
      params: { greenFreshness: 0.42, fieldAir: 0.34, pastelShift: 0.26 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.19, contrast: 0.04, temperature: 8, tint: -1, saturation: 13 },
      params: { greenFreshness: 0.35, fieldAir: 0.27, pastelShift: 0.19 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.28, contrast: 0.09, temperature: 13, tint: 3, saturation: 22 },
      params: { greenFreshness: 0.44, fieldAir: 0.36, pastelShift: 0.28 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (springFieldPassMap.get(chosen.label) ?? 0) + 1;
  springFieldPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  /* ---------------------------------------------------------
     PASS 2+ — STRONGER JITTER FOR HUMAN-VISIBLE SHIFTS
  --------------------------------------------------------- */
  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.05, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 3, preDramaMultiplier);
    base.tint = jitter(base.tint, 2, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 4, preDramaMultiplier);

    params.greenFreshness = jitter(params.greenFreshness, 0.05, preDramaMultiplier);
    params.fieldAir = jitter(params.fieldAir, 0.05, preDramaMultiplier);
    params.pastelShift = jitter(params.pastelShift, 0.05, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Spring Field",
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