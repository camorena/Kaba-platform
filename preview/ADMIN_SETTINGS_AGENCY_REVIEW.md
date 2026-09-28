# Kaba Fence Admin — Settings Agency Review (v11)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** Enterprise Settings redesign + Formal Colombian Spanish (es-CO, usted) + light chrome polish  
**Route:** `/admin/settings`  
**Live reference:** https://kaba-fence.vercel.app/admin  
**Constraints honored:** no DB / Stripe / new paid deps; EN+ES i18n; dark/light; Datelica credit; honest stub disclosures

---

## Verdict

**Pass — enterprise Settings layout shipped.** The prior “wall of stub cards” is now a sectioned workspace: sticky section nav (horizontal on mobile, rail on desktop), Profile form with help text + validation + session-save feedback, Appearance controls for language/theme, an elegant Security disclosure, Platform (data + Stripe) cards, and About with ops/craft notes plus Datelica credit. Copy elevated in both EN and Formal Colombian Spanish. Craft stays within admin v7–v10 gold–charcoal–cream tokens.

---

## What was fixed

### Layout & UX
1. **Sectioned enterprise layout** — Profile / Appearance / Security / Platform / About with sticky in-page nav and `IntersectionObserver` active state.
2. **Profile form craft** — avatar initials, session badge, required markers, per-field help text, invalid states, toast + inline “saved for this session” feedback (still session/local stub only).
3. **Appearance** — Language (EN|ES) and Light|Dark theme controls surfaced on Settings (device-local; matches shell toggles).
4. **Security** — Definition-list status rows, configured/missing pill, elegant callout for password rotation (never shown/edited in UI).
5. **Platform** — Data stores + Stripe grouped under one section; honest badges (`In-memory` / `Not connected`).
6. **About** — Ops tools + discovery/craft + scaffold version + Datelica credit preserved.
7. **Auth banner** — Light chrome polish (shield icon + flex inner) while keeping honesty.

### Copy (EN + es-CO)
1. Workspace-oriented page description and meta (`Workspace · preferences` / `Espacio de trabajo · preferencias`).
2. Formal usted throughout ES Settings/profile (Ingrese / Configure / Reemplácela / Rótela).
3. Clearer stub labels without fake security theater (`Stub gate` / `Puerta provisional`, `Session only` / `Solo esta sesión`).
4. Distinct card titles vs nav labels (e.g. Appearance nav → “Language & theme” / “Idioma y tema”).

### Tokens
1. New Settings CSS: sticky nav, definition list, callout, field hints, avatar, inline code, saved indicator — aligned to existing `--admin-*` / bronze craft.

---

## Remaining gaps

1. **Profile is still session-only** — no persistence until Auth.js/Clerk + user records.
2. **Auth remains a shared password cookie** — honest, but must be replaced before live PII.
3. **Data stores remain in-memory** — cold starts reset demo rows on serverless.
4. **Stripe not connected** — Payments ledger is a stub by design.
5. **ThemeToggle topbar aria labels** still English-hardcoded (Settings theme control is localized).
6. **Sidebar length** (12 items) unchanged — grouping still a future chrome win (out of Settings scope).

---

## Priority next steps (max 8)

1. Wire Auth.js/Clerk + roles; remove password-cookie stub before live PII.
2. Persist operator profile against real user records.
3. Postgres/SQLite for quotes/invoices/payments; end cold-start resets.
4. Localize ThemeToggle `aria-label` / `title` via i18n.
5. Optional: collapse Security details behind “Ver detalles” for denser first glance.
6. Optional: locale-aware phone/email formatting (es-CO) on profile fields.
7. Group sidebar nav (Ventas / Finanzas / Operaciones).
8. Stripe deposits + webhooks when ready — keep Payments UI as ledger shell until then.

---

## Screenshots

| File | Surface |
|------|---------|
| `preview/admin11-settings-en.png` | Settings EN, light, desktop |
| `preview/admin11-settings-es.png` | Settings ES (es-CO), light, desktop |
| `preview/admin11-settings-dark.png` | Settings EN, dark, desktop |
| `preview/admin11-settings-mobile-es.png` | Settings ES, light, mobile |

---

## Files touched (summary)

- `src/components/admin/SettingsClient.tsx` — enterprise section layout + sticky nav  
- `src/components/admin/SettingsProfile.tsx` — elevated form UX  
- `src/components/admin/SettingsAppearance.tsx` — language + theme  
- `src/components/admin/AdminShell.tsx` — auth banner polish  
- `src/lib/admin/i18n/en.ts` / `es.ts` — Settings + profile copy  
- `src/app/globals.css` — Settings v11 tokens + banner inner  
- `preview/ADMIN_SETTINGS_AGENCY_REVIEW.md` — this review  
- `preview/admin11-settings-*.png` — capture set  
