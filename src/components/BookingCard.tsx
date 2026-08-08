import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BedDouble,
  Calendar as CalendarDays,
  Check,
  ClipboardList,
  Mail,
  MapPin,
  MoreVertical,
  Moon,
  Search,
  Users,
} from "lucide-react";

const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const CHAMPAGNE = "#EEBE44";
const CHAMPAGNE_LINE = "rgba(238,190,68,0.35)";
const IVORY = "#ECE7DF";
const PEARL = "#F4F1EA";
const MUTED = "#7F8F9C";
const GOLD_BRUSHED_H =
  "linear-gradient(140deg, #B88E43 0%, #C8A55A 18%, #E2C984 38%, #EBD7A2 50%, #E2C984 62%, #C8A55A 82%, #B88E43 100%)";

export type BookingStatus = "request_submitted" | "hotel_sourcing" | "offers_ready" | "confirmed";

export interface Booking {
  id: string;
  reference: string;
  hotelReference?: string;
  type: "leisure" | "me";
  name: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  nights: number;
  rooms?: number;
  guests?: number;
  status: BookingStatus;
  statusNote?: string;
  image: string;
}

const GROUP_LABEL: Record<string, string> = {
  awaiting: "Awaiting Response",
  proposal: "Proposal Ready",
  confirmed: "Confirmed",
};
const GROUP_COLOR: Record<string, string> = {
  awaiting: "#5A88E8",
  proposal: CHAMPAGNE,
  confirmed: "#6DBB83",
};

function groupOf(status: BookingStatus) {
  if (status === "request_submitted" || status === "hotel_sourcing") return "awaiting";
  if (status === "offers_ready") return "proposal";
  return "confirmed";
}

const TRACK_STEPS = [
  { key: "received", label: "Request\nreceived", icon: Mail },
  { key: "sourcing", label: "Hotels\nsourcing", icon: Search },
  { key: "proposal", label: "Proposal\nready", icon: ClipboardList },
  { key: "confirmed", label: "Confirmed", icon: Check },
] as const;

function trackIndex(status: BookingStatus) {
  switch (status) {
    case "request_submitted":
      return 0;
    case "hotel_sourcing":
      return 1;
    case "offers_ready":
      return 2;
    default:
      return 3;
  }
}

function Timeline({ status }: { status: BookingStatus }) {
  const active = trackIndex(status);
  return (
    <div className="relative grid grid-cols-4 gap-1">
      <div
        className="absolute left-[12.5%] right-[12.5%] top-[16px]"
        style={{ height: "0.5px", backgroundColor: "rgba(255,255,255,0.054)" }}
      />
      <div
        className="absolute left-[12.5%] top-[16px]"
        style={{
          height: "0.5px",
          width: `${(active / 3) * 75}%`,
          background:
            "linear-gradient(90deg, rgba(216,197,142,0.16) 0%, rgba(216,197,142,0.62) 35%, rgba(226,201,132,0.80) 70%, rgba(235,215,162,0.88) 100%)",
        }}
      />
      {TRACK_STEPS.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s.key} className="relative flex flex-col items-center gap-[7px]">
            <span
              className="relative grid h-[32px] w-[32px] place-items-center rounded-full"
              style={{
                background: current
                  ? "radial-gradient(80% 80% at 50% 28%, rgba(245,220,158,0.17) 0%, rgba(13,20,32,0.96) 100%)"
                  : "linear-gradient(180deg, rgba(20,28,40,0.96) 0%, rgba(13,20,32,0.96) 100%)",
                border: `1px solid ${current ? "rgba(216,197,142,0.85)" : done ? "rgba(236,231,221,0.30)" : "rgba(168,182,199,0.28)"}`,
                color: current ? CHAMPAGNE : done ? IVORY : "#A9B7C6",
                boxShadow: current
                  ? "0 0 6px rgba(216,197,142,0.26), inset 0 1px 0 rgba(255,246,220,0.14), inset 0 -2px 5px rgba(0,0,0,0.42)"
                  : "inset 0 1px 0 rgba(255,255,255,0.045), inset 0 -2px 5px rgba(0,0,0,0.35)",
              }}
            >
              <s.icon size={14} strokeWidth={1.65} />
            </span>
            <span
              className={`whitespace-pre-line text-center text-[12px] font-light leading-[1.25] tracking-[0.01em]${current ? " hgb-champagne-metal" : ""}`}
              style={current ? undefined : { color: done ? IVORY : "#A9B7C6" }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TypeChip({ type }: { type: Booking["type"] }) {
  return (
    <span
      className="inline-flex items-center rounded-[8px] px-[13px] py-[6px] text-[12px] font-semibold uppercase tracking-[0.14em]"
      style={{
        color: "#EEBE44",
        border: `1px solid ${CHAMPAGNE_LINE}`,
        background:
          "linear-gradient(140deg, rgba(184,142,67,0.20) 0%, rgba(216,197,142,0.16) 38%, rgba(235,215,162,0.13) 52%, rgba(184,142,67,0.18) 100%)",
      }}
    >
      {type === "leisure" ? "Leisure" : "M&E"}
    </span>
  );
}

export function BookingCard({ booking }: { booking: Booking }) {
  const g = groupOf(booking.status);
  const tone = GROUP_COLOR[g];

  const metas = [
    { icon: <MapPin size={16} strokeWidth={1.6} />, text: booking.destination },
    {
      icon: <CalendarDays size={16} strokeWidth={1.6} />,
      text: booking.startDate ? `${booking.startDate} – ${booking.endDate}` : "Dates pending",
    },
    { icon: <Moon size={16} strokeWidth={1.6} />, text: `${booking.nights} nights` },
    { icon: <BedDouble size={16} strokeWidth={1.6} />, text: `${booking.rooms ?? 0} rooms` },
    { icon: <Users size={16} strokeWidth={1.6} />, text: `${booking.guests ?? 0} guests` },
  ];

  return (
    <div className="hgb-card-recess">
      <article
        className="hgb-booking-card group relative grid grid-cols-1 items-stretch gap-[18px] overflow-hidden py-[22px] pr-[24px] transition-all duration-300 sm:grid-cols-[230px_minmax(0,1fr)] lg:grid-cols-[258px_minmax(0,1fr)]"
        style={{
          backgroundImage: [
            "radial-gradient(120% 110% at 10% 0%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 32%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.14) 100%)",
            "linear-gradient(158deg, #17222E 0%, #141E29 52%, #111A24 100%)",
          ].join(", "),
          border: "1px solid rgba(255,255,255,0.055)",
          borderLeft: "none",
          borderRadius: 12,
          boxShadow:
            "0 10px 24px rgba(12,16,22,0.34), 0 2px 4px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.055), inset 0 -8px 20px rgba(0,0,0,0.42)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-[2]"
          style={{ width: 17, background: GOLD_BRUSHED_H }}
        />

        <div
          className="relative rounded-[16px] p-[8px] sm:h-full sm:self-stretch"
          style={{
            marginLeft: -10,
            background: "linear-gradient(180deg, #18212C 0%, #131B25 100%)",
            border: "1px solid rgba(255,255,255,0.055)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -4px 12px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="relative h-full overflow-hidden rounded-[8px]"
            style={{ border: "1px solid rgba(0,0,0,0.55)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <img
              src={booking.image}
              alt={booking.destination}
              className="h-[148px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-full"
              style={{ filter: "saturate(0.95) contrast(1.06) brightness(0.84)" }}
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(120% 100% at 50% 50%, rgba(10,17,25,0) 62%, rgba(10,17,25,0.30) 100%)" }}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <TypeChip type={booking.type} />
              <h3
                className="mt-[7px] truncate text-[28px] leading-[1.05] tracking-[0.002em]"
                style={{ color: PEARL, fontFamily: SERIF, fontWeight: 500 }}
              >
                {booking.name}
              </h3>
            </div>
            <div className="flex shrink-0 items-start gap-2">
              <span
                className="mt-1.5 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:inline-flex"
                style={{ color: tone }}
              >
                <span
                  className="inline-block h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: tone, boxShadow: `0 0 0 3px ${tone}1F, 0 0 5px ${tone}80` }}
                />
                {GROUP_LABEL[g]}
              </span>
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5" style={{ color: MUTED }}>
                <MoreVertical size={17} />
              </button>
            </div>
          </div>

          <div className="mt-[9px] flex flex-wrap items-center gap-[7px]">
            {metas.map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-[9px] whitespace-nowrap rounded-[5px] px-[12px] py-[5px] text-[13px] font-light"
                style={{
                  color: "#E6EDF3",
                  border: "1px solid rgba(255,255,255,0.055)",
                  background: "linear-gradient(180deg, #1C2632 0%, #161E29 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.085), 0 1px 1px rgba(0,0,0,0.34), 0 2px 4px rgba(0,0,0,0.22)",
                }}
              >
                <span className="shrink-0" style={{ color: CHAMPAGNE }}>
                  {m.icon}
                </span>
                {m.text}
              </span>
            ))}
          </div>

          <div
            className="mt-[8px] grid grid-cols-1 overflow-hidden rounded-[8px] sm:grid-cols-2"
            style={{
              border: "1px solid rgba(255,255,255,0.055)",
              background: "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.09) 100%)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.22), inset 0 -1px 0 rgba(255,255,255,0.035), 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="px-[20px] py-[8px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: CHAMPAGNE }}>
                Your reference
              </p>
              <p className="mt-[3px] text-[17px] leading-none" style={{ color: IVORY }}>
                {booking.reference}
              </p>
            </div>
            <div className="px-[20px] py-[8px]" style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: CHAMPAGNE }}>
                Hotel reference
              </p>
              <p className="mt-[3px] text-[17px] leading-none" style={{ color: booking.hotelReference ? IVORY : "#93A5B2" }}>
                {booking.hotelReference ?? "Pending"}
              </p>
            </div>
          </div>

          <div className="mt-[10px]">
            <Timeline status={booking.status} />
          </div>

          <div
            className="mt-[9px] flex flex-nowrap items-center justify-between gap-4 pt-[8px]"
            style={{ borderTop: "1px solid rgba(255,255,255,0.038)" }}
          >
            <p className="min-w-0 flex-1 truncate text-[14px] font-light" style={{ color: "#AFC0CD" }}>
              {booking.statusNote ?? ""}
            </p>
            <Link
              {...({ to: `/bookings/${booking.id}` } as never)}
              className="hgb-view-btn hgb-gold-sheen group/btn relative inline-flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-[8px] px-[20px] py-[9px] text-[15px]"
              style={{
                color: "#E4D3A2",
                border: "1.5px solid transparent",
                background: `linear-gradient(180deg, #1A2330 0%, #131C27 100%) padding-box, ${GOLD_BRUSHED_H} border-box`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.45), 0 0 12px rgba(216,197,142,0.14), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <span className="hgb-champagne-metal">View status</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-[3px]" style={{ color: CHAMPAGNE }} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}