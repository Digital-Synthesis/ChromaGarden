import {
  BaseDirectory,
  mkdir,
  readDir,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import type { MyLook } from "./myLooksTypes";

const MY_LOOKS_DIR = "MyLooks";

function sanitizeLookName(name: string): string {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\.+$/g, "")
    .slice(0, 25);
}

function describeStorageError(action: string, error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  return new Error(`My Looks ${action} failed: ${message}`);
}

function getLookPath(name: string): string {
  return `${MY_LOOKS_DIR}/${name}.json`;
}

function toStoredLook(myLook: MyLook): MyLook {
  const stored: MyLook = {
    name: sanitizeLookName(myLook.name),
    season: myLook.season,
    profile: myLook.profile,
    recipe: myLook.recipe,
    adjustments: myLook.adjustments,
    manualTweaks: myLook.manualTweaks,
    postDrama: myLook.postDrama,
    preDrama: myLook.preDrama,
    thumbnail: myLook.thumbnail,
    createdAt: myLook.createdAt,
    mode: myLook.mode,
  };

  if (typeof myLook.jitterSeed === "number") {
    stored.jitterSeed = myLook.jitterSeed;
  }

  if (myLook.jitterDeltas) {
    stored.jitterDeltas = myLook.jitterDeltas;
  }

  return stored;
}

async function ensureLooksDir(): Promise<void> {
  try {
    await mkdir(MY_LOOKS_DIR, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
  } catch (error) {
    throw describeStorageError("directory setup", error);
  }
}

export async function saveLook(myLook: MyLook): Promise<MyLook> {
  await ensureLooksDir();
  const safeName = sanitizeLookName(myLook.name);
  if (!safeName) {
    throw new Error("Look name is required");
  }

  const filePath = getLookPath(safeName);
  const json = JSON.stringify(toStoredLook(myLook), null, 2);

  try {
    await writeTextFile(filePath, json, { baseDir: BaseDirectory.AppData });
    const saved = JSON.parse(
      await readTextFile(filePath, { baseDir: BaseDirectory.AppData })
    ) as MyLook;
    return saved;
  } catch (error) {
    throw describeStorageError(`save "${myLook.name}"`, error);
  }
}

export async function loadLooks(): Promise<MyLook[]> {
  await ensureLooksDir();
  let entries;
  try {
    entries = await readDir(MY_LOOKS_DIR, { baseDir: BaseDirectory.AppData });
  } catch (error) {
    throw describeStorageError("load", error);
  }

  const looks: MyLook[] = [];

  for (const entry of entries) {
    if (!entry.name || !entry.name.endsWith(".json")) continue;

    try {
      const filePath = getLookPath(entry.name.replace(/\.json$/i, ""));
      const contents = await readTextFile(filePath, {
        baseDir: BaseDirectory.AppData,
      });
      looks.push(JSON.parse(contents) as MyLook);
    } catch (error) {
      console.warn("Failed to load saved look", entry.name, error);
    }
  }

  return looks.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deleteLook(name: string): Promise<void> {
  await ensureLooksDir();
  const safeName = sanitizeLookName(name);
  const filePath = getLookPath(safeName);
  try {
    await remove(filePath, { baseDir: BaseDirectory.AppData });
  } catch (error) {
    throw describeStorageError(`delete "${name}"`, error);
  }
}

/** Deletes a user-saved look by name (same as `deleteLook`). */
export async function deleteMyLook(name: string): Promise<void> {
  return deleteLook(name);
}

/**
 * Renames a saved look: updates JSON `name`, moves file `oldName.json` → `newName.json`.
 */
export async function renameMyLook(
  oldName: string,
  newName: string
): Promise<MyLook> {
  await ensureLooksDir();
  const safeOld = sanitizeLookName(oldName);
  const safeNew = sanitizeLookName(newName);
  if (!safeOld) {
    throw new Error("Current look name is required");
  }
  if (!safeNew) {
    throw new Error("New look name is required");
  }
  if (safeOld === safeNew) {
    const path = getLookPath(safeOld);
    const raw = await readTextFile(path, { baseDir: BaseDirectory.AppData });
    return JSON.parse(raw) as MyLook;
  }

  const oldPath = getLookPath(safeOld);
  const newPath = getLookPath(safeNew);

  const entries = await readDir(MY_LOOKS_DIR, { baseDir: BaseDirectory.AppData });
  const targetTaken = entries.some((e) => {
    const stem = e.name?.replace(/\.json$/i, "") ?? "";
    return (
      stem.toLowerCase() === safeNew.toLowerCase() &&
      stem.toLowerCase() !== safeOld.toLowerCase()
    );
  });
  if (targetTaken) {
    throw new Error(`A look named "${safeNew}" already exists`);
  }

  let look: MyLook;
  try {
    const raw = await readTextFile(oldPath, { baseDir: BaseDirectory.AppData });
    look = JSON.parse(raw) as MyLook;
  } catch (error) {
    throw describeStorageError(`read "${oldName}"`, error);
  }

  look.name = safeNew;
  const json = JSON.stringify(toStoredLook(look), null, 2);

  try {
    await writeTextFile(newPath, json, { baseDir: BaseDirectory.AppData });
    await remove(oldPath, { baseDir: BaseDirectory.AppData });
    const saved = JSON.parse(
      await readTextFile(newPath, { baseDir: BaseDirectory.AppData })
    ) as MyLook;
    return saved;
  } catch (error) {
    throw describeStorageError(`rename "${oldName}" → "${newName}"`, error);
  }
}
