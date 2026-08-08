import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

const NAVY = "#08131F";
const GOLD = "#D4A64A";
const GOLD_SOFT = "#E8C775";
const IVORY = "#F5F1E6";

export interface SiteMenuItem {
  label: string;
  to?: string;
  href?: string;
}

interface SiteMenuProps {
  items: SiteMenuItem[];
  /** Style of the trigger button. "outline" = premium gold outline pill (homepage). */
  variant?: "outline" | "ghost";
}

export function SiteMenu({ items, variant = "outline" }: SiteMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const triggerClass =
    variant === "outline"
      ? "inline-flex items-center justify-center gap-3 rounded-full border px-[26px] py-2 text-[14px] leading-none tracking-[0.14em] transition-all hover:border-[color:var(--gold-soft)] hover:text-[color:var(--gold-soft)]"
      : "ml-auto flex shrink-0 items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-white/5";


  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={triggerClass}
        style={
          variant === "outline"
            ? {
                borderColor: `${GOLD}80`,
                color: IVORY,
                background: "rgba(2, 12, 20, 0.35)",
                ["--gold-soft" as never]: GOLD_SOFT,
              }
            : undefined
        }
      >
        <span className="flex flex-col items-center justify-center gap-[5px]">
          <span className="h-px w-6" style={{ background: GOLD }} />
          <span className="h-px w-6" style={{ background: GOLD }} />
          <span className="h-px w-6" style={{ background: GOLD }} />
        </span>
        <span
          className="text-[13px] leading-none tracking-[0.18em]"
          style={{ color: IVORY, transform: "translateY(0.5px)" }}
        >
          Menu
        </span>

      </button>

      {/* Overlay */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(4,10,18,0.55)" }}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[100] flex h-full w-[86vw] max-w-[380px] flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: `linear-gradient(180deg, #0B1826 0%, ${NAVY} 100%)`,
          borderLeft: `1px solid ${GOLD}55`,
          boxShadow: "-24px 0 60px -20px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex items-center justify-between px-7 pt-8">
          <span
            className="text-[12px] tracking-[0.32em]"
            style={{ color: GOLD, fontWeight: 600 }}
          >
            MENU
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/5"
            style={{ color: GOLD, border: `1px solid ${GOLD}55` }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="mx-7 mt-5 h-px"
          style={{ background: `linear-gradient(90deg, ${GOLD}00, ${GOLD}88, ${GOLD}00)` }}
        />
        <nav className="mt-3 flex flex-col px-3">
          {items.map((item, i) => {
            const content = (
              <span
                className="text-[15px] tracking-[0.02em] transition-colors"
                style={{ color: IVORY }}
              >
                {item.label}
              </span>
            );
            return (
              <div key={item.label}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-lg px-4 py-3.5 transition-all hover:translate-x-1 hover:bg-white/[0.03]"
                  >
                    <span className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />
                    {content}
                  </Link>
                ) : (
                  <a
                    href={item.href ?? "#"}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-lg px-4 py-3.5 transition-all hover:translate-x-1 hover:bg-white/[0.03]"
                  >
                    <span className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />
                    {content}
                  </a>
                )}
                {i < items.length - 1 && (
                  <div
                    className="mx-4 h-px"
                    style={{ background: "rgba(245,241,230,0.06)" }}
                  />
                )}
              </div>
            );
          })}
        </nav>
        <div
          className="mx-7 mt-6 h-px"
          style={{ background: `linear-gradient(90deg, ${GOLD}00, ${GOLD}55, ${GOLD}00)` }}
        />
        <div className="mt-auto px-7 pb-8 pt-6">
          <p
            className="text-[11.5px] tracking-[0.14em]"
            style={{ color: "rgba(245,241,230,0.55)" }}
          >
            HOTELGROUPBOOK · SCANDINAVIA
          </p>
        </div>
      </aside>
    </>
  );
}
