/* ---------------------------------------------------------
   SHADOW LIFT CURVE WRAPPER
--------------------------------------------------------- */

import { applyShadowLiftEngine } from "./shadow-lift-engine";

export type ShadowLiftOptions = {
  amount: number; // -1..+1
};

export function applyShadowLiftCurve(
  imageData: ImageData,
  options: ShadowLiftOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyShadowLiftEngine(imageData, amount);
}