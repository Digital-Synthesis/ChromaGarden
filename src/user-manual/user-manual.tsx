import React, { useState, useRef, useEffect } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { manualContent } from "./manualContent";

const HIGHLIGHT_MARK_STYLE =
  "background-color: #f5f8359a; color: inherit; padding: 2px 3px; border-radius: 3px;";

function escapeRegExp(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Highlight search matches in visible text only — never inside HTML tags/attributes. */
function highlightHtmlText(html: string, term: string): string {
  if (!term.trim()) return html;

  const template = document.createElement("template");
  template.innerHTML = html;

  const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent ?? "";
    if (!regex.test(text)) {
      regex.lastIndex = 0;
      continue;
    }
    regex.lastIndex = 0;

    const parent = textNode.parentNode;
    if (!parent) continue;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      const mark = document.createElement("mark");
      mark.setAttribute("style", HIGHLIGHT_MARK_STYLE);
      mark.textContent = match[0];
      fragment.appendChild(mark);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    parent.replaceChild(fragment, textNode);
  }

  return template.innerHTML;
}

async function openExternalUrl(href: string): Promise<void> {
  try {
    await openUrl(href);
  } catch {
    window.open(href, "_blank", "noopener,noreferrer");
  }
}

interface UserManualModalProps {
  theme: {
    panelBackground: string;
    border: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    buttonBackground?: string;
  };
  onClose: () => void;
}

export default function UserManualModal({ theme, onClose }: UserManualModalProps) {
  const [activeChapterId, setActiveChapterId] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Hover states for subtle button highlights
  const [minHovered, setMinHovered] = useState(false);
  const [maxHovered, setMaxHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);

  // Drag functionality
  const modalRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const currentChapter = manualContent.find(ch => ch.id === activeChapterId) || manualContent[0];

  // Full-text search + accurate match count (title + every occurrence in content)
  const filteredContent = manualContent
    .map(chapter => {
      if (!searchTerm.trim()) {
        return { ...chapter, matchCount: 0 };
      }

      const term = searchTerm.toLowerCase();
      const titleMatch = chapter.title.toLowerCase().includes(term);

      // Count every real occurrence in the chapter content
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const contentMatches = chapter.content.match(regex);
      const contentCount = contentMatches ? contentMatches.length : 0;

      const matchCount = (titleMatch ? 1 : 0) + contentCount;

      return { ...chapter, matchCount };
    })
    .filter(chapter => chapter.matchCount > 0 || !searchTerm.trim());

  const highlightedContent = highlightHtmlText(
    currentChapter.content,
    searchTerm
  );

  const handleManualContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a[href]");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || !/^https?:\/\//i.test(href)) return;

    e.preventDefault();
    e.stopPropagation();
    void openExternalUrl(href);
  };

  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
    if (isMaximized) setIsMaximized(false);
  };

  // Drag handlers
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

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0 });
  }, [activeChapterId]);

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
          width: isMaximized ? "96%" : "92%",
          maxWidth: isMaximized ? "1400px" : "1150px",
          height: isMaximized ? "94%" : isMinimized ? "auto" : "88%",
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
        {/* === TITLE BAR (Draggable) === */}
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
          <div style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.03em" }}>
            Chroma Garden — User Manual
          </div>

          {/* Window Controls */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
              onMouseEnter={() => setMinHovered(true)}
              onMouseLeave={() => setMinHovered(false)}
              style={{
                width: "32px", height: "32px",
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
                width: "32px", height: "32px",
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

        {/* Content Area */}
        {!isMinimized && (
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Table of Contents */}
            <div
              style={{
                width: "260px",
                backgroundColor: "#161616",
                borderRight: `1px solid ${theme.border}`,
                padding: "20px 12px",
                overflowY: "auto",
              }}
            >
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.12em", color: theme.textMuted, paddingLeft: "12px", marginBottom: "12px" }}>
                CONTENTS
              </div>

              {/* Search Bar */}
              <div style={{ padding: 0, marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Search manual..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "#1e1e1e",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "6px",
                    color: theme.textPrimary,
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {filteredContent.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => setActiveChapterId(chapter.id)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "6px",
                    marginBottom: "3px",
                    cursor: "pointer",
                    backgroundColor: activeChapterId === chapter.id ? "#222" : "transparent",
                    color: activeChapterId === chapter.id ? theme.textPrimary : theme.textMuted,
                    fontSize: "0.9rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{chapter.title}</span>
                  {chapter.matchCount > 0 && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor: "#f5f83522",
                        color: "#f5f835",
                        padding: "2px 7px",
                        borderRadius: "9999px",
                        fontWeight: 500,
                      }}
                    >
                      {chapter.matchCount}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <div
              ref={contentScrollRef}
              style={{
                flex: 1,
                padding: "40px 50px",
                overflowY: "auto",
                color: theme.textPrimary,
                lineHeight: 1.75,
              }}
            >
              <div
                onClick={handleManualContentClick}
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
                style={{ fontSize: "1.05rem" }}
              />
            </div>
          </div>
        )}

        {/* Persistent Footer */}
        <div
          style={{
            padding: "12px 28px",
            borderTop: `1px solid ${theme.border}`,
            backgroundColor: "#111",
            fontSize: "0.78rem",
            color: theme.textMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexShrink: 0,
          }}
        >
          <span>Chroma Garden — User Manual — Version 0.1.0</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>© Digital Synthesis</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>Platform: Desktop (Windows)</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>Built with Tauri + React</span>
        </div>
      </div>
    </div>
  );
}