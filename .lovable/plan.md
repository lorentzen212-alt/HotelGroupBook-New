# Gullinjen (venstre gullkant) — eksakt kode

Gullstripen på bookingkortet består av tre deler som må kopieres nøyaktig for at den skal se 100 % lik ut.

## 1. Gradienten

```ts
const GOLD_BRUSHED_H =
  "linear-gradient(140deg, #B88E43 0%, #C8A55A 18%, #E2C984 38%, #EBD7A2 50%, #E2C984 62%, #C8A55A 82%, #B88E43 100%)";
```

## 2. Selve stripen

Ligger inne i kortets `<article>`, som må ha `position: relative` og `overflow: hidden`.

```tsx
<span
  aria-hidden
  className="pointer-events-none absolute left-0 top-0 bottom-0 z-[2]"
  style={{ width: 17, background: GOLD_BRUSHED_H }}
/>
```

## 3. Kortet rundt (det som gjør at stripen ligger helt i kanten)

```css
/* src/styles.css */
.hgb-booking-card {
  --insert-w: 17px;
  padding-left: calc(var(--insert-w) + 33px);
}

.hgb-card-recess {
  position: relative;
  padding: 4px;
  border-radius: 16px;
  background-color: #3f464e;
  background-image:
    linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 38%),
    linear-gradient(340deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0) 42%);
  box-shadow:
    inset 0 2px 1px -1px rgba(255,255,255,0.1),
    inset 2px 0 1px -1px rgba(255,255,255,0.055),
    inset 0 -2px 1px -1px rgba(0,0,0,0.42),
    inset -2px 0 1px -1px rgba(0,0,0,0.3),
    inset 0 4px 8px -2px rgba(0,0,0,0.38),
    inset 0 -3px 7px -3px rgba(0,0,0,0.22),
    0 1px 0 rgba(255,255,255,0.045);
}
.hgb-card-recess > * {
  position: relative;
  border-radius: 12px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.28), 0 2px 6px -3px rgba(0,0,0,0.3) !important;
}
```

## Minimal komplett wrapper

```tsx
<div className="hgb-card-recess">
  <article
    className="hgb-booking-card relative overflow-hidden py-[22px] pr-[24px]"
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
    {/* innhold */}
  </article>
</div>
```

Tre fallgruver: `relative` + `overflow-hidden` på article, `borderLeft: "none"` (ellers får du en lys strek oppå gullet), og at de globale klassene `.hgb-booking-card` / `.hgb-card-recess` finnes på den andre siden også.

## Neste steg

Si hvilken side/komponent kortet skal inn på, så bygger jeg gullinjen inn der direkte i stedet for manuell kopiering.