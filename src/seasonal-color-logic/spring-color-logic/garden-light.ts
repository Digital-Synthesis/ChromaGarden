import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const gardenLightPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringGardenLightGrade(
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
     GARDEN LIGHT — STRONG CREATIVE SEPARATION
     Neutral balance, foliage softness, dappled light, gentle pastel greens
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.12, contrast: 0.04, temperature: 4, tint: 2, saturation: 6 },
      params: { foliageSoftness: 0.28, dappleLight: 0.20, neutralBalance: 0.18 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.14, contrast: 0.05, temperature: 5, tint: 3, saturation: 7 },
      params: { foliageSoftness: 0.30, dappleLight: 0.22, neutralBalance: 0.20 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.10, contrast: 0.03, temperature: 3, tint: 1, saturation: 5 },
      params: { foliageSoftness: 0.26, dappleLight: 0.18, neutralBalance: 0.16 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.16, contrast: 0.06, temperature: 6, tint: 4, saturation: 8 },
      params: { foliageSoftness: 0.32, dappleLight: 0.24, neutralBalance: 0.22 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.18, contrast: 0.07, temperature: 7, tint: 5, saturation: 9 },
      params: { foliageSoftness: 0.34, dappleLight: 0.26, neutralBalance: 0.24 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.09, contrast: 0.03, temperature: 2, tint: 1, saturation: 4 },
      params: { foliageSoftness: 0.25, dappleLight: 0.17, neutralBalance: 0.15 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.20, contrast: 0.08, temperature: 8, tint: 6, saturation: 10 },
      params: { foliageSoftness: 0.36, dappleLight: 0.28, neutralBalance: 0.26 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.13, contrast: 0.04, temperature: 4, tint: 2, saturation: 6 },
      params: { foliageSoftness: 0.29, dappleLight: 0.21, neutralBalance: 0.19 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.22, contrast: 0.09, temperature: 9, tint: 7, saturation: 11 },
      params: { foliageSoftness: 0.38, dappleLight: 0.30, neutralBalance: 0.28 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (gardenLightPassMap.get(chosen.label) ?? 0) + 1;
  gardenLightPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  /* ---------------------------------------------------------
     PASS 2+ — STRONGER JITTER FOR HUMAN-VISIBLE SHIFTS
  --------------------------------------------------------- */
  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.04, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2.5, preDramaMultiplier);
    base.tint = jitter(base.tint, 2, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 3, preDramaMultiplier);

    params.foliageSoftness = jitter(params.foliageSoftness, 0.04, preDramaMultiplier);
    params.dappleLight = jitter(params.dappleLight, 0.04, preDramaMultiplier);
    params.neutralBalance = jitter(params.neutralBalance, 0.04, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Garden Light",
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