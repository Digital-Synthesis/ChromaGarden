// ------------------------------------------------------------
// Manual Tweak Pixel Math — universal, lightweight, safe
// Consolidates ALL tweak math including:
// - Blue Shadow Boost
// - Highlight Neutral Lift
// - Snow Crispness
// - All Autumn / Spring / Winter / Portrait creative params
// - Black & White filmic tonal controls
// - Curvy Adaptive curve transforms (NEW)
// ------------------------------------------------------------

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/* ---------------------------------------------------------
   COLD DAYLIGHT — EXTRACTED FROM adjustmentWorker.ts
--------------------------------------------------------- */

export function applyBlueShadowBoost(r: number, g: number, b: number, amt: number) {
  const strength = amt * 0.3;
  const luma = 0.3 * r + 0.59 * g + 0.11 * b;
  const shadowMask = clamp01((0.45 - luma) * 3);
  if (shadowMask <= 0) return [r, g, b];
  const k = strength * shadowMask;
  return [
    clamp01(r - k * 0.18),
    clamp01(g - k * 0.12),
    clamp01(b + k * 0.35),
  ];
}

export function applyHighlightNeutralLift(r: number, g: number, b: number, amt: number) {
  const strength = amt * 0.3;
  const luma = 0.3 * r + 0.59 * g + 0.11 * b;
  const highlightMask = clamp01((luma - 0.6) * 2.5);
  if (highlightMask <= 0) return [r, g, b];
  const k = strength * highlightMask;
  const avg = (r + g + b) / 3;
  let nr = r + (avg - r) * 0.6 * k;
  let ng = g + (avg - g) * 0.6 * k;
  let nb = b + (avg - b) * 0.4 * k;
  const lift = 0.08 * k;
  nr = clamp01(nr + lift);
  ng = clamp01(ng + lift);
  nb = clamp01(nb + lift);
  return [nr, ng, nb];
}

export function applySnowCrispness(r: number, g: number, b: number, amt: number) {
  const strength = amt * 0.3;
  const luma = 0.3 * r + 0.59 * g + 0.11 * b;
  const brightMask = clamp01((luma - 0.5) * 2.2);
  if (brightMask <= 0) return [r, g, b];
  const k = strength * brightMask;
  const mid = 0.65;
  const contrastFactor = 1 + 0.6 * k;
  const applyC = (v: number) => clamp01((v - mid) * contrastFactor + mid);
  let nr = applyC(r);
  let ng = applyC(g);
  let nb = applyC(b);
  const gray = luma;
  const satBoost = 0.25 * k;
  nr = clamp01(gray + (nr - gray) * (1 + satBoost));
  ng = clamp01(gray + (ng - gray) * (1 + satBoost));
  nb = clamp01(gray + (nb - gray) * (1 + satBoost));
  return [nr, ng, nb];
}

/* ---------------------------------------------------------
   WINTER — SIMPLE RGB TWEAKS
--------------------------------------------------------- */

export function applyGraySoftening(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applyBlueMelt(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.05), clamp01(g + t * 0.05), clamp01(b + t * 0.1)];
}

export function applySnowFlatten(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applySteelBlueShift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g - t * 0.05), clamp01(b + t)];
}

export function applyConcreteNeutralLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applyUrbanShadowControl(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g - t * 0.1), clamp01(b - t * 0.05)];
}

export function applyCoolShadowDepth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.05), clamp01(g - t * 0.05), clamp01(b + t)];
}

export function applyGreenBlueCast(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g + t * 0.15), clamp01(b + t * 0.2)];
}

export function applyWarmHighlightLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.15), clamp01(g + t * 0.05), b];
}

export function applyColdBlackDepth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.15), clamp01(g - t * 0.15), clamp01(b - t * 0.1)];
}

export function applyIcyBluePunch(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.15), clamp01(g - t * 0.05), clamp01(b + t * 0.25)];
}

export function applyEdgeCrispness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01((r - 0.5) * (1 + t * 0.2) + 0.5),
    clamp01((g - 0.5) * (1 + t * 0.2) + 0.5),
    clamp01((b - 0.5) * (1 + t * 0.2) + 0.5),
  ];
}

export function applyDuskMagentaLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.2), clamp01(g - t * 0.05), clamp01(b + t * 0.1)];
}

export function applyIcyBlueBalance(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g - t * 0.05), clamp01(b + t * 0.2)];
}

export function applyPastelFade(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = 0.5;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

/* ---------------------------------------------------------
   AUTUMN — RGB TWEAKS
--------------------------------------------------------- */

export function applyBrickWarmth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.4), clamp01(g + t * 0.1), clamp01(b - t * 0.1)];
}

export function applyConcreteNeutral(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applyFoliageAccent(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g + t * 0.3), clamp01(b - t * 0.1)];
}

export function applyShadowAmber(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const luma = (r + g + b) / 3;
  const k = (1 - luma) * t;
  return [clamp01(r + k * 0.5), clamp01(g + k * 0.2), clamp01(b - k * 0.1)];
}

export function applyHorizonRollOff(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applySkyDepth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g - t * 0.05), clamp01(b + t)];
}

export function applyCanopyWarmth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.4), clamp01(g + t * 0.2), clamp01(b - t * 0.1)];
}

export function applyLeafSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g + t * 0.3), clamp01(b - t * 0.1)];
}

export function applyTrunkDepth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.2), clamp01(g - t * 0.1), clamp01(b - t * 0.05)];
}

export function applyFieldGlow(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.3), clamp01(g + t * 0.2), clamp01(b + t * 0.1)];
}

export function applyGrassSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g + t * 0.4), clamp01(b - t * 0.1)];
}

export function applySkyBalance(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g - t * 0.05), clamp01(b + t)];
}

export function applyFogDensity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = 0.75;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applyHorizonSoftness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applyFieldSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.2), clamp01(b + t * 0.1)];
}

export function applyBarkDepth(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.2), clamp01(g - t * 0.1), clamp01(b - t * 0.05)];
}

export function applyMossSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r - t * 0.1), clamp01(g + t * 0.4), clamp01(b - t * 0.1)];
}

export function applyCanopyShadow(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const luma = (r + g + b) / 3;
  const k = (1 - luma) * t;
  return [clamp01(r - k * 0.1), clamp01(g - k * 0.1), clamp01(b - k * 0.1)];
}

/* ---------------------------------------------------------
   SPRING — RGB TWEAKS
--------------------------------------------------------- */

export function applyPetalGlow(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.2), clamp01(g + t * 0.1), clamp01(b + t * 0.15)];
}

export function applyHalation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.15), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applySkinBloom(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.05), clamp01(b + t * 0.05)];
}

export function applyFoliageSoftness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.05), clamp01(g + t * 0.15), clamp01(b + t * 0.05)];
}

export function applyDappleLight(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.05)];
}

export function applyNeutralBalance(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [clamp01(r + t * 0.1), clamp01(g + t * 0.1), clamp01(b + t * 0.1)];
}

export function applyMistDensity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applyDewLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.05),
    clamp01(g + t * 0.05),
    clamp01(b + t * 0.1),
  ];
}

export function applyCoolAir(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r - t * 0.05),
    clamp01(g - t * 0.05),
    clamp01(b + t * 0.15),
  ];
}

export function applyGrayBalance(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applyRainSoftness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.1),
    clamp01(b + t * 0.1),
  ];
}

export function applyCoolMist(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r - t * 0.05),
    clamp01(g - t * 0.05),
    clamp01(b + t * 0.1),
  ];
}

export function applyGreenFreshness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r - t * 0.05),
    clamp01(g + t * 0.2),
    clamp01(b - t * 0.05),
  ];
}

export function applyFieldAir(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.1),
    clamp01(b + t * 0.05),
  ];
}

export function applyPastelShift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = 0.5;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applySkyLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r - t * 0.1),
    clamp01(g - t * 0.05),
    clamp01(b + t),
  ];
}

export function applyCloudSoftness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.1),
    clamp01(b + t * 0.05),
  ];
}

export function applyBluePurity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r - t * 0.05),
    clamp01(g - t * 0.05),
    clamp01(b + t * 0.2),
  ];
}

/* ---------------------------------------------------------
   PORTRAIT — HUMAN ESSENCE
--------------------------------------------------------- */

export function applyWarmMidtones(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.05),
    b,
  ];
}

export function applyCoolShadows(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    r,
    clamp01(g - t * 0.05),
    clamp01(b + t * 0.1),
  ];
}

export function applyPastelCompression(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = 0.5;
  return [
    clamp01(r * (1 - t) + gray * t),
    clamp01(g * (1 - t) + gray * t),
    clamp01(b * (1 - t) + gray * t),
  ];
}

export function applySkinProtectStrength(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(gray + (r - gray) * (1 - t * 0.2)),
    clamp01(gray + (g - gray) * (1 - t * 0.2)),
    clamp01(gray + (b - gray) * (1 - t * 0.2)),
  ];
}

export function applyMicroContrast(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01((r - 0.5) * (1 + t * 0.2) + 0.5),
    clamp01((g - 0.5) * (1 + t * 0.2) + 0.5),
    clamp01((b - 0.5) * (1 + t * 0.2) + 0.5),
  ];
}

export function applyHighlightSheen(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.1),
    clamp01(b + t * 0.1),
  ];
}

export function applyShadowSoftness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t * 0.1),
    clamp01(g + t * 0.1),
    clamp01(b + t * 0.1),
  ];
}

export function applyColorDensity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const gray = (r + g + b) / 3;
  return [
    clamp01(gray + (r - gray) * (1 + t)),
    clamp01(gray + (g - gray) * (1 + t)),
    clamp01(gray + (b - gray) * (1 + t)),
  ];
}

export function applyBackgroundSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    r,
    g,
    clamp01(b + t * 0.1),
  ];
}

/* ---------------------------------------------------------
   BLACK & WHITE — FILMIC TONAL CONTROLS
--------------------------------------------------------- */

export function applyBWContrast(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const mid = 0.5;
  const applyC = (v: number) => clamp01((v - mid) * (1 + t) + mid);
  return [applyC(r), applyC(g), applyC(b)];
}

export function applyBWShadowDensity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((0.35 - L) * 3);
  if (mask <= 0) return [r, g, b];
  const k = t * mask;
  return [
    clamp01(r * (1 - k)),
    clamp01(g * (1 - k)),
    clamp01(b * (1 - k)),
  ];
}

export function applyBWHighlightDensity(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((L - 0.65) * 3);
  if (mask <= 0) return [r, g, b];
  const k = t * mask;
  return [
    clamp01(r - k * 0.2),
    clamp01(g - k * 0.2),
    clamp01(b - k * 0.2),
  ];
}

export function applyBWMidtoneBalance(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = 1 - Math.abs(L - 0.5) * 3;
  const k = clamp01(mask) * t;
  return [
    clamp01(r + k * 0.15),
    clamp01(g + k * 0.15),
    clamp01(b + k * 0.15),
  ];
}

export function applyBWToeStrength(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((0.4 - L) * 2.5);
  const k = t * mask;
  return [
    clamp01(r + k * 0.2),
    clamp01(g + k * 0.2),
    clamp01(b + k * 0.2),
  ];
}

export function applyBWShoulderStrength(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((L - 0.6) * 2.5);
  const k = t * mask;
  return [
    clamp01(r - k * 0.25),
    clamp01(g - k * 0.25),
    clamp01(b - k * 0.25),
  ];
}

export function applyBWMatteStrength(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const low = 0.06 * t;
  const high = 1 - 0.06 * t;
  const applyM = (v: number) => clamp01(low + (high - low) * v);
  return [applyM(r), applyM(g), applyM(b)];
}

/* ---------------------------------------------------------
   CURVY — ADAPTIVE B&W PERSONALITY (NEW)
--------------------------------------------------------- */

export function applyCurvyHighlightRolloff(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((L - 0.65) * 2.2);
  if (mask <= 0) return [r, g, b];
  const k = t * mask;
  return [
    clamp01(r - k * 0.20),
    clamp01(g - k * 0.20),
    clamp01(b - k * 0.20),
  ];
}

export function applyCurvyFilmicShoulder(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((L - 0.55) * 2.0);
  const k = t * mask;
  return [
    clamp01(r - k * 0.25),
    clamp01(g - k * 0.25),
    clamp01(b - k * 0.25),
  ];
}

export function applyCurvyShadowLift(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((0.4 - L) * 2.5);
  const k = t * mask;
  return [
    clamp01(r + k * 0.18),
    clamp01(g + k * 0.18),
    clamp01(b + k * 0.18),
  ];
}

export function applyCurvyFilmicToe(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const L = 0.3*r + 0.59*g + 0.11*b;
  const mask = clamp01((0.3 - L) * 3.0);
  const k = t * mask;
  return [
    clamp01(r - k * 0.15),
    clamp01(g - k * 0.15),
    clamp01(b - k * 0.15),
  ];
}

export function applyCurvyColorSeparation(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  const mid = 0.5;
  const applyC = (v: number) =>
    clamp01((v - mid) * (1 + t * 0.15) + mid);
  return [applyC(r), applyC(g), applyC(b)];
}

export function applyCurvyBrightness(r: number, g: number, b: number, amt: number) {
  const t = amt * 0.3;
  return [
    clamp01(r + t),
    clamp01(g + t),
    clamp01(b + t),
  ];
}

// base pixel math functions for Exposure, Contrast, Temperature, Tint & Saturation //

export function applyManualExposure(r: number, g: number, b: number, amt: number) {
  const k = amt * 0.25; // gentle, safe
  return [
    clamp01(r * Math.pow(2, k)),
    clamp01(g * Math.pow(2, k)),
    clamp01(b * Math.pow(2, k)),
  ];
}

export function applyManualContrast(r: number, g: number, b: number, amt: number) {
  const k = amt * 0.25;
  const mid = 0.5;
  const applyC = (v: number) => clamp01((v - mid) * (1 + k) + mid);
  return [applyC(r), applyC(g), applyC(b)];
}

export function applyManualTemperature(r: number, g: number, b: number, amt: number) {
  const k = amt * 0.15;
  return [
    clamp01(r + k),
    g,
    clamp01(b - k),
  ];
}

export function applyManualTint(r: number, g: number, b: number, amt: number) {
  const k = amt * 0.15;
  return [
    r,
    clamp01(g + k),
    clamp01(b - k),
  ];
}

export function applyManualSaturation(r: number, g: number, b: number, amt: number) {
  const k = amt * 0.25;
  const gray = (r + g + b) / 3;
  return [
    clamp01(gray + (r - gray) * (1 + k)),
    clamp01(gray + (g - gray) * (1 + k)),
    clamp01(gray + (b - gray) * (1 + k)),
  ];
}