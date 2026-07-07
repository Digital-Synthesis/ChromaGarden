import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyAutumnHybridEngine, type AutumnRecipeDebug } from "./autumn-engine";

const duskPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applyAutumnDuskGrade(
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
      base: { exposure: -0.02, contrast: 0.18, temperature: 14, tint: 4, saturation: 4 },
      params: { shadowAmber: 0.22, horizonRollOff: 0.1, skyDepth: 0.12 },
    },
    {
      label: "Look 2",
      base: { exposure: -0.04, contrast: 0.2, temperature: 16, tint: 5, saturation: 5 },
      params: { shadowAmber: 0.26, horizonRollOff: 0.12, skyDepth: 0.14 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.01, contrast: 0.16, temperature: 12, tint: 3, saturation: 3 },
      params: { shadowAmber: 0.2, horizonRollOff: 0.09, skyDepth: 0.1 },
    },
    {
      label: "Look 4",
      base: { exposure: -0.06, contrast: 0.22, temperature: 18, tint: 6, saturation: 6 },
      params: { shadowAmber: 0.3, horizonRollOff: 0.14, skyDepth: 0.16 },
    },
    {
      label: "Look 5",
      base: { exposure: -0.08, contrast: 0.24, temperature: 20, tint: 7, saturation: 7 },
      params: { shadowAmber: 0.34, horizonRollOff: 0.16, skyDepth: 0.18 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.03, contrast: 0.14, temperature: 10, tint: 2, saturation: 2 },
      params: { shadowAmber: 0.18, horizonRollOff: 0.08, skyDepth: 0.09 },
    },
    {
      label: "Look 7",
      base: { exposure: -0.1, contrast: 0.26, temperature: 22, tint: 8, saturation: 8 },
      params: { shadowAmber: 0.38, horizonRollOff: 0.18, skyDepth: 0.2 },
    },
    {
      label: "Look 8",
      base: { exposure: -0.05, contrast: 0.2, temperature: 16, tint: 5, saturation: 5 },
      params: { shadowAmber: 0.28, horizonRollOff: 0.13, skyDepth: 0.15 },
    },
    {
      label: "Look 9",
      base: { exposure: -0.12, contrast: 0.28, temperature: 24, tint: 9, saturation: 9 },
      params: { shadowAmber: 0.42, horizonRollOff: 0.2, skyDepth: 0.22 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (duskPassMap.get(chosen.label) ?? 0) + 1;
  duskPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.shadowAmber = jitter(params.shadowAmber, 0.02, preDramaMultiplier);
    params.horizonRollOff = jitter(params.horizonRollOff, 0.02, preDramaMultiplier);
    params.skyDepth = jitter(params.skyDepth, 0.02, preDramaMultiplier);
  }

  const debug: AutumnRecipeDebug = {
    personalityId: "Dusk",
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