import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { applyWinterHybridEngine, type WinterRecipeDebug } from "./winter-engine";

/* ---------------------------------------------------------
   PASS TRACKING
--------------------------------------------------------- */
const arcticDuskPassMap: Map<string, number> = new Map();

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
   ARCTIC DUSK — Winter Pastel Dusk
--------------------------------------------------------- */
export function applyWinterArcticDuskGrade(
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
      base: { exposure: 0.0, contrast: -0.04, temperature: -8, tint: 10, saturation: 6 },
      params: { duskMagentaLift: 0.14, icyBlueBalance: 0.1, pastelFade: 0.08 },
    },
    {
      label: "Look 2",
      base: { exposure: 0.04, contrast: -0.08, temperature: -12, tint: 14, saturation: 10 },
      params: { duskMagentaLift: 0.18, icyBlueBalance: 0.14, pastelFade: 0.12 },
    },
    {
      label: "Look 3",
      base: { exposure: -0.02, contrast: -0.02, temperature: -6, tint: 8, saturation: 4 },
      params: { duskMagentaLift: 0.1, icyBlueBalance: 0.08, pastelFade: 0.06 },
    },
    {
      label: "Look 4",
      base: { exposure: 0.06, contrast: -0.1, temperature: -14, tint: 16, saturation: 12 },
      params: { duskMagentaLift: 0.22, icyBlueBalance: 0.16, pastelFade: 0.14 },
    },
    {
      label: "Look 5",
      base: { exposure: 0.1, contrast: -0.14, temperature: -18, tint: 20, saturation: 16 },
      params: { duskMagentaLift: 0.28, icyBlueBalance: 0.2, pastelFade: 0.18 },
    },
    {
      label: "Look 6",
      base: { exposure: -0.01, contrast: -0.01, temperature: -4, tint: 6, saturation: 3 },
      params: { duskMagentaLift: 0.08, icyBlueBalance: 0.06, pastelFade: 0.05 },
    },
    {
      label: "Look 7",
      base: { exposure: 0.12, contrast: -0.18, temperature: -22, tint: 24, saturation: 20 },
      params: { duskMagentaLift: 0.34, icyBlueBalance: 0.26, pastelFade: 0.22 },
    },
    {
      label: "Look 8",
      base: { exposure: 0.02, contrast: -0.06, temperature: -10, tint: 12, saturation: 8 },
      params: { duskMagentaLift: 0.16, icyBlueBalance: 0.12, pastelFade: 0.1 },
    },
    {
      label: "Look 9",
      base: { exposure: 0.15, contrast: -0.2, temperature: -26, tint: 28, saturation: 24 },
      params: { duskMagentaLift: 0.4, icyBlueBalance: 0.32, pastelFade: 0.28 },
    },
  ];

  const chosen = looks[Math.floor(Math.random() * looks.length)];

  const currentPass = (arcticDuskPassMap.get(chosen.label) ?? 0) + 1;
  arcticDuskPassMap.set(chosen.label, currentPass);

  const base = { ...chosen.base };
  const params = { ...chosen.params };

  if (currentPass >= 2) {
    base.exposure = jitter(base.exposure, 0.02, preDramaMultiplier);
    base.contrast = jitter(base.contrast, 0.03, preDramaMultiplier);
    base.temperature = jitter(base.temperature, 2, preDramaMultiplier);
    base.tint = jitter(base.tint, 1, preDramaMultiplier);
    base.saturation = jitter(base.saturation, 2, preDramaMultiplier);

    params.duskMagentaLift = jitter(params.duskMagentaLift, 0.02, preDramaMultiplier);
    params.icyBlueBalance = jitter(params.icyBlueBalance, 0.02, preDramaMultiplier);
    params.pastelFade = jitter(params.pastelFade, 0.02, preDramaMultiplier);
  }

  const debug: WinterRecipeDebug = {
    personalityId: "Arctic Dusk",
    label: chosen.label,
    pass: currentPass,

    // ✅ Keep base for type compatibility (RightUI ignores it for seasonal)
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

  applyWinterHybridEngine(originalImageRef, setImageSrc, debug);
  return debug;
}