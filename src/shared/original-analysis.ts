// Universal Original Image Analysis (Medium + Skin Detection)
// Runs once per loaded image, independent of any recipe.

export type OriginalImageAnalysis = {
  // Global luminance metrics
  avgLuma: number;
  minLuma: number;
  maxLuma: number;
  contrast: number;

  // Histogram distribution
  shadowPercent: number;
  midtonePercent: number;
  highlightPercent: number;

  // Color cast (OKLab-based)
  avgA: number;
  avgB: number;
  colorCastLabel: string;

  // Saturation distribution
  avgSaturation: number;
  maxSaturation: number;
  lowSatPercent: number;
  highSatPercent: number;

  // Edge density (0–1)
  edgeDensity: number;

  // Skin detection
  skinPixelPercent: number;
  hasSkin: boolean;
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
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

/* -------------------------------------------------------
   CORE ANALYSIS
------------------------------------------------------- */

function analyzeImageData(imageData: ImageData): OriginalImageAnalysis {
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  let sumL = 0;
  let sumL2 = 0;
  let minL = 1;
  let maxL = 0;

  let shadowCount = 0;
  let midtoneCount = 0;
  let highlightCount = 0;

  let sumA = 0;
  let sumB = 0;

  let sumSat = 0;
  let maxSat = 0;
  let lowSatCount = 0;
  let highSatCount = 0;

  let skinCount = 0;

  // For edge density (simple luma gradient)
  const lumaBuffer = new Float32Array(totalPixels);

  let idx = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [L, a, bb] = rgbToOklab(r, g, b);
    const l = clamp(L, 0, 1);

    lumaBuffer[idx++] = l;

    sumL += l;
    sumL2 += l * l;
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;

    if (l < 0.30) shadowCount++;
    else if (l > 0.70) highlightCount++;
    else midtoneCount++;

    sumA += a;
    sumB += bb;

    // simple saturation estimate from RGB
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;

    sumSat += sat;
    if (sat > maxSat) maxSat = sat;
    if (sat < 0.12) lowSatCount++;
    if (sat > 0.45) highSatCount++;

    // skin detection in OKLab space
    const C = Math.sqrt(a * a + bb * bb);
    const hue = Math.atan2(bb, a);
    let hueDeg = (hue * 180) / Math.PI;
    if (hueDeg < 0) hueDeg += 360;

    if (
      hueDeg >= 20 &&
      hueDeg <= 55 &&
      C >= 0.02 &&
      C <= 0.18 &&
      l >= 0.25 &&
      l <= 0.80
    ) {
      skinCount++;
    }
  }

  const avgLuma = sumL / totalPixels;
  const variance = sumL2 / totalPixels - avgLuma * avgLuma;
  const contrast = Math.sqrt(Math.max(variance, 0));

  const shadowPercent = shadowCount / totalPixels;
  const midtonePercent = midtoneCount / totalPixels;
  const highlightPercent = highlightCount / totalPixels;

  const avgA = sumA / totalPixels;
  const avgB = sumB / totalPixels;

  let colorCastLabel = "neutral";
  const mag = Math.sqrt(avgA * avgA + avgB * avgB);
  if (mag > 0.02) {
    const hue = Math.atan2(avgB, avgA);
    let hueDeg = (hue * 180) / Math.PI;
    if (hueDeg < 0) hueDeg += 360;

    if (hueDeg >= 30 && hueDeg <= 70) colorCastLabel = "warm";
    else if (hueDeg >= 200 && hueDeg <= 260) colorCastLabel = "cool";
    else if (hueDeg >= 90 && hueDeg <= 150) colorCastLabel = "green";
    else if (hueDeg >= 300 || hueDeg <= 30) colorCastLabel = "magenta";
  }

  const avgSaturation = sumSat / totalPixels;
  const lowSatPercent = lowSatCount / totalPixels;
  const highSatPercent = highSatCount / totalPixels;

  // Edge density: simple luma gradient sampling
  let edgeCount = 0;
  let edgeSamples = 0;
  const threshold = 0.06;

  for (let y = 0; y < height; y++) {
    for (let x = 1; x < width; x++) {
      const i1 = y * width + x;
      const i0 = y * width + (x - 1);
      const d = Math.abs(lumaBuffer[i1] - lumaBuffer[i0]);
      edgeSamples++;
      if (d > threshold) edgeCount++;
    }
  }

  const edgeDensity = edgeSamples > 0 ? edgeCount / edgeSamples : 0;

  const skinPixelPercent = skinCount / totalPixels;
  const hasSkin = skinPixelPercent > 0.01;

  return {
    avgLuma,
    minLuma: minL,
    maxLuma: maxL,
    contrast,
    shadowPercent,
    midtonePercent,
    highlightPercent,
    avgA,
    avgB,
    colorCastLabel,
    avgSaturation,
    maxSaturation: maxSat,
    lowSatPercent,
    highSatPercent,
    edgeDensity,
    skinPixelPercent,
    hasSkin,
  };
}

/* -------------------------------------------------------
   PUBLIC API
------------------------------------------------------- */

export function analyzeOriginalImageFromElement(
  img: HTMLImageElement
): OriginalImageAnalysis {
  const maxSize = 1200;
  const { naturalWidth: w, naturalHeight: h } = img;

  const scale = Math.min(1, maxSize / Math.max(w, h));
  const targetW = Math.max(1, Math.round(w * scale));
  const targetH = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Fallback: minimal structure
    return {
      avgLuma: 0,
      minLuma: 0,
      maxLuma: 0,
      contrast: 0,
      shadowPercent: 0,
      midtonePercent: 0,
      highlightPercent: 0,
      avgA: 0,
      avgB: 0,
      colorCastLabel: "neutral",
      avgSaturation: 0,
      maxSaturation: 0,
      lowSatPercent: 0,
      highSatPercent: 0,
      edgeDensity: 0,
      skinPixelPercent: 0,
      hasSkin: false,
    };
  }

  ctx.drawImage(img, 0, 0, targetW, targetH);
  const imageData = ctx.getImageData(0, 0, targetW, targetH);
  return analyzeImageData(imageData);
}