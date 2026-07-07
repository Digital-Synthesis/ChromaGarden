/* ---------------------------------------------------------
   SHADOWS WRAPPER
   Public API for shadows adjustment
--------------------------------------------------------- */

import { applyShadowsEngine } from "./shadows-engine";

export type ShadowsOptions = {
  amount: number; // -1.0 to +1.0
};

export function applyShadowsAdjustment(
  imageData: ImageData,
  options: ShadowsOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyShadowsEngine(imageData, amount);
}