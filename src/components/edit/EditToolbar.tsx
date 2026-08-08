import { Check, Pencil } from "lucide-react";
import { useState } from "react";

import { useEditMode } from "./EditModeProvider";

const BASE =
  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors duration-300";

export function EditToolbar() {
  const { isAdmin, editing, dirty, saving, startEditing, stopEditing, save, cancel } =
    useEditMode();
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col items-end gap-2 sm:right-6 sm:top-6">
      <div className="pointer-events-auto flex items-center gap-2">
        {editing && dirty && (
          <>
            <button
              type="button"
              onClick={() => {
                cancel();
                setError(null);
              }}
              className={`${BASE} border-white/15 bg-[#0A0B0D]/70 text-white/75 hover:border-white/30 hover:text-white`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                try {
                  await save();
                  setError(null);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Could not save");
                }
              }}
              className={`${BASE} border-[#E2B473]/60 bg-[#0A0B0D]/80 text-[#E7D3AE] hover:border-[#E2B473] hover:text-[#F3E3C4]`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            if (editing) {
              cancel();
              stopEditing();
            } else {
              startEditing();
            }
          }}
          className={`${BASE} border-[#E2B473]/45 bg-[#0A0B0D]/70 text-[#E7D3AE] hover:border-[#E2B473]/80 hover:text-[#F3E3C4]`}
        >
          {editing ? <Check size={13} strokeWidth={1.75} /> : <Pencil size={13} strokeWidth={1.75} />}
          {editing ? "Done" : "Edit"}
        </button>
      </div>
      {error && (
        <p className="pointer-events-auto rounded-md border border-red-400/30 bg-[#0A0B0D]/85 px-3 py-1.5 text-[11px] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}