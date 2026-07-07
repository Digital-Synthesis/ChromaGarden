/* ---------------------------------------------------------
   HIGHLIGHT ROLLOFF CURVE ENGINE
   Soft, filmic highlight smoothing
--------------------------------------------------------- */

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function rolloff(v: number, amt: number): number {
  if (amt === 0) return v;

  // Only affect upper half of the range more strongly
  const t = v;
  const weight = Math.min(1, Math.max(0, (t - 0.5) * 2)); // 0..1 above midtones

  if (weight <= 0) return v;

  const strength = 1 + amt * 2.0;
  const exp = Math.max(0.2, strength);

  const inv = 1 - t;
  const curved = 1 - Math.pow(inv, exp);

  // Blend between original and curved based on weight
  return v * (1 - weight) + curved * weight;
}

export function applyHighlightRolloffEngine(
  imageData: ImageData,
  amount: number, // -1..+1
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  const amt = Math.max(-1, Math.min(1, amount));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const a = data[i + 3];

    const nr = rolloff(r, amt);
    const ng = rolloff(g, amt);
    const nb = rolloff(b, amt);

    outData[i] = clamp(nr * 255);
    outData[i + 1] = clamp(ng * 255);
    outData[i + 2] = clamp(nb * 255);
    outData[i + 3] = a;
  }

  return out;
}