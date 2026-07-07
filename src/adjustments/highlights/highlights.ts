/* ---------------------------------------------------------
   HIGHLIGHTS WRAPPER
   Public API for highlights adjustment
--------------------------------------------------------- */

import { applyHighlightsEngine } from "./highlights-engine";

export type HighlightsOptions = {
  amount: number; // -1.0 to +1.0
};

export function applyHighlightsAdjustment(
  imageData: ImageData,
  options: HighlightsOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyHighlightsEngine(imageData, amount);
}