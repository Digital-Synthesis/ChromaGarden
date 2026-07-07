/* ---------------------------------------------------------
   HIGHLIGHTS ENGINE
   Lightroom-style tone curve for upper midtones
--------------------------------------------------------- */

function clampChannel(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function applyHighlightsEngine(
  imageData: ImageData,
  amount: number, // -1.0 to +1.0
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  const strength = 0.45;
  const adj = Math.max(-1, Math.min(1, amount)) * strength;

  const center = 0.70; // upper midtones
  const widthRegion = 0.35;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const l =
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const dist = (l - center) / widthRegion;
    const weight = Math.exp(-dist * dist * 4);
    const newL = clamp01(l + adj * weight);

    let nr = r;
    let ng = g;
    let nb = b;

    if (l > 0) {
      const scale = newL / l;
      nr = clampChannel(r * scale);
      ng = clampChannel(g * scale);
      nb = clampChannel(b * scale);
    }

    outData[i] = nr;
    outData[i + 1] = ng;
    outData[i + 2] = nb;
    outData[i + 3] = a;
  }

  return out;
}