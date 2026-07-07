import React, { useEffect, useState } from "react";
import { readDir } from "@tauri-apps/plugin-fs";
import { homeDir } from "@tauri-apps/api/path";

import {
  AdjustmentState,
  ExportFormat,
  ExportMimeType,
} from "./export/export-payload";

import { runFullResExportWithPayload } from "./export/export-engine";

type ThemeShape = {
  accent: string;
  textMuted: string;
  textPrimary: string;
  border: string;
  panelBackground: string;
};

interface ExportDialogProps {
  t: any;
  theme: ThemeShape;
  isOpen: boolean;
  onClose: () => void;
  originalImageRef: React.RefObject<HTMLImageElement | null>;
  adjustments: AdjustmentState;
  initialDirectory?: string;
}

type FsEntry = {
  name: string;
  isDir: boolean;
};

export default function ExportDialog({
  t,
  theme,
  isOpen,
  onClose,
  originalImageRef,
  adjustments,
  initialDirectory,
}: ExportDialogProps) {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [entries, setEntries] = useState<FsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filename, setFilename] = useState<string>("output");
  const [format, setFormat] = useState<ExportFormat>("png");
  const [saving, setSaving] = useState(false);

  /* ---------------------------------------------------------
     AUTO-DETECT HOME DIRECTORY ON FIRST OPEN
  --------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    // If user provided a starting directory, use it.
    if (initialDirectory) {
      setCurrentPath(initialDirectory);
      loadDirectory(initialDirectory);
      return;
    }

    // Otherwise auto-detect home directory
    homeDir().then((dir) => {
      setCurrentPath(dir);
      loadDirectory(dir);
    });
  }, [isOpen]);

  /* ---------------------------------------------------------
     LOAD DIRECTORY CONTENTS
  --------------------------------------------------------- */
  const loadDirectory = async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = (await readDir(path)) as any[];

      const dirs: FsEntry[] = result
        .filter((e) => e && typeof e === "object")
        .map((e) => ({
          name: String(e.name),
          isDir: !!e.isDir,
        }))
        .filter((e) => e.isDir);

      setEntries(dirs);
    } catch (err: any) {
      console.error("Failed to read directory:", err);
      setError("Unable to read this folder. Try a different path.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------
     NAVIGATION: ENTER FOLDER
  --------------------------------------------------------- */
  const handleEnterFolder = (name: string) => {
    if (!currentPath) return;

    const separator = currentPath.includes("\\") ? "\\" : "/";
    const next = currentPath.endsWith(separator)
      ? `${currentPath}${name}`
      : `${currentPath}${separator}${name}`;

    setCurrentPath(next);
    loadDirectory(next);
  };

  /* ---------------------------------------------------------
     NAVIGATION: GO UP ONE LEVEL
  --------------------------------------------------------- */
  const handleGoUp = () => {
    if (!currentPath) return;

    const normalized = currentPath.replace(/[/\\]+$/, "");
    const parts = normalized.split(/[/\\]/);

    if (parts.length <= 1) return;

    parts.pop();

    const separator = normalized.includes("\\") ? "\\" : "/";
    const parent = parts.join(separator) || separator;

    setCurrentPath(parent);
    loadDirectory(parent);
  };

  /* ---------------------------------------------------------
     BUILD FULL PATH FOR SAVE
  --------------------------------------------------------- */
  const buildFullPath = (): string | null => {
    if (!currentPath || !filename.trim()) return null;

    const trimmedName = filename.trim();
    const ext = format === "png" ? ".png" : ".jpg";
    const separator = currentPath.includes("\\") ? "\\" : "/";

    const base =
      currentPath.endsWith("\\") || currentPath.endsWith("/")
        ? currentPath
        : `${currentPath}${separator}`;

    return `${base}${trimmedName}${ext}`;
  };

  const getMimeType = (): ExportMimeType =>
    format === "png" ? "image/png" : "image/jpeg";

  /* ---------------------------------------------------------
     SAVE HANDLER
  --------------------------------------------------------- */
  const handleSave = async () => {
    if (saving) return;

    const fullPath = buildFullPath();
    const originalImage = originalImageRef.current;

    if (!fullPath || !originalImage) {
      console.warn("Missing path or original image for export.");
      return;
    }

    setSaving(true);

    try {
      await runFullResExportWithPayload({
        fullPath,
        mimeType: getMimeType(),
        quality: format === "jpg" ? 0.9 : undefined,
        originalImage,
        adjustments,
        manualTweaks: {},
        postDrama: 0,
        imageRotation: 0,
      });

      onClose();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  /* ---------------------------------------------------------
     RENDER UI
  --------------------------------------------------------- */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "640px",
          maxWidth: "95vw",
          maxHeight: "80vh",
          backgroundColor: theme.panelBackground,
          border: `1px solid ${theme.border}`,
          borderRadius: "10px",
          boxShadow:
            "0 18px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.8)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: theme.textPrimary,
            fontWeight: 600,
          }}
        >
          <span>Save / Export</span>
          <button
            style={{
              ...t.button,
              padding: "0.25rem 0.6rem",
              fontSize: "0.8rem",
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* CURRENT PATH */}
        <div
          style={{
            marginBottom: "0.5rem",
            fontSize: "0.8rem",
            color: theme.textMuted,
            wordBreak: "break-all",
          }}
        >
          Selected folder:{" "}
          <span style={{ color: theme.textPrimary }}>
            {currentPath || "(not set)"}
          </span>
        </div>

        {/* NAV BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "0.75rem",
          }}
        >
          <button
            style={{
              ...t.button,
              padding: "0.35rem 0.6rem",
              fontSize: "0.8rem",
            }}
            onClick={handleGoUp}
          >
            Up One Level
          </button>

          <button
            style={{
              ...t.button,
              padding: "0.35rem 0.6rem",
              fontSize: "0.8rem",
            }}
            onClick={() => currentPath && loadDirectory(currentPath)}
          >
            Refresh
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: "12px",
            marginBottom: "0.75rem",
            minHeight: "180px",
          }}
        >
          {/* FOLDER LIST */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${theme.border}`,
              borderRadius: "6px",
              padding: "6px",
              overflowY: "auto",
            }}
          >
            {loading && (
              <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
                Loading folders…
              </div>
            )}

            {error && !loading && (
              <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            {!loading && !error && entries.length === 0 && (
              <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
                No subfolders in this location.
              </div>
            )}

            {!loading &&
              !error &&
              entries.map((entry) => (
                <div
                  key={entry.name}
                  style={{
                    padding: "4px 6px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: theme.textPrimary,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => handleEnterFolder(entry.name)}
                >
                  <span style={{ marginRight: "6px" }}>📁</span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.name}
                  </span>
                </div>
              ))}
          </div>

          {/* FILE NAME + TYPE */}
          <div
            style={{
              width: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* FILE NAME */}
            <div>
              <div
                style={{
                  marginBottom: "0.25rem",
                  color: theme.textPrimary,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                File name
              </div>

              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.35rem 0.4rem",
                  borderRadius: "4px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: theme.textPrimary,
                  fontSize: "0.85rem",
                }}
              />
            </div>

            {/* FILE TYPE */}
            <div>
              <div
                style={{
                  marginBottom: "0.25rem",
                  color: theme.textPrimary,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                File type
              </div>

              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                style={{
                  width: "100%",
                  padding: "0.35rem 0.4rem",
                  borderRadius: "4px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: theme.textPrimary,
                  fontSize: "0.85rem",
                }}
              >
                <option value="png">PNG Image (*.png)</option>
                <option value="jpg">JPEG Image (*.jpg)</option>
              </select>
            </div>

            <div
              style={{
                marginTop: "0.25rem",
                fontSize: "0.8rem",
                color: theme.textMuted,
              }}
            >
              Exporting at full resolution of the original image.
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "0.5rem",
          }}
        >
          <button
            style={{
              ...t.button,
              padding: "0.45rem 0.9rem",
              minWidth: "90px",
            }}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            style={{
              ...t.buttonAccent,
              padding: "0.45rem 0.9rem",
              minWidth: "120px",
              opacity:
                !filename.trim() || !currentPath || saving ? 0.5 : 1,
              cursor:
                !filename.trim() || !currentPath || saving
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={handleSave}
            disabled={!filename.trim() || !currentPath || saving}
          >
            {saving ? "Saving…" : "Save / Export"}
          </button>
        </div>
      </div>
    </div>
  );
}