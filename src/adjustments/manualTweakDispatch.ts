import {
  applyBlueShadowBoost,
  applyHighlightNeutralLift,
  applySnowCrispness,
  applyGraySoftening,
  applyBlueMelt,
  applySnowFlatten,
  applySteelBlueShift,
  applyConcreteNeutralLift,
  applyUrbanShadowControl,
  applyCoolShadowDepth,
  applyGreenBlueCast,
  applyWarmHighlightLift,
  applyColdBlackDepth,
  applyIcyBluePunch,
  applyEdgeCrispness,
  applyDuskMagentaLift,
  applyIcyBlueBalance,
  applyPastelFade,
  applyBrickWarmth,
  applyConcreteNeutral,
  applyFoliageAccent,
  applyShadowAmber,
  applyHorizonRollOff,
  applySkyDepth,
  applyCanopyWarmth,
  applyLeafSeparation,
  applyTrunkDepth,
  applyFieldGlow,
  applyGrassSeparation,
  applySkyBalance,
  applyFogDensity,
  applyHorizonSoftness,
  applyFieldSeparation,
  applyBarkDepth,
  applyMossSeparation,
  applyCanopyShadow,
  applyPetalGlow,
  applyHalation,
  applySkinBloom,
  applyFoliageSoftness,
  applyDappleLight,
  applyNeutralBalance,
  applyMistDensity,
  applyDewLift,
  applyCoolAir,
  applyGrayBalance,
  applyRainSoftness,
  applyCoolMist,
  applyGreenFreshness,
  applyFieldAir,
  applyPastelShift,
  applySkyLift,
  applyCloudSoftness,
  applyBluePurity,
  applyWarmMidtones,
  applyCoolShadows,
  applyPastelCompression,
  applySkinProtectStrength,
  applyMicroContrast,
  applyHighlightSheen,
  applyShadowSoftness,
  applyColorDensity,
  applyBackgroundSeparation,
  applyBWContrast,
  applyBWShadowDensity,
  applyBWHighlightDensity,
  applyBWMidtoneBalance,
  applyBWToeStrength,
  applyBWShoulderStrength,
  applyBWMatteStrength,
  applyCurvyHighlightRolloff,
  applyCurvyFilmicShoulder,
  applyCurvyShadowLift,
  applyCurvyFilmicToe,
  applyCurvyColorSeparation,
  applyCurvyBrightness,
  applyManualExposure,
  applyManualContrast,
  applyManualTemperature,
  applyManualTint,
  applyManualSaturation,
} from "./manualTweakPixelMath";

export type TweakMathMode =
  | "blackAndWhite"
  | "summerFilmic"
  | "summerDeep"
  | "summerNatural"
  | "default";

export function resolveTweakMathMode(
  activeSeason: string | null | undefined,
  activeProfile: string | null | undefined
): TweakMathMode {
  if (activeProfile === "Strong" || activeProfile === "Curvy") {
    return "blackAndWhite";
  }
  if (activeSeason === "summer") {
    if (activeProfile === "Filmic" || activeProfile === "Cinematic") {
      return "summerFilmic";
    }
    if (activeProfile === "Deep") return "summerDeep";
    if (activeProfile === "Natural") {
      return "summerNatural";
    }
  }
  return "default";
}

/** Profile-aware manual tweak pixel math (single dispatch — no shadowed switch cases). */
export function applyManualTweakPixel(
  key: string,
  amount: number,
  r: number,
  g: number,
  b: number,
  mode: TweakMathMode
): number[] {
  switch (key) {
    case "params.blueShadowBoost":
      return applyBlueShadowBoost(r, g, b, amount);
    case "params.highlightNeutralLift":
      return applyHighlightNeutralLift(r, g, b, amount);
    case "params.snowCrispness":
      return applySnowCrispness(r, g, b, amount);
    case "params.graySoftening":
      return applyGraySoftening(r, g, b, amount);
    case "params.blueMelt":
      return applyBlueMelt(r, g, b, amount);
    case "params.snowFlatten":
      return applySnowFlatten(r, g, b, amount);
    case "params.steelBlueShift":
      return applySteelBlueShift(r, g, b, amount);
    case "params.concreteNeutralLift":
      return applyConcreteNeutralLift(r, g, b, amount);
    case "params.urbanShadowControl":
      return applyUrbanShadowControl(r, g, b, amount);
    case "params.coolShadowDepth":
      return applyCoolShadowDepth(r, g, b, amount);
    case "params.greenBlueCast":
      return applyGreenBlueCast(r, g, b, amount);
    case "params.warmHighlightLift":
      return applyWarmHighlightLift(r, g, b, amount);
    case "params.coldBlackDepth":
      return applyColdBlackDepth(r, g, b, amount);
    case "params.icyBluePunch":
      return applyIcyBluePunch(r, g, b, amount);
    case "params.edgeCrispness":
      return applyEdgeCrispness(r, g, b, amount);
    case "params.duskMagentaLift":
      return applyDuskMagentaLift(r, g, b, amount);
    case "params.icyBlueBalance":
      return applyIcyBlueBalance(r, g, b, amount);
    case "params.pastelFade":
      return applyPastelFade(r, g, b, amount);
    case "params.brickWarmth":
      return applyBrickWarmth(r, g, b, amount);
    case "params.concreteNeutral":
      return applyConcreteNeutral(r, g, b, amount);
    case "params.foliageAccent":
      return applyFoliageAccent(r, g, b, amount);
    case "params.shadowAmber":
      return applyShadowAmber(r, g, b, amount);
    case "params.horizonRollOff":
      return applyHorizonRollOff(r, g, b, amount);
    case "params.skyDepth":
      return applySkyDepth(r, g, b, amount);
    case "params.canopyWarmth":
      return applyCanopyWarmth(r, g, b, amount);
    case "params.leafSeparation":
      return applyLeafSeparation(r, g, b, amount);
    case "params.trunkDepth":
      return applyTrunkDepth(r, g, b, amount);
    case "params.fieldGlow":
      return applyFieldGlow(r, g, b, amount);
    case "params.grassSeparation":
      return applyGrassSeparation(r, g, b, amount);
    case "params.skyBalance":
      return applySkyBalance(r, g, b, amount);
    case "params.fogDensity":
      return applyFogDensity(r, g, b, amount);
    case "params.horizonSoftness":
      return applyHorizonSoftness(r, g, b, amount);
    case "params.fieldSeparation":
      return applyFieldSeparation(r, g, b, amount);
    case "params.barkDepth":
      return applyBarkDepth(r, g, b, amount);
    case "params.mossSeparation":
      return applyMossSeparation(r, g, b, amount);
    case "params.canopyShadow":
      return applyCanopyShadow(r, g, b, amount);
    case "params.petalGlow":
      return applyPetalGlow(r, g, b, amount);
    case "params.halation":
      return applyHalation(r, g, b, amount);
    case "params.skinBloom":
      return applySkinBloom(r, g, b, amount);
    case "params.foliageSoftness":
      return applyFoliageSoftness(r, g, b, amount);
    case "params.dappleLight":
      return applyDappleLight(r, g, b, amount);
    case "params.neutralBalance":
      return applyNeutralBalance(r, g, b, amount);
    case "params.mistDensity":
      return applyMistDensity(r, g, b, amount);
    case "params.dewLift":
      return applyDewLift(r, g, b, amount);
    case "params.coolAir":
      return applyCoolAir(r, g, b, amount);
    case "params.grayBalance":
      return applyGrayBalance(r, g, b, amount);
    case "params.rainSoftness":
      return applyRainSoftness(r, g, b, amount);
    case "params.coolMist":
      return applyCoolMist(r, g, b, amount);
    case "params.greenFreshness":
      return applyGreenFreshness(r, g, b, amount);
    case "params.fieldAir":
      return applyFieldAir(r, g, b, amount);
    case "params.pastelShift":
      return applyPastelShift(r, g, b, amount);
    case "params.skyLift":
      return applySkyLift(r, g, b, amount);
    case "params.cloudSoftness":
      return applyCloudSoftness(r, g, b, amount);
    case "params.bluePurity":
      return applyBluePurity(r, g, b, amount);
    case "params.warmMidtones":
      return applyWarmMidtones(r, g, b, amount);
    case "params.pastelCompression":
      return applyPastelCompression(r, g, b, amount);
    case "params.skinProtectStrength":
      return applySkinProtectStrength(r, g, b, amount);
    case "params.highlightSheen":
      return applyHighlightSheen(r, g, b, amount);
    case "params.shadowSoftness":
      return applyShadowSoftness(r, g, b, amount);
    case "params.backgroundSeparation":
      return applyBackgroundSeparation(r, g, b, amount);

    case "params.coolShadows":
      if (mode === "summerFilmic") {
        return applyCoolShadows(r, g, b, amount * 0.6);
      }
      return applyCoolShadows(r, g, b, amount);

    case "params.microContrast":
      return applyMicroContrast(r, g, b, amount);

    case "params.colorDensity":
      return applyColorDensity(r, g, b, amount);

    case "params.exposure":
      return applyManualExposure(r, g, b, amount);

    case "params.contrast":
      if (mode === "blackAndWhite") {
        return applyBWContrast(r, g, b, amount);
      }
      return applyManualContrast(r, g, b, amount);

    case "params.temperature":
      return applyManualTemperature(r, g, b, amount);
    case "params.tint":
      return applyManualTint(r, g, b, amount);
    case "params.saturation":
      return applyManualSaturation(r, g, b, amount);

    case "params.vibrance":
      return applyManualSaturation(r, g, b, amount * 0.5);
    case "params.warmth":
      return applyManualTemperature(r, g, b, amount * 0.5);

    case "params.curveStrength":
      return applyManualContrast(r, g, b, amount * 0.4);

    case "params.highlightRolloff":
      return applyManualContrast(r, g, b, -amount * 0.3);

    case "params.shadowLift":
      if (mode === "summerDeep") {
        return applyManualExposure(r, g, b, amount * 0.4);
      }
      if (mode === "summerNatural" || mode === "summerFilmic") {
        return applyManualExposure(r, g, b, amount * 0.3);
      }
      return applyManualExposure(r, g, b, amount * 0.3);

    case "params.matteStrength":
      if (mode === "blackAndWhite") {
        return applyBWMatteStrength(r, g, b, amount);
      }
      return applyManualContrast(r, g, b, -amount * 0.4);

    case "params.warmHighlights":
      return applyWarmMidtones(r, g, b, amount * 0.6);
    case "params.shadowDepth":
      return applyManualContrast(r, g, b, amount * 0.6);

    case "params.warmBias":
      return applyManualTemperature(r, g, b, amount * 0.5);
    case "params.highlightBloom": {
      const [nr, ng, nb] = applyManualContrast(r, g, b, -amount * 0.4);
      return applyWarmMidtones(nr, ng, nb, amount * 0.2);
    }
    case "params.hueSoftening":
      return applyGraySoftening(r, g, b, amount * 0.4);
    case "params.chromaPreservation":
      return applyColorDensity(r, g, b, amount * 0.4);

    case "params.depthContrast":
      return applyManualContrast(r, g, b, amount * 0.6);
    case "params.hueSeparation":
      return applyGraySoftening(r, g, b, amount * 0.3);
    case "params.chromaDepth":
      return applyColorDensity(r, g, b, amount * 0.5);
    case "params.highlightCompression":
      return applyManualContrast(r, g, b, -amount * 0.4);
    case "params.cleanBlacks":
      return applyColdBlackDepth(r, g, b, amount * 0.5);
    case "params.highlightLift":
      return applyWarmHighlightLift(r, g, b, amount * 0.4);

    case "params.lift":
      return applyManualExposure(r, g, b, amount * 0.5);
    case "params.gamma":
      return applyManualContrast(r, g, b, amount * 0.4);
    case "params.gain":
      return applyWarmHighlightLift(r, g, b, amount * 0.4);
    case "params.solarWarmth":
      return applyWarmMidtones(r, g, b, amount * 0.5);
    case "params.goldenSaturation":
      return applyManualSaturation(r, g, b, amount * 0.5);
    case "params.colorBurn":
      return applyColorDensity(r, g, b, amount * 0.5);

    case "profile.contrast":
      return applyBWContrast(r, g, b, amount);
    case "profile.shadowDensity":
      return applyBWShadowDensity(r, g, b, amount);
    case "profile.highlightDensity":
      return applyBWHighlightDensity(r, g, b, amount);
    case "profile.midtoneBalance":
      return applyBWMidtoneBalance(r, g, b, amount);
    case "params.toeStrength":
      return applyBWToeStrength(r, g, b, amount);
    case "params.shoulderStrength":
      return applyBWShoulderStrength(r, g, b, amount);

    case "curves.filmicToe":
    case "jitter.filmicToe":
      return applyCurvyFilmicToe(r, g, b, amount);
    case "curves.filmicShoulder":
    case "jitter.filmicShoulder":
      return applyCurvyFilmicShoulder(r, g, b, amount);
    case "curves.highlightRolloff":
    case "jitter.highlightRolloff":
      return applyCurvyHighlightRolloff(r, g, b, amount);
    case "curves.shadowLift":
    case "jitter.shadowLift":
      return applyCurvyShadowLift(r, g, b, amount);
    case "curves.colorSeparation":
    case "jitter.colorSeparation":
      return applyCurvyColorSeparation(r, g, b, amount);
    case "base.brightness":
      return applyCurvyBrightness(r, g, b, amount);

    default:
      return [r, g, b];
  }
}