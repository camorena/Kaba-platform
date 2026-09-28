# Kaba Fence Admin — Agency Review (v9)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** Formal Colombian Spanish (es-CO, usted) copy audit + admin chrome polish  
**Live reference:** https://kaba-fence.vercel.app/admin  
**Constraints honored:** no DB / Stripe / new paid deps

---

## Copy verdict

**Pass with polish applied.** The admin Spanish dictionary is now enterprise-grade Formal Colombian Spanish: usted throughout, consistent domain terms (cotización, factura, cliente, pago, pipeline, cartera, recaudado), shorter microcopy, and fewer EN→ES calques. Hardcoded English on quote/invoice detail and price book was wired through i18n so ES locale no longer leaks EN chrome on those surfaces.

### Top issues fixed

1. **Calques / awkward EN→ES** — e.g. “Pulse” → “Presione”; “almacén en memoria” → “datos / almacenamiento en memoria”; login headline “con refinamiento” → “con elegancia”; “Estado masivo” → “Cambio masivo de estado”.
2. **Terminology consistency** — Pipeline kept as LatAm B2B loanword in nav/pages; “embudo” reserved for conversion funnel charts; partidas for invoice/price-book line items; lista de precios / cartera / recaudado / tasa de cierre aligned.
3. **Usted + CO norms** — Reemplácela / Ingrese / Inténtelo / Presione / Elija / Seleccione; no vosotros; Mexico/Spain slang avoided.
4. **Pluralization** — `selected` / `selected_plural`, `scheduledHint` / `_plural` (removed awkward “agendada(s)”).
5. **Hardcoded EN gaps** — Quote detail, invoice detail, price book toasts/labels/columns, and Select placeholders now use `t(...)`.
6. **Status badges on detail** — Detail pages now show localized status labels (not raw EN enum strings).

### Remaining copy gaps

1. **Template bodies** (`templates-data.ts`) remain English product content (US NC demo). Acceptable for now; localize when SMS/email go live for ES operators.
2. **Demo seed data** (names, services, cities) stays English — expected for US demo tenant.
3. **Long settings/auth disclosures** still dense by design (honest stub transparency); could later split into short UI + “Ver detalles”.
4. **Print letterhead** on invoices still bilingual-leaning in a few print-only strings if locale drifts mid-session (cookie/localStorage).

---

## Design verdict

**Pass — craft within admin v7 tokens.** No redesign. Targeted polish to hierarchy, focus, active states, drawer, auth banner, and table density. Dark mode and mobile drawer hold against Materials/About gold–charcoal–cream craft.

### Top issues fixed

1. **Focus-visible** on nav links, chips, search trigger, and touch targets (bronze outline).
2. **Dark active nav** — stronger bronze wash + inset ring so current page reads clearly.
3. **Auth banner** — left bronze/amber rail for scanability in light and dark.
4. **Table thead** — slightly stronger bottom border + padding for hierarchy.
5. **Mobile drawer** — backdrop blur + side shadow/gold hairline; active item gold rail retained.
6. **Flow hints** — left bronze accent; login card radius/background aligned to admin panel.
7. **Dense stats** — slightly tighter value size on small screens / dense cards.
8. **Empty-state breathing room** — `.admin-empty` padding tightened for dense pages.

### Remaining design gaps

1. **Topbar tagline** (“Cotizaciones · facturas · operaciones”) can read like secondary nav at a glance — consider shortening or moving under brand only on `sm+`.
2. **KPI sparklines** add noise next to small counts — optional hide under `md` or reserve for reports only.
3. **Sidebar length** (12 items) on short laptops needs scroll; grouping (Ventas / Finanzas / Ops) would help without a redesign.
4. **Notification stub** still English-seeded content inside ES shell (titles are localized; demo names remain EN).

---

## Priority next steps (max 8)

1. Wire Auth.js/Clerk + roles; remove password-cookie stub before live PII.
2. Persist quotes/invoices/payments (Postgres + Drizzle/Prisma); end cold-start resets.
3. Localize or bilingualize follow-up templates when messaging ships for ES operators.
4. Group sidebar nav (Ventas / Finanzas / Operaciones) for density.
5. Soften or collapse the always-on auth warning once real auth lands.
6. Add thead sticky on long quote/invoice tables for mobile scan.
7. Optional: locale-aware number/date formatting (es-CO) beyond status labels.
8. Stripe deposits + webhooks when ready — keep Payments UI as ledger shell until then.

---

## Screenshots

| File | Surface |
|------|---------|
| `preview/admin9-review-login-es.png` | Login (ES, light) |
| `preview/admin9-review-dashboard-es.png` | Panel (ES, light) |
| `preview/admin9-review-quotes-es.png` | Cotizaciones (ES, light) |
| `preview/admin9-review-dashboard-dark-es.png` | Panel (ES, dark) |
| `preview/admin9-review-mobile-drawer-es.png` | Mobile drawer (ES) |

---

## Files touched (summary)

- `src/lib/admin/i18n/es.ts` — Formal Colombian Spanish rewrite + new keys  
- `src/lib/admin/i18n/en.ts` — aligned keys + light UX wording polish  
- `src/components/admin/QuoteDetailClient.tsx` — i18n wiring + localized badges  
- `src/components/admin/InvoiceDetailClient.tsx` — i18n wiring + localized badges  
- `src/components/admin/PriceBookPanel.tsx` — i18n wiring  
- `src/components/admin/InvoicesPanel.tsx` / `PaymentsPanel.tsx` — Select placeholder  
- `src/app/globals.css` — admin v9 chrome polish  
