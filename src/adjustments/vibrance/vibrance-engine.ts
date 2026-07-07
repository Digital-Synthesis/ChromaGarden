/* ---------------------------------------------------------
   VIBRANCE ENGINE
   Low-level pixel math
   amount: -1 (desaturate) → +1 (boost muted colors)
--------------------------------------------------------- */

export function applyVibranceEngine(
  imageData: ImageData,
  amount: number
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  // Clamp amount
  const a = Math.max(-1, Math.min(1, amount));

  // Vibrance strength (scaled)
  const strength = a * 0.6; // subtle but effective

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const alpha = data[i + 3];

    // Convert to HSV
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let s = max === 0 ? 0 : delta / max;

    // Vibrance logic:
    // - Boost low saturation more than high saturation
    // - Protect skin tones (approx hue 25–70°)
    // - Avoid oversaturation
    const hue = getHue(r, g, b);

    const isSkinTone = hue > 25 && hue < 70;

    let vibranceBoost = strength * (1 - s);

    if (isSkinTone && strength > 0) {
      vibranceBoost *= 0.4; // protect skin tones
    }

    s = clamp01(s + vibranceBoost);

    // Convert back to RGB
    const [nr, ng, nb] = hsvToRgb(hue, s, max);

    outData[i] = Math.round(nr * 255);
    outData[i + 1] = Math.round(ng * 255);
    outData[i + 2] = Math.round(nb * 255);
    outData[i + 3] = alpha;
  }

  return out;
}

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function getHue(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  let h = 0;

  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h *= 60;
  if (h < 0) h += 360;

  return h;
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [r + m, g + m, b + m];
}