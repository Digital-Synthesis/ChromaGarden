import { useEffect, useState, type MouseEvent } from "react";
import type { MyLook } from "./myLooksTypes";

interface MyLooksDrawerProps {
  t: any;
  theme: any;
  looks: MyLook[];
  selectedLookName: string | null;
  onSelectLook: (look: MyLook) => void;
  onApplyLook: () => void;
  onRefreshLooks: () => Promise<void>;
  onRequestRenameMyLook: () => void;
  onDeleteMyLook: (name: string) => Promise<void>;
}

function TrashIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export default function MyLooksDrawer({
  t,
  theme,
  looks,
  selectedLookName,
  onSelectLook,
  onApplyLook,
  onRefreshLooks,
  onRequestRenameMyLook,
  onDeleteMyLook,
}: MyLooksDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [renameHovered, setRenameHovered] = useState(false);
  const [applyHovered, setApplyHovered] = useState(false);
  const hasSelection = Boolean(selectedLookName);

  const actionHoverAccent = (hovered: boolean) =>
    hovered && hasSelection
      ? {
          border: `1px solid ${theme.accent}`,
          color: theme.accent,
          boxShadow: t.buttonAccent.boxShadow,
        }
      : {};

  useEffect(() => {
    onRefreshLooks().catch((error) => {
      console.warn("Failed to refresh My Looks Library", error);
    });
  }, [onRefreshLooks]);

  useEffect(() => {
    if (!selectedLookName) {
      setIsOpen(false);
      setDeleteHovered(false);
      setRenameHovered(false);
      setApplyHovered(false);
    }
  }, [selectedLookName]);

  const handleDeleteClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (!hasSelection) return;
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLookName) return;
    setDeleteBusy(true);
    try {
      await onDeleteMyLook(selectedLookName);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.warn("Failed to delete look", error);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          ...t.button,
          width: "100%",
          boxSizing: "border-box",
          paddingRight: "0.75rem",
          textAlign: "left",
          border: `1px solid ${isOpen ? theme.accent : theme.border}`,
          color: isOpen ? theme.accent : theme.textPrimary,
          borderRadius: isOpen ? "6px 6px 0 0" : "6px",
          borderBottomColor: isOpen ? theme.border : theme.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen((v) => !v)}
      >
        <button
          type="button"
          title="Delete look"
          aria-label="Delete look"
          disabled={!hasSelection}
          style={{
            ...t.button,
            ...actionHoverAccent(deleteHovered),
            padding: "0.28rem 0.4rem",
            marginBottom: 0,
            minWidth: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hasSelection ? 1 : 0.4,
            cursor: hasSelection ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={() => hasSelection && setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(e);
          }}
        >
          <TrashIcon
            color={
              deleteHovered && hasSelection
                ? theme.accent
                : hasSelection
                  ? theme.textPrimary
                  : theme.textMuted
            }
          />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            flexShrink: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            style={{
              ...t.button,
              ...actionHoverAccent(renameHovered),
              padding: "0.35rem 0.45rem",
              marginBottom: 0,
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
              opacity: hasSelection ? 1 : 0.4,
              cursor: hasSelection ? "pointer" : "not-allowed",
              transition: "border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
            }}
            disabled={!hasSelection}
            onMouseEnter={() => hasSelection && setRenameHovered(true)}
            onMouseLeave={() => setRenameHovered(false)}
            onClick={() => {
              if (hasSelection) onRequestRenameMyLook();
            }}
          >
            Rename
          </button>
          <button
            type="button"
            style={{
              ...t.button,
              ...actionHoverAccent(applyHovered),
              padding: "0.35rem 0.45rem",
              marginBottom: 0,
              fontSize: "0.78rem",
              opacity: hasSelection ? 1 : 0.4,
              cursor: hasSelection ? "pointer" : "not-allowed",
              whiteSpace: "nowrap",
              transition: "border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
            }}
            disabled={!hasSelection}
            onMouseEnter={() => hasSelection && setApplyHovered(true)}
            onMouseLeave={() => setApplyHovered(false)}
            onClick={() => {
              if (hasSelection) onApplyLook();
            }}
          >
            Apply Look
          </button>
        </div>
      </div>

      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.28s ease-out, opacity 0.28s ease-out",
          maxHeight: isOpen ? "420px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          style={{
            backgroundColor: theme.panelBackground,
            border: `1px solid ${theme.border}`,
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            padding: "0.6rem",
          }}
        >
          {looks.length === 0 ? (
            <div style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
              No saved looks yet.
            </div>
          ) : (
            looks.map((look) => {
              const isActive = selectedLookName === look.name;

              return (
                <button
                  key={`${look.name}-${look.createdAt}`}
                  onClick={() => onSelectLook(look)}
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.6rem",
                    borderRadius: "6px",
                    border: `1px solid ${
                      isActive ? theme.accent : theme.border
                    }`,
                    backgroundColor: t.button.backgroundColor,
                    color: isActive ? theme.accent : theme.textPrimary,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    cursor: "pointer",
                    marginBottom: "0.5rem",
                    boxShadow: isActive ? `0 0 8px ${theme.accent}` : "none",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isActive
                        ? theme.accent
                        : theme.textMuted,
                      boxShadow: isActive
                        ? `0 0 6px ${theme.accent}`
                        : "none",
                      transition: "0.15s ease",
                    }}
                  />
                  {look.thumbnail ? (
                    <img
                      src={look.thumbnail}
                      alt=""
                      style={{
                        width: "34px",
                        height: "24px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: `1px solid ${theme.border}`,
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "0.8rem",
                      textAlign: "left",
                    }}
                  >
                    {look.name}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {deleteConfirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1002,
            backgroundColor: "rgba(0,0,0,0.62)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={handleDeleteCancel}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-looks-delete-title"
            style={{
              width: "360px",
              maxWidth: "100%",
              padding: "1rem",
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.panelBackground,
              boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              id="my-looks-delete-title"
              style={{
                color: theme.textPrimary,
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Delete look?
            </div>
            <p
              style={{
                margin: 0,
                marginBottom: "1rem",
                fontSize: "0.88rem",
                color: theme.textMuted,
                lineHeight: 1.4,
              }}
            >
              Delete is permanent. Are you sure?
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button type="button" style={t.button} onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button
                type="button"
                style={{
                  ...t.buttonAccent,
                  opacity: deleteBusy ? 0.6 : 1,
                  cursor: deleteBusy ? "wait" : "pointer",
                }}
                disabled={deleteBusy}
                onClick={() => void handleDeleteConfirm()}
              >
                {deleteBusy ? "Deleting…" : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
