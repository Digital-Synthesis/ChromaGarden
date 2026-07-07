import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyAutumnHybridEngine, type AutumnRecipeDebug } from "./autumn-engine";

const goldenCanopyPassMap: Map<string, number> = new Map();

function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

export function applyAutumnGoldenCanopyGrade(
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
      base: { exposure: 0.02, contrast: 0.12, temperature: 10, tint: 4, saturation: 4 },
      params: { canopyWarmth: 0.18, leafSeparation: 0.08, trunkDepth: 0.06 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.04, contrast: 0.16, temperature: 14, tint: 6, saturation: 6 },
      params: { canopyWarmth: 0.22, leafSeparation: 0.1, trunkDepth: 0.08 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.01, contrast: 0.1, temperature: 8, tint: 3, saturation: 3 },
      params: { canopyWarmth: 0.16, leafSeparation: 0.06, trunkDepth: 0.05 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.06, contrast: 0.18, temperature: 18, tint: 8, saturation: 7 },
      params: { canopyWarmth: 0.26, leafSeparation: 0.12, trunkDepth: 0.1 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.08, contrast: 0.22, temperature: 22, tint: 10, saturation: 8 },
      params: { canopyWarmth: 0.3, leafSeparation: 0.14, trunkDepth: 0.12 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.03, contrast: 0.08, temperature: 6, tint: 2, saturation: 2 },
      params: { canopyWarmth: 0.14, leafSeparation: 0.05, trunkDepth: 0.04 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.1, contrast: 0.24, temperature: 24, tint: 12, saturation: 10 },
      params: { canopyWarmth: 0.34, leafSeparation: 0.16, trunkDepth: 0.14 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.03, contrast: 0.14, temperature: 12, tint: 5, saturation: 5 },
      params: { canopyWarmth: 0.2, leafSeparation: 0.09, trunkDepth: 0.07 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.12, contrast: 0.26, temperature: 26, tint: 14, saturation: 11 },
      params: { canopyWarmth: 0.38, leafSeparation: 0.18, trunkDepth: 0.16 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (goldenCanopyPassMap.get(chosen.label) ?? 0) + 1;
  goldenCanopyPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.canopyWarmth = jitter(params.canopyWarmth, 0.02, preDramaMultiplier);
    params.leafSeparation = jitter(params.leafSeparation, 0.02, preDramaMultiplier);
    params.trunkDepth = jitter(params.trunkDepth, 0.02, preDramaMultiplier);
  }

  const debug: AutumnRecipeDebug = {
    personalityId: "Golden Canopy",
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