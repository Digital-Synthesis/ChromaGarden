import type React from "react";
import { analyzeOriginalImageFromElement } from "../shared/original-analysis";
import {
  applyBlackAndWhiteEngine,
  type BWRecipeDebug,
  type BWCurveTransform,
} from "./black-and-white-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const curvyPassMap: Map<string, number> = new Map();

/* ---------------------------------------------------------
   JITTER
--------------------------------------------------------- */
function jitter(v: number, amt: number, preDramaMultiplier: number = 1): number {
  const jitterDelta = (Math.random() * 2 - 1) * amt;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return v + effectiveDelta;
}

/* ---------------------------------------------------------
   CURVE TRANSFORM POOL
--------------------------------------------------------- */
const CURVE_POOL: BWCurveTransform[] = [
  { type: "filmicToe", amount: 0.18 },
  { type: "filmicShoulder", amount: 0.22 },
  { type: "highlightRolloff", amount: 0.16 },
  { type: "shadowLift", amount: 0.18 },
  { type: "colorSeparation", amount: 0.12 },
];

/* ---------------------------------------------------------
   ADAPTIVE HELPERS
--------------------------------------------------------- */
function adaptiveExposure(avgLuma: number): number {
  if (avgLuma < 0.35) return 0.05;
  if (avgLuma > 0.65) return -0.04;
  return 0.0;
}

function adaptiveContrast(contrast: number): number {
  if (contrast < 0.18) return 0.08;
  if (contrast > 0.32) return -0.05;
  return 0.0;
}

function adaptiveBrightness(shadows: number, highlights: number): number {
  if (shadows > 0.45) return 0.02;
  if (highlights > 0.35) return -0.015;
  return 0.0;
}

function adaptiveCurveWeights(
  sat: number,
  hasSkin: boolean
): BWCurveTransform[] {
  const curves: BWCurveTransform[] = [];

  if (sat < 0.18) {
    curves.push({ type: "filmicToe", amount: 0.16 });
    curves.push({ type: "shadowLift", amount: 0.14 });
  }

  if (sat > 0.35) {
    curves.push({ type: "highlightRolloff", amount: 0.14 });
    curves.push({ type: "filmicShoulder", amount: 0.18 });
  }

  if (hasSkin) {
    curves.push({ type: "shadowLift", amount: 0.12 });
    curves.push({ type: "highlightRolloff", amount: 0.10 });
  }

  return curves;
}

/* ---------------------------------------------------------
   CURVY — ADAPTIVE B&W PERSONALITY (patched for Manual Tweaks)
--------------------------------------------------------- */

export function applyCurvyBWGrade(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  preDramaMultiplier: number = 1
) {
  if (!originalImageRef.current) return null;

  const analysis = analyzeOriginalImageFromElement(originalImageRef.current);
  const {
    avgLuma,
    contrast,
    shadowPercent,
    highlightPercent,
    avgSaturation,
    hasSkin,
  } = analysis;

  /* ---------------------------------------------------------
     BASE LOOKS
  --------------------------------------------------------- */

  const looks = [
    { label: "Look 1", base: { exposure: 0.0,  contrast: 0.1,  brightness: 0.0  } },
    { label: "Look 2", base: { exposure: 0.05, contrast: 0.12, brightness: 0.02 } },
    { label: "Look 3", base: { exposure: -0.03, contrast: 0.15, brightness: -0.01 } },
    { label: "Look 4", base: { exposure: 0.02, contrast: 0.18, brightness: 0.01 } },
    { label: "Look 5", base: { exposure: 0.08, contrast: 0.2,  brightness: 0.03 } },
    { label: "Look 6", base: { exposure: -0.05, contrast: 0.1,  brightness: -0.02 } },
    { label: "Look 7", base: { exposure: 0.12, contrast: 0.22, brightness: 0.04 } },
    { label: "Look 8", base: { exposure: 0.03, contrast: 0.16, brightness: 0.01 } },
    { label: "Look 9", base: { exposure: 0.15, contrast: 0.25, brightness: 0.05 } },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  /* ---------------------------------------------------------
     PASS COUNTER
  --------------------------------------------------------- */

  const currentPass = (curvyPassMap.get(chosen.label) ?? 0) + 1;
  curvyPassMap.set(chosen.label, currentPass);

  /* ---------------------------------------------------------
     ADAPTIVE BASE MODIFIERS
  --------------------------------------------------------- */

  const base = { ...chosen.base };

  base.exposure += adaptiveExposure(avgLuma);
  base.contrast += adaptiveContrast(contrast);
  base.brightness += adaptiveBrightness(shadowPercent, highlightPercent);

  /* ---------------------------------------------------------
     ADAPTIVE CURVES
  --------------------------------------------------------- */

  const adaptiveCurves = adaptiveCurveWeights(avgSaturation, hasSkin);

  const randomCount = Math.random() < 0.33 ? 1 : 0;
  const randomCurves =
    randomCount === 1
      ? [CURVE_POOL[Math.floor(Math.random() * CURVE_POOL.length)]]
      : [];

  const curves = [...adaptiveCurves, ...randomCurves];

  /* ---------------------------------------------------------
     JITTER ON PASS ≥ 2
  --------------------------------------------------------- */

  const jitterMap: Record<string, number> = {};

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.015, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.02, preDramaMultiplier);
    base.brightness = jitter(base.brightness, 0.015, preDramaMultiplier);

    curves.forEach((c) => {
      const j = jitter(c.amount, 0.03, preDramaMultiplier);
      jitterMap[c.type] = j - c.amount;
      c.amount = j;
    });
  }

  /* ---------------------------------------------------------
     CURVY PARAMS (ONLY EXPOSURE + CONTRAST)
     - brightness stays in base.* (RightUI exposes it)
     - curve sliders come from curves[n].amount (RightUI exposes them)
  --------------------------------------------------------- */

  const params = {
    exposure: base.exposure,
    contrast: base.contrast,
  };

  /* ---------------------------------------------------------
     DEBUG OBJECT
--------------------------------------------------------- */

  const debug: BWRecipeDebug & {
    params: typeof params;
    mode: "blackAndWhite";
  } = {
    personalityId: "Curvy Adaptive",
    label: chosen.label,
    pass: currentPass,
    base,
    curves,
    jitter: jitterMap,
    params,
    mode: "blackAndWhite",
  };

  applyBlackAndWhiteEngine(originalImageRef, setImageSrc, debug);

  return debug;
}