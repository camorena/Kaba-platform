# Admin launch surfaces — minimal craft (admin19)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** Dashboard, Quotes (list+detail), Invoices (list+detail), Pipeline  
**Prior:** Content admin17 / Settings admin18  
**Evidence:** `preview/admin19-*.png`

---

## Verdict

**Pass.** Ops surfaces read quieter and more minimal while keeping features: soft filters, flat glass (no gold rails), quiet chips, muted footnotes, tighter EN + Formal Colombian Spanish. Brand (gold / charcoal / cream), dark/light, and responsive layouts retained.

---

## What simplified

| Area | Before | After (admin19) |
|------|--------|-----------------|
| Page chrome | Long descriptions | Short description + meta (Ops brief / Leads / Kanban / Billing) |
| Dashboard jumps | Chip pills with → | Soft text toggles |
| Attention / quiet | Amber gradients + loud pills | Flat borders + `admin-settings-chip` |
| Glass panels | `admin-gold-rail` | Flat glass |
| Quote/invoice filters | `admin-chip-active` navy pills | Soft bronze fill toggles |
| Detail progress | Gold rail panels | Flat glass |
| Flow hints | Bordered bronze boxes | Plain muted footnotes |
| Invoice create | Hardcoded EN card | i18n glass card + soft filters |

---

## Features retained

Dashboard stats/funnel/blockers, quiet quotes, needs attention, quote search/bulk/CSV, pipeline drag+quick advance, invoice create-from-quote, detail timelines/status/notes/pay link.

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3019
node scripts/admin19-launch-shots.mjs
```
