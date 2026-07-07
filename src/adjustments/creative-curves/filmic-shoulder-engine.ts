/* ---------------------------------------------------------
   FILMIC SHOULDER CURVE ENGINE
   Compresses highlights / soft rolloff
--------------------------------------------------------- */

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function applyShoulder(v: number, amt: number): number {
  if (amt === 0) return v;

  // v in [0,1]
  // Positive amt → stronger shoulder (softer highlights)
  // Negative amt → more linear / punchy highlights
  const strength = 1 + amt * 1.5;
  const exp = Math.max(0.2, strength);

  // Shoulder curve around highlights
  const inv = 1 - v;
  const curved = 1 - Math.pow(inv, exp);

  return curved;
}

export function applyFilmicShoulderEngine(
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

    const nr = applyShoulder(r, amt);
    const ng = applyShoulder(g, amt);
    const nb = applyShoulder(b, amt);

    outData[i] = clamp(nr * 255);
    outData[i + 1] = clamp(ng * 255);
    outData[i + 2] = clamp(nb * 255);
    outData[i + 3] = a;
  }

  return out;
}