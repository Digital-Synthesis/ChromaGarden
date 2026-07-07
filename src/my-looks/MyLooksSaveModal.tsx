import { useEffect, useMemo, useState } from "react";

const MAX_NAME_LENGTH = 25;

export type MyLooksSaveModalMode = "save" | "rename";

interface MyLooksSaveModalProps {
  open: boolean;
  mode?: MyLooksSaveModalMode;
  /** When mode is "rename", pre-fill and sync from this name when modal opens. */
  initialName?: string | null;
  t: any;
  theme: any;
  existingNames: string[];
  onCancel: () => void;
  onSave: (name: string) => Promise<void>;
}

export default function MyLooksSaveModal({
  open,
  mode = "save",
  initialName = null,
  t,
  theme,
  existingNames,
  onCancel,
  onSave,
}: MyLooksSaveModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRename = mode === "rename";

  useEffect(() => {
    if (open) {
      setName(isRename && initialName ? initialName : "");
      setSaving(false);
      setError(null);
    }
  }, [open, isRename, initialName]);

  const trimmedName = name.trim();
  const duplicateNames = useMemo(() => {
    if (isRename && initialName) {
      return existingNames.filter(
        (n) => n.toLowerCase() !== initialName.trim().toLowerCase()
      );
    }
    return existingNames;
  }, [existingNames, initialName, isRename]);

  const isDuplicate = useMemo(
    () =>
      duplicateNames.some(
        (existing) => existing.toLowerCase() === trimmedName.toLowerCase()
      ),
    [duplicateNames, trimmedName]
  );
  const canSave = trimmedName.length > 0 && !isDuplicate && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(trimmedName);
    } catch (saveError) {
      console.error("Failed to save look", saveError);
      setError(
        isRename
          ? "Could not rename this look. Please try again."
          : "Could not save this look. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const title = isRename ? "Rename Look" : "Save Look";
  const primaryLabel = saving
    ? isRename
      ? "Renaming..."
      : "Saving..."
    : isRename
    ? "Rename"
    : "Save";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "360px",
          maxWidth: "100%",
          padding: "1rem",
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.panelBackground,
          boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            color: theme.textPrimary,
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          {title}
        </div>

        <input
          autoFocus
          maxLength={MAX_NAME_LENGTH}
          value={name}
          onChange={(event) =>
            setName(event.target.value.slice(0, MAX_NAME_LENGTH))
          }
          placeholder={isRename ? "Look name" : "Name this look"}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "0.65rem 0.75rem",
            borderRadius: "6px",
            border: `1px solid ${isDuplicate ? "#ff6b6b" : theme.border}`,
            backgroundColor: "rgba(0,0,0,0.18)",
            color: theme.textPrimary,
            outline: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.4rem",
            fontSize: "0.8rem",
            color: isDuplicate ? "#ff6b6b" : theme.textMuted,
          }}
        >
          <span>
            {error ||
              (isDuplicate
                ? "Name already exists. Please choose another."
                : "")}
          </span>
          <span>
            {trimmedName.length} / {MAX_NAME_LENGTH}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button style={t.button} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{
              ...t.buttonAccent,
              opacity: canSave ? 1 : 0.4,
              cursor: canSave ? "pointer" : "not-allowed",
            }}
            disabled={!canSave}
            onClick={handleSave}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
