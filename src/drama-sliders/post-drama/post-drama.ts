// src/drama-sliders/post-drama/post-drama.ts

// ---------------------------------------------------------
// POST-DRAMA CONFIG
// ---------------------------------------------------------

export type PostDramaValue = number;

export const POST_DRAMA_MIN = -5;
export const POST_DRAMA_MAX = 5;
export const POST_DRAMA_STEP = 0.5;

/**
 * Clamp the Post-Drama slider value into the allowed range.
 */
export function clampPostDrama(value: PostDramaValue): PostDramaValue {
  if (value < POST_DRAMA_MIN) return POST_DRAMA_MIN;
  if (value > POST_DRAMA_MAX) return POST_DRAMA_MAX;
  return value;
}

/**
 * Convert a Post-Drama value into a multiplicative factor.
 *
 * - Slider range: -5 → +5
 * - Each step: 0.5
 * - Factor mapping: 1 + (postDrama * 0.1)
 */
export function getPostDramaFactor(postDrama: PostDramaValue): number {
  const clamped = clampPostDrama(postDrama);
  return 1 + clamped * 0.1;
}

// ---------------------------------------------------------
// INTERNAL HELPERS — PURE, IMMUTABLE TRANSFORMS
// ---------------------------------------------------------

type AnyObject = { [key: string]: any };

/**
 * Only scale values inside params.* — never profile.*, curves.*, etc.
 */
function shouldScaleKey(key: string): boolean {
  return key.startsWith("params.");
}

/**
 * Apply factor to a single numeric value.
 */
function applyFactorToValue(value: any, factor: number): any {
  if (typeof value !== "number") return value;
  return value * factor;
}

/**
 * Deep transform, but ONLY scaling params.* keys.
 */
function applyFactorDeep<T>(input: T, factor: number, parentKey = ""): T {
  if (input === null || input === undefined) return input;

  if (Array.isArray(input)) {
    return input.map((item) =>
      applyFactorDeep(item, factor, parentKey)
    ) as unknown as T;
  }

  if (typeof input === "object") {
    const obj = input as AnyObject;
    const out: AnyObject = {};

    Object.keys(obj).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (value === null || value === undefined) {
        out[key] = value;
      } else if (Array.isArray(value) || typeof value === "object") {
        out[key] = applyFactorDeep(value, factor, fullKey);
      } else {
        out[key] = shouldScaleKey(fullKey)
          ? applyFactorToValue(value, factor)
          : value;
      }
    });

    return out as T;
  }

  return input;
}

// ---------------------------------------------------------
// PUBLIC API — RECIPES & VARIATIONS
// ---------------------------------------------------------

/**
 * Apply Post-Drama to a single recipe/debug object.
 *
 * - Only scales params.* keys
 * - Never mutates original
 */
export function applyPostDramaToRecipe<T>(
  recipe: T,
  postDrama: PostDramaValue
): T {
  const factor = getPostDramaFactor(postDrama);
  if (factor === 1) return recipe;
  return applyFactorDeep(recipe, factor);
}

export interface VariationWithDebug {
  id: number;
  src: string;
  debug: any;
  locked: boolean;
}

/**
 * Apply Post-Drama to all variations' debug data.
 *
 * - Only transforms params.* inside debug
 * - src and other fields preserved
 */
export function applyPostDramaToVariations(
  variations: VariationWithDebug[],
  postDrama: PostDramaValue
): VariationWithDebug[] {
  const factor = getPostDramaFactor(postDrama);
  if (factor === 1) return variations;

  return variations.map((v) => ({
    ...v,
    debug: v.debug ? applyFactorDeep(v.debug, factor) : v.debug,
  }));
}