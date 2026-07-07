// src/adjustments/dehaze/dehaze-engine.ts

export interface DehazeEngineParams {
  amount: number; // -1 to +1
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getLuma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function applyDehazeEngine(
  imageData: ImageData,
  params: DehazeEngineParams
): ImageData {
  const { amount } = params;
  if (amount === 0) return imageData;

  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const output = new ImageData(width, height);
  const dst = output.data;

  const strength = amount;

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i] / 255;
    const g = src[i + 1] / 255;
    const b = src[i + 2] / 255;
    const a = src[i + 3];

    const L = getLuma(r, g, b);

    // Contrast around mid‑grey
    const contrastBoost = 1 + strength * 0.6;
    const hazeLift = strength * 0.08; // small bias

    let newL = (L - 0.5) * contrastBoost + 0.5 - hazeLift;

    // Mild saturation change with positive dehaze
    const satBoost = 1 + strength * 0.3;
    const avg = (r + g + b) / 3;

    const dr = r - avg;
    const dg = g - avg;
    const db = b - avg;

    let nr = avg + dr * satBoost;
    let ng = avg + dg * satBoost;
    let nb = avg + db * satBoost;

    // Re-normalize to target luminance
    const newAvg = getLuma(nr, ng, nb);
    const eps = 1e-5;
    const scale = newAvg > eps ? newL / (newAvg + eps) : 1;

    nr = clamp01(nr * scale);
    ng = clamp01(ng * scale);
    nb = clamp01(nb * scale);

    dst[i] = nr * 255;
    dst[i + 1] = ng * 255;
    dst[i + 2] = nb * 255;
    dst[i + 3] = a;
  }

  return output;
}