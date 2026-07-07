// src/adjustments/curves/parametric-engine.ts
// Lightroom-style segmented parametric curve (Shadows / Darks / Lights / Highlights)

export interface ParametricCurveParams {
  amount: number; // -1 to +1
}

export function applyParametricCurveEngine(
  imageData: ImageData,
  params: ParametricCurveParams
): ImageData {
  const output = new ImageData(imageData.width, imageData.height);
  const src = imageData.data;
  const dst = output.data;

  const amt = params.amount;

  for (let i = 0; i < src.length; i += 4) {
    let r = src[i] / 255;
    let g = src[i + 1] / 255;
    let b = src[i + 2] / 255;

    const apply = (v: number) => {
      if (amt === 0) return v;

      if (v < 0.25) return v + amt * (0.25 - v) * 0.5;
      if (v < 0.5) return v + amt * (0.5 - v) * 0.35;
      if (v < 0.75) return v + amt * (0.75 - v) * 0.25;
      return v + amt * (1 - v) * 0.15;
    };

    r = apply(r);
    g = apply(g);
    b = apply(b);

    dst[i] = Math.min(255, Math.max(0, r * 255));
    dst[i + 1] = Math.min(255, Math.max(0, g * 255));
    dst[i + 2] = Math.min(255, Math.max(0, b * 255));
    dst[i + 3] = src[i + 3];
  }

  return output;
}