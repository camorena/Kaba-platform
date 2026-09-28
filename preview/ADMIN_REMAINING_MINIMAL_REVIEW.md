# Admin remaining modules — minimal craft (admin21)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** `/admin/calendar`, `/admin/customers`, `/admin/payments`, `/admin/pricebook`, `/admin/activity`  
**Prior:** Content admin17 / Settings admin18 / launch admin19 / Templates admin20  
**Evidence:** `preview/admin21-*.png`

---

## Verdict

**Pass.** Calendar, Customers, Payments, Price book, and Activity read quieter and more enterprise while keeping their workflows: soft filters/chips with counts, search where useful, flat glass (no gold rails), quiet Demo / Stripe / kind chips, tighter EN + Formal Colombian Spanish titles and descriptions. Brand (gold / charcoal / cream), dark/light, and responsive layouts retained. Shared EmptyState also quieted (no gold rail / gradient icon).

---

## What improved

| Area | Before | After (admin21) |
|------|--------|-----------------|
| Page chrome | Long stub descriptions; uneven meta | Short descriptions; meta = Field ops / Directory / Ledger / Estimating / Feed |
| Filters | Loud `admin-chip` pills or none | Soft bronze fill toggles + counts (status / kind / category / repeat) |
| Search | Missing on most | Customers, Payments, Price book, Activity |
| Panels / tables | `admin-gold-rail` glass | Flat glass; hairline tables |
| Payments Stripe note | Emerald/sky bordered callout | Quiet chip + muted footnote → Settings |
| Payments labels | Hardcoded EN form labels | Full EN + Formal Colombian Spanish |
| Activity feed | Duplicate kind label + gold rail | Quiet kind chip once; flat glass timeline |
| Customers avatars | Gradient + ring | Soft bronze fill initials |
| Empty states | Gold rail + heavy icon tile | Dashed quiet empty (shared) |

---

## Features retained

Schedule month grid + upcoming jobs; customer directory from quotes; payment ledger + manual record + Stripe Checkout when ready; localStorage price book estimate; unified activity feed.

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3021
node scripts/admin21-remaining-shots.mjs
```
