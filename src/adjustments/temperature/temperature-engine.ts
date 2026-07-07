/* ---------------------------------------------------------
   TEMPERATURE ENGINE
   Low-level pixel math
   amount: -1 (cool) → +1 (warm)
--------------------------------------------------------- */

export function applyTemperatureEngine(
  imageData: ImageData,
  amount: number
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  // Clamp amount
  const a = Math.max(-1, Math.min(1, amount));

  // Scale to pixel shift range
  const shift = a * 40; // ±40 is subtle but visible

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];

    // Warm = +R, -B
    // Cool = -R, +B
    outData[i] = clamp(r + shift);
    outData[i + 1] = g; // leave green neutral
    outData[i + 2] = clamp(b - shift);
    outData[i + 3] = alpha;
  }

  return out;
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}