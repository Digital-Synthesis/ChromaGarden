// src/adjustments/clarity/clarity.ts

import {
  applyClarityEngine,
  type ClarityEngineParams,
} from "./clarity-engine";

export interface ClarityAdjustmentOptions {
  amount: number; // -1 to +1
}

export function applyClarityAdjustment(
  imageData: ImageData,
  options: ClarityAdjustmentOptions
): ImageData {
  const params: ClarityEngineParams = {
    amount: options.amount,
  };

  return applyClarityEngine(imageData, params);
}