// adjustmentWorker.ts
// Runs in a Web Worker — NO DOM, NO React

/* ---------------------------------------------------------
IMPORTS — BASIC ADJUSTMENTS
--------------------------------------------------------- */
import { applyExposureAdjustment } from "./exposure/exposure";
import { applyContrastAdjustment } from "./contrast/contrast";

/* ---------------------------------------------------------
IMPORTS — TONE
--------------------------------------------------------- */
import { applyShadowsAdjustment } from "./shadows/shadows";
import { applyHighlightsAdjustment } from "./highlights/highlights";
import { applyWhitesAdjustment } from "./whites/whites";
import { applyBlacksAdjustment } from "./blacks/blacks";

/* ---------------------------------------------------------
IMPORTS — COLOR
--------------------------------------------------------- */
import { applyTemperatureAdjustment } from "./temperature/temperature";
import { applyTintAdjustment } from "./temperature/tint";
import { applyVibranceAdjustment } from "./vibrance/vibrance";

/* ---------------------------------------------------------
IMPORTS — PRESENCE
--------------------------------------------------------- */
import { applyClarityAdjustment } from "./clarity/clarity";
import { applyTextureAdjustment } from "./texture/texture";
import { applyDehazeAdjustment } from "./dehaze/dehaze";

/* ---------------------------------------------------------
IMPORTS — COMMON CURVES
--------------------------------------------------------- */
import { applyParametricCurve } from "./curves/parametric";
import { applyRGBCompositeCurve } from "./curves/RGBcomposite";
import { applyRGBChannelCurve } from "./curves/RGB";

/* ---------------------------------------------------------
IMPORTS — CREATIVE CURVES
--------------------------------------------------------- */
import { applyFilmicToeCurve } from "./creative-curves/filmic-toe";
import { applyFilmicShoulderCurve } from "./creative-curves/filmic-shoulder";
import { applyHighlightRolloffCurve } from "./creative-curves/highlight-rolloff";
import { applyShadowLiftCurve } from "./creative-curves/shadow-lift";
import { applyColorSeparationCurve } from "./creative-curves/color-separation";

/* ---------------------------------------------------------
IMPORTS — MANUAL TWEAK PIXEL MATH
--------------------------------------------------------- */
import {
  applyManualExposure,
  applyManualContrast,
  applyBWContrast,
  applyBWToeStrength,
  applyBWShoulderStrength,
  applyBWMatteStrength,
  applyCurvyFilmicToe,
  applyCurvyFilmicShoulder,
  applyCurvyHighlightRolloff,
  applyCurvyShadowLift,
  applyCurvyColorSeparation,
  applyCurvyBrightness,
} from "./manualTweakPixelMath";
import {
  applyManualTweakPixel,
  type TweakMathMode,
} from "./manualTweakDispatch";

/* ---------------------------------------------------------
WORKER SETUP
--------------------------------------------------------- */
const workerSelf: any = self as any;
let latestJobId = 0;

/* ---------------------------------------------------------
ALLOWED MANUAL TWEAK KEYS — PREVENT BLEED-OVER
--------------------------------------------------------- */
const ALLOWED_TWEAK_KEYS = new Set([
  // Seasonal / Portrait / Spring / Winter / Autumn
  "params.blueShadowBoost",
  "params.highlightNeutralLift",
  "params.snowCrispness",
  "params.graySoftening",
  "params.blueMelt",
  "params.snowFlatten",
  "params.steelBlueShift",
  "params.concreteNeutralLift",
  "params.urbanShadowControl",
  "params.coolShadowDepth",
  "params.greenBlueCast",
  "params.warmHighlightLift",
  "params.coldBlackDepth",
  "params.icyBluePunch",
  "params.edgeCrispness",
  "params.duskMagentaLift",
  "params.icyBlueBalance",
  "params.pastelFade",
  "params.brickWarmth",
  "params.concreteNeutral",
  "params.foliageAccent",
  "params.shadowAmber",
  "params.horizonRollOff",
  "params.skyDepth",
  "params.canopyWarmth",
  "params.leafSeparation",
  "params.trunkDepth",
  "params.fieldGlow",
  "params.grassSeparation",
  "params.skyBalance",
  "params.fogDensity",
  "params.horizonSoftness",
  "params.fieldSeparation",
  "params.barkDepth",
  "params.mossSeparation",
  "params.canopyShadow",
  "params.petalGlow",
  "params.halation",
  "params.skinBloom",
  "params.foliageSoftness",
  "params.dappleLight",
  "params.neutralBalance",
  "params.mistDensity",
  "params.dewLift",
  "params.coolAir",
  "params.grayBalance",
  "params.rainSoftness",
  "params.coolMist",
  "params.greenFreshness",
  "params.fieldAir",
  "params.pastelShift",
  "params.skyLift",
  "params.cloudSoftness",
  "params.bluePurity",
  "params.warmMidtones",
  "params.coolShadows",
  "params.pastelCompression",
  "params.skinProtectStrength",
  "params.microContrast",
  "params.highlightSheen",
  "params.shadowSoftness",
  "params.colorDensity",
  "params.backgroundSeparation",

  // Base color engine
  "params.exposure",
  "params.contrast",
  "params.temperature",
  "params.tint",
  "params.saturation",

  // Summer
  "params.vibrance",
  "params.warmth",
  "params.curveStrength",
  "params.highlightRolloff",
  "params.shadowLift",
  "params.matteStrength",
  "params.warmHighlights",
  "params.shadowDepth",
  "params.warmBias",
  "params.highlightBloom",
  "params.hueSoftening",
  "params.chromaPreservation",
  "params.depthContrast",
  "params.hueSeparation",
  "params.chromaDepth",
  "params.highlightCompression",
  "params.cleanBlacks",
  "params.highlightLift",
  "params.lift",
  "params.gamma",
  "params.gain",
  "params.solarWarmth",
  "params.goldenSaturation",
  "params.colorBurn",

  // B&W
  "profile.contrast",
  "profile.shadowDensity",
  "profile.highlightDensity",
  "profile.midtoneBalance",
  "params.toeStrength",
  "params.shoulderStrength",

  // Curvy
  "curves.filmicToe",
  "curves.filmicShoulder",
  "curves.highlightRolloff",
  "curves.shadowLift",
  "curves.colorSeparation",
  "base.brightness",
  "base.exposure",
  "base.contrast",
]);

/* ---------------------------------------------------------
MESSAGE HANDLER
--------------------------------------------------------- */
workerSelf.onmessage = (e: MessageEvent) => {
  const {
    jobId,
    imageData,
    manualTweaksOnly = false,
    skipBwRecipeReapply = false,
    tweakMathMode = "default",
    requestPreTweakCache = false,
    bwRecipe,

    // Basic
    exposure,
    contrast,

    // Tone
    shadows,
    highlights,
    whites,
    blacks,

    // Color
    temperature,
    tint,
    vibrance,

    // Presence
    clarity,
    texture,
    dehaze,

    // Curves
    parametricCurve,
    rgbComposite,
    rgbR,
    rgbG,
    rgbB,

    // Creative Curves
    filmicToe,
    filmicShoulder,
    highlightRolloff,
    shadowLift,
    colorSeparation,

    // Manual Tweaks
    manualTweaks = {},

    // Curvy curves array
    curves
  } = e.data;

  /* -------------------------------------------------------
  LATEST-WINS CHECK
  ------------------------------------------------------- */
  if (typeof jobId === "number") {
    if (jobId < latestJobId) return;
    latestJobId = jobId;
  }

  /* -------------------------------------------------------
  APPLY MANUAL TWEAK DELTAS TO SLIDER VALUES
  ------------------------------------------------------- */
  let exp = exposure;
  let con = contrast;
  let shad = shadows;
  let high = highlights;
  let whit = whites;
  let blak = blacks;
  let temp = temperature;
  let tnt = tint;
  let vib = vibrance;
  let clar = clarity;
  let text = texture;
  let deh = dehaze;
  let pcurve = parametricCurve;
  let rgbc = rgbComposite;
  let rr = rgbR;
  let gg = rgbG;
  let bb = rgbB;
  let toe = filmicToe;
  let shoulder = filmicShoulder;
  let roll = highlightRolloff;
  let lift = shadowLift;
  let sep = colorSeparation;

  let manualExposureDelta = 0;
  let manualContrastDelta = 0;

  const tweakList: Array<{ key: string; amount: number }> = [];

  for (const key in manualTweaks) {
    const delta = manualTweaks[key];
    if (!delta) continue;

    if (
      !ALLOWED_TWEAK_KEYS.has(key) &&
      !key.startsWith("curves[") &&
      !key.startsWith("jitter.")
    ) {
      continue;
    }

    switch (key) {
      case "base.exposure":
        if (manualTweaksOnly) manualExposureDelta += delta;
        else exp += delta;
        break;

      case "base.contrast":
        if (manualTweaksOnly) manualContrastDelta += delta;
        else con += delta;
        break;

      case "base.brightness":
        tweakList.push({ key: "base.brightness", amount: delta });
        break;

      default:
        if (key.startsWith("curves[") && key.endsWith("].amount")) break;
        tweakList.push({ key, amount: delta });
        break;
    }
  }

  if (curves && Array.isArray(curves)) {
    for (const key in manualTweaks) {
      const delta = manualTweaks[key];
      if (!delta) continue;

      if (key.startsWith("curves[") && key.endsWith("].amount")) {
        const index = Number(key.slice(7, key.indexOf("]")));
        const curve = curves[index];

        if (curve && curve.type) {
          tweakList.push({
            key: `curves.${curve.type}`,
            amount: delta
          });
        }
      }
    }
  }

  for (const key in manualTweaks) {
    if (key.startsWith("jitter.")) {
      tweakList.push({
        key,
        amount: manualTweaks[key]
      });
    }
  }

  let result = imageData;
  const runFullPipeline = !manualTweaksOnly;
  const tweakMode = (tweakMathMode || "default") as TweakMathMode;

  if (bwRecipe?.mode === "blackAndWhite" && !skipBwRecipeReapply) {
    const data = result.data;
    const params = bwRecipe.params || {};
    const bwCurves = Array.isArray(bwRecipe.curves) ? bwRecipe.curves : [];

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;

      const gray = 0.3 * r + 0.59 * g + 0.11 * b;
      r = gray;
      g = gray;
      b = gray;

      if (typeof params.exposure === "number") {
        [r, g, b] = applyManualExposure(r, g, b, params.exposure);
      }

      if (typeof params.contrast === "number") {
        [r, g, b] = bwCurves.length > 0
          ? applyManualContrast(r, g, b, params.contrast)
          : applyBWContrast(r, g, b, params.contrast);
      }

      if (typeof params.toeStrength === "number") {
        [r, g, b] = applyBWToeStrength(r, g, b, params.toeStrength);
      }

      if (typeof params.shoulderStrength === "number") {
        [r, g, b] = applyBWShoulderStrength(r, g, b, params.shoulderStrength);
      }

      if (typeof params.matteStrength === "number") {
        [r, g, b] = applyBWMatteStrength(r, g, b, params.matteStrength);
      }

      for (const curve of bwCurves) {
        if (!curve || typeof curve.amount !== "number") continue;

        switch (curve.type) {
          case "filmicToe":
            [r, g, b] = applyCurvyFilmicToe(r, g, b, curve.amount);
            break;
          case "filmicShoulder":
            [r, g, b] = applyCurvyFilmicShoulder(r, g, b, curve.amount);
            break;
          case "highlightRolloff":
            [r, g, b] = applyCurvyHighlightRolloff(r, g, b, curve.amount);
            break;
          case "shadowLift":
            [r, g, b] = applyCurvyShadowLift(r, g, b, curve.amount);
            break;
          case "colorSeparation":
            [r, g, b] = applyCurvyColorSeparation(r, g, b, curve.amount);
            break;
        }
      }

      if (bwRecipe.base && typeof bwRecipe.base.brightness === "number") {
        [r, g, b] = applyCurvyBrightness(r, g, b, bwRecipe.base.brightness);
      }

      data[i] = Math.round(Math.min(1, Math.max(0, r)) * 255);
      data[i + 1] = Math.round(Math.min(1, Math.max(0, g)) * 255);
      data[i + 2] = Math.round(Math.min(1, Math.max(0, b)) * 255);
    }
  }

  if (runFullPipeline) {
    result = applyExposureAdjustment(result, { stops: exp });
    result = applyContrastAdjustment(result, { amount: con });
    result = applyBlacksAdjustment(result, { amount: blak });
    result = applyShadowsAdjustment(result, { amount: shad });
    result = applyHighlightsAdjustment(result, { amount: high });
    result = applyWhitesAdjustment(result, { amount: whit });
    result = applyTemperatureAdjustment(result, { amount: temp });
    result = applyTintAdjustment(result, { amount: tnt });
    result = applyVibranceAdjustment(result, { amount: vib });

    if (rgbc !== 0) {
      result = applyRGBCompositeCurve(result, { amount: rgbc });
    }
    if (pcurve !== 0) {
      result = applyParametricCurve(result, { amount: pcurve });
    }
    if (rr !== 0 || gg !== 0 || bb !== 0) {
      result = applyRGBChannelCurve(result, { r: rr, g: gg, b: bb });
    }
    if (toe !== 0) {
      result = applyFilmicToeCurve(result, { amount: toe });
    }
    if (shoulder !== 0) {
      result = applyFilmicShoulderCurve(result, { amount: shoulder });
    }
    if (roll !== 0) {
      result = applyHighlightRolloffCurve(result, { amount: roll });
    }
    if (lift !== 0) {
      result = applyShadowLiftCurve(result, { amount: lift });
    }
    if (sep !== 0) {
      result = applyColorSeparationCurve(result, { amount: sep });
    }

    result = applyClarityAdjustment(result, { amount: clar });
    result = applyTextureAdjustment(result, { amount: text });
    result = applyDehazeAdjustment(result, { amount: deh });
  }

  if (manualTweaksOnly) {
    if (manualExposureDelta !== 0) {
      result = applyExposureAdjustment(result, { stops: manualExposureDelta });
    }
    if (manualContrastDelta !== 0) {
      result = applyContrastAdjustment(result, { amount: manualContrastDelta });
    }
  }

  let preTweakCache: ImageData | undefined;
  if (requestPreTweakCache && !manualTweaksOnly) {
    preTweakCache = new ImageData(
      new Uint8ClampedArray(result.data),
      result.width,
      result.height
    );
  }

  if (tweakList.length > 0) {
    const data = result.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;

      for (const { key, amount } of tweakList) {
        [r, g, b] = applyManualTweakPixel(key, amount, r, g, b, tweakMode);
      }

      data[i] = Math.round(r * 255);
      data[i + 1] = Math.round(g * 255);
      data[i + 2] = Math.round(b * 255);
    }
  }

  if (preTweakCache) {
    workerSelf.postMessage({ output: result, preTweakCache }, [
      result.data.buffer,
      preTweakCache.data.buffer,
    ]);
  } else {
    workerSelf.postMessage(result, [result.data.buffer]);
  }
};
