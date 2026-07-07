import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import SettingsUI from "./SettingsUI";
import {
  getPostDramaFactor,
  type PostDramaValue,
} from "./drama-sliders/post-drama/post-drama";

// Worker
import AdjustmentWorker from "./adjustments/adjustmentWorker?worker";
import type { TweakMathMode } from "./adjustments/manualTweakDispatch";
import type { BWCurveTransform } from "./black-and-white/black-and-white-engine";

import UserManualModal from "./user-manual/user-manual";

type ThemeName =
  | "cinematicDark"
  | "warmGlow"
  | "slateGrey"
  | "desertSand"
  | "forestGreen";

interface CenterUIProps {
  t: any;
  theme: any;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;

  imageSrc: string | null;
  imageRef: React.RefObject<HTMLImageElement | null>;
  originalImageRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  activeProfile: string | null;

  variationsMode: boolean;
  /** 0–100 while Explore 9 generates; hover previews enabled only at 100. */
  variationProgress: number;
  variations: {
    id: number;
    src: string;
    debug: any;
    locked: boolean;
  }[];
  selectedVariationIndex: number | null;
  hoveredVariationIndex: number | null;
  onHoverVariation: (index: number | null) => void;
  onSelectVariation: (index: number) => void;
  onToggleVariationLock: (index: number) => void;
  onExitVariationsMode: () => void;
  /** Incremented when a new image is loaded; clears graded preview cache only then. */
  previewResetToken: number;
  /** Incremented on full workspace reset; clears split view and rotation UI. */
  workspaceResetToken: number;
  onRestoreWorkspaceToLoaded: () => void;

  postDrama: PostDramaValue;

  // Basic
  exposure: number;
  contrast: number;

  // Tone
  shadows: number;
  highlights: number;
  whites: number;
  blacks: number;

  // Color
  temperature: number;
  tint: number;
  vibrance: number;

  // Presence
  clarity: number;
  texture: number;
  dehaze: number;

  // Common Curves
  parametricCurve: number;
  rgbComposite: number;
  rgbR: number;
  rgbG: number;
  rgbB: number;

  // Creative Curves (NEW)
  filmicToe: number;
  filmicShoulder: number;
  highlightRolloff: number;
  shadowLift: number;
  colorSeparation: number;

  // ⭐ NEW — Manual Tweaks (threaded from App)
  manualTweaks: Record<string, number>;
  tweakMathMode?: TweakMathMode;
  recipeCurves?: BWCurveTransform[] | undefined;
  bwRecipe?: any;

  /** Clockwise rotation (0, 90, 180, 270) for preview canvas + export. */
  imageRotation: number;
  onRotateImage90: () => void;
}

const MAX_PREVIEW_DIMENSION = 1600;

/** Preview-scale bitmap with rotation baked in (for split-view ORIGINAL panel). */
function buildRotatedPreviewDataUrl(
  img: HTMLImageElement,
  rotation: number
): string {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  if (!srcW || !srcH) return "";

  const scale =
    Math.min(MAX_PREVIEW_DIMENSION / srcW, MAX_PREVIEW_DIMENSION / srcH, 1) || 1;
  const targetW = Math.round(srcW * scale);
  const targetH = Math.round(srcH * scale);

  const rot = (((rotation % 360) + 360) % 360) as number;
  const snapped = rot === 90 || rot === 180 || rot === 270 ? rot : 0;
  const swap = snapped === 90 || snapped === 270;
  const cw = swap ? targetH : targetW;
  const ch = swap ? targetW : targetH;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = cw;
  canvas.height = ch;
  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((snapped * Math.PI) / 180);
  ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.8);
}

export default function CenterUI({
  t,
  theme,
  settingsOpen,
  setSettingsOpen,
  imageSrc,
  imageRef,
  originalImageRef,
  canvasRef,
  handleDrop,
  handleImageUpload,
  themeName,
  setThemeName,
  activeProfile,
  variationsMode,
  variationProgress,
  variations,
  selectedVariationIndex,
  hoveredVariationIndex,
  onHoverVariation,
  onSelectVariation,
  onToggleVariationLock,
  onExitVariationsMode,
  previewResetToken,
  workspaceResetToken,
  onRestoreWorkspaceToLoaded,
  postDrama,
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
  // Common Curves
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
  // ⭐ NEW
  manualTweaks,
  tweakMathMode = "default",
  recipeCurves,
  bwRecipe,
  imageRotation,
  onRotateImage90,
}: CenterUIProps) {
  /* ---------------------------------------------------------
     SPLIT VIEW
  --------------------------------------------------------- */
  const [splitView, setSplitView] = useState(false);
  const [rotationMode, setRotationMode] = useState(false);
  const [resetAllConfirmOpen, setResetAllConfirmOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  useEffect(() => {
    if (variationsMode) setSplitView(false);
  }, [variationsMode]);

  useEffect(() => {
    if (variationsMode || splitView) setRotationMode(false);
  }, [variationsMode, splitView]);

  useEffect(() => {
    if (!imageSrc) setRotationMode(false);
  }, [imageSrc]);

  const hoverPreviewsEnabled =
    variationsMode && variationProgress >= 100;

  useEffect(() => {
    if (variationsMode && variationProgress < 100) {
      onHoverVariation(null);
    }
  }, [variationsMode, variationProgress, onHoverVariation]);

  const enlargedPreviewImgRef = useRef<HTMLImageElement | null>(null);

  const handleVariationsPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!hoverPreviewsEnabled) return;

      const hit = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (hit?.closest("[data-variation-bottom-lock]")) return;

      const cell = hit?.closest("[data-variation-cell]");
      if (!cell) return;

      const idx = Number(cell.getAttribute("data-variation-index"));
      if (Number.isNaN(idx) || idx === hoveredVariationIndex) return;

      onHoverVariation(idx);
    },
    [hoverPreviewsEnabled, hoveredVariationIndex, onHoverVariation]
  );

  const handleVariationsDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hoverPreviewsEnabled || hoveredVariationIndex == null) return;

      const img = enlargedPreviewImgRef.current;
      if (!img) return;

      const r = img.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        return;
      }

      onToggleVariationLock(hoveredVariationIndex);
    },
    [
      hoverPreviewsEnabled,
      hoveredVariationIndex,
      onToggleVariationLock,
    ]
  );

  /* ---------------------------------------------------------
     POST-DRAMA FACTOR
  --------------------------------------------------------- */
  const postDramaFactor = useMemo(
    () => getPostDramaFactor(postDrama),
    [postDrama]
  );

  const baseFilter = `contrast(${postDramaFactor}) saturate(${
    0.9 + postDramaFactor * 0.15
  })`;

  const hasActiveAdjustments = useMemo(() => {
    const sliders = [
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
    ];
    if (sliders.some((value) => value !== 0)) return true;
    if (postDrama !== 0) return true;
    return Object.values(manualTweaks).some((value) => value !== 0);
  }, [
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
    postDrama,
    manualTweaks,
  ]);

  /* ---------------------------------------------------------
     WORKER INSTANCE
  --------------------------------------------------------- */
  const workerRef = useRef<any>(null);
  const workerTimeout = useRef<any>(null);
  const jobIdRef = useRef<number>(0);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  /** True original (from originalImageRef), preview-scaled + rotated — split view left only. */
  const [originalRotatedPreviewSrc, setOriginalRotatedPreviewSrc] = useState<
    string | null
  >(null);
  const baseImageDataRef = useRef<ImageData | null>(null);
  /** Tracks which imageSrc the cached canvas base corresponds to. */
  const syncedBaseImageSrcRef = useRef<string | null>(null);
  const baseImageLoadIdRef = useRef(0);
  const [baseImageSyncToken, setBaseImageSyncToken] = useState(0);
  const preTweakCacheRef = useRef<ImageData | null>(null);
  const adjustmentCacheKeyRef = useRef<string>("");

  const skipBwRecipeReapply =
    activeProfile === "Strong" || activeProfile === "Curvy";

  const adjustmentCacheKey = useMemo(
    () =>
      JSON.stringify({
        imageSrc,
        baseImageSyncToken,
        skipBwRecipeReapply,
        tweakMathMode,
        bwRecipeLabel: bwRecipe?.label ?? null,
        bwRecipePass: bwRecipe?.pass ?? null,
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
        activeProfile,
        curveCount: recipeCurves?.length ?? 0,
      }),
    [
      imageSrc,
      baseImageSyncToken,
      skipBwRecipeReapply,
      tweakMathMode,
      bwRecipe,
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
      activeProfile,
      recipeCurves,
    ]
  );

  useEffect(() => {
    setProcessedSrc(null);
  }, [previewResetToken]);

  useEffect(() => {
    setSplitView(false);
    setRotationMode(false);
  }, [workspaceResetToken]);

  useEffect(() => {
    workerRef.current = new (AdjustmentWorker as any)();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  /* ---------------------------------------------------------
     DRAW ORIGINAL IMAGE TO CANVAS + CACHE BASE IMAGEDATA
  --------------------------------------------------------- */
  /* Split-view ORIGINAL: always from originalImageRef, never from graded imageSrc. */
  useEffect(() => {
    if (!imageSrc) {
      setOriginalRotatedPreviewSrc(null);
      return;
    }

    const original = originalImageRef.current;
    if (!original?.src) return;

    const apply = (img: HTMLImageElement) => {
      const dataUrl = buildRotatedPreviewDataUrl(img, imageRotation);
      if (dataUrl) setOriginalRotatedPreviewSrc(dataUrl);
    };

    if (original.complete && (original.naturalWidth || original.width)) {
      apply(original);
      return;
    }

    const img = new Image();
    img.onload = () => apply(img);
    img.src = original.src;
  }, [imageSrc, imageRotation, originalImageRef]);

  useEffect(() => {
    if (!imageSrc) {
      baseImageDataRef.current = null;
      syncedBaseImageSrcRef.current = null;
      setProcessedSrc(null);
      return;
    }
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const srcForThisLoad = imageSrc;
    const loadId = ++baseImageLoadIdRef.current;
    const img = new Image();
    img.onload = () => {
      if (loadId !== baseImageLoadIdRef.current) return;

      const { width: srcW, height: srcH } = img;
      const scale =
        Math.min(
          MAX_PREVIEW_DIMENSION / srcW,
          MAX_PREVIEW_DIMENSION / srcH,
          1
        ) || 1;

      const targetW = Math.round(srcW * scale);
      const targetH = Math.round(srcH * scale);

      const rot = (((imageRotation % 360) + 360) % 360) as number;
      const snapped =
        rot === 90 || rot === 180 || rot === 270 ? rot : 0;
      const swap = snapped === 90 || snapped === 270;
      const cw = swap ? targetH : targetW;
      const ch = swap ? targetW : targetH;

      canvas.width = cw;
      canvas.height = ch;

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate((snapped * Math.PI) / 180);
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      ctx.restore();

      baseImageDataRef.current = ctx.getImageData(0, 0, cw, ch);
      syncedBaseImageSrcRef.current = srcForThisLoad;
      setBaseImageSyncToken((t) => t + 1);
    };
    img.src = srcForThisLoad;
  }, [imageSrc, canvasRef, imageRotation]);

  /* ---------------------------------------------------------
     APPLY ADJUSTMENTS (WORKER + DEBOUNCE + LATEST-WINS)
  --------------------------------------------------------- */
  useEffect(() => {
    if (!imageSrc) return;
    if (syncedBaseImageSrcRef.current !== imageSrc) return;
    if (!canvasRef.current) return;
    if (!imageRef.current) return;
    if (!workerRef.current) return;
    if (!baseImageDataRef.current) return;

    if (workerTimeout.current) clearTimeout(workerTimeout.current);

    workerTimeout.current = setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (adjustmentCacheKeyRef.current !== adjustmentCacheKey) {
        preTweakCacheRef.current = null;
      }

      const tweaksOnly =
        preTweakCacheRef.current !== null &&
        adjustmentCacheKeyRef.current === adjustmentCacheKey;

      const sourceBase = tweaksOnly
        ? preTweakCacheRef.current!
        : baseImageDataRef.current;
      if (!sourceBase) return;

      canvas.width = sourceBase.width;
      canvas.height = sourceBase.height;

      const imageData = new ImageData(
        new Uint8ClampedArray(sourceBase.data),
        sourceBase.width,
        sourceBase.height
      );

      jobIdRef.current += 1;
      const currentJobId = jobIdRef.current;

      workerRef.current.onmessage = (e: MessageEvent) => {
        const payload = e.data;
        const processed: ImageData = payload?.output ?? payload;
        if (currentJobId !== jobIdRef.current) return;

        if (payload?.preTweakCache) {
          preTweakCacheRef.current = new ImageData(
            new Uint8ClampedArray(payload.preTweakCache.data),
            payload.preTweakCache.width,
            payload.preTweakCache.height
          );
          adjustmentCacheKeyRef.current = adjustmentCacheKey;
        }

        ctx.putImageData(processed, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        if (imageRef.current) {
          imageRef.current.src = dataUrl;
        }
        setProcessedSrc(dataUrl);
      };

      workerRef.current.postMessage(
        {
          jobId: currentJobId,
          imageData,
          manualTweaksOnly: tweaksOnly,
          skipBwRecipeReapply,
          tweakMathMode,
          requestPreTweakCache: !tweaksOnly,
          bwRecipe:
            activeProfile === "Strong" || activeProfile === "Curvy"
              ? bwRecipe
              : undefined,
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
          manualTweaks,
          curves: recipeCurves,
        },
        [imageData.data.buffer]
      );
    }, 24);
  }, [
    adjustmentCacheKey,
    manualTweaks,
    skipBwRecipeReapply,
    tweakMathMode,
    recipeCurves,
    bwRecipe,
    activeProfile,
    splitView,
    imageRotation,
    canvasRef,
    imageRef,
  ]);

  /* ---------------------------------------------------------
     FRAME CLICK
  --------------------------------------------------------- */
  const handleFrameClick = () => {
    if (!variationsMode) {
      document.getElementById("fileInput")?.click();
    }
  };

  const rotateToolbarDisabled =
    !imageSrc || variationsMode || splitView;

  /* ---------------------------------------------------------
     VARIATIONS GRID
  --------------------------------------------------------- */
  const renderVariationsGrid = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          width: "100%",
          height: "100%",
          gap: "6px",
          padding: "6px",
        }}
      >
        {variations.map((v, index) => {
          const isSelected = selectedVariationIndex === index;
          const isHovered = hoveredVariationIndex === index;

          return (
            <div
              key={v.id}
              data-variation-cell
              data-variation-index={index}
              style={{
                position: "relative",
                borderRadius: "6px",
                overflow: "hidden",
                border: isSelected
                  ? `2px solid ${theme.accent}`
                  : `1px solid ${theme.border}`,
                cursor: "pointer",
                transform: isHovered ? "scale(1.03)" : "scale(1.0)",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={() => {
                if (!hoverPreviewsEnabled) return;
                onHoverVariation(index);
              }}
              onClick={() => onSelectVariation(index)}
            >
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: "4px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  color: theme.textPrimary,
                  fontSize: "0.7rem",
                  letterSpacing: "0.06em",
                  zIndex: 5,
                }}
              >
                Grade {index + 1}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  backgroundColor: v.locked
                    ? theme.accent
                    : "rgba(0,0,0,0.55)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.65rem",
                  color: v.locked ? "#000" : theme.textPrimary,
                  cursor: "pointer",
                  zIndex: 5,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVariationLock(index);
                }}
              >
                {v.locked ? "🔒" : "🔓"}
              </div>

              {v.src ? (
                <img
                  src={v.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    filter: baseFilter,
                    transition: "filter 0.16s ease-out",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: theme.textMuted,
                    fontSize: "0.8rem",
                  }}
                >
                  No Preview
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* ---------------------------------------------------------
     BOTTOM LOCK ROW (outside 9-grid, in Center UI panel)
  --------------------------------------------------------- */
  const renderVariationsLockRow = () => (
    <div
      style={{
        position: "absolute",
        bottom: "14px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        zIndex: 15,
        pointerEvents: "auto",
      }}
    >
      {variations.map((v, index) => (
        <button
          key={v.id}
          type="button"
          data-variation-bottom-lock
          title={
            v.locked
              ? `Unlock Grade ${index + 1}`
              : `Lock Grade ${index + 1}`
          }
          aria-label={
            v.locked
              ? `Unlock Grade ${index + 1}`
              : `Lock Grade ${index + 1}`
          }
          onClick={(e) => {
            e.stopPropagation();
            onToggleVariationLock(index);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "4px 2px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.textPrimary,
          }}
        >
          <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>
            {v.locked ? "🔒" : "🔓"}
          </span>
          <span
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.04em",
              color: theme.textMuted,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Grade {index + 1}
          </span>
        </button>
      ))}
    </div>
  );

  /* ---------------------------------------------------------
     HOVER OVERLAY
  --------------------------------------------------------- */
  const renderHoverOverlay = () => {
    if (
      !hoverPreviewsEnabled ||
      hoveredVariationIndex == null ||
      !variations[hoveredVariationIndex]
    )
      return null;

    const v = variations[hoveredVariationIndex];
    if (!v.src) return null;

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.65)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 30,
          pointerEvents: "none",
          animation: "fadeIn 0.12s ease",
        }}
      >
        <img
          ref={enlargedPreviewImgRef}
          src={v.src}
          alt=""
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "10px",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.8), 0 18px 40px rgba(0,0,0,0.85)",
            pointerEvents: "none",
            filter: baseFilter,
            transition: "filter 0.16s ease-out",
          }}
        />
      </div>
    );
  };

  /* ---------------------------------------------------------
     MAIN RENDER
  --------------------------------------------------------- */
  return (
    <div style={t.preview}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* SETTINGS MODE */}
      {settingsOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 20,
          }}
        >
          <SettingsUI
            theme={theme}
            themeName={themeName}
            setThemeName={setThemeName}
            onClose={() => setSettingsOpen(false)}
          />
        </div>
      )}

      {/* USER MANUAL MODAL */}
      {manualOpen && (
        <UserManualModal
          theme={theme}
          onClose={() => setManualOpen(false)}
        />
      )}

      {/* WORKSPACE MODE */}
      {!settingsOpen && (
        <>
          <style>
            {`
              @keyframes dssRotateToolSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          {/* ROTATE TOOL (single-image mode only) */}
          <div
            title="Rotate image (single view only)."
            style={{
              position: "absolute",
              top: "12px",
              right: "96px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.55)",
              border: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: rotateToolbarDisabled ? "not-allowed" : "pointer",
              zIndex: 10,
              opacity: rotateToolbarDisabled ? 0.45 : 1,
              pointerEvents: rotateToolbarDisabled ? "none" : "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (rotateToolbarDisabled) return;
              setRotationMode((v) => !v);
            }}
          >
            <span
              style={{
                display: "flex",
                width: "18px",
                height: "18px",
                alignItems: "center",
                justifyContent: "center",
                animation: rotationMode
                  ? "dssRotateToolSpin 1.1s linear infinite"
                  : "none",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.88)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 3v6h-6" />
              </svg>
            </span>
          </div>

{/* HELP / USER MANUAL ICON */}
<div
  style={{
    position: "absolute",
    top: "12px",
    right: "54px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.55)",
    border: `1px solid ${theme.border}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 10,
    fontSize: "22px",
    fontWeight: 600,
    color: theme.textPrimary,
    lineHeight: 1,
  }}
  onClick={(e) => {
    e.stopPropagation();
    setManualOpen(true);
  }}
  title="Open User Manual"
>
  ?
</div>

          {/* SETTINGS ICON */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.55)",
              border: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSettingsOpen(true);
            }}
          >
            <img
              src="https://img.icons8.com/ios-glyphs/30/ffffff/settings.png"
              style={{ width: "18px", height: "18px", opacity: 0.85 }}
            />
          </div>

          {/* SPLIT VIEW / EXIT 9-GRID + ADJUSTMENTS INDICATOR */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 10,
            }}
          >
            {imageSrc &&
              (variationsMode ? (
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExitVariationsMode();
                  }}
                >
                  Exit 9-Grid
                </div>
              ) : (
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSplitView((v) => !v);
                  }}
                >
                  {splitView ? "Single View" : "Split View"}
                </div>
              ))}

            {imageSrc && (
            <div
              title={
                hasActiveAdjustments
                  ? "Adjustments are active"
                  : "No adjustments applied"
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 10px",
                borderRadius: "6px",
                backgroundColor: "rgba(0,0,0,0.55)",
                border: `1px solid ${hasActiveAdjustments ? theme.accent : theme.border}`,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  backgroundColor: hasActiveAdjustments
                    ? theme.accent
                    : "rgba(255,255,255,0.22)",
                  boxShadow: hasActiveAdjustments
                    ? `0 0 8px ${theme.accent}`
                    : "none",
                  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                }}
              />
              <span
                style={{
                  fontSize: "0.72rem",
                  color: hasActiveAdjustments
                    ? theme.textPrimary
                    : theme.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                {hasActiveAdjustments ? "Adjustments Active" : "Adjustments"}
              </span>
            </div>
            )}

            {imageSrc && !variationsMode && (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setResetAllConfirmOpen(true);
                }}
              >
                Reset All
              </div>
            )}
          </div>

          {resetAllConfirmOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-all-title"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
              onClick={() => setResetAllConfirmOpen(false)}
            >
              <div
                style={{
                  width: "min(320px, calc(100% - 2rem))",
                  padding: "1rem 1.1rem",
                  borderRadius: "8px",
                  backgroundColor: theme.panelBackground,
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  id="reset-all-title"
                  style={{
                    color: theme.textPrimary,
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Reset all changes?
                </div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: "1rem",
                    fontSize: "0.88rem",
                    color: theme.textMuted,
                    lineHeight: 1.4,
                  }}
                >
                  This restores the image to how it looked right after loading
                  and clears all adjustments, grades, curves, and other
                  modifications.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    style={t.button}
                    onClick={() => setResetAllConfirmOpen(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    style={t.buttonAccent}
                    onClick={() => {
                      setResetAllConfirmOpen(false);
                      onRestoreWorkspaceToLoaded();
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* IMAGE FRAME */}
          <div
            style={{
              ...t.previewInnerFrame,
              cursor:
                rotationMode && !variationsMode && !splitView && imageSrc
                  ? "grab"
                  : undefined,
            }}
            onClick={() => {
              if (
                rotationMode &&
                !variationsMode &&
                !splitView &&
                imageSrc
              ) {
                onRotateImage90();
                return;
              }
              handleFrameClick();
            }}
            onContextMenu={(e) => {
              if (rotationMode) {
                e.preventDefault();
                setRotationMode(false);
              }
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onMouseLeave={(e) => {
              if (!variationsMode || !hoverPreviewsEnabled) return;
              const next = e.relatedTarget as Node | null;
              if (next && e.currentTarget.contains(next)) return;
              onHoverVariation(null);
            }}
            onPointerEnter={
              variationsMode && hoverPreviewsEnabled
                ? handleVariationsPointerMove
                : undefined
            }
            onPointerMove={
              variationsMode && hoverPreviewsEnabled
                ? handleVariationsPointerMove
                : undefined
            }
            onDoubleClick={
              variationsMode ? handleVariationsDoubleClick : undefined
            }
          >
            {/* VARIATIONS GRID */}
            {variationsMode && renderVariationsGrid()}

            {/* NORMAL MODE */}
{!variationsMode &&
  (imageSrc ? (
    splitView ? (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {/* LEFT: ORIGINAL */}
        <div style={{ width: "50%", height: "100%", position: "relative" }}>
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              color: theme.textMuted,
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              zIndex: 10,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            ORIGINAL
          </div>

          <img
            src={originalRotatedPreviewSrc ?? ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRight: `1px solid ${theme.border}`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* RIGHT: GRADED */}
        <div style={{ width: "50%", height: "100%", position: "relative" }}>
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "50%",
              transform: "translateX(-50%)",
              color: theme.textMuted,
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              zIndex: 10,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            GRADED
          </div>

          <img
            ref={imageRef}
            src={processedSrc || imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              filter: baseFilter,
              transition: "filter 0.16s ease-out",
            }}
          />
        </div>
      </div>
    ) : (
      <img
        ref={imageRef}
        src={processedSrc || imageSrc}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: "6px",
          pointerEvents: "none",
          filter: baseFilter,
          transition: "filter 0.16s ease-out",
        }}
      />
    )
  ) : (
    <div style={t.previewPlaceholder}>
      <span style={t.placeholderText}>
        Click or Drop an Image Here
      </span>
    </div>
  ))}

{renderHoverOverlay()}
          </div>

          {variationsMode && renderVariationsLockRow()}

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </>
      )}
    </div>
  );
}