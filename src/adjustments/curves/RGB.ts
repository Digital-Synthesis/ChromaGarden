// src/adjustments/curves/RGB.ts

import {
  applyRGBChannelCurveEngine,
  type RGBChannelCurveParams,
} from "./RGB-engine";

export interface RGBChannelCurveOptions {
  r: number;
  g: number;
  b: number;
}

export function applyRGBChannelCurve(
  imageData: ImageData,
  options: RGBChannelCurveOptions
): ImageData {
  const params: RGBChannelCurveParams = {
    r: options.r,
    g: options.g,
    b: options.b,
  };

  return applyRGBChannelCurveEngine(imageData, params);
}