// src/adjustments/curves/RGB-engine.ts
// Per-channel RGB curve (one slider per channel)

export interface RGBChannelCurveParams {
  r: number; // -1 to +1
  g: number; // -1 to +1
  b: number; // -1 to +1
}

function applyCurve(v: number, amt: number): number {
  if (amt === 0) return v;
  return v + amt * (v - v * v); // gentle S-curve
}

export function applyRGBChannelCurveEngine(
  imageData: ImageData,
  params: RGBChannelCurveParams
): ImageData {
  const output = new ImageData(imageData.width, imageData.height);
  const src = imageData.data;
  const dst = output.data;

  const { r: ar, g: ag, b: ab } = params;

  for (let i = 0; i < src.length; i += 4) {
    let r = src[i] / 255;
    let g = src[i + 1] / 255;
    let b = src[i + 2] / 255;

    r = applyCurve(r, ar);
    g = applyCurve(g, ag);
    b = applyCurve(b, ab);

    dst[i] = Math.min(255, Math.max(0, r * 255));
    dst[i + 1] = Math.min(255, Math.max(0, g * 255));
    dst[i + 2] = Math.min(255, Math.max(0, b * 255));
    dst[i + 3] = src[i + 3];
  }

  return output;
}