import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const freshBloomPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringFreshBloomGrade(
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
     FRESH BLOOM — STRONG CREATIVE SEPARATION
     Romantic pastel, petal tones, soft glow, warm-magenta bias
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.14, contrast: 0.06, temperature: 10, tint: 14, saturation: 10 },
      params: { petalGlow: 0.28, halation: 0.22, skinBloom: 0.16 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.16, contrast: 0.07, temperature: 12, tint: 16, saturation: 12 },
      params: { petalGlow: 0.32, halation: 0.24, skinBloom: 0.18 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.12, contrast: 0.05, temperature: 8, tint: 12, saturation: 8 },
      params: { petalGlow: 0.26, halation: 0.2, skinBloom: 0.14 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.18, contrast: 0.08, temperature: 14, tint: 18, saturation: 14 },
      params: { petalGlow: 0.34, halation: 0.26, skinBloom: 0.2 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.20, contrast: 0.09, temperature: 16, tint: 20, saturation: 16 },
      params: { petalGlow: 0.38, halation: 0.28, skinBloom: 0.22 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.10, contrast: 0.04, temperature: 6, tint: 10, saturation: 6 },
      params: { petalGlow: 0.24, halation: 0.18, skinBloom: 0.12 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.22, contrast: 0.10, temperature: 18, tint: 22, saturation: 18 },
      params: { petalGlow: 0.42, halation: 0.3, skinBloom: 0.24 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.15, contrast: 0.06, temperature: 11, tint: 15, saturation: 11 },
      params: { petalGlow: 0.30, halation: 0.23, skinBloom: 0.17 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.24, contrast: 0.11, temperature: 20, tint: 24, saturation: 20 },
      params: { petalGlow: 0.46, halation: 0.32, skinBloom: 0.26 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (freshBloomPassMap.get(chosen.label) ?? 0) + 1;
  freshBloomPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  /* ---------------------------------------------------------
     PASS 2+ — STRONGER JITTER FOR HUMAN-VISIBLE SHIFTS
  --------------------------------------------------------- */
  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.04, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 3, preDramaMultiplier);
    base.tint = jitter(base.tint, 3, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 3, preDramaMultiplier);

    params.petalGlow = jitter(params.petalGlow, 0.04, preDramaMultiplier);
    params.halation = jitter(params.halation, 0.04, preDramaMultiplier);
    params.skinBloom = jitter(params.skinBloom, 0.04, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Fresh Bloom",
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