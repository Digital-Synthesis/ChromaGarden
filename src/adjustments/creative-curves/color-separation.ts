/* ---------------------------------------------------------
   COLOR SEPARATION CURVE WRAPPER
--------------------------------------------------------- */

import { applyColorSeparationEngine } from "./color-separation-engine";

export type ColorSeparationOptions = {
  amount: number; // -1..+1
};

export function applyColorSeparationCurve(
  imageData: ImageData,
  options: ColorSeparationOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyColorSeparationEngine(imageData, amount);
}