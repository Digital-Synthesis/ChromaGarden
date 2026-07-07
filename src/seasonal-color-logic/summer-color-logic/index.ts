// SAFE ADAPTIVE ENGINE — WORKS WITH ANY RECIPE
// Does not assume any fields exist, avoids all TS errors.

import type { OriginalImageAnalysis } from "../../shared/original-analysis";

// Safely read numeric fields from the profile
function num(profile: OriginalImageAnalysis | null, key: string): number {
  if (!profile) return 0;
  const v = (profile as any)[key];
  return typeof v === "number" ? v : 0;
}

// Safely read boolean flags
function flag(profile: OriginalImageAnalysis | null, key: string): boolean {
  if (!profile) return false;
  return Boolean((profile as any)[key]);
}

// Main adaptive function — NOW GENERIC (fixes TS error)
export function adaptParamsToImage<T extends Record<string, any>>(
  profile: OriginalImageAnalysis | null,
  params: T
): T {
  if (!profile) return params;

  const avgWarmth = num(profile, "avgWarmth");
  const avgSaturation = num(profile, "avgSaturation");
  const redDominance = num(profile, "redDominance");
  const contrastMetric = num(profile, "contrast");
  const hasSkin = flag(profile, "hasSkin") || flag(profile, "skinDetected");

  const next: T = { ...params };

  // Helper to scale a param only if it exists
  const scale = (key: string, factor: number) => {
    const obj = next as any;
    if (key in obj && typeof obj[key] === "number") {
      obj[key] = obj[key] * factor;
    }
  };

  // Warmth adaptation
  if (avgWarmth > 0.35) {
    scale("warmth", 0.6);
    scale("solarWarmth", 0.7);
  }
  if (avgWarmth > 0.45) {
    scale("warmth", 0.4);
    scale("solarWarmth", 0.5);
  }

  // Saturation adaptation
  if (avgSaturation > 0.30) {
    scale("saturation", 0.7);
    scale("vibrance", 0.8);
  }
  if (avgSaturation > 0.40) {
    scale("saturation", 0.5);
    scale("vibrance", 0.7);
  }

  // Red dominance protection
  if (redDominance > 0.20) {
    scale("warmth", 0.6);
    scale("solarWarmth", 0.6);
    scale("goldenSaturation", 0.7);
  }
  if (redDominance > 0.30) {
    scale("warmth", 0.4);
    scale("solarWarmth", 0.4);
    scale("goldenSaturation", 0.5);
  }

  // Contrast adaptation
  if (contrastMetric < 0.15) scale("contrast", 1.08);
  if (contrastMetric > 0.40) scale("contrast", 0.92);

  // Skin protection
  if (hasSkin) {
    scale("warmth", 0.8);
    scale("saturation", 0.85);
    scale("vibrance", 0.9);
    scale("colorBurn", 0.8);
  }

  return next;
}