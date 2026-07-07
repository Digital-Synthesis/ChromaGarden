/* ---------------------------------------------------------
   FILMIC SHOULDER CURVE WRAPPER
--------------------------------------------------------- */

import { applyFilmicShoulderEngine } from "./filmic-shoulder-engine";

export type FilmicShoulderOptions = {
  amount: number; // -1..+1
};

export function applyFilmicShoulderCurve(
  imageData: ImageData,
  options: FilmicShoulderOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyFilmicShoulderEngine(imageData, amount);
}