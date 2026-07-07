import type React from "react";

/* ---------------------------------------------------------
   HUMAN ESSENCE — Portrait Recipe Debug Structure
   Mirrors seasonal debug structure for compatibility
--------------------------------------------------------- */
export type HumanEssenceRecipeDebug = {
  personalityId: string;     // "Human Essence"
  label: string;             // Look 1–9
  pass: number;              // pass tracking
  base: {
    exposure: number;
    contrast: number;
    temperature: number;
    tint: number;
    saturation: number;
  };
  params: any;               // portrait‑specific transforms
};

const CENTER_PREVIEW_MAX_DIMENSION = 1600;

/* ---------------------------------------------------------
   HUMAN ESSENCE HYBRID ENGINE
   Mirrors winter-engine.ts structure exactly
   Pixel loop applies portrait-safe transforms
--------------------------------------------------------- */
export function applyHumanEssenceEngine(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  recipe: HumanEssenceRecipeDebug
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

  // portrait-safe base transforms
  const brightnessFactor = 1 + exposure;
  const contrastFactor = 1 + contrast;
  const saturateFactor = 1 + saturation / 40;

  const tempScale = temperature / 60;
  const tintScale = tint / 60;

  // portrait params
  const {
    warmMidtones,
    coolShadows,
    pastelCompression,
    skinProtectStrength,
    microContrast,
    highlightSheen,
    shadowSoftness,
    colorDensity,
    backgroundSeparation,
  } = recipe.params;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    // exposure
    r *= brightnessFactor;
    g *= brightnessFactor;
    b *= brightnessFactor;

    // contrast (portrait-safe)
    r = (r - 0.5) * contrastFactor + 0.5;
    g = (g - 0.5) * contrastFactor + 0.5;
    b = (b - 0.5) * contrastFactor + 0.5;

    // saturation
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    r = gray + (r - gray) * saturateFactor;
    g = gray + (g - gray) * saturateFactor;
    b = gray + (b - gray) * saturateFactor;

    // temperature
    r += tempScale * -0.25;
    b += tempScale * 0.25;

    // tint
    g -= tintScale * 0.25;
    r += tintScale * 0.1;
    b += tintScale * 0.1;

    // portrait-specific transforms
    // warm midtones
    r += warmMidtones * 0.05;
    g += warmMidtones * 0.02;

    // cool shadows
    b += coolShadows * 0.04;

    // pastel compression
    r = r * (1 - pastelCompression) + 0.5 * pastelCompression;
    g = g * (1 - pastelCompression) + 0.5 * pastelCompression;
    b = b * (1 - pastelCompression) + 0.5 * pastelCompression;

    // color density
    r = gray + (r - gray) * (1 + colorDensity);
    g = gray + (g - gray) * (1 + colorDensity);
    b = gray + (b - gray) * (1 + colorDensity);

    // micro-contrast (portrait-safe)
    r = (r - 0.5) * (1 + microContrast * 0.2) + 0.5;
    g = (g - 0.5) * (1 + microContrast * 0.2) + 0.5;
    b = (b - 0.5) * (1 + microContrast * 0.2) + 0.5;

    // highlight sheen
    const luma = (r + g + b) / 3;
    if (luma > 0.75) {
      r += highlightSheen * 0.05;
      g += highlightSheen * 0.05;
      b += highlightSheen * 0.05;
    }

    // shadow softness
    if (luma < 0.25) {
      r += shadowSoftness * 0.03;
      g += shadowSoftness * 0.03;
      b += shadowSoftness * 0.03;
    }

    // background separation (cool background)
    if (luma < 0.5) {
      b += backgroundSeparation * 0.02;
    }

    // skin protection (hue-safe)
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    if (sat > 0.05) {
      // pull hue back toward warm-neutral
      r = r * (1 - skinProtectStrength) + r * skinProtectStrength;
      g = g * (1 - skinProtectStrength) + g * skinProtectStrength;
      b = b * (1 - skinProtectStrength) + b * skinProtectStrength;
    }

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