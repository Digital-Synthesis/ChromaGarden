import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyAutumnHybridEngine, type AutumnRecipeDebug } from "./autumn-engine";

const woodlandPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applyAutumnWoodlandGrade(
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
      base: { exposure: -0.02, contrast: 0.16, temperature: 8, tint: 2, saturation: 3 },
      params: { barkDepth: 0.22, mossSeparation: 0.1, canopyShadow: 0.12 },
    },
    {
      label: "Look 2",
      base: { exposure: -0.04, contrast: 0.18, temperature: 6, tint: 1, saturation: 2 },
      params: { barkDepth: 0.24, mossSeparation: 0.12, canopyShadow: 0.14 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.01, contrast: 0.14, temperature: 10, tint: 3, saturation: 4 },
      params: { barkDepth: 0.2, mossSeparation: 0.09, canopyShadow: 0.1 },
    },
    {
      label: "Look 4",
      base: { exposure: -0.06, contrast: 0.2, temperature: 4, tint: 0, saturation: 1 },
      params: { barkDepth: 0.26, mossSeparation: 0.14, canopyShadow: 0.16 },
    },
    {
      label: "Look 5",
      base: { exposure: -0.03, contrast: 0.22, temperature: 12, tint: 4, saturation: 5 },
      params: { barkDepth: 0.3, mossSeparation: 0.16, canopyShadow: 0.18 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.05, contrast: 0.12, temperature: 6, tint: 1, saturation: 2 },
      params: { barkDepth: 0.18, mossSeparation: 0.08, canopyShadow: 0.09 },
    },
    {
      label: "Look 7",
      base: { exposure: -0.08, contrast: 0.24, temperature: 2, tint: -1, saturation: 1 },
      params: { barkDepth: 0.34, mossSeparation: 0.18, canopyShadow: 0.2 },
    },
    {
      label: "Look 8",
      base: { exposure: -0.02, contrast: 0.18, temperature: 9, tint: 3, saturation: 3 },
      params: { barkDepth: 0.24, mossSeparation: 0.11, canopyShadow: 0.13 },
    },
    {
      label: "Look 9",
      base: { exposure: -0.09, contrast: 0.26, temperature: 1, tint: -2, saturation: 0 },
      params: { barkDepth: 0.38, mossSeparation: 0.2, canopyShadow: 0.22 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (woodlandPassMap.get(chosen.label) ?? 0) + 1;
  woodlandPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 1.5, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 1.5, preDramaMultiplier);

    params.barkDepth = jitter(params.barkDepth, 0.02, preDramaMultiplier);
    params.mossSeparation = jitter(params.mossSeparation, 0.02, preDramaMultiplier);
    params.canopyShadow = jitter(params.canopyShadow, 0.02, preDramaMultiplier);
  }

  const debug: AutumnRecipeDebug = {
    personalityId: "Woodland",
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