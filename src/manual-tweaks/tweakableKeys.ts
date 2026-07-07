/** Flatten recipe debug — mirrors RightUI.flattenObject. */
export function flattenDebugObject(
  obj: any,
  prefix = ""
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (!obj || typeof obj !== "object") return out;

  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === "object") {
          Object.assign(out, flattenDebugObject(item, `${fullKey}[${index}]`));
        } else {
          out[`${fullKey}[${index}]`] = item;
        }
      });
      return;
    }

    if (value && typeof value === "object") {
      Object.assign(out, flattenDebugObject(value, fullKey));
      return;
    }

    out[fullKey] = value;
  });

  return out;
}

/**
 * Params.* keys that duplicate recipe-root metadata (personalityId, pass, label).
 * Summer engines spread full runtime params into `params`, so these appear twice;
 * post-drama scales the params.* copies — hide them in Active Recipe Raw Data.
 */
export function isDuplicateParamsMetaKey(key: string): boolean {
  if (!key.startsWith("params.")) return false;

  const name = key.slice("params.".length);
  if (
    name === "personalityId" ||
    name === "pass" ||
    name === "label" ||
    name === "index"
  ) {
    return true;
  }

  if (/^(personalityId|pass)\d+$/.test(name)) {
    return true;
  }

  return false;
}

/** Mirrors RightUI.renderManualTweaks key filter. */
export function isTweakableKey(
  key: string,
  value: unknown,
  activeProfile: string | null
): boolean {
  if (typeof value !== "number") return false;

  const isSeasonParam =
    key.startsWith("params.") &&
    !key.includes("adaptive") &&
    !isDuplicateParamsMetaKey(key);

  const isBWBase =
    key.startsWith("base.") &&
    (activeProfile === "Strong" ||
      (activeProfile === "Curvy" && key === "base.brightness"));

  const isCurvyCurve =
    activeProfile === "Curvy" &&
    key.startsWith("curves[") &&
    key.endsWith("].amount");

  return isSeasonParam || isBWBase || isCurvyCurve;
}

export function getTweakableKeysFromDebug(
  debug: any,
  activeProfile: string | null
): Set<string> {
  const flattened = flattenDebugObject(debug);
  const valid = new Set<string>();

  for (const [key, value] of Object.entries(flattened)) {
    if (isTweakableKey(key, value, activeProfile)) {
      valid.add(key);
    }
  }

  return valid;
}

export function pruneManualTweaks(
  tweaks: Record<string, number>,
  validKeys: Set<string>
): Record<string, number> {
  const pruned: Record<string, number> = {};
  for (const [key, val] of Object.entries(tweaks)) {
    if (validKeys.has(key)) pruned[key] = val;
  }
  return pruned;
}

/** Walk a dot/bracket path; return numeric leaf or null if missing/non-numeric. */
export function getNumericAtPath(obj: any, path: string): number | null {
  let current: any = obj;

  for (const segment of path.split(".")) {
    if (current == null || typeof current !== "object") return null;

    const bracket = segment.match(/^([^\[]+)\[(\d+)\]$/);
    if (bracket) {
      const arr = current[bracket[1]];
      if (!Array.isArray(arr)) return null;
      const idx = Number(bracket[2]);
      if (idx < 0 || idx >= arr.length) return null;
      current = arr[idx];
    } else {
      if (!(segment in current)) return null;
      current = current[segment];
    }
  }

  return typeof current === "number" ? current : null;
}

/** Add delta only if the full path already exists with a numeric leaf. */
export function addNumericDeltaAtPath(
  obj: any,
  path: string,
  delta: number
): boolean {
  const segments = path.split(".");
  if (segments.length === 0) return false;

  let current: any = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    if (current == null || typeof current !== "object") return false;

    const segment = segments[i];
    const bracket = segment.match(/^([^\[]+)\[(\d+)\]$/);
    if (bracket) {
      const arr = current[bracket[1]];
      if (!Array.isArray(arr)) return false;
      const idx = Number(bracket[2]);
      if (idx < 0 || idx >= arr.length) return false;
      current = arr[idx];
    } else {
      if (!(segment in current)) return false;
      current = current[segment];
    }
  }

  const last = segments[segments.length - 1];
  if (current == null || typeof current !== "object") return false;
  if (!(last in current)) return false;

  const val = current[last];
  if (typeof val !== "number") return false;

  current[last] = val + delta;
  return true;
}
