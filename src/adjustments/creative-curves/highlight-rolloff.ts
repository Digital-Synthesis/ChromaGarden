/* ---------------------------------------------------------
   HIGHLIGHT ROLLOFF CURVE WRAPPER
--------------------------------------------------------- */

import { applyHighlightRolloffEngine } from "./highlight-rolloff-engine";

export type HighlightRolloffOptions = {
  amount: number; // -1..+1
};

export function applyHighlightRolloffCurve(
  imageData: ImageData,
  options: HighlightRolloffOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyHighlightRolloffEngine(imageData, amount);
}