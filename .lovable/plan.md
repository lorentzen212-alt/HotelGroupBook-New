# Kode: "Active Bookings"-raden + søk/filter-raden

De to radene fra `/manage-bookings` i dette prosjektet, klare til å limes inn i Hotel Group Direct. Jeg kan lese det prosjektet, men ikke skrive til det — så koden må inn manuelt der.

## 1. CSS (src/styles.css)

```css
.hgb-stone-surface {
  background: linear-gradient(180deg, #e3e2dd 0%, #dcdbd6 42%, #d3d5d5 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.06);
}
```

## 2. FilterSelect-komponenten

```tsx
import { ChevronDown } from "lucide-react";

function FilterSelect({ value, onChange, options, label }: {
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
```

## 3. State i sidekomponenten

```tsx
const [scope, setScope] = useState<"active" | "cancelled" | "all">("active");
const [view, setView] = useState<"grid" | "list">("list");
const [query, setQuery] = useState("");
const [status, setStatus] = useState("all");
const [country, setCountry] = useState("all");
const [arrival, setArrival] = useState("all");
```

## 4. Panel + begge radene (JSX)

Ikoner: `Search, Grid2X2, LayoutList, SlidersHorizontal` fra `lucide-react`.

```tsx
<section
  className="hgb-stone-surface relative isolate mt-[18px] overflow-hidden rounded-[22px] p-[22px] sm:p-[26px]"
  style={{
    border: "1px solid rgba(120,116,104,0.22)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.06), 0 26px 60px -28px rgba(6,10,15,0.62)",
  }}
>
  {/* Rad 1 — Active / Cancelled / All */}
  <div className="mb-[14px] flex flex-wrap items-center gap-2">
    {(["active", "cancelled", "all"] as const).map((key) => {
      const label = key === "active" ? "Active Bookings" : key === "cancelled" ? "Cancelled Bookings" : "All Bookings";
      const on = scope === key;
      return (
        <button
          key={key}
          type="button"
          aria-pressed={on}
          onClick={() => setScope(key)}
          className="rounded-[10px] px-[15px] py-[8px] text-[13px] font-medium transition-all duration-200"
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

  {/* Rad 2 — søk, filtre, visningsvalg */}
  <div className="mb-[18px] flex flex-col gap-3 md:flex-row md:items-center">
    <div
      className="relative flex min-w-0 flex-1 items-center rounded-[11px]"
      style={{ background: "rgba(255,255,255,0.52)", border: "1px solid rgba(110,106,96,0.20)" }}
    >
      <Search size={17} strokeWidth={1.9} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#7B786C" }} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search bookings..."
        className="w-full bg-transparent py-[11px] pl-[44px] pr-4 text-[14px] outline-none"
        style={{ color: "#2E3138" }}
      />
    </div>

    <FilterSelect label="Status filter" value={status} onChange={setStatus} options={[
      { value: "all", label: "Status" },
      { value: "awaiting", label: "Awaiting Response" },
      { value: "proposal", label: "Proposal Ready" },
      { value: "confirmed", label: "Confirmed" },
    ]} />
    <FilterSelect label="Country filter" value={country} onChange={setCountry} options={[
      { value: "all", label: "Country" },
      { value: "no", label: "Norway" },
      { value: "dk", label: "Denmark" },
      { value: "se", label: "Sweden" },
    ]} />
    <FilterSelect label="Arrival filter" value={arrival} onChange={setArrival} options={[
      { value: "all", label: "Arrival" },
      { value: "upcoming", label: "Upcoming" },
      { value: "this_month", label: "This Month" },
      { value: "next_90", label: "Next 3 Months" },
      { value: "past", label: "Past Stays" },
    ]} />

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
            className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px] transition-all duration-200"
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
        onClick={() => { setQuery(""); setStatus("all"); setCountry("all"); setArrival("all"); }}
        className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px]"
        style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)", color: "#6B6858" }}
      >
        <SlidersHorizontal size={17} strokeWidth={1.9} />
      </button>
    </div>
  </div>

  {/* kortene under */}
  <div className={view === "list" ? "space-y-[14px]" : "grid grid-cols-1 gap-[14px] xl:grid-cols-2"}>
    {/* ... BookingCard ... */}
  </div>
</section>
```

## Fallgruver

- `.hgb-stone-surface` må finnes i det andre prosjektets `styles.css`, ellers blir panelet feil farge.
- Ikke bytt de hardkodede fargeverdiene mot temavariabler i det andre prosjektet — da blir radene ulike.
- Panelet trenger `overflow-hidden` + `rounded-[22px]` for at innholdet skal klippes riktig.

## Neste steg

Vil du heller at jeg bygger dette inn i en fil i dette prosjektet, si hvilken rute — skriving til andre prosjekter er ikke mulig herfra.