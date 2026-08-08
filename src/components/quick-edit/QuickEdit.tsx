/**
 * TEMPORARY DESIGN-TIME VISUAL EDITOR — delete before publishing.
 *
 * Removal = delete this folder, remove <QuickEdit /> from src/routes/index.tsx
 * and remove any data-qe="..." attributes. Nothing else in the app depends on it.
 *
 * No auth, no database, no persistence: edits are live inline styles on the DOM
 * node and disappear on reload.
 */
import { Check, Pencil, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const HOVER_CSS = `
[data-qe]{outline:1px dashed rgba(226,180,115,.35);outline-offset:2px;cursor:pointer}
[data-qe]:hover{outline:1px solid rgba(226,180,115,.9);background-color:rgba(226,180,115,.06)}
[data-qe][data-qe-selected]{outline:2px solid #E2B473}
`;

const BTN =
  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors duration-300 border-[#E2B473]/45 bg-[#0A0B0D]/75 text-[#E7D3AE] hover:border-[#E2B473] hover:text-[#F3E3C4]";

type Rect = { top: number; left: number; width: number; height: number };

function rectOf(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function QuickEdit() {
  const [on, setOn] = useState(false);
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [, force] = useState(0);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // inject / remove hover styles
  useEffect(() => {
    if (!on) return;
    const s = document.createElement("style");
    s.textContent = HOVER_CSS;
    document.head.appendChild(s);
    styleRef.current = s;
    return () => {
      s.remove();
      styleRef.current = null;
    };
  }, [on]);

  const deselect = useCallback(() => {
    setEl((prev) => {
      if (prev) {
        prev.removeAttribute("data-qe-selected");
        prev.removeAttribute("contenteditable");
      }
      return null;
    });
    setRect(null);
  }, []);

  useEffect(() => {
    if (!on) {
      deselect();
      return;
    }
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        "[data-qe]",
      ) as HTMLElement | null;
      if ((e.target as HTMLElement | null)?.closest?.("[data-qe-panel]")) return;
      e.preventDefault();
      e.stopPropagation();
      if (!target) {
        deselect();
        return;
      }
      setEl((prev) => {
        if (prev && prev !== target) {
          prev.removeAttribute("data-qe-selected");
          prev.removeAttribute("contenteditable");
        }
        target.setAttribute("data-qe-selected", "");
        return target;
      });
      setRect(rectOf(target));
    };
    document.addEventListener("click", onClick, true);
    const sync = () => setEl((p) => (p ? (setRect(rectOf(p)), p) : p));
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [on, deselect]);

  const set = (prop: string, value: string) => {
    if (!el) return;
    el.style.setProperty(prop, value);
    setRect(rectOf(el));
    force((n) => n + 1);
  };

  const computed = el ? window.getComputedStyle(el) : null;
  const isImage = el?.tagName === "IMG";

  return (
    <>
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex items-center gap-2 sm:right-6 sm:top-6">
        <button
          type="button"
          className={`pointer-events-auto ${BTN}`}
          onClick={() => setOn((v) => !v)}
        >
          {on ? <Check size={13} strokeWidth={1.75} /> : <Pencil size={13} strokeWidth={1.75} />}
          {on ? "Done" : "Edit"}
        </button>
      </div>

      {on && el && rect && (
        <div
          data-qe-panel
          className="fixed z-[90] w-[260px] rounded-lg border border-[#E2B473]/40 bg-[#0A0B0D]/95 p-3 text-[11px] text-[#E7D3AE] shadow-[0_20px_50px_rgba(0,0,0,.55)] backdrop-blur-md"
          style={{
            top: Math.min(Math.max(rect.top, 12), window.innerHeight - 380),
            left: Math.min(rect.left + rect.width + 14, window.innerWidth - 276),
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="uppercase tracking-[0.18em] text-[10px] text-white/60">
              {el.getAttribute("data-qe") || el.tagName.toLowerCase()}
            </span>
            <button type="button" onClick={deselect} className="text-white/50 hover:text-white">
              <X size={13} />
            </button>
          </div>

          {!isImage && (
            <Row label="Text">
              <textarea
                rows={3}
                value={el.innerText}
                onChange={(e) => {
                  el.innerText = e.target.value;
                  setRect(rectOf(el));
                  force((n) => n + 1);
                }}
                className="w-full resize-none rounded border border-white/15 bg-white/5 p-1.5 text-[11px] text-white outline-none focus:border-[#E2B473]/70"
              />
            </Row>
          )}

          {!isImage && (
            <>
              <Row label="Font size">
                <input
                  type="range"
                  min={10}
                  max={120}
                  value={parseFloat(computed?.fontSize || "16")}
                  onChange={(e) => set("font-size", `${e.target.value}px`)}
                  className="w-full accent-[#E2B473]"
                />
                <span className="w-10 text-right text-white/60">
                  {Math.round(parseFloat(computed?.fontSize || "16"))}px
                </span>
              </Row>
              <Row label="Text color">
                <input
                  type="color"
                  value={rgbToHex(computed?.color)}
                  onChange={(e) => set("color", e.target.value)}
                  className="h-6 w-10 rounded border border-white/15 bg-transparent"
                />
              </Row>
            </>
          )}

          <Row label="Background">
            <input
              type="color"
              value={rgbToHex(computed?.backgroundColor)}
              onChange={(e) => set("background-color", e.target.value)}
              className="h-6 w-10 rounded border border-white/15 bg-transparent"
            />
            <button
              type="button"
              onClick={() => set("background-color", "transparent")}
              className="ml-auto text-white/50 hover:text-white"
            >
              clear
            </button>
          </Row>

          <Row label="Width">
            <input
              type="range"
              min={40}
              max={1600}
              value={Math.round(rect.width)}
              onChange={(e) => set("width", `${e.target.value}px`)}
              className="w-full accent-[#E2B473]"
            />
            <span className="w-12 text-right text-white/60">{Math.round(rect.width)}</span>
          </Row>
          <Row label="Height">
            <input
              type="range"
              min={20}
              max={1200}
              value={Math.round(rect.height)}
              onChange={(e) => set("height", `${e.target.value}px`)}
              className="w-full accent-[#E2B473]"
            />
            <span className="w-12 text-right text-white/60">{Math.round(rect.height)}</span>
          </Row>

          <Row label="Padding">
            <input
              type="range"
              min={0}
              max={120}
              value={parseFloat(computed?.paddingTop || "0")}
              onChange={(e) => set("padding", `${e.target.value}px`)}
              className="w-full accent-[#E2B473]"
            />
          </Row>
          <Row label="Margin top">
            <input
              type="range"
              min={-120}
              max={200}
              value={parseFloat(computed?.marginTop || "0")}
              onChange={(e) => set("margin-top", `${e.target.value}px`)}
              className="w-full accent-[#E2B473]"
            />
          </Row>
          <Row label="Nudge X">
            <input
              type="range"
              min={-200}
              max={200}
              value={parseFloat(computed?.marginLeft || "0")}
              onChange={(e) => set("margin-left", `${e.target.value}px`)}
              className="w-full accent-[#E2B473]"
            />
          </Row>

          {isImage && (
            <Row label="Image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && el) (el as HTMLImageElement).src = URL.createObjectURL(f);
                }}
                className="w-full text-[10px] text-white/60"
              />
            </Row>
          )}

          <button
            type="button"
            onClick={() => {
              el.removeAttribute("style");
              setRect(rectOf(el));
              force((n) => n + 1);
            }}
            className="mt-2 w-full rounded border border-white/15 py-1 text-[10px] uppercase tracking-[0.18em] text-white/60 hover:border-white/35 hover:text-white"
          >
            Reset styles
          </button>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function rgbToHex(value?: string | null) {
  if (!value) return "#000000";
  const m = value.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Number(n).toString(16).padStart(2, "0"))
      .join("")
  );
}
