/* ---------------------------------------------------------
   FILMIC TOE CURVE ENGINE
   Deepens shadows / crushed blacks
--------------------------------------------------------- */

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function applyToe(v: number, amt: number): number {
  if (amt === 0) return v;

  // v in [0,1]
  // Positive amt → stronger toe (darker shadows)
  // Negative amt → softer toe (lifted shadows)
  const strength = 1 + amt * 1.5; // ~[ -0.5 .. 2.5 ]
  const exp = Math.max(0.2, strength);
  const curved = Math.pow(v, exp);

  return curved;
}

export function applyFilmicToeEngine(
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

    const nr = applyToe(r, amt);
    const ng = applyToe(g, amt);
    const nb = applyToe(b, amt);

    outData[i] = clamp(nr * 255);
    outData[i + 1] = clamp(ng * 255);
    outData[i + 2] = clamp(nb * 255);
    outData[i + 3] = a;
  }

  return out;
}