// src/adjustments/curves/parametric.ts

import { applyParametricCurveEngine, type ParametricCurveParams } from "./parametric-engine";

export interface ParametricCurveOptions {
  amount: number; // -1 to +1
}

export function applyParametricCurve(
  imageData: ImageData,
  options: ParametricCurveOptions
): ImageData {
  const params: ParametricCurveParams = {
    amount: options.amount,
  };

  return applyParametricCurveEngine(imageData, params);
}