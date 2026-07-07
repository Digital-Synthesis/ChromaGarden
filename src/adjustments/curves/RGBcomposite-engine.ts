// src/adjustments/curves/RGBcomposite-engine.ts
// Master RGB composite curve (global S-curve)

export interface RGBCompositeCurveParams {
  amount: number; // -1 to +1
}

function applyComposite(v: number, amt: number): number {
  if (amt === 0) return v;
  return v + amt * (v - v * v); // same S-curve shape as channel curves
}

export function applyRGBCompositeCurveEngine(
  imageData: ImageData,
  params: RGBCompositeCurveParams
): ImageData {
  const output = new ImageData(imageData.width, imageData.height);
  const src = imageData.data;
  const dst = output.data;

  const amt = params.amount;

  for (let i = 0; i < src.length; i += 4) {
    let r = src[i] / 255;
    let g = src[i + 1] / 255;
    let b = src[i + 2] / 255;

    r = applyComposite(r, amt);
    g = applyComposite(g, amt);
    b = applyComposite(b, amt);

    dst[i] = Math.min(255, Math.max(0, r * 255));
    dst[i + 1] = Math.min(255, Math.max(0, g * 255));
    dst[i + 2] = Math.min(255, Math.max(0, b * 255));
    dst[i + 3] = src[i + 3];
  }

  return output;
}