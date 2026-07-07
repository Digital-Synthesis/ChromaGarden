/* ---------------------------------------------------------
   COLOR SEPARATION CURVE ENGINE
   Warm highlights / cool shadows (cinematic split)
--------------------------------------------------------- */

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function applyColorSeparationEngine(
  imageData: ImageData,
  amount: number, // -1..+1
): ImageData {
  const { width, height, data } = imageData;
  const out = new ImageData(width, height);
  const outData = out.data;

  const amt = Math.max(-1, Math.min(1, amount));
  const strength = amt * 0.4; // keep tasteful

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;
    const a = data[i + 3];

    const Y = luma(r, g, b);

    const shadowWeight = Math.min(1, Math.max(0, (0.5 - Y) * 2)); // 0..1
    const highlightWeight = Math.min(1, Math.max(0, (Y - 0.5) * 2)); // 0..1

    // Positive amt:
    //   Shadows → cooler (more blue/cyan)
    //   Highlights → warmer (more red/yellow)
    // Negative amt reverses the effect.

    if (shadowWeight > 0) {
      const s = strength * shadowWeight;
      // Cool shadows: reduce red, boost blue slightly
      r -= s * 0.6;
      b += s;
    }

    if (highlightWeight > 0) {
      const h = strength * highlightWeight;
      // Warm highlights: boost red, slightly boost green
      r += h;
      g += h * 0.4;
    }

    r = Math.min(1, Math.max(0, r));
    g = Math.min(1, Math.max(0, g));
    b = Math.min(1, Math.max(0, b));

    outData[i] = clamp(r * 255);
    outData[i + 1] = clamp(g * 255);
    outData[i + 2] = clamp(b * 255);
    outData[i + 3] = a;
  }

  return out;
}