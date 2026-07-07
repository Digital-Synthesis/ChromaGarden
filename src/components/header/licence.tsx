import React, { useState, useRef, useEffect } from "react";

interface LicenseModalProps {
    theme: {
        panelBackground: string;
        border: string;
        textPrimary: string;
        textMuted: string;
        accent: string;
    };
    onClose: () => void;
}

export default function LicenseModal({ theme, onClose }: LicenseModalProps) {
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
                        USE LICENSE
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
                                    textAlign: "center",
                                    marginBottom: "30px",
                                    fontSize: "1.4rem",
                                }}
                            >
                                Chroma Garden — Use License
                            </h2>

                            {/* === USER RIGHTS === */}
                            <h3 style={{ textAlign: "center", marginBottom: "20px", opacity: 0.9 }}>
                                User Rights
                            </h3>

                            <p style={{ marginBottom: "18px" }}>
                                You are granted a <strong>non‑exclusive, non‑transferable, perpetual license</strong> to
                                install and use Chroma Garden for both personal and commercial projects.
                            </p>

                            <p style={{ marginBottom: "18px" }}>
                                You own all images, exports, and creative work you produce using Chroma Garden.
                            </p>

                            {/* === RESTRICTIONS === */}
                            <h3 style={{ textAlign: "center", marginBottom: "20px", opacity: 0.9 }}>
                                Restrictions
                            </h3>

                            <p style={{ marginBottom: "18px" }}>
                                You may not redistribute, resell, repackage, sublicense, lease, rent, or distribute the
                                original application files, assets, or source code in any form. Reverse engineering,
                                decompiling, or modifying the software is also prohibited.
                            </p>

                            {/* === DISCLAIMER === */}
                            <h3 style={{ textAlign: "center", marginBottom: "20px", opacity: 0.9 }}>
                                Disclaimer
                            </h3>

                            <p style={{ marginBottom: "18px", opacity: 0.85 }}>
                                Chroma Garden is provided “as is” without warranty of any kind. <strong>Digital
                                Synthesis</strong> shall not be liable for any damages arising from the use of this
                                software.
                            </p>

                            {/* === ACKNOWLEDGMENT === */}
                            <h3 style={{ textAlign: "center", marginBottom: "20px", opacity: 0.9 }}>
                                Acknowledgment
                            </h3>

                            <p style={{ marginBottom: "10px" }}>
                                By using Chroma Garden, you agree to these terms and acknowledge that all intellectual
                                property rights in the software remain with <strong>Digital Synthesis</strong>.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}