/* ---------------------------------------------------------
   BLACKS WRAPPER
   Public API for blacks adjustment
--------------------------------------------------------- */

import { applyBlacksEngine } from "./blacks-engine";

export type BlacksOptions = {
  amount: number; // -1.0 to +1.0
};

export function applyBlacksAdjustment(
  imageData: ImageData,
  options: BlacksOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyBlacksEngine(imageData, amount);
}