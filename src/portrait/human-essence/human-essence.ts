import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import {
  applyHumanEssenceEngine,
  type HumanEssenceRecipeDebug,
} from "./human-essence-engine";

/* ---------------------------------------------------------
   PASS TRACKING (mirrors seasonal behavior)
--------------------------------------------------------- */
const humanEssencePassMap: Map<string, number> = new Map();

/* ---------------------------------------------------------
   JITTER (same as seasonal)
--------------------------------------------------------- */
function jitter(
  value: number,
  amount: number,
  preDramaMultiplier: number = 1
): number {
  if (amount <= 0) return value;
  const jitterDelta = (Math.random() * 2 - 1) * amount;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return value + effectiveDelta;
}

/* ---------------------------------------------------------
   HUMAN ESSENCE — 9 Portrait Looks
   Each look is a distinct portrait transformation
--------------------------------------------------------- */
export function applyHumanEssenceGrade(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  preDramaMultiplier: number = 1
) {
  if (!originalImageRef.current) return null;

  const analysis = analyzeOriginalImageFromElement(originalImageRef.current);

  const looks = [
    {
      label: "Look 1 — Clean Neutral",
      base: { exposure: 0, contrast: 0.08, temperature: 2, tint: 1, saturation: 0 },
      params: {
        warmMidtones: 0.02,
        coolShadows: 0,
        pastelCompression: 0,
        skinProtectStrength: 0.4,
        microContrast: 0.1,
        highlightSheen: 0.1,
        shadowSoftness: 0.1,
        colorDensity: 0.05,
        backgroundSeparation: 0.05,
      },
    },
    {
      label: "Look 2 — Warm Glow",
      base: { exposure: 0.05, contrast: 0.1, temperature: 10, tint: 4, saturation: 4 },
      params: {
        warmMidtones: 0.15,
        coolShadows: 0,
        pastelCompression: 0.05,
        skinProtectStrength: 0.5,
        microContrast: 0.05,
        highlightSheen: 0.2,
        shadowSoftness: 0.15,
        colorDensity: 0.1,
        backgroundSeparation: 0.02,
      },
    },
    {
      label: "Look 3 — Cool Clean",
      base: { exposure: 0, contrast: 0.12, temperature: -8, tint: -2, saturation: -2 },
      params: {
        warmMidtones: 0,
        coolShadows: 0.15,
        pastelCompression: 0,
        skinProtectStrength: 0.4,
        microContrast: 0.15,
        highlightSheen: 0.05,
        shadowSoftness: 0.05,
        colorDensity: 0.1,
        backgroundSeparation: 0.1,
      },
    },
    {
      label: "Look 4 — Matte Pastel",
      base: { exposure: 0.02, contrast: -0.1, temperature: 6, tint: 2, saturation: -4 },
      params: {
        warmMidtones: 0.05,
        coolShadows: 0,
        pastelCompression: 0.25,
        skinProtectStrength: 0.5,
        microContrast: -0.1,
        highlightSheen: 0.05,
        shadowSoftness: 0.2,
        colorDensity: -0.1,
        backgroundSeparation: 0.05,
      },
    },
    {
      label: "Look 5 — Deep Rich",
      base: { exposure: -0.02, contrast: 0.18, temperature: 4, tint: 1, saturation: 6 },
      params: {
        warmMidtones: 0.1,
        coolShadows: 0.05,
        pastelCompression: 0,
        skinProtectStrength: 0.7,
        microContrast: 0.2,
        highlightSheen: 0.15,
        shadowSoftness: 0.1,
        colorDensity: 0.25,
        backgroundSeparation: 0.05,
      },
    },
    {
      label: "Look 6 — Cinematic Muted",
      base: { exposure: -0.03, contrast: 0.15, temperature: 6, tint: -1, saturation: -8 },
      params: {
        warmMidtones: 0.1,
        coolShadows: 0.1,
        pastelCompression: 0.05,
        skinProtectStrength: 0.6,
        microContrast: 0.1,
        highlightSheen: 0.05,
        shadowSoftness: 0.1,
        colorDensity: 0.15,
        backgroundSeparation: 0.1,
      },
    },
    {
      label: "Look 7 — Soft Film",
      base: { exposure: 0.01, contrast: 0.08, temperature: 4, tint: 1, saturation: -2 },
      params: {
        warmMidtones: 0.08,
        coolShadows: 0.05,
        pastelCompression: 0.1,
        skinProtectStrength: 0.5,
        microContrast: 0.05,
        highlightSheen: 0.1,
        shadowSoftness: 0.15,
        colorDensity: 0.05,
        backgroundSeparation: 0.05,
      },
    },
    {
      label: "Look 8 — High-Key Bright",
      base: { exposure: 0.12, contrast: -0.05, temperature: 8, tint: 2, saturation: 2 },
      params: {
        warmMidtones: 0.1,
        coolShadows: 0,
        pastelCompression: 0.15,
        skinProtectStrength: 0.5,
        microContrast: -0.05,
        highlightSheen: 0.25,
        shadowSoftness: 0.25,
        colorDensity: -0.05,
        backgroundSeparation: 0.02,
      },
    },
    {
      label: "Look 9 — Low-Key Dramatic",
      base: { exposure: -0.08, contrast: 0.25, temperature: 2, tint: 0, saturation: 4 },
      params: {
        warmMidtones: 0.05,
        coolShadows: 0.15,
        pastelCompression: 0,
        skinProtectStrength: 0.6,
        microContrast: 0.25,
        highlightSheen: 0.05,
        shadowSoftness: 0.05,
        colorDensity: 0.2,
        backgroundSeparation: 0.15,
      },
    },
  ];

  /* ---------------------------------------------------------
     PICK LOOK
  --------------------------------------------------------- */
  const chosen = looks[Math.floor(Math.random() * looks.length)];

  /* ---------------------------------------------------------
     PASS LOGIC
  --------------------------------------------------------- */
  const currentPass = (humanEssencePassMap.get(chosen.label) ?? 0) + 1;
  humanEssencePassMap.set(chosen.label, currentPass);

  /* ---------------------------------------------------------
     JITTER ON PASS ≥ 2
  --------------------------------------------------------- */
  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.warmMidtones = jitter(params.warmMidtones, 0.02, preDramaMultiplier);
    params.coolShadows = jitter(params.coolShadows, 0.02, preDramaMultiplier);
    params.pastelCompression = jitter(params.pastelCompression, 0.02, preDramaMultiplier);
    params.skinProtectStrength = jitter(params.skinProtectStrength, 0.02, preDramaMultiplier);
    params.microContrast = jitter(params.microContrast, 0.02, preDramaMultiplier);
    params.highlightSheen = jitter(params.highlightSheen, 0.02, preDramaMultiplier);
    params.shadowSoftness = jitter(params.shadowSoftness, 0.02, preDramaMultiplier);
    params.colorDensity = jitter(params.colorDensity, 0.02, preDramaMultiplier);
    params.backgroundSeparation = jitter(params.backgroundSeparation, 0.02, preDramaMultiplier);
  }

  /* ---------------------------------------------------------
     BUILD DEBUG OBJECT
  --------------------------------------------------------- */
  const debug: HumanEssenceRecipeDebug = {
    personalityId: "Human Essence",
    label: chosen.label,
    pass: currentPass,
    base,
    params: {
      ...params,
      adaptive: {
        avgLuma: analysis.avgLuma,
        shadowPercent: analysis.shadowPercent,
        highlightPercent: analysis.highlightPercent,
        avgSaturation: analysis.avgSaturation,
        skinPixelPercent: analysis.skinPixelPercent,
      },
    },
  };

  /* ---------------------------------------------------------
     APPLY ENGINE
  --------------------------------------------------------- */
  applyHumanEssenceEngine(originalImageRef, setImageSrc, debug);
  return debug;
}