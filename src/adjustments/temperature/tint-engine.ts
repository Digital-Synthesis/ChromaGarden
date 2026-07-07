/* ---------------------------------------------------------
   TINT ENGINE
   Low-level pixel math
   amount: -1 (green) → +1 (magenta)
--------------------------------------------------------- */

export function applyTintEngine(
  imageData: ImageData,
  amount: number
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  const a = Math.max(-1, Math.min(1, amount));
  const shift = a * 30; // ±30 is a good tint range

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    // Magenta = +R +B, -G
    // Green   = -R -B, +G
    outData[i] = clamp(r + shift);
    outData[i + 1] = clamp(g - shift);
    outData[i + 2] = clamp(b + shift);
    outData[i + 3] = alpha;
  }

  return out;
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}