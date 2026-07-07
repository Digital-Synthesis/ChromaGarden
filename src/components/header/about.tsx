import React, { useState, useRef, useEffect } from "react";

interface AboutModalProps {
    theme: {
        panelBackground: string;
        border: string;
        textPrimary: string;
        textMuted: string;
        accent: string;
    };
    onClose: () => void;
}

export default function AboutModal({ theme, onClose }: AboutModalProps) {
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
                    width: isMaximized ? "90%" : "70%",
                    maxWidth: isMaximized ? "1400px" : "900px",
                    height: isMaximized ? "90%" : isMinimized ? "auto" : "70%",
                    maxHeight: isMaximized ? "100%" : "800px",
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
                        ABOUT — CHROMA GARDEN
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
                        <div style={{ maxWidth: "800px", fontSize: "1.05rem" }}>
                            <h2
                                style={{
                                    marginBottom: "20px",
                                    letterSpacing: "0.03em",
                                    textAlign: "center",
                                }}
                            >
                                About Chroma Garden
                            </h2>

                            <p>
                                Chroma Garden is a creative color‑grading environment built for photographers,
                                artists, visual storytellers — and everyday users with no prior experience in
                                image editing. Its design philosophy is simple: powerful color science should
                                feel effortless, intuitive, and enjoyable for everyone.
                            </p>

                            <p>
                                The interface uses an armada of simple, friendly sliders that perform complex
                                mathematical transformations behind the scenes. You don’t need to understand
                                curves, channels, masks, or film response models — the engine handles all of it.
                                You just explore, adjust, and create.
                            </p>

                            <p>
                                The entire workspace is designed around clarity and discovery. No tiny icons.
                                No clutter. No “UI explosions.” Just a clean, modern environment that encourages
                                experimentation without overwhelming you.
                            </p>

                            <h3
                                style={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                }}
                            >
                                Infinite Color Randomizations
                            </h3>

                            <p>
                                At the heart of Chroma Garden is its Infinite Color engine — a system that
                                generates subtle, expressive variations with every click. Instead of forcing
                                you into one “correct” look, Chroma Garden encourages exploration through gentle
                                randomness.
                            </p>

                            <p>
                                Each variation is a small nudge: a shift in tone, a whisper of contrast, a hint
                                of color separation. Stacking these subtle adjustments creates dramatic, unique
                                results that feel handcrafted rather than algorithmic.
                            </p>

                            <p>
                                This philosophy is embodied in the 9‑Grid Variation Explorer, which presents
                                nine distinct interpretations of your chosen engine. Behind the scenes,
                                jitter‑controlled math adjusts the grading in delicate ways — because our
                                personal color vision isn’t everyone’s.
                            </p>

                            <h3
                                style={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                }}
                            >
                                Pre‑Drama Engine
                            </h3>

                            <p>
                                The Pre‑Drama slider exists to amplify your creative intent. It gently boosts
                                the emotional tone of your image before the main grading engine applies its
                                look, giving you even more control over the final aesthetic.
                            </p>

                            <h3
                                style={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                }}
                            >
                                A Modern Workflow
                            </h3>

                            <p>
                                Chroma Garden’s workflow is built around seasonal color engines, portrait‑aware
                                grading, black‑and‑white film treatments, hybrid systems, real‑time preview,
                                variation exploration, manual tweak controls, full‑resolution export, and
                                custom look saving.
                            </p>

                            <h3
                                style={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                }}
                            >
                                Built by Digital Synthesis
                            </h3>

                            <p>
                                Chroma Garden is developed by Digital Synthesis, an independent creative
                                software studio focused on expressive, artist‑driven tools. Every part of
                                Chroma Garden — from the color science to the interface — is crafted with care,
                                intention, and respect for the creative process.
                            </p>

                            <h3
                                style={{
                                    marginTop: "30px",
                                    textAlign: "center",
                                }}
                            >
                                Our Philosophy
                            </h3>

                            <p>
                                Color should feel alive. Tools should feel intuitive. Software should empower
                                creativity, not restrict it. Chroma Garden is built on that belief.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}