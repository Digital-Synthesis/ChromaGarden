import type React from "react";

export type BWCurveTransform =
  | { type: "filmicToe"; amount: number }
  | { type: "filmicShoulder"; amount: number }
  | { type: "highlightRolloff"; amount: number }
  | { type: "shadowLift"; amount: number }
  | { type: "colorSeparation"; amount: number };

export type BWRecipeDebug = {
  personalityId: string;       // "Curvy"
  label: string;               // "Look 1"..."Look 9"
  pass: number;                // pass counter
  base: {
    exposure: number;
    contrast: number;
    brightness: number;
  };
  curves: BWCurveTransform[];  // selected transforms
  jitter: Record<string, number>;
};

const CENTER_PREVIEW_MAX_DIMENSION = 1600;

export function applyBlackAndWhiteEngine(
  originalImageRef: React.RefObject<HTMLImageElement | null>,
  setImageSrc: (src: string | null) => void,
  recipe: BWRecipeDebug
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

  const { exposure, contrast, brightness } = recipe.base;

  const exposureFactor = 1 + exposure;
  const contrastFactor = 1 + contrast;
  const brightnessOffset = brightness;

  // Curve transform helpers
  const applyCurve = (v: number, t: BWCurveTransform): number => {
    switch (t.type) {
      case "filmicToe":
        return v * (1 - t.amount * 0.5);
      case "filmicShoulder":
        return 1 - (1 - v) * (1 - t.amount * 0.5);
      case "highlightRolloff":
        return v < 0.7 ? v : 0.7 + (v - 0.7) * (1 - t.amount);
      case "shadowLift":
        return v * (1 - t.amount) + t.amount * 0.1;
      case "colorSeparation":
        return v; // grayscale → no-op, but included for consistency
      default:
        return v;
    }
  };

  // Apply B&W + curves
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    // Convert to grayscale
    let v = 0.3 * r + 0.59 * g + 0.11 * b;

    // Exposure
    v *= exposureFactor;

    // Contrast around mid-gray
    v = (v - 0.5) * contrastFactor + 0.5;

    // Brightness
    v += brightnessOffset;

    // Apply selected curve transforms
    for (const t of recipe.curves) {
      v = applyCurve(v, t);
    }

    // Clamp
    v = Math.min(1, Math.max(0, v));

    const out = Math.round(v * 255);
    data[i] = out;
    data[i + 1] = out;
    data[i + 2] = out;
  }

  ctx.putImageData(imageData, 0, 0);
  const gradedSrc = canvas.toDataURL("image/jpeg", 0.95);
  setImageSrc(gradedSrc);

  return recipe;
}