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

type PastelPersonalityId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type PastelBaseParams = {
  contrast: number;
  saturation: number;
  vibrance: number;
  warmBias: number;
  shadowLift: number;
  highlightBloom: number;
  curveStrength: number;
  hueSoftening: number;
  chromaPreservation: number;
};

type PastelVariationEnvelope = {
  contrast: number;
  saturation: number;
  vibrance: number;
  warmBias: number;
  shadowLift: number;
  highlightBloom: number;
  curveStrength: number;
  hueSoftening: number;
  chromaPreservation: number;
};

type PastelPersonality = {
  personalityId: PastelPersonalityId;
  label: string;
  base: PastelBaseParams;
  variation: PastelVariationEnvelope;
};

type PastelRuntimeParams = PastelBaseParams & {
  personalityId: PastelPersonalityId;
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
   SUMMER → PASTEL PERSONALITIES (9 TOTAL)
   Soft Pastel — airy, dreamy, bright, creamy
------------------------------------------------------- */

const PASTEL_PERSONALITIES: PastelPersonality[] = [
  {
    personalityId: 0,
    label: "Pastel Neutral",
    base: {
      contrast: 0.65,
      saturation: 0.80,
      vibrance: 0.90,
      warmBias: 0.10,
      shadowLift: 0.25,
      highlightBloom: 0.20,
      curveStrength: 0.60,
      hueSoftening: 0.30,
      chromaPreservation: 0.85,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.15,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 1,
    label: "Pastel Warm",
    base: {
      contrast: 0.60,
      saturation: 0.85,
      vibrance: 0.95,
      warmBias: 0.25,
      shadowLift: 0.28,
      highlightBloom: 0.22,
      curveStrength: 0.55,
      hueSoftening: 0.35,
      chromaPreservation: 0.85,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 2,
    label: "Pastel Cool",
    base: {
      contrast: 0.60,
      saturation: 0.80,
      vibrance: 0.90,
      warmBias: -0.10,
      shadowLift: 0.30,
      highlightBloom: 0.25,
      curveStrength: 0.55,
      hueSoftening: 0.40,
      chromaPreservation: 0.90,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 3,
    label: "Pastel Rose",
    base: {
      contrast: 0.58,
      saturation: 0.85,
      vibrance: 0.95,
      warmBias: 0.20,
      shadowLift: 0.28,
      highlightBloom: 0.28,
      curveStrength: 0.50,
      hueSoftening: 0.45,
      chromaPreservation: 0.90,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 4,
    label: "Pastel Mint",
    base: {
      contrast: 0.62,
      saturation: 0.80,
      vibrance: 0.90,
      warmBias: -0.05,
      shadowLift: 0.32,
      highlightBloom: 0.22,
      curveStrength: 0.55,
      hueSoftening: 0.40,
      chromaPreservation: 0.90,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 5,
    label: "Pastel Sand",
    base: {
      contrast: 0.60,
      saturation: 0.78,
      vibrance: 0.88,
      warmBias: 0.15,
      shadowLift: 0.30,
      highlightBloom: 0.20,
      curveStrength: 0.55,
      hueSoftening: 0.35,
      chromaPreservation: 0.85,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 6,
    label: "Pastel Dream",
    base: {
      contrast: 0.50,
      saturation: 0.75,
      vibrance: 0.85,
      warmBias: 0.10,
      shadowLift: 0.35,
      highlightBloom: 0.35,
      curveStrength: 0.45,
      hueSoftening: 0.50,
      chromaPreservation: 0.90,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 7,
    label: "Pastel Deep",
    base: {
      contrast: 0.70,
      saturation: 0.85,
      vibrance: 0.95,
      warmBias: 0.05,
      shadowLift: 0.20,
      highlightBloom: 0.18,
      curveStrength: 0.65,
      hueSoftening: 0.30,
      chromaPreservation: 0.85,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },

  {
    personalityId: 8,
    label: "Pastel Vintage",
    base: {
      contrast: 0.55,
      saturation: 0.78,
      vibrance: 0.85,
      warmBias: 0.15,
      shadowLift: 0.30,
      highlightBloom: 0.30,
      curveStrength: 0.50,
      hueSoftening: 0.45,
      chromaPreservation: 0.80,
    },
    variation: {
      contrast: 0.20,
      saturation: 0.20,
      vibrance: 0.20,
      warmBias: 0.20,
      shadowLift: 0.20,
      highlightBloom: 0.20,
      curveStrength: 0.20,
      hueSoftening: 0.20,
      chromaPreservation: 0.15,
    },
  },
];

/* -------------------------------------------------------
   PASS TRACKING
------------------------------------------------------- */

const pastelPassMap: Map<PastelPersonalityId, number> = new Map();

export function resetSummerPastelPasses(): void {
  pastelPassMap.clear();
}

/* -------------------------------------------------------
   PERSONALITY SELECTION + PASS LOGIC
------------------------------------------------------- */

function pickPastelPersonality(): PastelPersonality {
  const index = Math.floor(Math.random() * PASTEL_PERSONALITIES.length);
  return PASTEL_PERSONALITIES[index];
}

function buildPastelRuntimeParams(
  personality: PastelPersonality,
  preDramaMultiplier: number = 1
): PastelRuntimeParams {
  const currentPass =
    (pastelPassMap.get(personality.personalityId) ?? 0) + 1;

  pastelPassMap.set(personality.personalityId, currentPass);

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
    warmBias: randInRange(base.warmBias, variation.warmBias, preDramaMultiplier),
    shadowLift: randInRange(base.shadowLift, variation.shadowLift, preDramaMultiplier),
    highlightBloom: randInRange(base.highlightBloom, variation.highlightBloom, preDramaMultiplier),
    curveStrength: randInRange(base.curveStrength, variation.curveStrength, preDramaMultiplier),
    hueSoftening: randInRange(base.hueSoftening, variation.hueSoftening, preDramaMultiplier),
    chromaPreservation: randInRange(
      base.chromaPreservation,
      variation.chromaPreservation,
      preDramaMultiplier
    ),
  };
}

/* -------------------------------------------------------
   PASTEL TONE + COLOR ENGINE
   Soft Pastel — airy, dreamy, bright, creamy
------------------------------------------------------- */

function applyPastelToneAndColor(
  imageData: ImageData,
  params: PastelRuntimeParams
): void {
  const { data } = imageData;

  const {
    contrast,
    saturation,
    vibrance,
    warmBias,
    shadowLift,
    highlightBloom,
    curveStrength,
    hueSoftening,
    chromaPreservation,
  } = params;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let [L, a, bb] = rgbToOklab(r, g, b);
    let l = clamp(L, 0, 1);

    /* -------------------------------------------------------
       1) Pastel Tone Curve — soft, airy, low contrast
    ------------------------------------------------------- */

    const mid = 0.5;

    // Gentle flattening
    let y = lerp(l, mid, (1 - contrast) * 0.4);

    // Curve strength (flatten midtones)
    y = lerp(y, mid, (1 - curveStrength) * 0.3);

    // Shadow lift
    if (shadowLift > 0) {
      const t = clamp(1 - y * 2.0, 0, 1);
      const lifted = y + shadowLift * 0.25;
      y = lerp(y, lifted, t);
    }

   // Highlight bloom
    if (highlightBloom > 0) {
      const t = clamp((y - 0.55) * 2.0, 0, 1);
      const bloomed = y + highlightBloom * 0.20;
      y = lerp(y, bloomed, t);
    }

    L = clamp(y, 0, 1);

    /* -------------------------------------------------------
       2) Pastel Color Engine — soft, airy, clean hues
    ------------------------------------------------------- */

    // Warm bias (gentle, never affects shadows)
    if (warmBias !== 0) {
      const t = clamp((L - 0.25) * 1.5, 0, 1);
      a = lerp(a, a + warmBias * 0.04, t);
      bb = lerp(bb, bb + warmBias * 0.02, t);
    }

    // Hue softening — reduce hue noise, pastel smoothing
    if (hueSoftening > 0) {
      const chroma = Math.sqrt(a * a + bb * bb);
      if (chroma > 0) {
        const softened = chroma * (1 - hueSoftening * 0.25);
        const scale = softened / chroma;
        a *= scale;
        bb *= scale;
      }
    }

    // Chroma preservation — keep colors clean even with low saturation
    if (chromaPreservation > 0) {
      const chroma = Math.sqrt(a * a + bb * bb);
      if (chroma > 0) {
        const preserved = chroma * (1 + chromaPreservation * 0.10);
        const scale = preserved / chroma;
        a *= scale;
        bb *= scale;
      }
    }

    // Vibrance — gentle midtone color lift
    if (vibrance !== 1.0) {
      const chroma = Math.sqrt(a * a + bb * bb);
      if (chroma > 0) {
        const t = clamp((L - 0.20) / 0.6, 0, 1);
        const target = chroma * vibrance;
        const newChroma = lerp(chroma, target, t);
        const scale = newChroma / chroma;
        a *= scale;
        bb *= scale;
      }
    }

    // Global saturation — final pastel desaturation
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
   Summer → Pastel (Soft Pastel Engine)
------------------------------------------------------- */

export function applySummerPastelGrade(
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

// Pick a Pastel personality and build runtime params with pass logic
const personality = pickPastelPersonality();
const params = buildPastelRuntimeParams(personality, preDramaMultiplier);

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
applyPastelToneAndColor(imageData, debug.params);

ctx.putImageData(imageData, 0, 0);

const result = previewCanvas.toDataURL("image/png");
setImageSrc(result);

return debug;
}