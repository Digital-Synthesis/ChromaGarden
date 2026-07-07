import React, { useState, useRef, useEffect } from "react";

interface VersionModalProps {
    theme: {
        panelBackground: string;
        border: string;
        textPrimary: string;
        textMuted: string;
        accent: string;
    };
    onClose: () => void;
}

export default function VersionModal({ theme, onClose }: VersionModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const [minHovered, setMinHovered] = useState(false);
    const [maxHovered, setMaxHovered] = useState(false);
    const [closeHovered, setCloseHovered] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | null>(null);

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
        if (isMinimized) setIsMinimized(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(prev => !prev);
        if (isMaximized) setIsMaximized(false);
    };

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
                    width: isMaximized ? "90%" : "60%",
                    maxWidth: isMaximized ? "1200px" : "700px",
                    height: isMaximized ? "90%" : isMinimized ? "auto" : "60%",
                    maxHeight: isMaximized ? "100%" : "600px",
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
                {/* === TITLE BAR === */}
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
                        VERSION INFO
                    </div>

                    {/* Window Controls */}
                    <div style={{ display: "flex", gap: "4px", position: "absolute", right: "20px" }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                            onMouseEnter={() => setMinHovered(true)}
                            onMouseLeave={() => setMinHovered(false)}
                            style={{
                                width: "32px",
                                height: "32px",
                                background: minHovered ? "rgba(255,255,255,0.1)" : "transparent",
                                border: "none",
                                color: theme.textMuted,
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: "4px",
                                transition: "all 0.1s ease",
                            }}
                        >
                            −
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                            onMouseEnter={() => setMaxHovered(true)}
                            onMouseLeave={() => setMaxHovered(false)}
                            style={{
                                width: "32px",
                                height: "32px",
                                background: maxHovered ? "rgba(255,255,255,0.1)" : "transparent",
                                border: "none",
                                color: theme.textMuted,
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: "4px",
                                transition: "all 0.1s ease",
                            }}
                        >
                            {isMaximized ? "❐" : "□"}
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            onMouseEnter={() => setCloseHovered(true)}
                            onMouseLeave={() => setCloseHovered(false)}
                            style={{
                                width: "32px",
                                height: "32px",
                                background: closeHovered ? "#e53935" : "transparent",
                                border: "none",
                                color: closeHovered ? "#ffffff" : theme.textMuted,
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: "4px",
                                transition: "all 0.1s ease",
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* === MAIN CONTENT === */}
                {!isMinimized && (
                    <div
                        style={{
                            flex: 1,
                            padding: "40px 50px",
                            overflowY: "auto",
                            color: theme.textPrimary,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            textAlign: "left",
                            lineHeight: 1.75,
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
                                Chroma Garden v1.0 — Stable Release
                            </h2>

                            <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
                                Seasonal Engine Suite Build
                            </p>

                            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Highlights</h3>

                            <ul style={{ paddingLeft: "20px", marginBottom: "30px" }}>
                                <li>Added About & Use License modals</li>
                                <li>Improved seasonal engine color consistency</li>
                                <li>Enhanced Infinite Color jitter math for smoother variations</li>
                                <li>Updated Pre‑Drama engine behavior</li>
                                <li>Export pipeline stability improvements</li>
                                <li>General UI polish and performance tuning</li>
                            </ul>

                            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Build Details</h3>

                            <ul style={{ paddingLeft: "20px", marginBottom: "30px" }}>
                                <li><strong>Build Date:</strong> July 7, 2026</li>
                                <li><strong>Engine Core:</strong> Seasonal Engine Suite v2.1</li>
                                <li><strong>Variation Engine:</strong> Infinite Color v3.0</li>
                                <li><strong>Portrait Engine:</strong> Human Essence v1.2</li>
                                <li><strong>Export Engine:</strong> Full‑Resolution Pipeline v1.4</li>
                            </ul>

                            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Our Commitment</h3>

                            <p style={{ marginBottom: "10px" }}>
                                Every update is crafted to make color exploration more intuitive, expressive,
                                and enjoyable — for beginners and professionals alike.
                            </p>

                            <p style={{ textAlign: "center", marginTop: "30px", opacity: 0.8 }}>
                                Digital Synthesis — Crafted with intention.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}