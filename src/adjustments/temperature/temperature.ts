/* ---------------------------------------------------------
   TEMPERATURE WRAPPER
   Public API for temperature adjustment
--------------------------------------------------------- */

import { applyTemperatureEngine } from "./temperature-engine";

export type TemperatureOptions = {
  amount: number; // -1 to +1
};

export function applyTemperatureAdjustment(
  imageData: ImageData,
  options: TemperatureOptions
): ImageData {
  const amount = options.amount ?? 0;
  return applyTemperatureEngine(imageData, amount);
}