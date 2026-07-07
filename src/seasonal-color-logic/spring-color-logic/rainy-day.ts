import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const rainyDayPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringRainyDayGrade(
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
     RAINY DAY — STRONG CREATIVE SEPARATION
     Cool gray, soft contrast, heavy desaturation, wet atmosphere
     The moodiest Spring profile
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: -0.06, contrast: -0.10, temperature: -10, tint: -2, saturation: -14 },
      params: { grayBalance: 0.36, rainSoftness: 0.28, coolMist: 0.22 },
    },
    {
      label: "Look 2",
      base: { exposure: -0.04, contrast: -0.09, temperature: -9, tint: -1, saturation: -15 },
      params: { grayBalance: 0.38, rainSoftness: 0.30, coolMist: 0.24 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.08, contrast: -0.11, temperature: -11, tint: -3, saturation: -13 },
      params: { grayBalance: 0.34, rainSoftness: 0.26, coolMist: 0.20 },
    },
    {
      label: "Look 4",
      base: { exposure: -0.02, contrast: -0.08, temperature: -8, tint: 0, saturation: -16 },
      params: { grayBalance: 0.40, rainSoftness: 0.32, coolMist: 0.26 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.00, contrast: -0.07, temperature: -7, tint: 1, saturation: -17 },
      params: { grayBalance: 0.42, rainSoftness: 0.34, coolMist: 0.28 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.10, contrast: -0.12, temperature: -12, tint: -4, saturation: -12 },
      params: { grayBalance: 0.32, rainSoftness: 0.24, coolMist: 0.18 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.02, contrast: -0.06, temperature: -6, tint: 2, saturation: -18 },
      params: { grayBalance: 0.44, rainSoftness: 0.36, coolMist: 0.30 },
    },
    {
      label: "Look 8",
      base: { exposure: -0.03, contrast: -0.09, temperature: -9, tint: -1, saturation: -15 },
      params: { grayBalance: 0.37, rainSoftness: 0.29, coolMist: 0.23 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.04, contrast: -0.05, temperature: -5, tint: 3, saturation: -19 },
      params: { grayBalance: 0.46, rainSoftness: 0.38, coolMist: 0.32 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (rainyDayPassMap.get(chosen.label) ?? 0) + 1;
  rainyDayPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  /* ---------------------------------------------------------
     PASS 2+ — STRONGER JITTER FOR HUMAN-VISIBLE SHIFTS
  --------------------------------------------------------- */
  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.04, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.05, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 3.5, preDramaMultiplier);
    base.tint = jitter(base.tint, 2.5, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 4, preDramaMultiplier);

    params.grayBalance = jitter(params.grayBalance, 0.05, preDramaMultiplier);
    params.rainSoftness = jitter(params.rainSoftness, 0.05, preDramaMultiplier);
    params.coolMist = jitter(params.coolMist, 0.05, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Rainy Day",
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