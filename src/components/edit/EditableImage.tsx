import { ImageUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useEditMode } from "./EditModeProvider";

type EditableImageProps = {
  contentKey: string;
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

export function EditableImage({
  contentKey,
  src,
  alt,
  className,
  style,
  width,
  height,
  loading,
}: EditableImageProps) {
  const { editing, getValue, setDraft, registerType, uploadImage } = useEditMode();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const current = getValue(contentKey, src);

  useEffect(() => {
    registerType(contentKey, "image");
  }, [contentKey, registerType]);

  const img = (
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
    />
  );

  if (!editing) return img;

  return (
    <>
      {img}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100">
        <div className="absolute inset-0 bg-[#0A0B0D]/35" />
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="pointer-events-auto relative inline-flex items-center gap-2 rounded-md border border-[#E2B473]/50 bg-[#0A0B0D]/85 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#E7D3AE] backdrop-blur-sm transition-colors hover:border-[#E2B473] hover:text-[#F3E3C4]"
        >
          <ImageUp size={13} strokeWidth={1.75} />
          {busy ? "Uploading…" : "Change image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            try {
              const url = await uploadImage(file);
              setDraft(contentKey, url);
            } catch (err) {
              console.error(err);
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>
    </>
  );
}