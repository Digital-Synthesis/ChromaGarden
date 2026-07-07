export type MyLookMode = "seasonal" | "portrait" | "blackAndWhite";

export interface MyLook {
  name: string;
  season: string;
  profile: string;
  recipe: any;
  adjustments: Record<string, number>;
  manualTweaks: Record<string, number>;
  postDrama: number;
  preDrama: number;
  jitterSeed?: number;
  jitterDeltas?: Record<string, number>;
  thumbnail: string;
  createdAt: string;
  mode: MyLookMode;
}
