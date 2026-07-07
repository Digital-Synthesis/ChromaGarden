/* ---------------------------------------------------------
   FILMIC TOE CURVE WRAPPER
--------------------------------------------------------- */

import { applyFilmicToeEngine } from "./filmic-toe-engine";

export type FilmicToeOptions = {
  amount: number; // -1..+1
};

export function applyFilmicToeCurve(
  imageData: ImageData,
  options: FilmicToeOptions,
): ImageData {
  const amount = options.amount ?? 0;
  return applyFilmicToeEngine(imageData, amount);
}