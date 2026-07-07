import type React from "react";

export type AutumnRecipeDebug = {
  personalityId: string;
  label: string;
  pass: number;
  base: {
    exposure: number;
    contrast: number;
    temperature: number;
    tint: number;
    saturation: number;
  };
  params: any;
};

const CENTER_PREVIEW_MAX_DIMENSION = 1600;

export function applyAutumnHybridEngine(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  recipe: AutumnRecipeDebug
) {
  if (!originalImageRef.current) return recipe;

  const img = originalImageRef.current;
  const canvas = document.createElement("canvas");
  const sourceW = img.naturalWidth || img.width;
  const sourceH = img.naturalHeight || img.height;

  if (!sourceW || !sourceH) {
    setImageSrc(img.src);
    return recipe;
  }

  const scale = Math.min(
    CENTER_PREVIEW_MAX_DIMENSION / sourceW,
    CENTER_PREVIEW_MAX_DIMENSION / sourceH,
    1
  );
  const w = Math.round(sourceW * scale);
  const h = Math.round(sourceH * scale);

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    setImageSrc(img.src);
    return recipe;
  }

  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const { exposure, contrast, temperature, tint, saturation } = recipe.base;

  const brightnessFactor = 1 + exposure;          // ~ -0.3..+0.3
  const contrastFactor = 1 + contrast;            // ~ -0.3..+0.6
  const saturateFactor = 1 + saturation / 40;     // small integer steps
  const tempScale = temperature / 60;             // autumn temps ~ -10..+30
  const tintScale = tint / 60;                    // tint ~ -20..+20

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    // exposure / brightness
    r *= brightnessFactor;
    g *= brightnessFactor;
    b *= brightnessFactor;

    // contrast around mid gray
    r = (r - 0.5) * contrastFactor + 0.5;
    g = (g - 0.5) * contrastFactor + 0.5;
    b = (b - 0.5) * contrastFactor + 0.5;

    // saturation
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    r = gray + (r - gray) * saturateFactor;
    g = gray + (g - gray) * saturateFactor;
    b = gray + (b - gray) * saturateFactor;

    // temperature: positive = warmer (more red), negative = cooler (more blue)
    r += tempScale * 0.4;
    b += tempScale * -0.2;

    // tint: positive = magenta (less green), negative = green
    g -= tintScale * 0.3;
    r += tintScale * 0.15;
    b += tintScale * 0.15;

    // clamp
    r = Math.min(1, Math.max(0, r));
    g = Math.min(1, Math.max(0, g));
    b = Math.min(1, Math.max(0, b));

    data[i] = Math.round(r * 255);
    data[i + 1] = Math.round(g * 255);
    data[i + 2] = Math.round(b * 255);
  }

  ctx.putImageData(imageData, 0, 0);
  const gradedSrc = canvas.toDataURL("image/jpeg", 0.95);
  setImageSrc(gradedSrc);

  return recipe;
}