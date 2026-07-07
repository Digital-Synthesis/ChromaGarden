// src/adjustments/exposure/exposure.ts

import { applyExposureEngine, type ExposureEngineParams } from "./exposure-engine";

export interface ExposureAdjustmentOptions {
  stops: number;          // slider value
  rolloff?: number;       // optional highlight rolloff
  shadowLift?: number;    // optional shadow lift
}

export function applyExposureAdjustment(
  imageData: ImageData,
  options: ExposureAdjustmentOptions
): ImageData {
  const params: ExposureEngineParams = {
    stops: options.stops,
    rolloff: options.rolloff ?? 0,
    shadowLift: options.shadowLift ?? 0,
  };

  return applyExposureEngine(imageData, params);
}