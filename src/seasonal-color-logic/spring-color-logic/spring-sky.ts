import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applySpringHybridEngine, type SpringRecipeDebug } from "./spring-engine";

const springSkyPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applySpringSkyGrade(
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
     SPRING SKY — STRONG CREATIVE SEPARATION
     Blue purity, sky lift, cloud softness, cool pastel air
  --------------------------------------------------------- */

  const looks = [
    {
      label: "Look 1",
      base: { exposure: 0.20, contrast: 0.02, temperature: -4, tint: 2, saturation: 10 },
      params: { skyLift: 0.36, cloudSoftness: 0.28, bluePurity: 0.22 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.22, contrast: 0.03, temperature: -3, tint: 3, saturation: 12 },
      params: { skyLift: 0.38, cloudSoftness: 0.30, bluePurity: 0.24 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.18, contrast: 0.01, temperature: -5, tint: 1, saturation: 9 },
      params: { skyLift: 0.34, cloudSoftness: 0.26, bluePurity: 0.20 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.24, contrast: 0.04, temperature: -2, tint: 4, saturation: 14 },
      params: { skyLift: 0.40, cloudSoftness: 0.32, bluePurity: 0.26 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.26, contrast: 0.05, temperature: -1, tint: 5, saturation: 16 },
      params: { skyLift: 0.42, cloudSoftness: 0.34, bluePurity: 0.28 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.16, contrast: 0.01, temperature: -6, tint: 0, saturation: 8 },
      params: { skyLift: 0.32, cloudSoftness: 0.24, bluePurity: 0.18 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.28, contrast: 0.06, temperature: 0, tint: 6, saturation: 18 },
      params: { skyLift: 0.44, cloudSoftness: 0.36, bluePurity: 0.30 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.21, contrast: 0.03, temperature: -3, tint: 3, saturation: 13 },
      params: { skyLift: 0.37, cloudSoftness: 0.29, bluePurity: 0.23 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.30, contrast: 0.07, temperature: 1, tint: 7, saturation: 20 },
      params: { skyLift: 0.46, cloudSoftness: 0.38, bluePurity: 0.32 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (springSkyPassMap.get(chosen.label) ?? 0) + 1;
  springSkyPassMap.set(chosen.label, currentPass);

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

    params.skyLift = jitter(params.skyLift, 0.05, preDramaMultiplier);
    params.cloudSoftness = jitter(params.cloudSoftness, 0.05, preDramaMultiplier);
    params.bluePurity = jitter(params.bluePurity, 0.05, preDramaMultiplier);
  }

  const debug: SpringRecipeDebug = {
    personalityId: "Spring Sky",
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