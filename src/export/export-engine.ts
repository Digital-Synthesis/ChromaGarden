import { writeFile } from "@tauri-apps/plugin-fs";
import AdjustmentWorker from "../adjustments/adjustmentWorker?worker";
import { getPostDramaFactor } from "../drama-sliders/post-drama/post-drama";
import { ExportPayload } from "./export-payload";

/** Must match CenterUI MAX_PREVIEW_DIMENSION — preview worker runs at this scale. */
const PREVIEW_MAX_DIMENSION = 1600;

function normalizeExportRotation(degrees: number | undefined): number {
  const r = Math.round((((degrees ?? 0) % 360) + 360) % 360);
  if (r === 90 || r === 180 || r === 270) return r;
  return 0;
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load graded preview for export."));
    img.src = src;
  });
}

function hasActiveExportGrading(payload: ExportPayload): boolean {
  const { adjustments, manualTweaks, bwRecipe, skipBwRecipeReapply } = payload;

  const sliders = [
    adjustments.exposure,
    adjustments.contrast,
    adjustments.shadows,
    adjustments.highlights,
    adjustments.whites,
    adjustments.blacks,
    adjustments.temperature,
    adjustments.tint,
    adjustments.vibrance,
    adjustments.clarity,
    adjustments.texture,
    adjustments.dehaze,
    adjustments.parametricCurve,
    adjustments.rgbComposite,
    adjustments.rgbR,
    adjustments.rgbG,
    adjustments.rgbB,
    adjustments.filmicToe,
    adjustments.filmicShoulder,
    adjustments.highlightRolloff,
    adjustments.shadowLift,
    adjustments.colorSeparation,
  ];

  if (sliders.some((value) => value !== 0)) return true;
  if (Object.values(manualTweaks).some((value) => value !== 0)) return true;
  if (bwRecipe && !skipBwRecipeReapply) return true;
  return false;
}

/**
 * Build preview-scale ImageData using the same scale + rotation logic as CenterUI.
 * Export must grade at this resolution so clarity/texture/micro-contrast match preview.
 */
async function buildPreviewScaleImageData(
  payload: ExportPayload,
  originalImage: HTMLImageElement
): Promise<ImageData> {
  const rot = normalizeExportRotation(payload.imageRotation);

  const sourceImg =
    payload.useGradedPreviewAsBase && payload.gradedPreviewBaseSrc
      ? await loadImageElement(payload.gradedPreviewBaseSrc)
      : originalImage;

  const srcW = sourceImg.naturalWidth || sourceImg.width;
  const srcH = sourceImg.naturalHeight || sourceImg.height;

  const scale =
    Math.min(
      PREVIEW_MAX_DIMENSION / srcW,
      PREVIEW_MAX_DIMENSION / srcH,
      1
    ) || 1;

  const targetW = Math.round(srcW * scale);
  const targetH = Math.round(srcH * scale);

  const swap = rot === 90 || rot === 270;
  const cw = swap ? targetH : targetW;
  const ch = swap ? targetW : targetH;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context for preview-scale export base.");
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.drawImage(sourceImg, -targetW / 2, -targetH / 2, targetW, targetH);
  ctx.restore();

  const base = ctx.getImageData(0, 0, cw, ch);
  return new ImageData(
    new Uint8ClampedArray(base.data),
    base.width,
    base.height
  );
}

async function drawExportBaseToCanvas(
  ctx: CanvasRenderingContext2D,
  ow: number,
  oh: number,
  originalImage: HTMLImageElement,
  payload: ExportPayload
): Promise<void> {
  const rot = normalizeExportRotation(payload.imageRotation);
  const cw = rot % 180 === 0 ? ow : oh;
  const ch = rot % 180 === 0 ? oh : ow;

  ctx.canvas.width = cw;
  ctx.canvas.height = ch;

  ctx.save();
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((rot * Math.PI) / 180);

  if (payload.useGradedPreviewAsBase && payload.gradedPreviewBaseSrc) {
    const graded = await loadImageElement(payload.gradedPreviewBaseSrc);
    ctx.drawImage(graded, -ow / 2, -oh / 2, ow, oh);
  } else {
    ctx.drawImage(originalImage, -ow / 2, -oh / 2, ow, oh);
  }

  ctx.restore();
}

function upscaleImageDataToCanvas(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  targetW: number,
  targetH: number
): void {
  const temp = document.createElement("canvas");
  temp.width = imageData.width;
  temp.height = imageData.height;

  const tctx = temp.getContext("2d");
  if (!tctx) {
    throw new Error("Could not get 2D context for export upscale.");
  }

  tctx.putImageData(imageData, 0, 0);

  ctx.canvas.width = targetW;
  ctx.canvas.height = targetH;
  ctx.drawImage(temp, 0, 0, targetW, targetH);
}

type WorkerPassInput = {
  imageData: ImageData;
  bwRecipe?: any;
  curves?: any[];
  manualTweaks?: Record<string, number>;
  skipBwRecipeReapply?: boolean;
  tweakMathMode?: string;
  adjustments: {
    exposure: number;
    contrast: number;
    shadows: number;
    highlights: number;
    whites: number;
    blacks: number;
    temperature: number;
    tint: number;
    vibrance: number;
    clarity: number;
    texture: number;
    dehaze: number;
    parametricCurve: number;
    rgbComposite: number;
    rgbR: number;
    rgbG: number;
    rgbB: number;
    filmicToe: number;
    filmicShoulder: number;
    highlightRolloff: number;
    shadowLift: number;
    colorSeparation: number;
  };
};

async function runWorkerPass(input: WorkerPassInput): Promise<ImageData> {
  return await new Promise<ImageData>((resolve, reject) => {
    const worker = new (AdjustmentWorker as any)();
    worker.onerror = (err: ErrorEvent) => {
      worker.terminate();
      reject(err);
    };
    worker.onmessage = (e: MessageEvent) => {
      worker.terminate();
      const data = e.data;
      resolve((data?.output ?? data) as ImageData);
    };

    const { adjustments } = input;
    worker.postMessage(
      {
        jobId: Date.now() + Math.random(),
        imageData: input.imageData,
        manualTweaksOnly: false,
        skipBwRecipeReapply: input.skipBwRecipeReapply ?? false,
        tweakMathMode: input.tweakMathMode ?? "default",
        bwRecipe: input.bwRecipe,
        exposure: adjustments.exposure,
        contrast: adjustments.contrast,
        shadows: adjustments.shadows,
        highlights: adjustments.highlights,
        whites: adjustments.whites,
        blacks: adjustments.blacks,
        temperature: adjustments.temperature,
        tint: adjustments.tint,
        vibrance: adjustments.vibrance,
        clarity: adjustments.clarity,
        texture: adjustments.texture,
        dehaze: adjustments.dehaze,
        parametricCurve: adjustments.parametricCurve,
        rgbComposite: adjustments.rgbComposite,
        rgbR: adjustments.rgbR,
        rgbG: adjustments.rgbG,
        rgbB: adjustments.rgbB,
        filmicToe: adjustments.filmicToe,
        filmicShoulder: adjustments.filmicShoulder,
        highlightRolloff: adjustments.highlightRolloff,
        shadowLift: adjustments.shadowLift,
        colorSeparation: adjustments.colorSeparation,
        manualTweaks: input.manualTweaks || {},
        curves: input.curves,
      },
      [input.imageData.data.buffer]
    );
  });
}

function applyPostDramaCssFilter(
  source: HTMLCanvasElement,
  postDrama: number
): HTMLCanvasElement {
  const factor = getPostDramaFactor(postDrama);
  if (factor === 1) return source;

  const filtered = document.createElement("canvas");
  filtered.width = source.width;
  filtered.height = source.height;

  const fctx = filtered.getContext("2d");
  if (!fctx) return source;

  fctx.filter = `contrast(${factor}) saturate(${0.9 + factor * 0.15})`;
  fctx.drawImage(source, 0, 0);
  return filtered;
}

export async function runFullResExportWithPayload(
  payload: ExportPayload
): Promise<void> {
  const {
    originalImage,
    fullPath,
    mimeType,
    quality,
    adjustments,
    manualTweaks,
    postDrama,
    bwRecipe,
    curves,
    imageRotation,
    skipBwRecipeReapply,
    tweakMathMode,
  } = payload;

  if (!originalImage) {
    console.warn("No original image provided for export.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.warn("Could not get 2D context for export canvas.");
    return;
  }

  const width = originalImage.naturalWidth || originalImage.width;
  const height = originalImage.naturalHeight || originalImage.height;

  if (!width || !height) {
    console.warn("Original image has invalid dimensions.");
    return;
  }

  const rot = normalizeExportRotation(imageRotation);
  const canvasW = rot % 180 === 0 ? width : height;
  const canvasH = rot % 180 === 0 ? height : width;

  try {
    if (hasActiveExportGrading(payload)) {
      // Match preview: worker at preview scale, then upscale to full resolution.
      const previewBase = await buildPreviewScaleImageData(payload, originalImage);
      const processed = await runWorkerPass({
        imageData: previewBase,
        adjustments,
        manualTweaks,
        bwRecipe,
        curves,
        skipBwRecipeReapply,
        tweakMathMode,
      });
      upscaleImageDataToCanvas(ctx, processed, canvasW, canvasH);
    } else {
      await drawExportBaseToCanvas(ctx, width, height, originalImage, payload);
    }

    const filteredCanvas = applyPostDramaCssFilter(canvas, postDrama);
    const blob: Blob = await new Promise((resolveBlob, rejectBlob) => {
      filteredCanvas.toBlob(
        (b) => {
          if (!b) {
            rejectBlob(new Error("Failed to create export blob."));
            return;
          }
          resolveBlob(b);
        },
        mimeType,
        quality ?? (mimeType === "image/jpeg" ? 0.9 : undefined)
      );
    });

    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    await writeFile(fullPath, bytes);
  } catch (err) {
    console.error("Error during export pipeline:", err);
    throw err;
  }
}
