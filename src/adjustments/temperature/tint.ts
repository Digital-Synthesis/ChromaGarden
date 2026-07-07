/* ---------------------------------------------------------
   TINT WRAPPER
   Public API for tint adjustment
--------------------------------------------------------- */

import { applyTintEngine } from "./tint-engine";

export type TintOptions = {
  amount: number; // -1 to +1
};

export function applyTintAdjustment(
  imageData: ImageData,
  options: TintOptions
): ImageData {
  const amount = options.amount ?? 0;
  return applyTintEngine(imageData, amount);
}