export type ExportMimeType = "image/png" | "image/jpeg";

export type ExportFormat = "png" | "jpg";

export interface AdjustmentState {
  [key: string]: number;

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

  // Creative Curves
  filmicToe: number;
  filmicShoulder: number;
  highlightRolloff: number;
  shadowLift: number;
  colorSeparation: number;
}

export interface ExportPayload {
  fullPath: string;
  mimeType: ExportMimeType;
  quality?: number;
  originalImage: HTMLImageElement;
  adjustments: AdjustmentState;
  manualTweaks: Record<string, number>;
  postDrama: number;
  /** B&W recipe for worker pre-pass (Strong / Curvy). */
  bwRecipe?: any;
  /** Curvy B&W curve transforms. */
  curves?: any[];
  /**
   * When true, draw gradedPreviewBaseSrc to full-res canvas before the worker
   * (matches preview where engine grade lives in imageSrc pixels).
   */
  useGradedPreviewAsBase?: boolean;
  gradedPreviewBaseSrc?: string | null;
  /** When true, B&W recipe block is skipped (base already engine-graded). */
  skipBwRecipeReapply?: boolean;
  /** Profile-aware manual tweak math routing. */
  tweakMathMode?: string;
  /** Degrees clockwise (0, 90, 180, 270) applied before export grading. */
  imageRotation?: number;
}
