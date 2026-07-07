/* ---------------------------------------------------------
   CONTRAST ENGINE
   Low-level pixel math
--------------------------------------------------------- */

export function applyContrastEngine(
  imageData: ImageData,
  amount: number, // -1.0 to +1.0 recommended
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  // Map amount [-1,1] → contrast factor
  // amount = 0 → factor = 1 (no change)
  const clamped = Math.max(-1, Math.min(1, amount));
  const c = clamped * 100; // -100..100
  const factor = (259 * (c + 255)) / (255 * (259 - c));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    outData[i] = clamp(factor * (r - 128) + 128);
    outData[i + 1] = clamp(factor * (g - 128) + 128);
    outData[i + 2] = clamp(factor * (b - 128) + 128);
    outData[i + 3] = a;
  }

  return out;
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}