import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyAutumnHybridEngine, type AutumnRecipeDebug } from "./autumn-engine";

const harvestFieldPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applyAutumnHarvestFieldGrade(
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
      base: { exposure: 0.06, contrast: 0.14, temperature: 16, tint: 4, saturation: 5 },
      params: { fieldGlow: 0.2, grassSeparation: 0.08, skyBalance: 0.06 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.08, contrast: 0.18, temperature: 20, tint: 5, saturation: 6 },
      params: { fieldGlow: 0.24, grassSeparation: 0.1, skyBalance: 0.08 },
    },
    {
      label: "Look 3",
      base: { exposure: 0.03, contrast: 0.12, temperature: 14, tint: 3, saturation: 4 },
      params: { fieldGlow: 0.18, grassSeparation: 0.07, skyBalance: 0.05 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.1, contrast: 0.2, temperature: 22, tint: 6, saturation: 7 },
      params: { fieldGlow: 0.28, grassSeparation: 0.12, skyBalance: 0.1 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.12, contrast: 0.24, temperature: 26, tint: 8, saturation: 8 },
      params: { fieldGlow: 0.32, grassSeparation: 0.14, skyBalance: 0.12 },
    },
    {
      label: "Look 6",
      base: { exposure: 0.02, contrast: 0.1, temperature: 12, tint: 2, saturation: 3 },
      params: { fieldGlow: 0.16, grassSeparation: 0.06, skyBalance: 0.04 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.14, contrast: 0.26, temperature: 28, tint: 9, saturation: 9 },
      params: { fieldGlow: 0.36, grassSeparation: 0.16, skyBalance: 0.14 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.05, contrast: 0.16, temperature: 18, tint: 4, saturation: 5 },
      params: { fieldGlow: 0.22, grassSeparation: 0.09, skyBalance: 0.07 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.16, contrast: 0.28, temperature: 30, tint: 10, saturation: 10 },
      params: { fieldGlow: 0.4, grassSeparation: 0.18, skyBalance: 0.16 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (harvestFieldPassMap.get(chosen.label) ?? 0) + 1;
  harvestFieldPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.fieldGlow = jitter(params.fieldGlow, 0.02, preDramaMultiplier);
    params.grassSeparation = jitter(params.grassSeparation, 0.02, preDramaMultiplier);
    params.skyBalance = jitter(params.skyBalance, 0.02, preDramaMultiplier);
  }

  const debug: AutumnRecipeDebug = {
    personalityId: "Harvest Field",
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