// src/adjustments/curves/RGBcomposite.ts

import {
  applyRGBCompositeCurveEngine,
  type RGBCompositeCurveParams,
} from "./RGBcomposite-engine";

export interface RGBCompositeCurveOptions {
  amount: number;
}

export function applyRGBCompositeCurve(
  imageData: ImageData,
  options: RGBCompositeCurveOptions
): ImageData {
  const params: RGBCompositeCurveParams = {
    amount: options.amount,
  };

  return applyRGBCompositeCurveEngine(imageData, params);
}