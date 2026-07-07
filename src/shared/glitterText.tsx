/**
 * ===================================================================
 * GLITTERTEXT.TSX
 * ===================================================================
 * 
 * Reusable glitter/shimmer text component for Chroma Garden.
 * 
 * Used on major section headers in both Color Profiles and Adjustments tabs.
 * 
 * Supports optional style overrides (fontSize, etc.) while keeping the
 * glitter effect consistent.
 * 
 * ===================================================================
 */

import React from "react";

interface GlitterTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;     // ← This was missing
}

const GlitterText: React.FC<GlitterTextProps> = ({ children, style = {} }) => {
  return (
    <span
      style={{
        display: "inline-block",
        background: `
          linear-gradient(90deg, 
            #c0d0e0 0%, 
            #f0f4ff 25%, 
            #c0d0e0 50%, 
            #f0f4ff 75%, 
            #c0d0e0 100%
          ),
          radial-gradient(circle, rgba(255,255,255,0.95) 0.8px, transparent 0) 15% 40%,
          radial-gradient(circle, rgba(255,255,255,0.85) 0.6px, transparent 0) 70% 25%,
          radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 0) 35% 75%
        `,
        backgroundSize: "300% 100%, 200% 200%, 180% 180%, 220% 220%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "glitterFlow 7s linear infinite",
        fontWeight: 600,
        letterSpacing: "0.05em",
        ...style,                    // ← allows overriding fontSize, etc.
      }}
    >
      {children}
    </span>
  );
};

export default GlitterText;