/* ---------------------------------------------------------
   WHITES WRAPPER
   Public API for whites adjustment
--------------------------------------------------------- */

import { applyWhitesEngine } from "./whites-engine";

export type WhitesOptions = {
  amount: number; // -1.0 to +1.0
};

export function applyWhitesAdjustment(
  imageData: ImageData,
  options: WhitesOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyWhitesEngine(imageData, amount);
}