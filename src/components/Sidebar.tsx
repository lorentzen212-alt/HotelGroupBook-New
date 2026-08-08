import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

const SIDE_TEXT = "rgba(255,255,255,0.90)";
const SIDE_LINE = "rgba(255,255,255,0.06)";
const GOLD_DEEP = "#A9853A";

export const RAIL_EASE = "cubic-bezier(0.4, 0.0, 0.2, 1)";
export const RAIL_MS = 400;

const PRIMARY_NAV = [
  { label: "Dashboard", icon: CalendarCheck, to: "/" },
  { label: "My Bookings", icon: CalendarDays, to: "/manage-bookings" },
  { label: "Rooming Lists", icon: ClipboardList, to: "/rooming" },
  { label: "Documents", icon: FileText, to: "/documents" },
  { label: "Messages", icon: MessageSquare, to: "/messages" },
];

const SECONDARY_NAV = [
  { label: "Profile", icon: User, to: "/account" },
  { label: "Settings", icon: Settings, to: "/settings" },
  { label: "Support", icon: LifeBuoy, to: "/support" },
];

export function Sidebar({
  active,
  displayName,
  initials,
  email,
  onSignOut,
  collapsed = false,
  showLabels = true,
  onToggle,
}: {
  active: string;
  displayName: string;
  initials: string;
  email: string;
  onSignOut: () => void;
  collapsed?: boolean;
  showLabels?: boolean;
  onToggle?: () => void;
}) {
  const SIDEBAR_LAYERS = [
    "radial-gradient(120% 70% at 108% 92%, rgba(150,178,205,0.30) 0%, rgba(126,155,182,0.16) 26%, rgba(90,116,142,0.06) 52%, rgba(27,38,50,0) 78%)",
    "radial-gradient(150% 95% at 96% 78%, rgba(120,150,178,0.12) 0%, rgba(27,38,50,0) 70%)",
    "radial-gradient(110% 80% at 0% 0%, rgba(9,16,24,0.55) 0%, rgba(9,16,24,0.22) 38%, rgba(9,16,24,0) 72%)",
    "linear-gradient(170deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.05) 100%)",
    "linear-gradient(180deg, #1B2632 0%, #1D2937 46%, #202D3B 100%)",
  ].join(", ");

  const renderItem = (item: { label: string; icon: typeof User; to: string }) => {
    const isActive = item.label === active;
    const style: React.CSSProperties = {
      background: isActive ? "rgba(255,255,255,0.16)" : "transparent",
      color: "rgba(255,255,255,0.90)",
      fontWeight: isActive ? 600 : 400,
      boxShadow: isActive ? "0 8px 18px rgba(0,0,0,0.12)" : "none",
      border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "transparent"}`,
      borderRadius: 14,
      padding: collapsed ? "9px 0" : isActive ? "8px 16px" : "9px 16px",
      justifyContent: collapsed ? "center" : "flex-start",
      transition: `padding ${RAIL_MS}ms ${RAIL_EASE}, background-color 220ms ease, box-shadow 220ms ease, transform 220ms ease, color 220ms ease`,
    };
    return (
      <Link
        key={item.label}
        to={item.to as never}
        className={`hgb-side-item hgb-rail-item group relative flex w-full items-center rounded-[14px] text-left text-[13.5px] ${
          collapsed ? "gap-0" : "gap-3"
        }`}
        style={style}
      >
        {isActive && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[6px] top-[9px] bottom-[9px] w-[2px] rounded-full"
            style={{ background: "#C9B489" }}
          />
        )}
        <item.icon size={17} strokeWidth={1.8} className="shrink-0" style={{ color: "rgba(255,255,255,0.90)" }} />
        <span
          className="hgb-rail-label truncate"
          style={{ opacity: showLabels ? 1 : 0, width: showLabels ? "auto" : 0, overflow: "hidden" }}
        >
          {item.label}
        </span>
        {collapsed && (
          <span className="hgb-rail-tip pointer-events-none" role="tooltip">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`relative flex h-full flex-col py-7 ${collapsed ? "px-[13px]" : "px-4"}`}
      style={{
        backgroundImage: SIDEBAR_LAYERS,
        boxShadow:
          "inset -1px 0 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08), 1px 0 30px -16px rgba(20,28,36,0.28)",
        transition: `padding ${RAIL_MS}ms ${RAIL_EASE}`,
      }}
    >
      <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2 px-3"}`}>
        <Link to="/" className="block min-w-0 py-2" aria-label="HotelGroupBook">
          {collapsed ? (
            <span
              className="grid h-9 w-9 place-items-center rounded-[12px] text-[12.5px] font-semibold tracking-[0.06em]"
              style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)" }}
            >
              HGB
            </span>
          ) : (
            <span
              className="text-[19px] font-semibold tracking-[0.01em] text-white"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              HotelGroupBook
            </span>
          )}
        </Link>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            className="hgb-rail-toggle grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
          >
            {collapsed ? <ArrowRight size={15} strokeWidth={1.8} /> : <ArrowLeft size={15} strokeWidth={1.8} />}
          </button>
        )}
      </div>

      <nav className="mt-10 space-y-1.5">{PRIMARY_NAV.map(renderItem)}</nav>

      <div className="mt-auto space-y-1.5 pt-10">{SECONDARY_NAV.map(renderItem)}</div>

      <div
        className={`mt-6 flex items-center gap-3 pt-5 ${collapsed ? "justify-center" : ""}`}
        style={{ borderTop: `1px solid ${SIDE_LINE}` }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: "rgba(169,133,58,0.14)", color: GOLD_DEEP }}
        >
          {initials || "—"}
        </span>
        {!collapsed && (
          <span className="min-w-0 flex-1" style={{ opacity: showLabels ? 1 : 0, transition: "opacity 200ms ease" }}>
            <Link to={"/account" as never} className="block truncate text-[12.5px]" style={{ color: SIDE_TEXT }}>
              {displayName || email}
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px]"
              style={{ color: GOLD_DEEP }}
            >
              <LogOut size={12} /> Log out
            </button>
          </span>
        )}
      </div>
    </div>
  );
}