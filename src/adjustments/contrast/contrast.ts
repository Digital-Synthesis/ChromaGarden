/* ---------------------------------------------------------
   CONTRAST WRAPPER
   Public API for contrast adjustment
--------------------------------------------------------- */

import { applyContrastEngine } from "./contrast-engine";

export type ContrastOptions = {
  amount: number; // -1.0 to +1.0
};

export function applyContrastAdjustment(
  imageData: ImageData,
  options: ContrastOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyContrastEngine(imageData, amount);
}