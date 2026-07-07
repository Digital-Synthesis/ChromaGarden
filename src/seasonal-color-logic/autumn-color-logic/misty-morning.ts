import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyAutumnHybridEngine, type AutumnRecipeDebug } from "./autumn-engine";

const mistyMorningPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applyAutumnMistyMorningGrade(
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
      base: { exposure: 0.04, contrast: 0.06, temperature: 6, tint: 2, saturation: -2 },
      params: { fogDensity: 0.16, horizonSoftness: 0.08, fieldSeparation: 0.04 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.06, contrast: 0.08, temperature: 8, tint: 3, saturation: -3 },
      params: { fogDensity: 0.2, horizonSoftness: 0.1, fieldSeparation: 0.06 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.02, contrast: 0.04, temperature: 4, tint: 1, saturation: -1 },
      params: { fogDensity: 0.14, horizonSoftness: 0.06, fieldSeparation: 0.03 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.08, contrast: 0.1, temperature: 10, tint: 4, saturation: -4 },
      params: { fogDensity: 0.22, horizonSoftness: 0.12, fieldSeparation: 0.08 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.1, contrast: 0.12, temperature: 12, tint: 5, saturation: -5 },
      params: { fogDensity: 0.26, horizonSoftness: 0.14, fieldSeparation: 0.1 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.01, contrast: 0.03, temperature: 3, tint: 1, saturation: -1 },
      params: { fogDensity: 0.12, horizonSoftness: 0.05, fieldSeparation: 0.02 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.12, contrast: 0.14, temperature: 14, tint: 6, saturation: -6 },
      params: { fogDensity: 0.3, horizonSoftness: 0.16, fieldSeparation: 0.12 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.05, contrast: 0.07, temperature: 7, tint: 2, saturation: -2 },
      params: { fogDensity: 0.18, horizonSoftness: 0.09, fieldSeparation: 0.05 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.14, contrast: 0.16, temperature: 16, tint: 7, saturation: -7 },
      params: { fogDensity: 0.34, horizonSoftness: 0.18, fieldSeparation: 0.14 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (mistyMorningPassMap.get(chosen.label) ?? 0) + 1;
  mistyMorningPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.02, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 1.5, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 1.5, preDramaMultiplier);

    params.fogDensity = jitter(params.fogDensity, 0.02, preDramaMultiplier);
    params.horizonSoftness = jitter(params.horizonSoftness, 0.02, preDramaMultiplier);
    params.fieldSeparation = jitter(params.fieldSeparation, 0.02, preDramaMultiplier);
  }

  const debug: AutumnRecipeDebug = {
    personalityId: "Misty Morning",
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

  applyAutumnHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}