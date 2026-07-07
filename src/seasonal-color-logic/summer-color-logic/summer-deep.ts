import type React from "react";
import { analyzeOriginalImageFromElement } from "../../shared/original-analysis";
import { adaptParamsToImage } from "./index";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

export type DeepPersonalityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DeepRuntimeParams = {
  index: DeepPersonalityIndex;
  personalityId: number;
  label: string;

  depthContrast: number;
  hueSeparation: number;
  microContrast: number;
  chromaDepth: number;
  highlightCompression: number;
  cleanBlacks: number;
  colorDensity: number;
  shadowLift: number;
  highlightLift: number;
};

/* -------------------------------------------------------
   PERSONALITY DEFINITIONS — 1.x–3.x BASES
------------------------------------------------------- */

const DEEP_PERSONALITIES: DeepRuntimeParams[] = [
  {
    index: 0,
    personalityId: 0,
    label: "Deep Chrome",
    depthContrast: 1.0400000000000000,
    hueSeparation: 1.4300000000000000,
    microContrast: 1.8200000000000000,
    chromaDepth: 1.2350000000000000,
    highlightCompression: 0.8450000000000000,
    cleanBlacks: 0.9100000000000000,
    colorDensity: 1.1050000000000000,
    shadowLift: 0.6500000000000000,
    highlightLift: 1.0400000000000000,
  },
  {
    index: 1,
    personalityId: 1,
    label: "Deep Noir",
    depthContrast: 1.9500000000000000,
    hueSeparation: 0.6500000000000000,
    microContrast: 1.1700000000000000,
    chromaDepth: 0.7150000000000000,
    highlightCompression: 1.6900000000000000,
    cleanBlacks: 1.9500000000000000,
    colorDensity: 0.7800000000000000,
    shadowLift: 0.6500000000000000,
    highlightLift: 0.7150000000000000,
  },
  {
    index: 2,
    personalityId: 2,
    label: "Deep Ember",
    depthContrast: 1.3000000000000000,
    hueSeparation: 1.0400000000000000,
    microContrast: 1.3000000000000000,
    chromaDepth: 1.8200000000000000,
    highlightCompression: 1.0400000000000000,
    cleanBlacks: 0.9750000000000000,
    colorDensity: 1.6900000000000000,
    shadowLift: 0.7800000000000000,
    highlightLift: 1.1700000000000000,
  },
  {
    index: 3,
    personalityId: 3,
    label: "Deep Arctic",
    depthContrast: 1.2350000000000000,
    hueSeparation: 1.8850000000000000,
    microContrast: 1.6250000000000000,
    chromaDepth: 0.7800000000000000,
    highlightCompression: 1.1050000000000000,
    cleanBlacks: 1.0400000000000000,
    colorDensity: 0.9750000000000000,
    shadowLift: 0.9100000000000000,
    highlightLift: 1.2350000000000000,
  },
  {
    index: 4,
    personalityId: 4,
    label: "Deep Velvet",
    depthContrast: 0.7800000000000000,
    hueSeparation: 1.1050000000000000,
    microContrast: 0.7150000000000000,
    chromaDepth: 1.8850000000000000,
    highlightCompression: 0.8450000000000000,
    cleanBlacks: 0.8450000000000000,
    colorDensity: 1.8200000000000000,
    shadowLift: 0.9750000000000000,
    highlightLift: 1.1050000000000000,
  },
  {
    index: 5,
    personalityId: 5,
    label: "Deep Steel",
    depthContrast: 1.6900000000000000,
    hueSeparation: 0.7800000000000000,
    microContrast: 1.7550000000000000,
    chromaDepth: 1.3000000000000000,
    highlightCompression: 1.1700000000000000,
    cleanBlacks: 1.4300000000000000,
    colorDensity: 1.1700000000000000,
    shadowLift: 0.7800000000000000,
    highlightLift: 0.9750000000000000,
  },
  {
    index: 6,
    personalityId: 6,
    label: "Deep Solar",
    depthContrast: 1.3650000000000000,
    hueSeparation: 1.1700000000000000,
    microContrast: 1.3650000000000000,
    chromaDepth: 1.8850000000000000,
    highlightCompression: 1.2350000000000000,
    cleanBlacks: 0.7800000000000000,
    colorDensity: 1.7550000000000000,
    shadowLift: 1.0400000000000000,
    highlightLift: 1.4950000000000000,
  },
  {
    index: 7,
    personalityId: 7,
    label: "Deep Obsidian",
    depthContrast: 1.9500000000000000,
    hueSeparation: 0.7150000000000000,
    microContrast: 1.5600000000000000,
    chromaDepth: 0.6500000000000000,
    highlightCompression: 1.8200000000000000,
    cleanBlacks: 1.9500000000000000,
    colorDensity: 0.8450000000000000,
    shadowLift: 0.6500000000000000,
    highlightLift: 0.7800000000000000,
  },
  {
    index: 8,
    personalityId: 8,
    label: "Deep Bloom",
    depthContrast: 0.8450000000000000,
    hueSeparation: 1.3000000000000000,
    microContrast: 0.7800000000000000,
    chromaDepth: 1.7550000000000000,
    highlightCompression: 0.9100000000000000,
    cleanBlacks: 0.7800000000000000,
    colorDensity: 1.8850000000000000,
    shadowLift: 1.1050000000000000,
    highlightLift: 1.3000000000000000,
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

function pickDeepPersonality(): DeepPersonalityIndex {
  return Math.floor(Math.random() * 9) as DeepPersonalityIndex;
}

function buildDeepRuntimeParams(
  index: DeepPersonalityIndex,
  preDramaMultiplier: number = 1
): DeepRuntimeParams {
  const base = DEEP_PERSONALITIES[index];

  // Strong jitter: 0.3–0.8 range
  const jitterAmount = 0.8;

  return {
    index: base.index,
    personalityId: base.personalityId,
    label: base.label,

    depthContrast: jitter(base.depthContrast, jitterAmount, preDramaMultiplier),
    hueSeparation: jitter(base.hueSeparation, jitterAmount, preDramaMultiplier),
    microContrast: jitter(base.microContrast, jitterAmount, preDramaMultiplier),
    chromaDepth: jitter(base.chromaDepth, jitterAmount, preDramaMultiplier),
    highlightCompression: jitter(base.highlightCompression, jitterAmount, preDramaMultiplier),
    cleanBlacks: jitter(base.cleanBlacks, jitterAmount, preDramaMultiplier),
    colorDensity: jitter(base.colorDensity, jitterAmount, preDramaMultiplier),
    shadowLift: jitter(base.shadowLift, jitterAmount, preDramaMultiplier),
    highlightLift: jitter(base.highlightLift, jitterAmount, preDramaMultiplier),
  };
}

/* -------------------------------------------------------
   DEEP SUMMER ENGINE
------------------------------------------------------- */

function applyDeepToneAndColor(
  imageData: ImageData,
  params: DeepRuntimeParams
) {
  const { data } = imageData;

  const {
    depthContrast,
    hueSeparation,
    microContrast,
    chromaDepth,
    highlightCompression,
    cleanBlacks,
    colorDensity,
    shadowLift,
    highlightLift,
  } = params;

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
    const skin = isSkinTone(L, a, bb);

    // Scale factors so 1.x–3.x are strong but not nuclear
    const depthScale = 0.18;
    const microScale = 0.10;
    const chromaScale = 0.22;
    const cleanBlackScale = 0.40;
    const colorDensityScale = 0.22;
    const shadowLiftScale = 0.10;
    const highlightLiftScale = 0.10;
    const hueSepScale = 0.06;
    const highlightCompressionScale = 0.20;

    const depthAmount = depthContrast * depthScale;
    const microAmount = microContrast * microScale;
    const chromaAmount = chromaDepth * chromaScale;
    const cleanBlackAmount = cleanBlacks * cleanBlackScale;
    const colorDensityAmount = colorDensity * colorDensityScale;
    const shadowLiftAmount = shadowLift * shadowLiftScale;
    const highlightLiftAmount = highlightLift * highlightLiftScale;
    const hueSepAmount = hueSeparation * hueSepScale;
    const highlightCompressionAmount = highlightCompression * highlightCompressionScale;

    /* ---------------------------------------------------
       1) DEPTH CONTRAST
    --------------------------------------------------- */

    const shadowT = clamp((0.5 - L) * 2, 0, 1);
    const highlightT = clamp((L - 0.5) * 2, 0, 1);

    L -= depthAmount * shadowT;
    L += depthAmount * 0.6 * highlightT;

    /* ---------------------------------------------------
       2) SHADOW LIFT / HIGHLIGHT LIFT
    --------------------------------------------------- */

    L += shadowLiftAmount * shadowT;
    L += highlightLiftAmount * highlightT;

    /* ---------------------------------------------------
       3) HUE SEPARATION
    --------------------------------------------------- */

    if (!skin) {
      const sep = hueSepAmount;
      const angle = (Math.atan2(bb, a) + sep) % (Math.PI * 2);
      const c = getChroma(a, bb);
      a = Math.cos(angle) * c;
      bb = Math.sin(angle) * c;
    }

    /* ---------------------------------------------------
       4) CHROMA DEPTH
    --------------------------------------------------- */

    if (chroma > 0 && chroma < 0.40) {
      const t = chroma / 0.40;
      const scale = 1 + chromaAmount * t;
      a *= scale;
      bb *= scale;
    }

    /* ---------------------------------------------------
       5) CLEAN BLACKS
    --------------------------------------------------- */

    if (L < 0.25) {
      const t = 1 - L / 0.25;
      const scale = 1 - cleanBlackAmount * t;
      a *= scale;
      bb *= scale;
    }

    /* ---------------------------------------------------
       6) HIGHLIGHT COMPRESSION
    --------------------------------------------------- */

    if (L > 0.75) {
      const t = (L - 0.75) / 0.25;
      const target = 0.75 + t * 0.18;
      L = lerp(L, target, highlightCompressionAmount * t);
    }

    /* ---------------------------------------------------
       7) COLOR DENSITY
    --------------------------------------------------- */

    if (!skin) {
      const c = getChroma(a, bb);
      if (c > 0) {
        const scale = 1 + colorDensityAmount;
        a *= scale;
        bb *= scale;
      }
    }

    /* ---------------------------------------------------
       8) MICRO‑CONTRAST (GLOBAL APPROX)
    --------------------------------------------------- */

    const micro = microAmount;
    L = clamp(L * (1 + micro), 0, 1);

    /* ---------------------------------------------------
       9) SKIN PROTECTION
    --------------------------------------------------- */

    if (skin) {
      a = lerp(a, origA, 0.35);
      bb = lerp(bb, origB, 0.35);
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

export function applySummerDeepGrade(
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
  const personality = pickDeepPersonality();
  let params = buildDeepRuntimeParams(personality, preDramaMultiplier);

  // Adaptive scaling
  params = adaptParamsToImage(profile, params);

  // ✅ Build debug object FIRST
  const debug = {
    personalityId: params.personalityId,
    label: params.label,
    pass: 1, // Deep has no pass logic
    base: {
      exposure: 0,
      contrast: params.depthContrast,
      temperature: 0,
      tint: 0,
      saturation: 1,
    },
    params: { ...params },
    adaptive: {
      avgLuma: profile.avgLuma ?? 0,
      shadowPercent: profile.shadowPercent ?? 0,
      highlightPercent: profile.highlightPercent ?? 0,
      avgSaturation: profile.avgSaturation ?? 0,
    },
  };

  // ✅ Apply tone + color using debug.params (Manual Tweaks compatible)
  applyDeepToneAndColor(imageData, debug.params);

  ctx.putImageData(imageData, 0, 0);

  const result = previewCanvas.toDataURL("image/png");
  setImageSrc(result);

  return debug;
}