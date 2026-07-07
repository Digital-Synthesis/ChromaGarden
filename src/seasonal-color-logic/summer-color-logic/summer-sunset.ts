import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

type SunsetPersonalityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type SunsetRuntimeParams = {
  index: SunsetPersonalityIndex;

  lift: number;
  gamma: number;
  gain: number;
  contrast: number;

  warmth: number;
  solarWarmth: number;
  goldenSaturation: number;
  colorBurn: number;
  vibrance: number;
  saturation: number;
};

/* -------------------------------------------------------
   PERSONALITY DEFINITIONS
------------------------------------------------------- */

const SUNSET_PERSONALITIES: SunsetRuntimeParams[] = [
  {
    index: 0,
    lift: 0.0,
    gamma: 1.0,
    gain: 1.02,
    contrast: 1.02,
    warmth: 0.18,
    solarWarmth: 0.18,
    goldenSaturation: 0.10,
    colorBurn: 0.06,
    vibrance: 1.04,
    saturation: 1.02,
  },
  {
    index: 1,
    lift: -0.01,
    gamma: 0.98,
    gain: 1.03,
    contrast: 1.05,
    warmth: 0.24,
    solarWarmth: 0.24,
    goldenSaturation: 0.16,
    colorBurn: 0.08,
    vibrance: 1.06,
    saturation: 1.04,
  },
  {
    index: 2,
    lift: 0.0,
    gamma: 0.99,
    gain: 1.03,
    contrast: 1.04,
    warmth: 0.22,
    solarWarmth: 0.20,
    goldenSaturation: 0.18,
    colorBurn: 0.08,
    vibrance: 1.07,
    saturation: 1.05,
  },
  {
    index: 3,
    lift: -0.01,
    gamma: 0.97,
    gain: 1.05,
    contrast: 1.07,
    warmth: 0.26,
    solarWarmth: 0.26,
    goldenSaturation: 0.20,
    colorBurn: 0.10,
    vibrance: 1.08,
    saturation: 1.06,
  },
  {
    index: 4,
    lift: -0.015,
    gamma: 0.96,
    gain: 1.06,
    contrast: 1.10,
    warmth: 0.30,
    solarWarmth: 0.30,
    goldenSaturation: 0.24,
    colorBurn: 0.14,
    vibrance: 1.10,
    saturation: 1.08,
  },
  {
    index: 5,
    lift: -0.02,
    gamma: 0.95,
    gain: 1.07,
    contrast: 1.12,
    warmth: 0.34,
    solarWarmth: 0.34,
    goldenSaturation: 0.26,
    colorBurn: 0.16,
    vibrance: 1.12,
    saturation: 1.10,
  },
  {
    index: 6,
    lift: -0.015,
    gamma: 0.96,
    gain: 1.06,
    contrast: 1.10,
    warmth: 0.30,
    solarWarmth: 0.30,
    goldenSaturation: 0.24,
    colorBurn: 0.14,
    vibrance: 1.12,
    saturation: 1.08,
  },
  {
    index: 7,
    lift: -0.02,
    gamma: 0.94,
    gain: 1.08,
    contrast: 1.15,
    warmth: 0.32,
    solarWarmth: 0.32,
    goldenSaturation: 0.22,
    colorBurn: 0.18,
    vibrance: 1.10,
    saturation: 1.06,
  },
  {
    index: 8,
    lift: -0.005,
    gamma: 0.97,
    gain: 1.05,
    contrast: 1.06,
    warmth: 0.28,
    solarWarmth: 0.28,
    goldenSaturation: 0.24,
    colorBurn: 0.12,
    vibrance: 1.12,
    saturation: 1.10,
  },
];

/* -------------------------------------------------------
   UTILS
------------------------------------------------------- */

function clamp(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

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

/* -------------------------------------------------------
   COLOR SPACE HELPERS — sRGB ↔ Oklab
------------------------------------------------------- */

function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp(Math.round(v * 255), 0, 255);
}

function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  return [L, a, bb];
}

function oklabToRgb(L: number, a: number, bb: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * bb;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

/* -------------------------------------------------------
   HUE / CHROMA / SKIN DETECTION
------------------------------------------------------- */

function getChroma(a: number, bb: number): number {
  return Math.sqrt(a * a + bb * bb);
}

function getHueDegrees(a: number, bb: number): number {
  const angle = (Math.atan2(bb, a) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
}

function isWarmHue(h: number): boolean {
  return h >= 20 && h <= 80;
}

function isRedOrangeHue(h: number): boolean {
  return h <= 40 || h >= 340;
}

function isSkinTone(L: number, a: number, bb: number): boolean {
  const chroma = getChroma(a, bb);
  if (chroma < 0.03 || chroma > 0.20) return false;
  if (L < 0.30 || L > 0.85) return false;

  const h = getHueDegrees(a, bb);
  return h >= 20 && h <= 70;
}

/* -------------------------------------------------------
   PERSONALITY PICK + PARAMS
------------------------------------------------------- */

function pickSunsetPersonality(): SunsetPersonalityIndex {
  return Math.floor(Math.random() * 9) as SunsetPersonalityIndex;
}

function buildSunsetRuntimeParams(
  index: SunsetPersonalityIndex,
  preDramaMultiplier: number = 1
): SunsetRuntimeParams {
  const base = SUNSET_PERSONALITIES[index];

  return {
    index,
    lift: jitter(base.lift, 0.005, preDramaMultiplier),
    gamma: jitter(base.gamma, 0.01, preDramaMultiplier),
    gain: jitter(base.gain, 0.01, preDramaMultiplier),
    contrast: jitter(base.contrast, 0.02, preDramaMultiplier),
    warmth: jitter(base.warmth, 0.04, preDramaMultiplier),
    solarWarmth: jitter(base.solarWarmth, 0.04, preDramaMultiplier),
    goldenSaturation: jitter(base.goldenSaturation, 0.03, preDramaMultiplier),
    colorBurn: jitter(base.colorBurn, 0.03, preDramaMultiplier),
    vibrance: jitter(base.vibrance, 0.03, preDramaMultiplier),
    saturation: jitter(base.saturation, 0.03, preDramaMultiplier),
  };
}

/* -------------------------------------------------------
   TONE CURVE
------------------------------------------------------- */

function applyToneCurve(
  L: number,
  lift: number,
  gamma: number,
  gain: number,
  contrast: number
): number {
  let x = L;

  x = x * gain + lift;

  if (gamma !== 1.0 && gamma > 0.01) {
    x = Math.pow(clamp(x, 0, 1), gamma);
  }

  const pivot = 0.5;
  x = (x - pivot) * contrast + pivot;

  return clamp(x, 0, 1);
}

/* -------------------------------------------------------
   SUNSET ENGINE
------------------------------------------------------- */

function applySunsetToneAndColor(
  imageData: ImageData,
  params: SunsetRuntimeParams
) {
  const { data } = imageData;
  const {
    lift,
    gamma,
    gain,
    contrast,
    warmth,
    solarWarmth,
    goldenSaturation,
    colorBurn,
    vibrance,
    saturation,
  } = params;

  const warmPivot = 0.30;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    if (alpha === 0) continue;

    let [L, a, bb] = rgbToOklab(r, g, b);
    const origL = L;
    const origA = a;
    const origB = bb;

    const chroma = getChroma(a, bb);
    const hue = getHueDegrees(a, bb);
    const skin = isSkinTone(L, a, bb);

    /* Tone */
    L = applyToneCurve(L, lift, gamma, gain, contrast);

    /* Warmth */
    let warmT =
      L < warmPivot
        ? L / warmPivot
        : (L - warmPivot) / (1 - warmPivot);

    warmT = clamp(warmT, 0, 1);

    let warmFactor = 1.0;
    if (isWarmHue(hue)) warmFactor *= 0.35;
    if (isRedOrangeHue(hue)) warmFactor *= 0.25;
    if (chroma > 0.16) warmFactor *= 0.5;
    if (skin) warmFactor *= 0.15;

    const warmthBoost = warmth * warmFactor * (0.4 + 0.6 * warmT);

    a += warmthBoost * 0.10;
    bb += warmthBoost * 0.05;

    /* Golden Saturation */
    let satT = 0;
    if (L >= 0.20 && L <= 0.80) {
      satT = (L - 0.20) / (0.80 - 0.20);
    }
    satT = clamp(satT, 0, 1);

    let satFactor = 1.0;
    if (chroma > 0.18) satFactor *= 0.5;
    if (isRedOrangeHue(hue)) satFactor *= 0.4;
    if (skin) satFactor *= 0.2;

    const goldenSatBoost = goldenSaturation * satFactor * satT;

    let newChroma = getChroma(a, bb);
    if (newChroma > 0) {
      const targetChroma = newChroma * (1 + goldenSatBoost);
      const scale = targetChroma / newChroma;
      a *= scale;
      bb *= scale;
    }

    /* Color Burn */
    if (colorBurn > 0 && !skin) {
      const mid = L > 0.20 && L < 0.80;
      const neutralish = chroma < 0.12;

      if (mid && neutralish && !isRedOrangeHue(hue)) {
        const burnT = (L - 0.20) / (0.80 - 0.20);
        const burnStrength = colorBurn * clamp(burnT, 0, 1);

        const c = getChroma(a, bb);
        if (c > 0) {
          const burned = c * (1 + burnStrength * 0.6);
          const scale = burned / c;
          a *= scale;
          bb *= scale;
        }
      }
    }

    /* Vibrance */
    if (vibrance !== 1.0) {
      const c = getChroma(a, bb);
      if (c > 0) {
        let t = clamp((L - 0.15) / 0.7, 0, 1);

        if (skin) t *= 0.2;
        else if (isWarmHue(hue)) t *= 0.6;

        const target = c * vibrance;
        const newC = lerp(c, target, t);
        const scale = newC / c;
        a *= scale;
        bb *= scale;
      }
    }

    /* Global Saturation */
    if (saturation !== 1.0) {
      const c = getChroma(a, bb);
      if (c > 0) {
        let satT2 = 1.0;

        if (c > 0.20) satT2 *= 0.5;
        if (skin) satT2 *= 0.3;

        const target = c * (1 + (saturation - 1) * satT2);
        const scale = target / c;
        a *= scale;
        bb *= scale;
      }
    }

    /* Solar Warmth */
    if (solarWarmth > 0) {
      let solarT = 0;
      if (L >= 0.15 && L <= 0.85) {
        solarT = (L - 0.15) / (0.85 - 0.15);
      }
      solarT = clamp(solarT, 0, 1);

      let solarFactor = 1.0;
      if (isWarmHue(hue)) solarFactor *= 0.4;
      if (isRedOrangeHue(hue)) solarFactor *= 0.3;
      if (chroma > 0.18) solarFactor *= 0.5;
      if (skin) solarFactor *= 0.1;

      const solarBoost = solarWarmth * solarFactor * (0.3 + 0.7 * solarT);

      a += solarBoost * 0.08;
      bb += solarBoost * 0.04;
    }

    /* Final Safety Clamp */
    const maxDeltaChroma = 0.25;
    const origChroma = getChroma(origA, origB);
    const newChroma2 = getChroma(a, bb);
    const deltaChroma = newChroma2 - origChroma;

    if (deltaChroma > maxDeltaChroma) {
      const allowed = origChroma + maxDeltaChroma;
      if (newChroma2 > 0) {
        const scale = allowed / newChroma2;
        a *= scale;
        bb *= scale;
      }
    }

    if (skin) {
      const blend = 0.35;
      a = lerp(a, origA, blend);
      bb = lerp(bb, origB, blend);
      L = lerp(L, origL, 0.25);
    }

    const [nr, ng, nb] = oklabToRgb(L, a, bb);

    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }
}

/* -------------------------------------------------------
   DOWNSCALE HELPER
------------------------------------------------------- */

function downscaleImage(
  img: HTMLImageElement,
  maxSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const { naturalWidth: w, naturalHeight: h } = img;

  if (Math.max(w, h) <= maxSize) {
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  const scale = maxSize / Math.max(w, h);
  const newW = Math.round(w * scale);
  const newH = Math.round(h * scale);

  canvas.width = newW;
  canvas.height = newH;
  ctx.drawImage(img, 0, 0, newW, newH);

  return canvas;
}

/* -------------------------------------------------------
   EXPORTED APPLY FUNCTION
------------------------------------------------------- */

export function applySummerSunsetGrade(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string) => void,
  preDramaMultiplier: number = 1
): any {
  if (!originalImageRef.current) {
    return { profile: null, params: null };
  }

  const img = originalImageRef.current;

  const previewCanvas = downscaleImage(img, 1600);
  const ctx = previewCanvas.getContext("2d");
  if (!ctx) return { profile: null, params: null };

  const width = previewCanvas.width;
  const height = previewCanvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);

  // Debug-only profile (does not drive the recipe)
  const profile = analyzeOriginalImageFromElement(img);

  // Pick personality + jittered params
  const personality = pickSunsetPersonality();
  const params = buildSunsetRuntimeParams(personality, preDramaMultiplier);

  // ✅ Build debug object FIRST
  const debug = {
    personalityId: params.index,
    label: `Sunset ${params.index}`,
    pass: 1,
    base: {
      exposure: 0,
      contrast: params.contrast,
      temperature: 0,
      tint: 0,
      saturation: params.saturation,
    },
    params: { ...params },
    adaptive: {
      avgLuma: profile.avgLuma ?? 0,
      shadowPercent: profile.shadowPercent ?? 0,
      highlightPercent: profile.highlightPercent ?? 0,
      avgSaturation: profile.avgSaturation ?? 0,
    },
  };

  // ✅ Apply tone + color using debug.params
  applySunsetToneAndColor(imageData, debug.params);

  ctx.putImageData(imageData, 0, 0);

  const result = previewCanvas.toDataURL("image/png");
  setImageSrc(result);

  return debug;
}