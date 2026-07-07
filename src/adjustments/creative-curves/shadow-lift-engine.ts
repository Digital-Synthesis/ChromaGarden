/* ---------------------------------------------------------
   SHADOW LIFT CURVE ENGINE
   Matte / lifted blacks / pastel shadows
--------------------------------------------------------- */

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function liftShadows(v: number, amt: number): number {
  if (amt === 0) return v;

  // Emphasize lower half of the range
  const weight = Math.min(1, Math.max(0, (0.5 - v) * 2)); // 0..1 in shadows

  if (weight <= 0) return v;

  // Positive amt → lift shadows
  // Negative amt → deepen shadows
  const lift = amt * 0.5; // keep subtle
  const target = v + lift;

  return v * (1 - weight) + target * weight;
}

export function applyShadowLiftEngine(
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

    const nr = liftShadows(r, amt);
    const ng = liftShadows(g, amt);
    const nb = liftShadows(b, amt);

    outData[i] = clamp(nr * 255);
    outData[i + 1] = clamp(ng * 255);
    outData[i + 2] = clamp(nb * 255);
    outData[i + 3] = a;
  }

  return out;
}