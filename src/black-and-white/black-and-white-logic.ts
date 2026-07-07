import type React from "react";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

type ImageProfileBW = {
  avgLuma: number;
  contrast: number;
  shadowDensity: number;
  highlightDensity: number;
  midtoneBalance: number;
};

type BWParams = {
  personalityId: number;
  label: string;

  // Core tonal controls
  contrast: number;        // global contrast strength
  toeStrength: number;     // shadow softness / lift
  shoulderStrength: number; // highlight rolloff
  matteStrength: number;   // overall matte feel
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
   IMAGE ANALYSIS (FOR DEBUG ONLY)
------------------------------------------------------- */

function analyzeImageBW(imageData: ImageData): ImageProfileBW {
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
   FILMIC & CLEAN PERSONALITIES (DETERMINISTIC)
------------------------------------------------------- */

const FILMIC_PRESETS: BWParams[] = [
  {
    personalityId: 0,
    label: "Filmic Neutral",
    contrast: 1.0,
    toeStrength: 0.4,
    shoulderStrength: 0.4,
    matteStrength: 0.1,
  },
  {
    personalityId: 1,
    label: "Filmic Soft",
    contrast: 0.85,
    toeStrength: 0.55,
    shoulderStrength: 0.55,
    matteStrength: 0.18,
  },
  {
    personalityId: 2,
    label: "Filmic Punchy",
    contrast: 1.2,
    toeStrength: 0.35,
    shoulderStrength: 0.35,
    matteStrength: 0.08,
  },
  {
    personalityId: 3,
    label: "Filmic Hard",
    contrast: 1.35,
    toeStrength: 0.30,
    shoulderStrength: 0.30,
    matteStrength: 0.04,
  },
  {
    personalityId: 4,
    label: "Filmic Matte",
    contrast: 0.95,
    toeStrength: 0.65,
    shoulderStrength: 0.55,
    matteStrength: 0.28,
  },
  {
    personalityId: 5,
    label: "Filmic High-Key",
    contrast: 0.95,
    toeStrength: 0.55,
    shoulderStrength: 0.70,
    matteStrength: 0.16,
  },
  {
    personalityId: 6,
    label: "Filmic Low-Key",
    contrast: 1.15,
    toeStrength: 0.30,
    shoulderStrength: 0.55,
    matteStrength: 0.14,
  },
  {
    personalityId: 7,
    label: "Filmic Deep",
    contrast: 1.25,
    toeStrength: 0.35,
    shoulderStrength: 0.45,
    matteStrength: 0.18,
  },
  {
    personalityId: 8,
    label: "Filmic Clean Contrast",
    contrast: 1.1,
    toeStrength: 0.45,
    shoulderStrength: 0.45,
    matteStrength: 0.06,
  },
];

/* -------------------------------------------------------
   FILMIC CURVE
------------------------------------------------------- */

function applyFilmicCurve(L: number, params: BWParams): number {
  const x = clamp(L, 0, 1);

  // 1) Base contrast around midtones
  const mid = 0.5;
  const c = params.contrast;
  let y = (x - mid) * c + mid;

  // 2) Toe (shadows) – soften or deepen
  if (params.toeStrength > 0) {
    const t = params.toeStrength;
    const shadowRegion = clamp(1 - x * 3, 0, 1); // stronger near blacks
    const lifted = lerp(y, mid * 0.25 + y * 0.75, t * shadowRegion);
    y = lifted;
  }

  // 3) Shoulder (highlights) – rolloff
  if (params.shoulderStrength > 0) {
    const s = params.shoulderStrength;
    const highlightRegion = clamp((x - 0.5) * 2, 0, 1); // stronger near whites
    const rolled = lerp(y, 1 - (1 - y) * 0.7, s * highlightRegion);
    y = rolled;
  }

  // 4) Matte – compress extremes slightly
  if (params.matteStrength > 0) {
    const m = params.matteStrength;
    const lowMatte = lerp(0, 0.06, m);
    const highMatte = lerp(1, 0.94, m);
    y = lowMatte + (highMatte - lowMatte) * y;
  }

  return clamp(y, 0, 1);
}

/* -------------------------------------------------------
   PARAM SELECTION FOR EACH CALL
   (Deterministic per preset, but we choose a preset per call)
------------------------------------------------------- */

function pickFilmicParams(): BWParams {
  // We keep the curve itself deterministic.
  // For variations, each call can pick a different preset.
  const index = Math.floor(Math.random() * FILMIC_PRESETS.length);
  return FILMIC_PRESETS[index];
}

/* -------------------------------------------------------
   APPLY ENGINE — FILMIC & CLEAN B&W
------------------------------------------------------- */

function applyFilmicBWLook(
  imageData: ImageData,
  params: BWParams
): void {
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [L] = rgbToOklab(r, g, b);
    const l = clamp(L, 0, 1);

    const shaped = applyFilmicCurve(l, params);

    const [nr, ng, nb] = oklabToRgb(shaped, 0, 0);

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

export function applyInfiniteBWGrade(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string) => void,
  preDramaMultiplier: number = 1
): any {
  void preDramaMultiplier;

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

  // Debug-only profile (no longer drives the recipe)
  const profile = analyzeImageBW(imageData);

  // Pick one filmic personality for this call
  const params = pickFilmicParams();

  applyFilmicBWLook(imageData, params);
  ctx.putImageData(imageData, 0, 0);
  setImageSrc(previewCanvas.toDataURL("image/png"));

  return { profile, params, mode: "blackAndWhite" };
}