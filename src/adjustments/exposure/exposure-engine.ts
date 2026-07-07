// src/adjustments/exposure/exposure-engine.ts

export interface ExposureEngineParams {
  stops: number;          // slider value in stops (-5 to +5 recommended)
  rolloff?: number;       // highlight rolloff strength (0–1)
  shadowLift?: number;    // shadow lift strength (0–1)
}

export function stopsToMultiplier(stops: number): number {
  // 1 stop = 2x brightness
  return Math.pow(2, stops);
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function applyHighlightRolloff(value: number, strength: number): number {
  if (strength <= 0) return value;
  const t = clamp01(value);
  return t - (t * t * strength * 0.5);
}

export function applyShadowLift(value: number, strength: number): number {
  if (strength <= 0) return value;
  const t = clamp01(value);
  return t + (strength * (1 - t) * 0.25);
}

export function applyExposureToPixel(
  r: number,
  g: number,
  b: number,
  params: ExposureEngineParams
) {
  const mult = stopsToMultiplier(params.stops);

  let nr = r * mult;
  let ng = g * mult;
  let nb = b * mult;

  // highlight rolloff
  if (params.rolloff && params.rolloff > 0) {
    nr = applyHighlightRolloff(nr, params.rolloff);
    ng = applyHighlightRolloff(ng, params.rolloff);
    nb = applyHighlightRolloff(nb, params.rolloff);
  }

  // shadow lift
  if (params.shadowLift && params.shadowLift > 0) {
    nr = applyShadowLift(nr, params.shadowLift);
    ng = applyShadowLift(ng, params.shadowLift);
    nb = applyShadowLift(nb, params.shadowLift);
  }

  return {
    r: clamp01(nr),
    g: clamp01(ng),
    b: clamp01(nb),
  };
}

export function applyExposureEngine(
  imageData: ImageData,
  params: ExposureEngineParams
): ImageData {
  const output = new ImageData(imageData.width, imageData.height);
  const src = imageData.data;
  const dst = output.data;

  for (let i = 0; i < src.length; i += 4) {
    const r = src[i] / 255;
    const g = src[i + 1] / 255;
    const b = src[i + 2] / 255;

    const { r: nr, g: ng, b: nb } = applyExposureToPixel(r, g, b, params);

    dst[i] = nr * 255;
    dst[i + 1] = ng * 255;
    dst[i + 2] = nb * 255;
    dst[i + 3] = src[i + 3]; // preserve alpha
  }

  return output;
}