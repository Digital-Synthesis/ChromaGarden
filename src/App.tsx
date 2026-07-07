// React + Hooks
import type React from "react";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// UI Panels
import LeftUI from "./LeftUI";
import CenterUI from "./CenterUI";
import RightUI from "./RightUI";

// Seasonal engines
import { applySummerGrade } from "./seasonal-color-logic/summer-color-logic/summer-color-grade";
import { applySummerFilmicGrade } from "./seasonal-color-logic/summer-color-logic/summer-filmic";
import { applySummerPastelGrade } from "./seasonal-color-logic/summer-color-logic/summer-pastel";
import { applySummerSunsetGrade } from "./seasonal-color-logic/summer-color-logic/summer-sunset";
import { applySummerDeepGrade } from "./seasonal-color-logic/summer-color-logic/summer-deep";
import { applySummerCinematicGrade } from "./seasonal-color-logic/summer-color-logic/summer-cinematic";
import { applySummerHybridEngine } from "./seasonal-color-logic/summer-color-logic/summer-engine";

import { applySpringFreshBloomGrade } from "./seasonal-color-logic/spring-color-logic/fresh-bloom";
import { applySpringMorningDewGrade } from "./seasonal-color-logic/spring-color-logic/morning-dew";
import { applySpringFieldGrade } from "./seasonal-color-logic/spring-color-logic/spring-field";
import { applySpringSkyGrade } from "./seasonal-color-logic/spring-color-logic/spring-sky";
import { applySpringGardenLightGrade } from "./seasonal-color-logic/spring-color-logic/garden-light";
import { applySpringRainyDayGrade } from "./seasonal-color-logic/spring-color-logic/rainy-day";
import { applySpringHybridEngine } from "./seasonal-color-logic/spring-color-logic/spring-engine";

import { applyWinterColdDaylightGrade } from "./seasonal-color-logic/winter-color-logic/cold-daylight";
import { applyWinterOvercastSnowGrade } from "./seasonal-color-logic/winter-color-logic/overcast-snow";
import { applyWinterForestShadeGrade } from "./seasonal-color-logic/winter-color-logic/forest-shade";
import { applyWinterCityGrade } from "./seasonal-color-logic/winter-color-logic/winter-city";
import { applyWinterArcticDuskGrade } from "./seasonal-color-logic/winter-color-logic/arctic-dusk";
import { applyWinterDeepFreezeGrade } from "./seasonal-color-logic/winter-color-logic/deep-freeze";
import { applyWinterHybridEngine } from "./seasonal-color-logic/winter-color-logic/winter-engine";

import { applyAutumnGoldenCanopyGrade } from "./seasonal-color-logic/autumn-color-logic/golden-canopy";
import { applyAutumnMistyMorningGrade } from "./seasonal-color-logic/autumn-color-logic/misty-morning";
import { applyAutumnHarvestFieldGrade } from "./seasonal-color-logic/autumn-color-logic/harvest-field";
import { applyAutumnWoodlandGrade } from "./seasonal-color-logic/autumn-color-logic/woodland";
import { applyAutumnCityGrade } from "./seasonal-color-logic/autumn-color-logic/autumn-city";
import { applyAutumnDuskGrade } from "./seasonal-color-logic/autumn-color-logic/dusk";
import { applyAutumnHybridEngine } from "./seasonal-color-logic/autumn-color-logic/autumn-engine";

// Portrait
import { applyHumanEssenceGrade } from "./portrait/human-essence/human-essence";
import { applyHumanEssenceEngine } from "./portrait/human-essence/human-essence-engine";

// Image analysis + B&W
import {
  analyzeOriginalImageFromElement,
  type OriginalImageAnalysis,
} from "./shared/original-analysis";

import { applyInfiniteBWGrade } from "./black-and-white/black-and-white-logic";
import { applyCurvyBWGrade } from "./black-and-white/curvy";
import type { BWCurveTransform } from "./black-and-white/black-and-white-engine";

// Post-Drama
import {
  type PostDramaValue,
  applyPostDramaToRecipe,
  applyPostDramaToVariations,
} from "./drama-sliders/post-drama/post-drama";

// Theme
import { ThemeName, themes, getStyles } from "./theme/theme";

import { SeasonKey } from "./shared/season-types";

// Native Tauri Save dialog
import { save } from "@tauri-apps/plugin-dialog";

// Export engine
import { runFullResExportWithPayload } from "./export/export-engine";

import type { AdjustmentState } from "./export/export-payload";
import MyLooksSaveModal from "./my-looks/MyLooksSaveModal";
import { loadLooks, saveLook, deleteLook, renameMyLook } from "./my-looks/myLooksStorage";
import type { MyLook, MyLookMode } from "./my-looks/myLooksTypes";
import {
  addNumericDeltaAtPath,
  getNumericAtPath,
  getTweakableKeysFromDebug,
  pruneManualTweaks,
} from "./manual-tweaks/tweakableKeys";
import { resolveTweakMathMode } from "./adjustments/manualTweakDispatch";

// Headers
import LicenseModal from "./components/header/licence";
import AboutModal from "./components/header/about";
import VersionModal from "./components/header/version";
import UpdateModal from "./components/header/UpdateModal";

type ProfileDrawerOpenTarget =
  | { type: "season"; season: SeasonKey }
  | { type: "blackAndWhite" }
  | { type: "portrait" };


const profiles: Record<SeasonKey, string[]> = {
  summer: ["Natural", "Filmic", "Pastel", "Sunset", "Deep", "Cinematic"],
  spring: [
    "Fresh Bloom",
    "Morning Dew",
    "Spring Field",
    "Spring Sky",
    "Garden Light",
    "Rainy Day",
  ],
  autumn: [
    "Golden Canopy",
    "Misty Morning",
    "Harvest Field",
    "Woodland",
    "Autumn City",
    "Dusk",
  ],
  winter: [
    "Cold Daylight",
    "Overcast Snow",
    "Forest Shade",
    "Winter City",
    "Arctic Dusk",
    "Deep Freeze",
  ],
  portrait: ["Human Essence"],
};

type Variation = {
  id: number;
  src: string;
  debug: any;
  locked: boolean;
};

function createPreview(img: HTMLImageElement, maxSize = 1600): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return img.src;

  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function createThumbnail(source: HTMLCanvasElement | HTMLImageElement): string {
  const maxSize = 240;
  const width =
    source instanceof HTMLCanvasElement
      ? source.width
      : source.naturalWidth || source.width;
  const height =
    source instanceof HTMLCanvasElement
      ? source.height
      : source.naturalHeight || source.height;

  if (!width || !height) return "";

  const scale = Math.min(maxSize / width, maxSize / height, 1);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function stripImageData(value: any): any {
  if (typeof value === "string") {
    return value.startsWith("data:image") ? undefined : value;
  }

  if (Array.isArray(value)) {
    return value.map(stripImageData).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const cleaned: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      const loweredKey = key.toLowerCase();
      if (
        loweredKey === "src" ||
        loweredKey === "imagesrc" ||
        loweredKey === "dataurl" ||
        loweredKey === "thumbnail"
      ) {
        return;
      }

      const cleanedValue = stripImageData(item);
      if (cleanedValue !== undefined) cleaned[key] = cleanedValue;
    });

    return cleaned;
  }

  return value;
}

/* ---------------------------------------------------------
APP COMPONENT
--------------------------------------------------------- */
export default function App() {
  // Exposure
  const [exposure, setExposure] = useState(0);
  // Contrast
  const [contrast, setContrast] = useState(0);

  // Tone sliders
  const [shadows, setShadows] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [whites, setWhites] = useState(0);
  const [blacks, setBlacks] = useState(0);

  // Temperature + Tint
  const [temperature, setTemperature] = useState(0);
  const [tint, setTint] = useState(0);

  // Vibrance
  const [vibrance, setVibrance] = useState(0);

  // Presence sliders
  const [clarity, setClarity] = useState(0);
  const [texture, setTexture] = useState(0);
  const [dehaze, setDehaze] = useState(0);

  // Curves (common)
  const [parametricCurve, setParametricCurve] = useState(0);
  const [rgbComposite, setRgbComposite] = useState(0);
  const [rgbR, setRgbR] = useState(0);
  const [rgbG, setRgbG] = useState(0);
  const [rgbB, setRgbB] = useState(0);

  // Creative Curves
  const [filmicToe, setFilmicToe] = useState(0);
  const [filmicShoulder, setFilmicShoulder] = useState(0);
  const [highlightRolloff, setHighlightRolloff] = useState(0);
  const [shadowLift, setShadowLift] = useState(0);
  const [colorSeparation, setColorSeparation] = useState(0);

  // Header modals
  const [showLicense, setShowLicense] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  // Main image state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  /** Clockwise rotation of preview + export (0, 90, 180, 270). Resets on new image. */
  const [imageRotation, setImageRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** Recipe snapshot captured when Save Look modal opens — avoids stale/null reads at confirm. */
  const saveLookRecipeRef = useRef<any>(null);

  // UI panel state
  const [leftTab, setLeftTab] = useState<"profiles" | "adjustments">("profiles");
  const [rightTab, setRightTab] = useState<"data" | "export">("data");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Theme system
  const [themeName, setThemeName] = useState<ThemeName>("cinematicDark");
  const theme = themes[themeName];
  const t = getStyles(theme);

  // Active season + profile
  const [activeSeason, setActiveSeason] = useState<SeasonKey>("summer");
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  // Original image analysis
  const [originalImageProfile, setOriginalImageProfile] =
    useState<OriginalImageAnalysis | null>(null);

  // Debug data for each season
  const [summerDebugData, setSummerDebugData] = useState<any>(null);
  const [springDebugData, setSpringDebugData] = useState<any>(null);
  const [autumnDebugData, setAutumnDebugData] = useState<any>(null);
  const [winterDebugData, setWinterDebugData] = useState<any>(null);

  // Portrait debug
  const [portraitDebugData, setPortraitDebugData] = useState<any>(null);
  const [bwDebugData, setBwDebugData] = useState<any>(null);

  // Variations grid state
  const [variationsMode, setVariationsMode] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<
    number | null
  >(null);
  const [hoveredVariationIndex, setHoveredVariationIndex] = useState<
    number | null
  >(null);
  const [variationProgress, setVariationProgress] = useState<number>(0);
  /** Bumped only when a new image is loaded — clears graded preview cache in CenterUI. */
  const [previewResetToken, setPreviewResetToken] = useState(0);
  const [workspaceResetToken, setWorkspaceResetToken] = useState(0);

  // Post-drama slider
  const [postDrama, setPostDrama] = useState<PostDramaValue>(0);

  // Pre-Drama jitter amplifier. Slider value is stored as multiplier offset;
  // generation receives the multiplier only when a new look is created.
  const [preDramaValue, setPreDramaValue] = useState<number>(0);
  const preDramaMultiplier = 1 + preDramaValue;

  // Manual Tweaks state
  const [manualTweaks, setManualTweaks] = useState<Record<string, number>>({});

  // My Looks Library state
  const [myLooks, setMyLooks] = useState<MyLook[]>([]);
  const [selectedMyLookName, setSelectedMyLookName] = useState<string | null>(
    null
  );
  /** Set when Apply Look runs — gates Explore 9 while a saved look is active. */
  const [appliedMyLookName, setAppliedMyLookName] = useState<string | null>(
    null
  );
  const [saveLookModalOpen, setSaveLookModalOpen] = useState(false);
  const [renameLookModalOpen, setRenameLookModalOpen] = useState(false);
  const [renameLookSourceName, setRenameLookSourceName] = useState<string | null>(
    null
  );

  /** Clears drawer selection only — does not re-enable Explore 9. */
  const clearMyLookSelection = () => {
    setSelectedMyLookName(null);
  };

  /** Full workspace reset — clears applied My Look and re-enables Explore 9. */
  const clearMyLookWorkspaceState = () => {
    setSelectedMyLookName(null);
    setAppliedMyLookName(null);
  };

  const [profileChangedSinceLastRecipe, setProfileChangedSinceLastRecipe] =
    useState(false);
  const [activeRecipeDebug, setActiveRecipeDebug] = useState<any | null>(null);
  const [profileDrawerOpenTarget, setProfileDrawerOpenTarget] =
    useState<ProfileDrawerOpenTarget | null>(null);

  const handleProfileDrawerOpenHandled = useCallback(() => {
    setProfileDrawerOpenTarget(null);
  }, []);

  const handleResetManualTweaks = () => {
    setManualTweaks({});
  };

  const applyAdjustmentState = (adjustments: Record<string, number>) => {
    setExposure(adjustments.exposure ?? 0);
    setContrast(adjustments.contrast ?? 0);
    setShadows(adjustments.shadows ?? 0);
    setHighlights(adjustments.highlights ?? 0);
    setWhites(adjustments.whites ?? 0);
    setBlacks(adjustments.blacks ?? 0);
    setTemperature(adjustments.temperature ?? 0);
    setTint(adjustments.tint ?? 0);
    setVibrance(adjustments.vibrance ?? 0);
    setClarity(adjustments.clarity ?? 0);
    setTexture(adjustments.texture ?? 0);
    setDehaze(adjustments.dehaze ?? 0);
    setParametricCurve(adjustments.parametricCurve ?? 0);
    setRgbComposite(adjustments.rgbComposite ?? 0);
    setRgbR(adjustments.rgbR ?? 0);
    setRgbG(adjustments.rgbG ?? 0);
    setRgbB(adjustments.rgbB ?? 0);
    setFilmicToe(adjustments.filmicToe ?? 0);
    setFilmicShoulder(adjustments.filmicShoulder ?? 0);
    setHighlightRolloff(adjustments.highlightRolloff ?? 0);
    setShadowLift(adjustments.shadowLift ?? 0);
    setColorSeparation(adjustments.colorSeparation ?? 0);
  };

  const handleResetAllAdjustments = () => {
    applyAdjustmentState({});
  };

  /** Clears grading state hydrated by My Looks so a new image starts clean. */
  const resetWorkspaceGradingState = () => {
    applyAdjustmentState({});
    setManualTweaks({});
    setPostDrama(0);
    setPreDramaValue(0);
  };

  /* ---------------------------------------------------------
  NEW: Native Tauri Save dialog handler
  --------------------------------------------------------- */
  const handleNativeExport = async () => {
    if (!originalImageRef.current) {
      console.warn("No image loaded to export");
      return;
    }

    const filePath = await save({
      filters: [
        { name: "PNG Image", extensions: ["png"] },
        { name: "JPEG Image", extensions: ["jpg"] },
      ],
      defaultPath: "exported-image.png",
    });

    if (filePath) {
      const normalizedPath = filePath.toLowerCase();
      const mimeType = normalizedPath.endsWith(".jpg") || normalizedPath.endsWith(".jpeg")
        ? "image/jpeg"
        : "image/png";
      const isBWProfile =
        activeProfile === "Strong" || activeProfile === "Curvy";
      const hasEngineRecipe = Boolean(getRawBaseDebug());
      const useGradedPreviewBase = hasEngineRecipe && Boolean(imageSrc);

      // Let the debounced preview worker finish so export grading state is current.
      await new Promise((resolve) => setTimeout(resolve, 32));

      await runFullResExportWithPayload({
        fullPath: filePath,
        mimeType,
        quality: 0.9,
        originalImage: originalImageRef.current,
        adjustments: buildAdjustmentState(),
        manualTweaks,
        postDrama,
        bwRecipe: isBWProfile ? bwDebugData : undefined,
        curves: recipeCurvesForWorker,
        useGradedPreviewAsBase: useGradedPreviewBase,
        gradedPreviewBaseSrc: imageSrc,
        skipBwRecipeReapply: isBWProfile && useGradedPreviewBase,
        tweakMathMode: resolveTweakMathMode(activeSeason, activeProfile),
        imageRotation,
      });
    }
  };

  /* ---------------------------------------------------------
  PREVENT DEFAULT BROWSER DRAG BEHAVIOR
  --------------------------------------------------------- */
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  useEffect(() => {
    loadLooks()
      .then(setMyLooks)
      .catch((error) => {
        console.warn("Failed to load My Looks Library", error);
      });
  }, []);

  /* ---------------------------------------------------------
  IMAGE LOADING HELPERS
  --------------------------------------------------------- */
  const resetAllDebug = () => {
    setSummerDebugData(null);
    setSpringDebugData(null);
    setAutumnDebugData(null);
    setWinterDebugData(null);
    setPortraitDebugData(null);
    setBwDebugData(null);
    setActiveRecipeDebug(null);
    setProfileChangedSinceLastRecipe(false);
  };

  const getRawBaseDebug = () => {
    if (variationsMode && selectedVariationIndex != null) {
      const v = variations[selectedVariationIndex];
      if (v?.debug) return v.debug;
    }
    if (activeProfile === "Strong" || activeProfile === "Curvy") {
      return bwDebugData;
    }
    if (activeSeason === "summer") return summerDebugData;
    if (activeSeason === "spring") return springDebugData;
    if (activeSeason === "autumn") return autumnDebugData;
    if (activeSeason === "winter") return winterDebugData;
    if (activeSeason === "portrait") return portraitDebugData;
    return null;
  };

  const persistActiveRecipe = (debug: any) => {
    if (!debug) return;
    setActiveRecipeDebug(debug);
    setProfileChangedSinceLastRecipe(false);
    const validKeys = getTweakableKeysFromDebug(debug, activeProfile);
    setManualTweaks((prev) => pruneManualTweaks(prev, validKeys));
  };

  const resetVariationsState = () => {
    setVariationsMode(false);
    setVariations([]);
    setSelectedVariationIndex(null);
    setHoveredVariationIndex(null);
    setVariationProgress(0);
  };

  const handleExitVariationsMode = () => {
    resetVariationsState();
  };

  /** Restores in-memory workspace to the state right after the current image loaded. */
  const applyLoadedImageWorkspaceReset = () => {
    const img = originalImageRef.current;
    if (!img) return;
    resetWorkspaceGradingState();
    resetAllDebug();
    resetVariationsState();
    clearMyLookWorkspaceState();
    setPreviewResetToken((t) => t + 1);
    setImageSrc(createPreview(img));
    setImageRotation(0);
  };

  const handleRestoreWorkspaceToLoaded = () => {
    applyLoadedImageWorkspaceReset();
    setWorkspaceResetToken((t) => t + 1);
  };

  const loadImage = (result: string | ArrayBuffer | null) => {
    if (!result) return;
    const src = result as string;
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      applyLoadedImageWorkspaceReset();
      const profile = analyzeOriginalImageFromElement(img);
      setOriginalImageProfile(profile);
    };
    img.src = src;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------------------------------------------------
  SEASON + PROFILE HANDLERS
  --------------------------------------------------------- */
  const handleSeasonSelect = (season: SeasonKey) => {
    setActiveSeason(season);
    setActiveProfile(null);
    clearMyLookSelection();
    resetAllDebug();
    resetVariationsState();
  };

  const handleProfileSelect = (profile: string) => {
    const raw = getRawBaseDebug();
    if (raw) {
      setActiveRecipeDebug(raw);
      setProfileChangedSinceLastRecipe(true);
    }
    clearMyLookSelection();
    setActiveProfile(profile);
  };

  /* ---------------------------------------------------------
  RANDOMIZE ROUTING (SINGLE RESULT)
  --------------------------------------------------------- */
  const handleRandomize = () => {
    if (!activeProfile) return;
    if (!originalImageRef.current) return;

    resetVariationsState();

    // BLACK & WHITE ROUTING
    if (activeProfile === "Strong") {
      const bwDebug = applyInfiniteBWGrade(
        originalImageRef,
        setImageSrc,
        preDramaMultiplier
      );
      setBwDebugData(bwDebug);
      persistActiveRecipe(bwDebug);
      return;
    }

    if (activeProfile === "Curvy") {
      const bwDebug = applyCurvyBWGrade(
        originalImageRef,
        setImageSrc,
        preDramaMultiplier
      );
      setBwDebugData(bwDebug);
      persistActiveRecipe(bwDebug);
      return;
    }

    // PORTRAIT ROUTING
    if (activeSeason === "portrait") {
      if (activeProfile === "Human Essence") {
        const debug = applyHumanEssenceGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setPortraitDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
    }

    // SUMMER ROUTING
    let debug: any = null;
    if (activeSeason === "summer") {
      if (activeProfile === "Filmic") {
        debug = applySummerFilmicGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setSummerDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
      if (activeProfile === "Pastel") {
        debug = applySummerPastelGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setSummerDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
      if (activeProfile === "Sunset") {
        debug = applySummerSunsetGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setSummerDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
      if (activeProfile === "Deep") {
        debug = applySummerDeepGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setSummerDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
      if (activeProfile === "Cinematic") {
        debug = applySummerCinematicGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
        setSummerDebugData(debug);
        persistActiveRecipe(debug);
        return;
      }
      debug = applySummerGrade(originalImageRef, setImageSrc, preDramaMultiplier);
      setSummerDebugData(debug);
      persistActiveRecipe(debug);
      return;
    }

    // WINTER ROUTING
    if (activeSeason === "winter") {
      if (activeProfile === "Cold Daylight") {
        debug = applyWinterColdDaylightGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Overcast Snow") {
        debug = applyWinterOvercastSnowGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Forest Shade") {
        debug = applyWinterForestShadeGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Winter City") {
        debug = applyWinterCityGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Arctic Dusk") {
        debug = applyWinterArcticDuskGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Deep Freeze") {
        debug = applyWinterDeepFreezeGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else {
        debug = {
          season: "winter",
          profile: activeProfile,
          note: "fallback",
        };
      }
      setWinterDebugData(debug);
      persistActiveRecipe(debug);
      return;
    }

    // AUTUMN ROUTING
    if (activeSeason === "autumn") {
      if (activeProfile === "Golden Canopy") {
        debug = applyAutumnGoldenCanopyGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Misty Morning") {
        debug = applyAutumnMistyMorningGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Harvest Field") {
        debug = applyAutumnHarvestFieldGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Woodland") {
        debug = applyAutumnWoodlandGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Autumn City") {
        debug = applyAutumnCityGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Dusk") {
        debug = applyAutumnDuskGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else {
        debug = {
          season: "autumn",
          profile: activeProfile,
          note: "fallback",
        };
      }
      setAutumnDebugData(debug);
      persistActiveRecipe(debug);
      return;
    }

    // SPRING ROUTING
    if (activeSeason === "spring") {
      if (activeProfile === "Fresh Bloom") {
        debug = applySpringFreshBloomGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Morning Dew") {
        debug = applySpringMorningDewGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Spring Field") {
        debug = applySpringFieldGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Spring Sky") {
        debug = applySpringSkyGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Garden Light") {
        debug = applySpringGardenLightGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else if (activeProfile === "Rainy Day") {
        debug = applySpringRainyDayGrade(
          originalImageRef,
          setImageSrc,
          preDramaMultiplier
        );
      } else {
        debug = {
          season: "spring",
          profile: activeProfile,
          note: "fallback",
        };
      }
      setSpringDebugData(debug);
      persistActiveRecipe(debug);
      return;
    }
  };

  /* ---------------------------------------------------------
  VARIATIONS GRID GENERATION
  --------------------------------------------------------- */
  const handleGenerateVariations = async () => {
    if (!activeProfile) return;
    if (!originalImageRef.current) return;
    if (appliedMyLookName) return;

    const COUNT = 9;
    setVariationsMode(true);
    setHoveredVariationIndex(null);
    setVariationProgress(0);

    setVariations((prev) => {
      if (prev.length === COUNT) return prev;
      return Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        src: "",
        debug: null,
        locked: false,
      }));
    });

    let firstVariationDebug: any = null;

    for (let index = 0; index < COUNT; index++) {
      await new Promise((resolve) => setTimeout(resolve, 0));

      setVariations((prev) => {
        const base =
          prev.length === COUNT
            ? prev
            : Array.from({ length: COUNT }, (_, i) => ({
              id: i,
              src: "",
              debug: null,
              locked: false,
            }));

        const current = base[index];

        if (current.locked && current.src) {
          const updated = [...base];
          updated[index] = current;
          return updated;
        }

        let capturedSrc: string | null = null;
        const captureSetter = (src: string | null) => {
          if (src) capturedSrc = src;
        };

        let debug: any = null;

        // VARIATIONS — BLACK & WHITE
        if (activeProfile === "Strong") {
          debug = applyInfiniteBWGrade(originalImageRef, (src) => {
            if (src) capturedSrc = src;
          }, preDramaMultiplier);
        } else if (activeProfile === "Curvy") {
          debug = applyCurvyBWGrade(originalImageRef, (src) => {
            if (src) capturedSrc = src;
          }, preDramaMultiplier);
        }

        // VARIATIONS — PORTRAIT
        else if (activeSeason === "portrait") {
          if (activeProfile === "Human Essence") {
            debug = applyHumanEssenceGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else {
            debug = {
              season: "portrait",
              profile: activeProfile,
              note: `variation ${index + 1}`,
            };
          }
        }

        // VARIATIONS — SUMMER
        else if (activeSeason === "summer") {
          if (activeProfile === "Filmic") {
            debug = applySummerFilmicGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Pastel") {
            debug = applySummerPastelGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Sunset") {
            debug = applySummerSunsetGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Deep") {
            debug = applySummerDeepGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Cinematic") {
            debug = applySummerCinematicGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else {
            debug = applySummerGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          }
        }

        // VARIATIONS — WINTER
        else if (activeSeason === "winter") {
          if (activeProfile === "Cold Daylight") {
            debug = applyWinterColdDaylightGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Overcast Snow") {
            debug = applyWinterOvercastSnowGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Forest Shade") {
            debug = applyWinterForestShadeGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Winter City") {
            debug = applyWinterCityGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Arctic Dusk") {
            debug = applyWinterArcticDuskGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Deep Freeze") {
            debug = applyWinterDeepFreezeGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else {
            debug = {
              season: "winter",
              profile: activeProfile,
              note: `variation ${index + 1}`,
            };
          }
        }

        // VARIATIONS — AUTUMN
        else if (activeSeason === "autumn") {
          if (activeProfile === "Golden Canopy") {
            debug = applyAutumnGoldenCanopyGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Misty Morning") {
            debug = applyAutumnMistyMorningGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Harvest Field") {
            debug = applyAutumnHarvestFieldGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Woodland") {
            debug = applyAutumnWoodlandGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Autumn City") {
            debug = applyAutumnCityGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Dusk") {
            debug = applyAutumnDuskGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else {
            debug = {
              season: "autumn",
              profile: activeProfile,
              note: `variation ${index + 1}`,
            };
          }
        }

        // VARIATIONS — SPRING
        else if (activeSeason === "spring") {
          if (activeProfile === "Fresh Bloom") {
            debug = applySpringFreshBloomGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Morning Dew") {
            debug = applySpringMorningDewGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Spring Field") {
            debug = applySpringFieldGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Spring Sky") {
            debug = applySpringSkyGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Garden Light") {
            debug = applySpringGardenLightGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else if (activeProfile === "Rainy Day") {
            debug = applySpringRainyDayGrade(
              originalImageRef,
              captureSetter,
              preDramaMultiplier
            );
          } else {
            debug = {
              season: "spring",
              profile: activeProfile,
              note: `variation ${index + 1}`,
            };
          }
        }

        const updated = [...base];
        updated[index] = {
          id: index,
          src: capturedSrc || current.src || "",
          debug,
          locked: current.locked,
        };
        if (index === 0 && debug) firstVariationDebug = debug;
        return updated;
      });

      const progress = Math.round(((index + 1) / COUNT) * 100);
      setVariationProgress(progress);
    }

    setSelectedVariationIndex(0);
    if (firstVariationDebug) persistActiveRecipe(firstVariationDebug);
  };

  /* ---------------------------------------------------------
  VARIATION INTERACTIONS
  --------------------------------------------------------- */
  const handleToggleVariationLock = (index: number) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, locked: !v.locked } : v))
    );
  };

  const handleHoverVariation = (index: number | null) => {
    setHoveredVariationIndex(index);
  };

  const handleSelectVariation = (index: number) => {
    setSelectedVariationIndex(index);
  };

  const handlePromoteSelectedVariation = () => {
    if (selectedVariationIndex == null) return;
    const v = variations[selectedVariationIndex];
    if (!v || !v.src) return;

    setImageSrc(v.src);

    if (activeProfile === "Strong" || activeProfile === "Curvy") {
      setBwDebugData(v.debug);
    } else if (activeSeason === "portrait") {
      setPortraitDebugData(v.debug);
    } else {
      if (activeSeason === "summer") setSummerDebugData(v.debug);
      if (activeSeason === "spring") setSpringDebugData(v.debug);
      if (activeSeason === "autumn") setAutumnDebugData(v.debug);
      if (activeSeason === "winter") setWinterDebugData(v.debug);
    }

    persistActiveRecipe(v.debug);
    resetVariationsState();
  };

  /* ---------------------------------------------------------
  ACTIVE DEBUG DATA (WITH POST-DRAMA + MANUAL TWEAKS) — memoized
  --------------------------------------------------------- */
  const activeSeasonDebugData = useMemo(() => {
    let baseDebug: any = null;

    if (variationsMode && selectedVariationIndex != null) {
      const v = variations[selectedVariationIndex];
      if (v) baseDebug = v.debug;
    } else if (profileChangedSinceLastRecipe && activeRecipeDebug) {
      baseDebug = activeRecipeDebug;
    } else if (activeProfile === "Strong" || activeProfile === "Curvy") {
      baseDebug = bwDebugData;
    } else {
      if (activeSeason === "summer") baseDebug = summerDebugData;
      if (activeSeason === "spring") baseDebug = springDebugData;
      if (activeSeason === "autumn") baseDebug = autumnDebugData;
      if (activeSeason === "winter") baseDebug = winterDebugData;
      if (activeSeason === "portrait") baseDebug = portraitDebugData;
    }

    if (!baseDebug && activeRecipeDebug) baseDebug = activeRecipeDebug;
    if (!baseDebug) return baseDebug;

    const postDramaResult = applyPostDramaToRecipe(baseDebug, postDrama);
    const merged = structuredClone(postDramaResult);

    Object.keys(manualTweaks).forEach((key) => {
      const tweakValue = manualTweaks[key];
      if (tweakValue === undefined || tweakValue === 0) return;
      if (getNumericAtPath(postDramaResult, key) === null) return;
      addNumericDeltaAtPath(merged, key, tweakValue);
    });

    return merged;
  }, [
    variationsMode,
    selectedVariationIndex,
    variations,
    profileChangedSinceLastRecipe,
    activeRecipeDebug,
    activeProfile,
    bwDebugData,
    activeSeason,
    summerDebugData,
    springDebugData,
    autumnDebugData,
    winterDebugData,
    portraitDebugData,
    postDrama,
    manualTweaks,
  ]);

  const tweakMathMode = useMemo(
    () => resolveTweakMathMode(activeSeason, activeProfile),
    [activeSeason, activeProfile]
  );

  /* ---------------------------------------------------------
  POST-DRAMA VARIATIONS
  --------------------------------------------------------- */
  const postDramaVariations = applyPostDramaToVariations(
    variations.map((v) => ({
      id: v.id,
      src: v.src,
      debug: v.debug,
      locked: v.locked,
    })),
    postDrama
  );

  /* ---------------------------------------------------------
  BUILD ADJUSTMENT STATE FOR EXPORT
  --------------------------------------------------------- */
  const buildAdjustmentState = (): AdjustmentState => ({
    exposure,
    contrast,
    shadows,
    highlights,
    whites,
    blacks,
    temperature,
    tint,
    vibrance,
    clarity,
    texture,
    dehaze,
    parametricCurve,
    rgbComposite,
    rgbR,
    rgbG,
    rgbB,
    filmicToe,
    filmicShoulder,
    highlightRolloff,
    shadowLift,
    colorSeparation,
  });

  const getMyLookMode = (): MyLookMode => {
    if (activeProfile === "Strong" || activeProfile === "Curvy") {
      return "blackAndWhite";
    }
    if (activeSeason === "portrait") return "portrait";
    return "seasonal";
  };

  const getJitterDeltas = (recipe: any): Record<string, number> | undefined => {
    if (recipe?.jitter && typeof recipe.jitter === "object") {
      return recipe.jitter as Record<string, number>;
    }
    return undefined;
  };

  const refreshMyLooks = useCallback(async () => {
    const looks = await loadLooks();
    setMyLooks(looks);
  }, []);

  const getRecipeForSave = () => {
    const raw = getRawBaseDebug() ?? activeRecipeDebug;
    if (!raw) return null;
    const recipe = stripImageData(raw);
    if (!recipe || typeof recipe !== "object") return null;
    if (Array.isArray(recipe)) return recipe.length > 0 ? recipe : null;
    return Object.keys(recipe).length > 0 ? recipe : null;
  };

  const handleOpenSaveLookModal = () => {
    if (!activeProfile) return;
    const recipeForSave = getRecipeForSave();
    if (!recipeForSave) return;
    saveLookRecipeRef.current = getRawBaseDebug() ?? activeRecipeDebug;
    setSaveLookModalOpen(true);
  };

  const handleConfirmSaveLook = async (name: string) => {
    const rawRecipe =
      saveLookRecipeRef.current ?? getRawBaseDebug() ?? activeRecipeDebug;
    saveLookRecipeRef.current = null;

    const recipe = stripImageData(rawRecipe);
    if (!activeProfile || !recipe) {
      throw new Error("No active recipe to save.");
    }

    // Let the debounced preview worker finish so thumbnail matches the graded preview.
    await new Promise((resolve) => setTimeout(resolve, 32));

    const thumbnail =
      (canvasRef.current && createThumbnail(canvasRef.current)) ||
      (originalImageRef.current && createThumbnail(originalImageRef.current)) ||
      "";

    const jitterDeltas = getJitterDeltas(recipe);
    const myLook: MyLook = {
      name,
      season: activeSeason,
      profile: activeProfile,
      recipe,
      adjustments: buildAdjustmentState(),
      manualTweaks: { ...manualTweaks },
      postDrama,
      preDrama: preDramaMultiplier,
      thumbnail,
      createdAt: new Date().toISOString(),
      mode: getMyLookMode(),
    };

    if (jitterDeltas) {
      myLook.jitterDeltas = jitterDeltas;
    }

    const savedLook = await saveLook(myLook);
    await refreshMyLooks();
    setSelectedMyLookName(savedLook.name);
    setSaveLookModalOpen(false);
  };

  const handleSelectMyLook = (look: MyLook) => {
    setSelectedMyLookName(look.name);
  };

  const handleRequestRenameMyLook = () => {
    if (!selectedMyLookName) return;
    setRenameLookSourceName(selectedMyLookName);
    setRenameLookModalOpen(true);
  };

  const handleConfirmRenameMyLook = async (newName: string) => {
    if (!renameLookSourceName) return;
    const saved = await renameMyLook(renameLookSourceName, newName);
    await refreshMyLooks();
    if (selectedMyLookName === renameLookSourceName) {
      setSelectedMyLookName(saved.name);
    }
    if (appliedMyLookName === renameLookSourceName) {
      setAppliedMyLookName(saved.name);
    }
    setRenameLookModalOpen(false);
    setRenameLookSourceName(null);
  };

  const handleDeleteMyLook = async (name: string) => {
    await deleteLook(name);
    await refreshMyLooks();
    if (selectedMyLookName === name) {
      setSelectedMyLookName(null);
    }
    if (appliedMyLookName === name) {
      setAppliedMyLookName(null);
    }
  };

  const handleApplyMyLook = () => {
    const look = myLooks.find((item) => item.name === selectedMyLookName);
    if (!look) return;

    setAppliedMyLookName(look.name);

    if (look.mode === "blackAndWhite") {
      setProfileDrawerOpenTarget({ type: "blackAndWhite" });
    } else if (look.mode === "portrait") {
      setProfileDrawerOpenTarget({ type: "portrait" });
    } else {
      setProfileDrawerOpenTarget({
        type: "season",
        season: look.season as SeasonKey,
      });
    }

    resetVariationsState();
    resetAllDebug();
    applyAdjustmentState(look.adjustments || {});
    setManualTweaks({ ...(look.manualTweaks || {}) });
    setPostDrama((look.postDrama ?? 0) as PostDramaValue);
    setPreDramaValue(Math.max(0, (look.preDrama ?? 1) - 1));

    if (
      look.mode !== "blackAndWhite" &&
      ["summer", "spring", "autumn", "winter", "portrait"].includes(
        look.season
      )
    ) {
      setActiveSeason(look.season as SeasonKey);
    }

    setActiveProfile(look.profile);

    if (look.mode === "blackAndWhite") {
      setBwDebugData(look.recipe);
      persistActiveRecipe(look.recipe);
      return;
    }

    if (look.mode === "portrait") {
      setPortraitDebugData(look.recipe);
      applyHumanEssenceEngine(originalImageRef, setImageSrc, look.recipe);
      persistActiveRecipe(look.recipe);
    } else {
      if (look.season === "summer") {
        setSummerDebugData(look.recipe);
        applySummerHybridEngine(originalImageRef, setImageSrc, look.recipe);
      }
      if (look.season === "spring") {
        setSpringDebugData(look.recipe);
        applySpringHybridEngine(originalImageRef, setImageSrc, look.recipe);
      }
      if (look.season === "autumn") {
        setAutumnDebugData(look.recipe);
        applyAutumnHybridEngine(originalImageRef, setImageSrc, look.recipe);
      }
      if (look.season === "winter") {
        setWinterDebugData(look.recipe);
        applyWinterHybridEngine(originalImageRef, setImageSrc, look.recipe);
      }
      persistActiveRecipe(look.recipe);
    }
  };

  const recipeCurvesForWorker = useMemo((): BWCurveTransform[] | undefined => {
    if (activeProfile !== "Curvy") return undefined;
    if (variationsMode && selectedVariationIndex != null) {
      const v = variations[selectedVariationIndex];
      const c = v?.debug?.curves;
      if (Array.isArray(c) && c.length > 0) return c;
    }
    const c = bwDebugData?.curves;
    if (Array.isArray(c) && c.length > 0) return c;
    return undefined;
  }, [
    activeProfile,
    variationsMode,
    selectedVariationIndex,
    variations,
    bwDebugData,
  ]);

  /* ---------------------------------------------------------
  RENDER
  --------------------------------------------------------- */
  return (
    <div
      style={{
        ...t.app,
        margin: 0,
        padding: 0,
        border: "1px solid rgba(255,255,255,0.15)",   // change back to 1px when done testing
        boxSizing: "border-box",
        outline: "none",
        boxShadow: "none",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Ultra-minimal reset */}
      <style>{`
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
      }

      input,
      textarea,
      [contenteditable="true"] {
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
      }
    `}</style>

      <header style={t.header} data-tauri-drag-region>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <style>
            {`
            @keyframes chromaPulse {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 200% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
          </style>

          <span
            style={{
              fontWeight: 700,
              display: "inline-block",
              backgroundImage: "linear-gradient(90deg, #d8b46a, #4cc9b0, #d8b46a)",
              backgroundSize: "200% 200%",
              backgroundRepeat: "repeat",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
              animation: "chromaPulse 10s ease-in-out infinite",
              willChange: "background-position",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            Chroma
          </span>

          <span
            style={{
              fontWeight: 300,
              color: "#e6e6e6",
              letterSpacing: "0.4px",
            }}
          >
            Garden
          </span>
        </div>

        {/* --- Centered Top‑Bar Menu --- */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            fontSize: "14px",
            color: "#e6e6e6",
            letterSpacing: "0.3px",
            userSelect: "none",
          }}
        >
          {/* ABOUT */}
          <span style={{ cursor: "pointer" }} onClick={() => setShowAbout(true)}>
            About
          </span>
          <span>|</span>

          {/* LICENSE */}
          <span style={{ cursor: "pointer" }} onClick={() => setShowLicense(true)}>
            Use License
          </span>
          <span>|</span>

          {/* VERSION INFO */}
          <span style={{ cursor: "pointer" }} onClick={() => setShowVersion(true)}>
            Version Info
          </span>
          <span>|</span>

          {/* CHECK FOR UPDATES */}
          <span style={{ cursor: "pointer" }} onClick={() => setShowUpdate(true)}>
            Check for Updates
          </span>
        </div>
      </header>

      {/* ---------------------------------------------------------
       LICENSE MODAL (conditionally rendered)
       --------------------------------------------------------- */}
      {showLicense && (
        <LicenseModal
          theme={theme}
          onClose={() => setShowLicense(false)}
        />
      )}

      {/* ---------------------------------------------------------
       ABOUT MODAL (conditionally rendered)
       --------------------------------------------------------- */}
      {showAbout && (
        <AboutModal
          theme={theme}
          onClose={() => setShowAbout(false)}
        />
      )}

      {/* ---------------------------------------------------------
       VERSION MODAL (conditionally rendered)
       --------------------------------------------------------- */}

      {showVersion && (
        <VersionModal
          theme={theme}
          onClose={() => setShowVersion(false)}
        />
      )}

      {/* ---------------------------------------------------------
       UPDATE MODAL (conditionally rendered)
       --------------------------------------------------------- */}
      {showUpdate && (
        <UpdateModal
          theme={theme}
          onClose={() => setShowUpdate(false)}
        />
      )}

      <div style={t.layout}>
        {/* LEFT PANEL */}
        <LeftUI
          t={{
            ...t,
            exposureValue: exposure,
            onExposureChange: setExposure,
            contrastValue: contrast,
            onContrastChange: setContrast,
            shadowsValue: shadows,
            onShadowsChange: setShadows,
            highlightsValue: highlights,
            onHighlightsChange: setHighlights,
            whitesValue: whites,
            onWhitesChange: setWhites,
            blacksValue: blacks,
            onBlacksChange: setBlacks,
            temperatureValue: temperature,
            onTemperatureChange: setTemperature,
            tintValue: tint,
            onTintChange: setTint,
            vibranceValue: vibrance,
            onVibranceChange: setVibrance,
            clarityValue: clarity,
            onClarityChange: setClarity,
            textureValue: texture,
            onTextureChange: setTexture,
            dehazeValue: dehaze,
            onDehazeChange: setDehaze,
            parametricCurveValue: parametricCurve,
            onParametricCurveChange: setParametricCurve,
            rgbCompositeValue: rgbComposite,
            onRgbCompositeChange: setRgbComposite,
            rgbRValue: rgbR,
            onRgbRChange: setRgbR,
            rgbGValue: rgbG,
            onRgbGChange: setRgbG,
            rgbBValue: rgbB,
            onRgbBChange: setRgbB,
            filmicToeValue: filmicToe,
            onFilmicToeChange: setFilmicToe,
            filmicShoulderValue: filmicShoulder,
            onFilmicShoulderChange: setFilmicShoulder,
            highlightRolloffValue: highlightRolloff,
            onHighlightRolloffChange: setHighlightRolloff,
            shadowLiftValue: shadowLift,
            onShadowLiftChange: setShadowLift,
            colorSeparationValue: colorSeparation,
            onColorSeparationChange: setColorSeparation,
          }}
          theme={theme}
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          profiles={profiles}
          activeSeason={activeSeason}
          activeProfile={activeProfile}
          onSeasonSelect={handleSeasonSelect}
          onProfileSelect={handleProfileSelect}
          onRandomize={handleRandomize}
          onGenerateVariations={handleGenerateVariations}
          variationsMode={variationsMode}
          variationProgress={variationProgress}
          preDramaValue={preDramaValue}
          onPreDramaChange={setPreDramaValue}
          myLooks={myLooks}
          selectedMyLookName={selectedMyLookName}
          appliedMyLookName={appliedMyLookName}
          onSelectMyLook={handleSelectMyLook}
          onApplyMyLook={handleApplyMyLook}
          onRefreshLooks={refreshMyLooks}
          onResetAllAdjustments={handleResetAllAdjustments}
          onRequestRenameMyLook={handleRequestRenameMyLook}
          onDeleteMyLook={handleDeleteMyLook}
          profileDrawerOpenTarget={profileDrawerOpenTarget}
          onProfileDrawerOpenHandled={handleProfileDrawerOpenHandled}
        />

        {/* CENTER PANEL */}
        <CenterUI
          t={t}
          theme={theme}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          imageSrc={imageSrc}
          imageRef={imageRef}
          originalImageRef={originalImageRef}
          canvasRef={canvasRef}
          handleDrop={handleDrop}
          handleImageUpload={handleImageUpload}
          themeName={themeName}
          setThemeName={setThemeName}
          activeProfile={activeProfile}
          variationsMode={variationsMode}
          variationProgress={variationProgress}
          variations={postDramaVariations}
          selectedVariationIndex={selectedVariationIndex}
          hoveredVariationIndex={hoveredVariationIndex}
          onHoverVariation={handleHoverVariation}
          onSelectVariation={handleSelectVariation}
          onToggleVariationLock={handleToggleVariationLock}
          onExitVariationsMode={handleExitVariationsMode}
          previewResetToken={previewResetToken}
          workspaceResetToken={workspaceResetToken}
          onRestoreWorkspaceToLoaded={handleRestoreWorkspaceToLoaded}
          postDrama={postDrama}
          exposure={exposure}
          contrast={contrast}
          shadows={shadows}
          highlights={highlights}
          whites={whites}
          blacks={blacks}
          temperature={temperature}
          tint={tint}
          vibrance={vibrance}
          clarity={clarity}
          texture={texture}
          dehaze={dehaze}
          parametricCurve={parametricCurve}
          rgbComposite={rgbComposite}
          rgbR={rgbR}
          rgbG={rgbG}
          rgbB={rgbB}
          filmicToe={filmicToe}
          filmicShoulder={filmicShoulder}
          highlightRolloff={highlightRolloff}
          shadowLift={shadowLift}
          colorSeparation={colorSeparation}
          tweakMathMode={tweakMathMode}
          manualTweaks={manualTweaks}
          recipeCurves={recipeCurvesForWorker}
          bwRecipe={bwDebugData}
          imageRotation={imageRotation}
          onRotateImage90={() =>
            setImageRotation((r) => (((r + 90) % 360) + 360) % 360)
          }
        />

        {/* RIGHT PANEL */}
        <RightUI
          t={t}
          theme={theme}
          rightTab={rightTab}
          setRightTab={setRightTab}
          activeProfile={activeProfile}
          originalImageProfile={originalImageProfile}
          debugData={activeSeasonDebugData}
          activeRecipeDebug={activeRecipeDebug}
          variationsMode={variationsMode}
          variations={postDramaVariations}
          selectedVariationIndex={selectedVariationIndex}
          onSelectVariationIndex={setSelectedVariationIndex}
          onPromoteSelectedVariation={handlePromoteSelectedVariation}
          postDrama={postDrama}
          setPostDrama={setPostDrama}
          onExport={handleNativeExport}
          onSaveLook={handleOpenSaveLookModal}
          manualTweaks={manualTweaks}
          setManualTweaks={setManualTweaks}
          onResetManualTweaks={handleResetManualTweaks}
          profileChangedSinceLastRecipe={profileChangedSinceLastRecipe}
        />
      </div>

      <MyLooksSaveModal
        open={saveLookModalOpen}
        mode="save"
        t={t}
        theme={theme}
        existingNames={myLooks.map((look) => look.name)}
        onCancel={() => {
          saveLookRecipeRef.current = null;
          setSaveLookModalOpen(false);
        }}
        onSave={handleConfirmSaveLook}
      />

      <MyLooksSaveModal
        open={renameLookModalOpen}
        mode="rename"
        initialName={renameLookSourceName}
        t={t}
        theme={theme}
        existingNames={myLooks.map((look) => look.name)}
        onCancel={() => {
          setRenameLookModalOpen(false);
          setRenameLookSourceName(null);
        }}
        onSave={handleConfirmRenameMyLook}
      />
    </div>
  );
}