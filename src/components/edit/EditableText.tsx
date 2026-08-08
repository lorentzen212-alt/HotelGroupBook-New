import { useEffect, useRef, useState, type ElementType } from "react";

import { cn } from "@/lib/utils";
import { useEditMode } from "./EditModeProvider";

type EditableTextProps = {
  contentKey: string;
  value: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Optional custom renderer for the (possibly overridden) value when not editing. */
  render?: (value: string) => React.ReactNode;
};

export function EditableText({
  contentKey,
  value,
  as,
  multiline = false,
  className,
  style,
  render,
}: EditableTextProps) {
  const { editing, getValue, setDraft, registerType } = useEditMode();
  const Tag = (as ?? "span") as ElementType;
  const current = getValue(contentKey, value);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    registerType(contentKey, "text");
  }, [contentKey, registerType]);

  useEffect(() => {
    if (!editing) setActive(false);
  }, [editing]);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [active]);

  if (editing && active) {
    const shared = {
      ref: ref as never,
      value: current,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
        setDraft(contentKey, e.target.value),
      onBlur: () => setActive(false),
      className: cn(
        className,
        "w-full resize-none bg-transparent outline-none ring-1 ring-[#E2B473]/60 rounded-[3px]",
      ),
      style: { ...style, boxShadow: "0 0 0 4px rgba(226,180,115,0.08)" } as React.CSSProperties,
    };
    return multiline ? (
      <textarea
        {...shared}
        rows={Math.max(2, current.split("\n").length)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setActive(false);
        }}
      />
    ) : (
      <input
        {...shared}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") setActive(false);
        }}
      />
    );
  }

  return (
    <Tag
      className={cn(className, editing && "editable-target")}
      style={style}
      {...(editing
        ? {
            role: "button",
            tabIndex: 0,
            onClick: () => setActive(true),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter") setActive(true);
            },
          }
        : {})}
    >
      {render ? render(current) : current}
    </Tag>
  );
}