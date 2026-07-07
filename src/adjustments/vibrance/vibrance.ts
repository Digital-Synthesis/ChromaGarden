/* ---------------------------------------------------------
   VIBRANCE WRAPPER
   Public API for vibrance adjustment
--------------------------------------------------------- */

import { applyVibranceEngine } from "./vibrance-engine";

export type VibranceOptions = {
  amount: number; // -1 to +1
};

export function applyVibranceAdjustment(
  imageData: ImageData,
  options: VibranceOptions
): ImageData {
  const amount = options.amount ?? 0;
  return applyVibranceEngine(imageData, amount);
}