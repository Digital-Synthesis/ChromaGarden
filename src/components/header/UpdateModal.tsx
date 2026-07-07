import React, { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { writeFile } from "@tauri-apps/plugin-fs";
import { downloadDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";


interface UpdateModalProps {
    theme: {
        panelBackground: string;
        border: string;
        textPrimary: string;
        textMuted: string;
        accent: string;
    };
    onClose: () => void;
}

const CURRENT_VERSION = "1.0.0"; // your app version

export default function UpdateModal({ theme, onClose }: UpdateModalProps) {
    const [status, setStatus] = useState<"idle" | "checking" | "upToDate" | "updateAvailable">("idle");

    // === DRAG LOGIC (from VersionModal) ===
    const modalRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!modalRef.current) return;
        isDragging.current = true;

        const rect = modalRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !modalRef.current) return;

        if (rafId.current) cancelAnimationFrame(rafId.current);

        rafId.current = requestAnimationFrame(() => {
            if (!modalRef.current) return;

            let newLeft = e.clientX - dragOffset.current.x;
            let newTop = e.clientY - dragOffset.current.y;

            const minTop = 40;
            const minSide = 40;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (newLeft < minSide) newLeft = minSide;
            if (newLeft > viewportWidth - 400) newLeft = viewportWidth - 400;
            if (newTop < minTop) newTop = minTop;
            if (newTop > viewportHeight - 120) newTop = viewportHeight - 120;

            modalRef.current.style.position = "absolute";
            modalRef.current.style.left = `${newLeft}px`;
            modalRef.current.style.top = `${newTop}px`;
            modalRef.current.style.transform = "none";
        });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        (window as any).lastDragTime = Date.now();

        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // === UPDATE CHECK LOGIC ===
    const handleCheck = async () => {
        setStatus("checking");

        try {
            const response = await fetch(
                "https://raw.githubusercontent.com/Digital-Synthesis/ChromaGarden/main/version.json"
            );

            if (!response.ok) throw new Error("Failed to fetch version.json");

            const data = await response.json();
            const latest = data.latestVersion;

            if (latest === CURRENT_VERSION) {
                setStatus("upToDate");
                return;
            }

            setStatus("updateAvailable");
            (window as any).updateDownloadUrl = data.downloadUrl;

        } catch (err) {
            console.error("Update check failed:", err);
            setStatus("idle");
        }
    };

    // === DOWNLOAD + INSTALL LOGIC ===
    const handleDownloadUpdate = async () => {
    const url = (window as any).updateDownloadUrl;
    if (!url) return;

    setStatus("checking");

    try {
        // 1. Download MSI
        const response = await fetch(url);
        const fileBytes = await response.arrayBuffer();
        const binary = new Uint8Array(fileBytes);

        // 2. Resolve the real download directory path
        const downloadPath = await downloadDir(); // returns "C:/Users/Justin/Downloads"

        const fullPath = `${downloadPath}/chroma-garden-update.msi`;

        // 3. Save MSI using Tauri v2 FS plugin
        await writeFile(fullPath, binary);

        // 4. Launch installer using Tauri v2 Shell plugin
        const command = await Command.create("run-installer", [fullPath]);
        command.spawn();

        // 5. Close the app
        await invoke("plugin:window|close");

    } catch (err) {
        console.error("Update failed:", err);
        setStatus("idle");
    }
};

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
            }}
            onClick={() => {
                if (!isDragging.current && Date.now() - (window as any).lastDragTime > 80) {
                    onClose();
                }
            }}
        >
            <div
                ref={modalRef}
                style={{
                    width: "60%",
                    maxWidth: "700px",
                    height: "auto",
                    maxHeight: "600px",
                    backgroundColor: theme.panelBackground,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "14px",
                    boxShadow: "0 30px 70px rgba(0,0,0,0.95)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* === TITLE BAR (DRAGGABLE) === */}
                <div
                    style={{
                        padding: "12px 20px",
                        borderBottom: `1px solid ${theme.border}`,
                        backgroundColor: "#111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        userSelect: "none",
                        cursor: "move",
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <div
                        style={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            letterSpacing: "0.03em",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        CHECK FOR UPDATES
                    </div>

                    {/* === SIMPLE CLOSE BUTTON === */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{
                            padding: "6px 14px",
                            backgroundColor: "#222",
                            border: `1px solid ${theme.border}`,
                            borderRadius: "6px",
                            color: theme.textPrimary,
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* === MAIN CONTENT === */}
                <div
                    style={{
                        flex: 1,
                        padding: "40px 50px",
                        overflowY: "auto",
                        color: theme.textPrimary,
                        textAlign: "left",
                        lineHeight: 1.75,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ maxWidth: "700px", fontSize: "1.05rem" }}>
                        <h2
                            style={{
                                marginBottom: "20px",
                                letterSpacing: "0.03em",
                                textAlign: "center",
                            }}
                        >
                            Check for Updates
                        </h2>

                        <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
                            Chroma Garden can check for new versions and download updates when available.
                        </p>

                        {/* STATUS */}
                        {status === "idle" && (
                            <div style={{ marginBottom: "24px", color: theme.textMuted, textAlign: "center" }}>
                                Click “Check Now” to see if a newer version is available.
                            </div>
                        )}

                        {status === "checking" && (
                            <div style={{ marginBottom: "24px", color: theme.accent, textAlign: "center" }}>
                                Checking for updates…
                            </div>
                        )}

                        {status === "upToDate" && (
                            <div style={{ marginBottom: "24px", color: "#7dd97c", textAlign: "center" }}>
                                You’re running the latest version.
                            </div>
                        )}

                        {status === "updateAvailable" && (
                            <div style={{ marginBottom: "24px", color: "#ffb86c", textAlign: "center" }}>
                                A new version is available!
                                <br />
                                Click below to download and install the update.
                            </div>
                        )}

                        {/* BUTTONS */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                            <button
                                onClick={handleCheck}
                                style={{
                                    padding: "10px 22px",
                                    backgroundColor: theme.accent,
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "#000",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                }}
                            >
                                Check Now
                            </button>

                            {status === "updateAvailable" && (
                                <button
                                    onClick={handleDownloadUpdate}
                                    style={{
                                        padding: "10px 22px",
                                        backgroundColor: "#4caf50",
                                        border: "none",
                                        borderRadius: "6px",
                                        color: "#000",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    Download Update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}