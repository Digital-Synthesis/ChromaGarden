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

type NaturalPersonalityId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type NaturalBaseParams = {
  contrast: number;        // global contrast
  saturation: number;      // overall saturation
  vibrance: number;        // midtone color intensity
  warmth: number;          // warm/cool bias
  curveStrength: number;   // tone curve strength
  highlightRolloff: number;
  shadowLift: number;
  matteStrength: number;
};

type NaturalVariationEnvelope = {
  contrast: number;
  saturation: number;
  vibrance: number;
  warmth: number;
  curveStrength: number;
  highlightRolloff: number;
  shadowLift: number;
  matteStrength: number;
};

type NaturalPersonality = {
  personalityId: NaturalPersonalityId;
  label: string;
  base: NaturalBaseParams;
  variation: NaturalVariationEnvelope;
};

type NaturalRuntimeParams = NaturalBaseParams & {
  personalityId: NaturalPersonalityId;
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
   IMAGE ANALYSIS (DEBUG-ONLY)
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
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [L] = rgbToOklab(r, g, b);
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

  const shadowDensity = shadowCount / total;
  const highlightDensity = highlightCount / total;
  const midtoneBalance = midtoneCount / total;

  return {
    avgLuma,
    contrast,
    shadowDensity,
    highlightDensity,
    midtoneBalance,
  };
}

/* -------------------------------------------------------
   SUMMER → NATURAL PERSONALITIES (9 TOTAL)
   Mixed subtle + strong, film-inspired
------------------------------------------------------- */

const NATURAL_PERSONALITIES: NaturalPersonality[] = [
  {
    personalityId: 0,
    label: "Natural Clean",
    base: {
      contrast: 1.0,
      saturation: 1.0,
      vibrance: 1.0,
      warmth: 0.0,
      curveStrength: 0.9,
      highlightRolloff: 0.25,
      shadowLift: 0.10,
      matteStrength: 0.05,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.15,
      vibrance: 0.15,
      warmth: 0.10,
      curveStrength: 0.15,
      highlightRolloff: 0.15,
      shadowLift: 0.10,
      matteStrength: 0.08,
    },
  },
  {
    personalityId: 1,
    label: "Natural Warm",
    base: {
      contrast: 1.0,
      saturation: 1.05,
      vibrance: 1.05,
      warmth: 0.20,
      curveStrength: 0.95,
      highlightRolloff: 0.30,
      shadowLift: 0.12,
      matteStrength: 0.06,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.20,
      curveStrength: 0.15,
      highlightRolloff: 0.15,
      shadowLift: 0.10,
      matteStrength: 0.08,
    },
  },
  {
    personalityId: 2,
    label: "Natural Punchy",
    base: {
      contrast: 1.20,
      saturation: 1.10,
      vibrance: 1.15,
      warmth: 0.10,
      curveStrength: 1.10,
      highlightRolloff: 0.22,
      shadowLift: 0.06,
      matteStrength: 0.03,
    },
    variation: {
      contrast: 0.30,
      saturation: 0.25,
      vibrance: 0.25,
      warmth: 0.12,
      curveStrength: 0.20,
      highlightRolloff: 0.15,
      shadowLift: 0.08,
      matteStrength: 0.06,
    },
  },
  {
    personalityId: 3,
    label: "Natural Soft Film",
    base: {
      contrast: 0.90,
      saturation: 0.95,
      vibrance: 0.95,
      warmth: 0.05,
      curveStrength: 0.85,
      highlightRolloff: 0.32,
      shadowLift: 0.14,
      matteStrength: 0.10,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.10,
      curveStrength: 0.15,
      highlightRolloff: 0.18,
      shadowLift: 0.12,
      matteStrength: 0.10,
    },
  },
  {
    personalityId: 4,
    label: "Natural Matte",
    base: {
      contrast: 0.95,
      saturation: 0.95,
      vibrance: 0.95,
      warmth: 0.05,
      curveStrength: 0.90,
      highlightRolloff: 0.30,
      shadowLift: 0.18,
      matteStrength: 0.18,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.10,
      curveStrength: 0.18,
      highlightRolloff: 0.18,
      shadowLift: 0.14,
      matteStrength: 0.14,
    },
  },
  {
    personalityId: 5,
    label: "Natural Deep",
    base: {
      contrast: 1.15,
      saturation: 0.95,
      vibrance: 1.00,
      warmth: 0.00,
      curveStrength: 1.05,
      highlightRolloff: 0.24,
      shadowLift: 0.04,
      matteStrength: 0.06,
    },
    variation: {
      contrast: 0.30,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.10,
      curveStrength: 0.20,
      highlightRolloff: 0.15,
      shadowLift: 0.08,
      matteStrength: 0.08,
    },
  },
  {
    personalityId: 6,
    label: "Natural High-Key",
    base: {
      contrast: 0.95,
      saturation: 1.00,
      vibrance: 1.05,
      warmth: 0.10,
      curveStrength: 0.95,
      highlightRolloff: 0.35,
      shadowLift: 0.16,
      matteStrength: 0.08,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.25,
      warmth: 0.12,
      curveStrength: 0.18,
      highlightRolloff: 0.20,
      shadowLift: 0.12,
      matteStrength: 0.10,
    },
  },
  {
    personalityId: 7,
    label: "Natural Low-Key",
    base: {
      contrast: 1.20,
      saturation: 0.95,
      vibrance: 1.00,
      warmth: -0.05,
      curveStrength: 1.10,
      highlightRolloff: 0.22,
      shadowLift: 0.02,
      matteStrength: 0.05,
    },
    variation: {
      contrast: 0.30,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.12,
      curveStrength: 0.20,
      highlightRolloff: 0.15,
      shadowLift: 0.08,
      matteStrength: 0.08,
    },
  },
  {
    personalityId: 8,
    label: "Natural Filmic",
    base: {
      contrast: 1.10,
      saturation: 1.00,
      vibrance: 1.05,
      warmth: 0.05,
      curveStrength: 1.05,
      highlightRolloff: 0.30,
      shadowLift: 0.08,
      matteStrength: 0.08,
    },
    variation: {
      contrast: 0.25,
      saturation: 0.20,
      vibrance: 0.20,
      warmth: 0.10,
      curveStrength: 0.20,
      highlightRolloff: 0.18,
      shadowLift: 0.10,
      matteStrength: 0.10,
    },
  },
];

/* -------------------------------------------------------
   PASS TRACKING (PER PERSONALITY)
   Reset by caller when image/profile changes.
------------------------------------------------------- */

const personalityPassMap: Map<NaturalPersonalityId, number> = new Map();

/**
 * Reset all pass counts — call this when:
 * - a new image is loaded
 * - the active profile changes away from Summer → Natural
 */
export function resetSummerNaturalPasses(): void {
  personalityPassMap.clear();
}

/* -------------------------------------------------------
   PERSONALITY SELECTION + PASS LOGIC
------------------------------------------------------- */

function pickPersonality(): NaturalPersonality {
  const index = Math.floor(Math.random() * NATURAL_PERSONALITIES.length);
  return NATURAL_PERSONALITIES[index];
}

function buildRuntimeParams(
  personality: NaturalPersonality,
  preDramaMultiplier: number = 1
): NaturalRuntimeParams {
  const currentPass = (personalityPassMap.get(personality.personalityId) ?? 0) + 1;
  personalityPassMap.set(personality.personalityId, currentPass);

  const { base, variation } = personality;

  // Pass 1 → base values only (consistent anchor look)
  if (currentPass === 1) {
    return {
      personalityId: personality.personalityId,
      label: personality.label,
      pass: currentPass,
      ...base,
    };
  }

  // Pass ≥ 2 → base + variation envelope (human-visible randomization)
  const contrast = randInRange(base.contrast, variation.contrast, preDramaMultiplier);
  const saturation = randInRange(base.saturation, variation.saturation, preDramaMultiplier);
  const vibrance = randInRange(base.vibrance, variation.vibrance, preDramaMultiplier);
  const warmth = randInRange(base.warmth, variation.warmth, preDramaMultiplier);
  const curveStrength = randInRange(base.curveStrength, variation.curveStrength, preDramaMultiplier);
  const highlightRolloff = randInRange(
    base.highlightRolloff,
    variation.highlightRolloff,
    preDramaMultiplier
  );
  const shadowLift = randInRange(base.shadowLift, variation.shadowLift, preDramaMultiplier);
  const matteStrength = randInRange(base.matteStrength, variation.matteStrength, preDramaMultiplier);

  return {
    personalityId: personality.personalityId,
    label: personality.label,
    pass: currentPass,
    contrast,
    saturation,
    vibrance,
    warmth,
    curveStrength,
    highlightRolloff,
    shadowLift,
    matteStrength,
  };
}

/* -------------------------------------------------------
   TONE + COLOR APPLICATION
------------------------------------------------------- */

function applyNaturalToneAndColor(
  imageData: ImageData,
  params: NaturalRuntimeParams
): void {
  const { data } = imageData;

  const {
    contrast,
    saturation,
    vibrance,
    warmth,
    curveStrength,
    highlightRolloff,
    shadowLift,
    matteStrength,
  } = params;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let [L, a, bb] = rgbToOklab(r, g, b);
    let l = clamp(L, 0, 1);

    // 1) Tone curve (filmic-ish, but gentle)
    const mid = 0.5;
    const c = contrast;
    let y = (l - mid) * c + mid;

    // Curve strength: blend between linear and contrasty
    y = lerp(l, y, clamp(curveStrength, 0.0, 1.5));

    // Shadow lift
    if (shadowLift !== 0) {
      const t = clamp(1 - y * 3, 0, 1);
      const lifted = y + shadowLift * t;
      y = lerp(y, lifted, 0.7);
    }

    // Highlight rolloff
    if (highlightRolloff !== 0) {
      const t = clamp((y - 0.5) * 2, 0, 1);
      const rolled = 1 - (1 - y) * (1 - highlightRolloff * 0.6);
      y = lerp(y, rolled, t);
    }

    // Matte
    if (matteStrength > 0) {
      const m = matteStrength;
      const lowMatte = lerp(0, 0.06, m);
      const highMatte = lerp(1, 0.94, m);
      y = lowMatte + (highMatte - lowMatte) * y;
    }

    L = clamp(y, 0, 1);

    // 2) Color shaping in OKLab
    // Warmth: push a/b slightly toward warm quadrant
    if (warmth !== 0) {
      const warmA = 0.03;
      const warmB = 0.02;
      a = lerp(a, a + warmA * warmth, 0.6);
      bb = lerp(bb, bb + warmB * warmth, 0.6);
    }

    // Vibrance: stronger in midtones, less in extremes
    const vib = vibrance;
    if (vib !== 1.0) {
      const chroma = Math.sqrt(a * a + bb * bb);
      if (chroma > 0) {
        const t = clamp((L - 0.15) / 0.7, 0, 1); // midtone emphasis
        const target = chroma * vib;
        const newChroma = lerp(chroma, target, t);
        const scale = newChroma / chroma;
        a *= scale;
        bb *= scale;
      }
    }

    // Saturation: global chroma scale
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
   Summer → Natural (Modern Recipe v1)
------------------------------------------------------- */

export function applySummerGrade(
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

  // Pick a personality, then build runtime params with pass logic
  const personality = pickPersonality();
  const params = buildRuntimeParams(personality, preDramaMultiplier);

  // ✅ Build debug object first (so it exists before use)
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
      avgSaturation: 0, // placeholder – no saturation metric in ImageProfileColor
    },
  };

  // ✅ Apply tone + color using debug.params (includes Manual Tweaks)
  applyNaturalToneAndColor(imageData, debug.params);

  ctx.putImageData(imageData, 0, 0);

  const result = previewCanvas.toDataURL("image/png");
  setImageSrc(result);

  return debug;
}