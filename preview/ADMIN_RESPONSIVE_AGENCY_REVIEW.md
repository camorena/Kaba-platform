# Admin responsive agency review (admin15)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** Entire `/admin` shell + dense ops surfaces (quotes, pipeline, invoices, payments, settings, content, pay-adjacent invoice actions)  
**Pass:** reuse **v7b** — high-impact CSS/layout after v7 mail + CMS  
**Evidence:** `preview/admin15-responsive-*.png`

---

## Verdict

**Enterprise-ready for demos on phone / tablet / desktop** after this pass. Core list pages already used table→card patterns; v7b closes the worst remaining gaps (Payments, Price book, topbar crowding, pipeline snap, safe-area, Settings rail affordance, detail action wrapping).

Not a claim of pixel perfection on every obscure breakpoint — remaining polish is listed under Follow-ups.

---

## Scorecard (pass / watch)

| Area | Status | Notes |
|------|--------|--------|
| Mobile drawer | **Pass** | Safe-area, enter/exit, Content nav visible, ⌘K hint |
| Topbar (≤390) | **Pass** | Icon-only brand + sign-out on xs; search icon; EN/ES + theme fit |
| Tables → cards | **Pass** | Quotes, invoices, customers, **payments**, **price book**, CMS lists |
| Pipeline | **Pass** | Horizontal scroll + snap-start columns + overscroll contain |
| Touch targets | **Pass** | `.admin-touch` 44px; Settings chips coarse-pointer min-height |
| Safe-area | **Pass** | Topbar, drawer, main L/R/B, dialogs, detail actions |
| Forms | **Pass** | `field-input` 16px on mobile (no iOS zoom); payment CTAs full-width xs |
| Settings | **Pass** | Sticky horizontal section rail + edge fade; mail + Stripe honesty intact |
| Pay-adjacent admin | **Pass** | Invoice detail actions wrap; copy/share pay link; Payments ledger cards |
| Content CMS | **Pass** | Hub responsive grid; list cards on mobile; edit form max-width |
| EN + es-CO | **Pass** | Shell + Settings ES mobile shot |

---

## Fixes applied (v7b)

1. **Payments** — mobile card list; desktop table from `md`; i18n column headers; full-width record/checkout buttons on xs.  
2. **Price book** — mobile cards with qty + remove; table from `md`.  
3. **Pipeline** — `snap-x` / `snap-start`, overscroll contain, scroll-padding.  
4. **Shell topbar** — hide brand text & sign-out label on xs (icon + `aria-label`); more room for controls.  
5. **Main** — safe-area inset left/right + bottom.  
6. **CSS admin v15** — Settings rail fade, detail-action flex wrap, table-wrap max-width, coarse Settings chips.  
7. **Quote / invoice detail** — `admin-detail-actions` for primary CTA wrapping on phones.

---

## Screenshots

| File | What |
|------|------|
| `admin15-responsive-drawer-mobile.png` | Nav drawer + Content item |
| `admin15-responsive-*-mobile.png` | Dashboard, quotes, payments, settings, content, pipeline @ 390 |
| `admin15-responsive-*-tablet.png` | Same set @ 768 |
| `admin15-responsive-*-desktop.png` | Same set @ 1440 |
| `admin15-responsive-settings-es-mobile.png` | Settings Formal Colombian Spanish |

---

## Follow-ups (not blocking)

| Item | Why later |
|------|-----------|
| Calendar 7-col grid on 320px | Already dense; may need day-list mode |
| Auth banner length on xs | Honest copy; consider collapse-to-one-line + expand |
| Reports charts on narrow | SVG scales; add stacked layout audit |
| Puppeteer shot script | Local only (`scripts/admin15-shots.mjs`); not required in CI |

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3015
# with puppeteer-core + Chrome:
node scripts/admin15-shots.mjs
```

Companion product docs: `preview/REUSE_PORT_v7.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
