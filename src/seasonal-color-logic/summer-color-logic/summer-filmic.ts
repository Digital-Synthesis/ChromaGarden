import type React from "react";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

type ImageProfileColor = {
  avgLuma: number;
  contrast: number;
  shadowDensity: number;
  highlightDensity: number;
  midtoneBalance: number;
};

type FilmicPersonalityId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type FilmicBaseParams = {
  contrast: number;
  saturation: number;
  vibrance: number;
  warmth: number;
  coolShadows: number;
  warmHighlights: number;
  curveStrength: number;
  highlightRolloff: number;
  shadowDepth: number;
  matteStrength: number;
};

type FilmicVariationEnvelope = {
  contrast: number;
  saturation: number;
  vibrance: number;
  warmth: number;
  coolShadows: number;
  warmHighlights: number;
  curveStrength: number;
  highlightRolloff: number;
  shadowDepth: number;
  matteStrength: number;
};

type FilmicPersonality = {
  personalityId: FilmicPersonalityId;
  label: string;
  base: FilmicBaseParams;
  variation: FilmicVariationEnvelope;
};

type FilmicRuntimeParams = FilmicBaseParams & {
  personalityId: FilmicPersonalityId;
  label: string;
  pass: number;
};

/* -------------------------------------------------------
   UTILS
------------------------------------------------------- */

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function randInRange(
  center: number,
  range: number,
  preDramaMultiplier: number = 1
): number {
  const half = range / 2;
  const jitterDelta = Math.random() * range - half;
  const effectiveDelta =
    preDramaMultiplier === 1 ? jitterDelta : jitterDelta * preDramaMultiplier;
  return center + effectiveDelta;
}

/* -------------------------------------------------------
   OKLAB HELPERS
------------------------------------------------------- */

function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const sr = Math.pow(r / 255, 2.2);
  const sg = Math.pow(g / 255, 2.2);
  const sb = Math.pow(b / 255, 2.2);

  const l = 0.4122214708 * sr + 0.5363325363 * sg + 0.0514459929 * sb;
  const m = 0.2119034982 * sr + 0.6806995451 * sg + 0.1073969566 * sb;
  const s = 0.0883024619 * sr + 0.2817188376 * sg + 0.6299787005 * sb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [
    clamp(Math.round(255 * Math.pow(lr, 1 / 2.2)), 0, 255),
    clamp(Math.round(255 * Math.pow(lg, 1 / 2.2)), 0, 255),
    clamp(Math.round(255 * Math.pow(lb, 1 / 2.2)), 0, 255),
  ];
}

/* -------------------------------------------------------
   IMAGE ANALYSIS (DEBUG ONLY)
------------------------------------------------------- */

function analyzeImageColor(imageData: ImageData): ImageProfileColor {
  const { data, width, height } = imageData;
  const total = width * height;

  let sumL = 0;
  let sumL2 = 0;
  let shadowCount = 0;
  let highlightCount = 0;
  let midtoneCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const [L] = rgbToOklab(data[i], data[i + 1], data[i + 2]);
    const l = clamp(L, 0, 1);

    sumL += l;
    sumL2 += l * l;

    if (l < 0.28) shadowCount++;
    else if (l > 0.72) highlightCount++;
    else midtoneCount++;
  }

  const avgLuma = sumL / total;
  const variance = sumL2 / total - avgLuma * avgLuma;
  const contrast = Math.sqrt(Math.max(variance, 0));

  return {
    avgLuma,
    contrast,
    shadowDensity: shadowCount / total,
    highlightDensity: highlightCount / total,
    midtoneBalance: midtoneCount / total,
  };
}

/* -------------------------------------------------------
   SUMMER → FILMIC PERSONALITIES (9 TOTAL)
   Aggressive Hollywood Hybrid (warm highlights + cool shadows)
------------------------------------------------------- */

const FILMIC_PERSONALITIES: FilmicPersonality[] = [
  {
    personalityId: 0,
    label: "Filmic Neutral",
    base: {
      contrast: 1.25,
      saturation: 0.90,
      vibrance: 0.85,
      warmth: 0.10,
      coolShadows: 0.20,
      warmHighlights: 0.25,
      curveStrength: 1.25,
      highlightRolloff: 0.40,
      shadowDepth: 0.20,
      matteStrength: 0.08,
    },
    variation: {
      contrast: 0.30,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 0.25,
      highlightRolloff: 0.20,
      shadowDepth: 0.20,
      matteStrength: 0.10,
    },
  },

  {
    personalityId: 1,
    label: "Filmic Warm",
    base: {
      contrast: 1.20,
      saturation: 0.95,
      vibrance: 0.90,
      warmth: 0.25,
      coolShadows: 0.15,
      warmHighlights: 0.35,
      curveStrength: 1.20,
      highlightRolloff: 0.45,
      shadowDepth: 0.18,
      matteStrength: 0.10,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.20,
      coolShadows: 0.15,
      warmHighlights: 0.20,
      curveStrength: 0.25,
      highlightRolloff: 0.20,
      shadowDepth: 0.20,
      matteStrength: 0.10,
    },
  },

  {
    personalityId: 2,
    label: "Filmic Punchy",
    base: {
      contrast: 1.35,
      saturation: 0.90,
      vibrance: 0.80,
      warmth: 0.15,
      coolShadows: 0.30,
      warmHighlights: 0.30,
      curveStrength: 1.35,
      highlightRolloff: 0.38,
      shadowDepth: 0.25,
      matteStrength: 0.06,
    },
    variation: {
      contrast: 0.35,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 0.30,
      highlightRolloff: 0.20,
      shadowDepth: 0.20,
      matteStrength: 0.08,
    },
  },

  {
    personalityId: 3,
    label: "Filmic Soft",
    base: {
      contrast: 1.10,
      saturation: 0.85,
      vibrance: 0.85,
      warmth: 0.10,
      coolShadows: 0.15,
      warmHighlights: 0.20,
      curveStrength: 1.10,
      highlightRolloff: 0.50,
      shadowDepth: 0.12,
      matteStrength: 0.12,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.15,
      warmHighlights: 0.20,
      curveStrength: 0.20,
      highlightRolloff: 0.20,
      shadowDepth: 0.15,
      matteStrength: 0.12,
    },
  },

  {
    personalityId: 4,
    label: "Filmic Matte",
    base: {
      contrast: 1.05,
      saturation: 0.80,
      vibrance: 0.80,
      warmth: 0.10,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 1.05,
      highlightRolloff: 0.45,
      shadowDepth: 0.10,
      matteStrength: 0.20,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 0.20,
      highlightRolloff: 0.20,
      shadowDepth: 0.15,
      matteStrength: 0.15,
    },
  },

  {
    personalityId: 5,
    label: "Filmic Deep",
    base: {
      contrast: 1.40,
      saturation: 0.85,
      vibrance: 0.75,
      warmth: 0.05,
      coolShadows: 0.35,
      warmHighlights: 0.25,
      curveStrength: 1.40,
      highlightRolloff: 0.35,
      shadowDepth: 0.30,
      matteStrength: 0.05,
    },
    variation: {
      contrast: 0.35,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 0.30,
      highlightRolloff: 0.20,
      shadowDepth: 0.20,
      matteStrength: 0.08,
    },
  },

  {
    personalityId: 6,
    label: "Filmic High-Key",
    base: {
      contrast: 1.15,
      saturation: 0.90,
      vibrance: 0.90,
      warmth: 0.20,
      coolShadows: 0.10,
      warmHighlights: 0.35,
      curveStrength: 1.15,
      highlightRolloff: 0.55,
      shadowDepth: 0.10,
      matteStrength: 0.10,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.20,
      coolShadows: 0.15,
      warmHighlights: 0.20,
      curveStrength: 0.20,
      highlightRolloff: 0.20,
      shadowDepth: 0.15,
      matteStrength: 0.10,
    },
  },

  {
    personalityId: 7,
    label: "Filmic Low-Key",
    base: {
      contrast: 1.45,
      saturation: 0.85,
      vibrance: 0.75,
      warmth: 0.05,
      coolShadows: 0.40,
      warmHighlights: 0.20,
      curveStrength: 1.45,
      highlightRolloff: 0.30,
      shadowDepth: 0.35,
      matteStrength: 0.05,
    },
    variation: {
      contrast: 0.35,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.15,
      coolShadows: 0.20,
      warmHighlights: 0.20,
      curveStrength: 0.30,
      highlightRolloff: 0.20,
      shadowDepth: 0.20,
      matteStrength: 0.08,
    },
  },

  {
    personalityId: 8,
    label: "Filmic Vintage",
    base: {
      contrast: 1.10,
      saturation: 0.80,
      vibrance: 0.75,
      warmth: 0.20,
      coolShadows: 0.15,
      warmHighlights: 0.30,
      curveStrength: 1.10,
      highlightRolloff: 0.50,
      shadowDepth: 0.15,
      matteStrength: 0.15,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.20,
      coolShadows: 0.15,
      warmHighlights: 0.20,
      curveStrength: 0.20,
      highlightRolloff: 0.20,
      shadowDepth: 0.15,
      matteStrength: 0.12,
    },
  },
];

/* -------------------------------------------------------
   PASS TRACKING
------------------------------------------------------- */

const filmicPassMap: Map<FilmicPersonalityId, number> = new Map();

export function resetSummerFilmicPasses(): void {
  filmicPassMap.clear();
}

/* -------------------------------------------------------
   PERSONALITY SELECTION + PASS LOGIC
------------------------------------------------------- */

function pickFilmicPersonality(): FilmicPersonality {
  const index = Math.floor(Math.random() * FILMIC_PERSONALITIES.length);
  return FILMIC_PERSONALITIES[index];
}

function buildFilmicRuntimeParams(
  personality: FilmicPersonality,
  preDramaMultiplier: number = 1
): FilmicRuntimeParams {
  const currentPass =
    (filmicPassMap.get(personality.personalityId) ?? 0) + 1;

  filmicPassMap.set(personality.personalityId, currentPass);

  const { base, variation } = personality;

  if (currentPass === 1) {
    return {
      personalityId: personality.personalityId,
      label: personality.label,
      pass: currentPass,
      ...base,
    };
  }

  return {
    personalityId: personality.personalityId,
    label: personality.label,
    pass: currentPass,
    contrast: randInRange(base.contrast, variation.contrast, preDramaMultiplier),
    saturation: randInRange(base.saturation, variation.saturation, preDramaMultiplier),
    vibrance: randInRange(base.vibrance, variation.vibrance, preDramaMultiplier),
    warmth: randInRange(base.warmth, variation.warmth, preDramaMultiplier),
    coolShadows: randInRange(base.coolShadows, variation.coolShadows, preDramaMultiplier),
    warmHighlights: randInRange(base.warmHighlights, variation.warmHighlights, preDramaMultiplier),
    curveStrength: randInRange(base.curveStrength, variation.curveStrength, preDramaMultiplier),
    highlightRolloff: randInRange(
      base.highlightRolloff,
      variation.highlightRolloff,
      preDramaMultiplier
    ),
    shadowDepth: randInRange(base.shadowDepth, variation.shadowDepth, preDramaMultiplier),
    matteStrength: randInRange(base.matteStrength, variation.matteStrength, preDramaMultiplier),
  };
}

/* -------------------------------------------------------
   FILMIC TONE + COLOR ENGINE
   Aggressive Hollywood Hybrid
------------------------------------------------------- */

function applyFilmicToneAndColor(
  imageData: ImageData,
  params: FilmicRuntimeParams
): void {
  const { data } = imageData;

  const {
    contrast,
    saturation,
    vibrance,
    warmth,
    coolShadows,
    warmHighlights,
    curveStrength,
    highlightRolloff,
    shadowDepth,
    matteStrength,
  } = params;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let [L, a, bb] = rgbToOklab(r, g, b);
    let l = clamp(L, 0, 1);

/* -------------------------------------------------------
       1) Strong Filmic S-Curve
    ------------------------------------------------------- */
    const mid = 0.5;
    const c = contrast;

    // Aggressive S-curve around midtones
    let y = (l - mid) * c + mid;

    // Curve strength: blend between linear and contrasty
    const curve = clamp(curveStrength, 0.0, 1.8);
    y = lerp(l, y, curve);

    // Extra punch in midtones for that blockbuster feel
    const midEmphasis = clamp((l - 0.25) / 0.5, 0, 1);
    const midBoost = (y - mid) * (0.15 * midEmphasis);
    y += midBoost;

    // Shadow depth: deepen blacks aggressively
    if (shadowDepth > 0) {
      const t = clamp(1 - y * 2.2, 0, 1);
      const deepened = y * (1 - shadowDepth * 0.6);
      y = lerp(y, deepened, t);
    }

    // Highlight rolloff: strong, cinematic
    if (highlightRolloff > 0) {
      const t = clamp((y - 0.55) * 2.2, 0, 1);
      const rolled = 1 - (1 - y) * (1 - highlightRolloff * 0.7);
      y = lerp(y, rolled, t);
    }

    // Matte: lift only the deepest blacks
    if (matteStrength > 0) {
      const m = matteStrength;
      const lowMatte = lerp(0, 0.05, m);
      const highMatte = 1.0;
      y = lowMatte + (highMatte - lowMatte) * y;
    }

    L = clamp(y, 0, 1);

    /* -------------------------------------------------------
       2) Color Shaping (Teal/Orange Hybrid)
    ------------------------------------------------------- */

    // Global warmth bias
    if (warmth !== 0) {
      const warmA = 0.03;
      const warmB = 0.02;
      a = lerp(a, a + warmA * warmth, 0.7);
      bb = lerp(bb, bb + warmB * warmth, 0.7);
    }

    // Cool shadows (teal) + warm highlights (orange)
    const cool = coolShadows;
    const warm = warmHighlights;

    if (cool > 0 || warm > 0) {
      const shadowT = clamp(1 - L * 2.2, 0, 1);
      const highlightT = clamp((L - 0.4) * 2.0, 0, 1);

      // Teal shadows: push a slightly negative, b slightly negative
      if (cool > 0 && shadowT > 0) {
        const targetA = a - 0.06 * cool;
        const targetB = bb - 0.04 * cool;
        a = lerp(a, targetA, shadowT * 0.9);
        bb = lerp(bb, targetB, shadowT * 0.9);
      }

      // Warm highlights: push a positive, b slightly positive
      if (warm > 0 && highlightT > 0) {
        const targetA = a + 0.06 * warm;
        const targetB = bb + 0.03 * warm;
        a = lerp(a, targetA, highlightT * 0.9);
        bb = lerp(bb, targetB, highlightT * 0.9);
      }
    }

    // Vibrance: midtone-focused, avoid neon
    if (vibrance !== 1.0) {
      const chroma = Math.sqrt(a * a + bb * bb);
      if (chroma > 0) {
        const t = clamp((L - 0.18) / 0.6, 0, 1); // midtone emphasis
        const target = chroma * vibrance;
        const newChroma = lerp(chroma, target, t);
        const scale = newChroma / chroma;
        a *= scale;
        bb *= scale;
      }
    }

    // Global saturation: final chroma scale
    if (saturation !== 1.0) {
      a *= saturation;
      bb *= saturation;
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
   Summer → Filmic (Aggressive Hollywood Hybrid)
------------------------------------------------------- */

export function applySummerFilmicGrade(
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
const profile = analyzeImageColor(imageData);

// Pick a Filmic personality and build runtime params with pass logic
const personality = pickFilmicPersonality();
const params = buildFilmicRuntimeParams(personality, preDramaMultiplier);

// ✅ Build debug object first
const debug = {
  personalityId: params.personalityId,
  label: params.label,
  pass: params.pass,
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
    shadowPercent: profile.shadowDensity ?? 0,
    highlightPercent: profile.highlightDensity ?? 0,
    avgSaturation: 0,
  },
};

// ✅ Apply tone + color using debug.params
applyFilmicToneAndColor(imageData, debug.params);

ctx.putImageData(imageData, 0, 0);

const result = previewCanvas.toDataURL("image/png");
setImageSrc(result);

return debug;
}