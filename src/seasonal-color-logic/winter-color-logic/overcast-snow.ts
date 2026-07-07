import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const overcastSnowPassMap: Map<string, number> = new Map();

/* ---------------------------------------------------------
   JITTER
--------------------------------------------------------- */
function jitter(value: number, amount: number, preDramaMultiplier: number = 1): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

/* ---------------------------------------------------------
   OVERCAST SNOW — Soft Winter Light
--------------------------------------------------------- */
export function applyWinterOvercastSnowGrade(
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
      base: { exposure: 0.02, contrast: -0.1, temperature: -6, tint: -2, saturation: -8 },
      params: { graySoftening: 0.12, blueMelt: 0.08, snowFlatten: 0.1 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.0, contrast: -0.14, temperature: -10, tint: -4, saturation: -12 },
      params: { graySoftening: 0.16, blueMelt: 0.12, snowFlatten: 0.14 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.03, contrast: -0.18, temperature: -8, tint: -1, saturation: -6 },
      params: { graySoftening: 0.1, blueMelt: 0.06, snowFlatten: 0.08 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.05, contrast: -0.12, temperature: -12, tint: -6, saturation: -14 },
      params: { graySoftening: 0.18, blueMelt: 0.14, snowFlatten: 0.16 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.08, contrast: -0.2, temperature: -15, tint: -8, saturation: -18 },
      params: { graySoftening: 0.22, blueMelt: 0.18, snowFlatten: 0.2 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.02, contrast: -0.08, temperature: -5, tint: 0, saturation: -4 },
      params: { graySoftening: 0.08, blueMelt: 0.04, snowFlatten: 0.06 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.1, contrast: -0.22, temperature: -18, tint: -10, saturation: -20 },
      params: { graySoftening: 0.26, blueMelt: 0.2, snowFlatten: 0.24 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.03, contrast: -0.16, temperature: -9, tint: -3, saturation: -10 },
      params: { graySoftening: 0.14, blueMelt: 0.1, snowFlatten: 0.12 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.12, contrast: -0.25, temperature: -20, tint: -12, saturation: -22 },
      params: { graySoftening: 0.3, blueMelt: 0.24, snowFlatten: 0.28 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (overcastSnowPassMap.get(chosen.label) ?? 0) + 1;
  overcastSnowPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.graySoftening = jitter(params.graySoftening, 0.02, preDramaMultiplier);
    params.blueMelt = jitter(params.blueMelt, 0.02, preDramaMultiplier);
    params.snowFlatten = jitter(params.snowFlatten, 0.02, preDramaMultiplier);
  }

  const debug: WinterRecipeDebug = {
    personalityId: "Overcast Snow",
    label: chosen.label,
  pass: currentPass,

  // Keep base for type compatibility
  base,

  params: {
    // ⭐ Base controls exposed for Manual Tweaks
    exposure: base.exposure,
    contrast: base.contrast,
    temperature: base.temperature,
    tint: base.tint,
    saturation: base.saturation,

    // ⭐ Existing creative parameters
    ...params,

    // ⭐ Adaptive metadata
    adaptive: {
      avgLuma: luma,
      shadowPercent: shadows,
      highlightPercent: highlights,
      avgSaturation: sat,
    },
  },
};

  applyWinterHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}