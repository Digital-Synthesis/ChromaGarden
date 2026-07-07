// src/adjustments/dehaze/dehaze.ts

import {
  applyDehazeEngine,
  type DehazeEngineParams,
} from "./dehaze-engine";

export interface DehazeAdjustmentOptions {
  amount: number; // -1 to +1
}

export function applyDehazeAdjustment(
  imageData: ImageData,
  options: DehazeAdjustmentOptions
): ImageData {
  const params: DehazeEngineParams = {
    amount: options.amount,
  };

  return applyDehazeEngine(imageData, params);
}