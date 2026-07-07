// src/adjustments/clarity/clarity-engine.ts

export interface ClarityEngineParams {
  amount: number; // -1 to +1
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getLuma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function applyClarityEngine(
  imageData: ImageData,
  params: ClarityEngineParams
): ImageData {
  const { amount } = params;
  if (amount === 0) return imageData;

  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;

  // Work in normalized 0–1
  const luma = new Float32Array(width * height);
  const blurred = new Float32Array(width * height);

  const idx = (x: number, y: number) => y * width + x;

  // Compute luma
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y) * 4;
      const r = src[i] / 255;
      const g = src[i + 1] / 255;
      const b = src[i + 2] / 255;
      luma[idx(x, y)] = getLuma(r, g, b);
    }
  }

  // Simple 3x3 box blur on luma
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += luma[idx(x + kx, y + ky)];
        }
      }
      blurred[idx(x, y)] = sum / 9;
    }
  }

  const output = new ImageData(width, height);
  const dst = output.data;

  const strength = amount * 1.5; // clarity punch

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = idx(x, y) * 4;

      const r = src[i] / 255;
      const g = src[i + 1] / 255;
      const b = src[i + 2] / 255;
      const a = src[i + 3];

      const L = getLuma(r, g, b);
      const blurL = blurred[idx(x, y)];

      const delta = (L - blurL) * strength;
      const newL = L + delta;

      const eps = 1e-5;
      const scale = newL > eps ? newL / (L + eps) : 1;

      const nr = clamp01(r * scale);
      const ng = clamp01(g * scale);
      const nb = clamp01(b * scale);

      dst[i] = nr * 255;
      dst[i + 1] = ng * 255;
      dst[i + 2] = nb * 255;
      dst[i + 3] = a;
    }
  }

  // Copy border pixels unchanged
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) continue;
      const i = idx(x, y) * 4;
      dst[i] = src[i];
      dst[i + 1] = src[i + 1];
      dst[i + 2] = src[i + 2];
      dst[i + 3] = src[i + 3];
    }
  }

  return output;
}