import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Check,
  ChevronDown,
  FileSignature,
  Grid2X2,
  Hourglass,
  LayoutList,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { BookingCard, type Booking } from "@/components/BookingCard";
import heroLobby from "@/assets/card-manage-concierge.png";
import imgBergen from "@/assets/dest-bergen.jpg";
import imgCopenhagen from "@/assets/dest-copenhagen.jpg";

export const Route = createFileRoute("/manage-bookings")({
  component: ManageBookings,
  head: () => ({
    meta: [
      { title: "My Bookings — HotelGroupBook" },
      {
        name: "description",
        content:
          "Track every group hotel booking in one place: awaiting responses, proposals ready and confirmed stays.",
      },
      { property: "og:title", content: "My Bookings — HotelGroupBook" },
      {
        property: "og:description",
        content: "Stay on top of every group, every stay, with live status tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const GOLD = "#E3A23C";
const GOLD_SOFT = "#F2C46A";

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    reference: "HGB-2026-00104",
    type: "leisure",
    name: "Bergen Group Stay",
    destination: "Bergen, NO",
    nights: 0,
    rooms: 81,
    guests: 25,
    status: "hotel_sourcing",
    statusNote: "Request received — sourcing hotels",
    image: imgBergen,
  },
  {
    id: "2",
    reference: "HGB-2026-00106",
    hotelReference: "Radisson Collection Royal Hotel",
    type: "leisure",
    name: "Oslo Winter Conference",
    destination: "Copenhagen, DK",
    startDate: "10 Feb",
    endDate: "15 Feb 2026",
    nights: 3,
    rooms: 45,
    guests: 88,
    status: "confirmed",
    statusNote: "Confirmed — welcome pack sent",
    image: imgCopenhagen,
  },
];

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div
      className="group relative flex min-w-0 flex-1 items-center rounded-[11px] md:w-[168px] md:flex-none"
      style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)" }}
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent py-[12px] pl-4 pr-10 text-left text-[14px] outline-none"
        style={{ color: "#3B3B34", letterSpacing: "0.005em" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#FBF9F4", color: "#2C3038" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={17} strokeWidth={1.8} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#6B6858" }} />
    </div>
  );
}

function StatTile({
  label,
  count,
  icon,
  active,
  action,
  onClick,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
  action?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative flex h-[84px] w-full items-center gap-[14px] overflow-hidden rounded-[12px] px-[18px] text-left transition-transform hover:-translate-y-px"
      style={{
        background: "linear-gradient(180deg, #2B3746 0%, #232E3B 100%)",
        border: `1px solid ${active || action ? "rgba(226,190,110,0.75)" : "rgba(255,255,255,0.09)"}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 34px rgba(0,0,0,0.30)",
      }}
    >
      {action && (
        <span
          className="absolute right-[14px] top-[12px] inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] text-[11px]"
          style={{ color: "#E9CB8C", border: "1px solid rgba(226,190,110,0.5)", background: "rgba(226,190,110,0.08)" }}
        >
          action
        </span>
      )}
      <span className="shrink-0" style={{ color: active || action ? "#E2BE6E" : "#9FB0BF" }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[30px] leading-none" style={{ color: "#F3F1EB", fontFamily: SERIF }}>
          {count}
        </span>
        <span className="mt-[4px] block truncate text-[13px]" style={{ color: "#B9C6D2" }}>
          {label}
        </span>
      </span>
    </button>
  );
}

function ManageBookings() {
  const [collapsed, setCollapsed] = useState(false);
  const [scope, setScope] = useState<"active" | "cancelled" | "all">("active");
  const [view, setView] = useState<"grid" | "list">("list");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [arrival, setArrival] = useState("all");

  const bookings = SAMPLE_BOOKINGS;
  const counts = useMemo(
    () => ({
      awaiting: bookings.filter((b) => b.status === "request_submitted" || b.status === "hotel_sourcing").length,
      proposal: bookings.filter((b) => b.status === "offers_ready").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
    }),
    [bookings],
  );

  const filtered = bookings.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #6A737B 0%, #646D75 35%, #5F6870 100%)" }}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block" style={{ width: collapsed ? 76 : 240 }}>
        <Sidebar
          active="My Bookings"
          displayName="Nicklas Lorentzen"
          initials="NL"
          email="nicklas@example.com"
          onSignOut={() => {}}
          collapsed={collapsed}
          showLabels={!collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      <main className="hgb-rail-shift relative min-h-screen" style={{ ["--rail-w" as string]: `${collapsed ? 76 : 240}px` }}>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[180px] sm:h-[220px] lg:h-[248px]"
          aria-hidden
          style={{
            maskImage: "linear-gradient(180deg, #000 0%, #000 calc(100% - 60px), rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 calc(100% - 60px), rgba(0,0,0,0) 100%)",
          }}
        >
          <img src={heroLobby} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(6,10,15,0.42) 0%, rgba(6,10,15,0.18) 45%, rgba(6,10,15,0.34) 100%)" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-[1580px] px-4 pb-8 pt-4 sm:px-6 lg:px-8 xl:px-10">
          <header className="mt-[12px] flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-[34px] leading-[1.02] sm:text-[42px]" style={{ color: "#F1EFE9", fontFamily: SERIF }}>
                My Bookings
              </h1>
              <p className="mt-1 text-[14px]" style={{ color: "#CBD5DF" }}>
                Stay on top of every group, every stay.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-5 lg:flex">
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/5"
                style={{ color: "#E5E9EE" }}
              >
                <Bell size={20} strokeWidth={1.7} />
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-[4px] text-[10.5px] font-semibold"
                  style={{ backgroundColor: GOLD, color: "#20180A" }}
                >
                  2
                </span>
              </button>
              <Link to={"/account" as never} className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 place-items-center overflow-hidden rounded-full text-[13px] font-semibold tracking-[0.06em]"
                  style={{ border: "1px solid rgba(226,190,110,0.45)", color: GOLD_SOFT, backgroundColor: "rgba(10,18,27,0.45)" }}
                >
                  NL
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-[15px]" style={{ color: "#F1EFE9" }}>
                    Nicklas Lorentzen
                  </span>
                  <span className="block truncate text-[12.5px]" style={{ color: "#A9B7C3" }}>
                    Group Coordinator
                  </span>
                </span>
                <ChevronDown size={18} style={{ color: "#A9B7C3" }} />
              </Link>
            </div>
          </header>

          <section className="mt-[20px] grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Awaiting response" count={counts.awaiting} icon={<Hourglass size={24} strokeWidth={1.4} />} active={false} onClick={() => {}} />
            <StatTile label="Proposal ready" count={counts.proposal} icon={<FileSignature size={24} strokeWidth={1.4} />} action active={false} onClick={() => {}} />
            <StatTile label="Confirmed" count={counts.confirmed} icon={<Check size={24} strokeWidth={1.4} />} active={false} onClick={() => {}} />
            <StatTile label="Total bookings" count={bookings.length} icon={<Briefcase size={24} strokeWidth={1.4} />} active={false} onClick={() => {}} />
          </section>

          <section
            className="hgb-stone-surface relative isolate mt-[14px] overflow-hidden rounded-[18px] p-[16px] sm:p-[18px]"
            style={{
              border: "1px solid rgba(120,116,104,0.22)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.06), 0 26px 60px -28px rgba(6,10,15,0.62)",
            }}
          >
            <div className="mb-[10px] flex flex-wrap items-center gap-2">
              {(["active", "cancelled", "all"] as const).map((key) => {
                const label = key === "active" ? "Active Bookings" : key === "cancelled" ? "Cancelled Bookings" : "All Bookings";
                const on = scope === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setScope(key)}
                    className="rounded-[10px] px-[13px] py-[6px] text-[12.5px] font-medium transition-all duration-200"
                    style={
                      on
                        ? {
                            background: "linear-gradient(180deg, rgba(24,33,44,0.94) 0%, rgba(17,25,34,0.94) 100%)",
                            border: "1px solid rgba(197,155,69,0.72)",
                            color: "#E3C583",
                          }
                        : { background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)", color: "#5B5A53" }
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mb-[12px] flex flex-col gap-2.5 md:flex-row md:items-center">
              <div
                className="relative flex min-w-0 flex-1 items-center rounded-[11px]"
                style={{ background: "rgba(255,255,255,0.52)", border: "1px solid rgba(110,106,96,0.20)" }}
              >
                <Search size={17} strokeWidth={1.9} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#7B786C" }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full bg-transparent py-[9px] pl-[44px] pr-4 text-[13.5px] outline-none"
                  style={{ color: "#2E3138" }}
                />
              </div>
              <FilterSelect
                label="Status filter"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "Status" },
                  { value: "awaiting", label: "Awaiting Response" },
                  { value: "proposal", label: "Proposal Ready" },
                  { value: "confirmed", label: "Confirmed" },
                ]}
              />
              <FilterSelect
                label="Country filter"
                value={country}
                onChange={setCountry}
                options={[
                  { value: "all", label: "Country" },
                  { value: "no", label: "Norway" },
                  { value: "dk", label: "Denmark" },
                  { value: "se", label: "Sweden" },
                ]}
              />
              <FilterSelect
                label="Arrival filter"
                value={arrival}
                onChange={setArrival}
                options={[
                  { value: "all", label: "Arrival" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "this_month", label: "This Month" },
                  { value: "next_90", label: "Next 3 Months" },
                  { value: "past", label: "Past Stays" },
                ]}
              />

              <div className="flex min-w-0 items-center gap-2.5">
                {([
                  { key: "grid" as const, icon: Grid2X2, label: "Grid view" },
                  { key: "list" as const, icon: LayoutList, label: "List view" },
                ]).map(({ key, icon: Icon, label }) => {
                  const on = view === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={label}
                      aria-pressed={on}
                      onClick={() => setView(key)}
                      className="grid h-[38px] w-[40px] shrink-0 place-items-center rounded-[11px] transition-all duration-200"
                      style={
                        on
                          ? { background: "rgba(255,255,255,0.72)", border: "1px solid rgba(184,142,67,0.7)", color: "#8A6A24" }
                          : { background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)", color: "#6B6858" }
                      }
                    >
                      <Icon size={17} strokeWidth={1.9} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="More filters"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                    setCountry("all");
                    setArrival("all");
                  }}
                  className="grid h-[38px] w-[40px] shrink-0 place-items-center rounded-[11px]"
                  style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)", color: "#6B6858" }}
                >
                  <SlidersHorizontal size={17} strokeWidth={1.9} />
                </button>
              </div>
            </div>

            <div className={view === "list" ? "space-y-[10px]" : "grid grid-cols-1 gap-[10px] xl:grid-cols-2"}>
              {filtered.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}