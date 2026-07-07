// src/adjustments/texture/texture.ts

import {
  applyTextureEngine,
  type TextureEngineParams,
} from "./texture-engine";

export interface TextureAdjustmentOptions {
  amount: number; // -1 to +1
}

export function applyTextureAdjustment(
  imageData: ImageData,
  options: TextureAdjustmentOptions
): ImageData {
  const params: TextureEngineParams = {
    amount: options.amount,
  };

  return applyTextureEngine(imageData, params);
}