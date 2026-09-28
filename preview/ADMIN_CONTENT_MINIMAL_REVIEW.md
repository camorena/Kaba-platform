# Admin Content CMS — minimal craft (admin17)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** `/admin/content`, `/admin/content/[type]`, `/admin/content/[type]/[id]`  
**Prior:** admin16 agency denseness (`preview/ADMIN_CONTENT_UX_REVIEW.md`)  
**Evidence:** `preview/admin17-content-*.png`

---

## Verdict

**Pass.** Content hub / list / edit read quieter and more minimal while staying enterprise: less chrome, tighter type, quiet chips, simpler phase groups, clearer hierarchy and breathing room. Brand (gold / charcoal / cream), EN + Formal Colombian Spanish, dark/light, and responsive layouts retained.

---

## What simplified

| Area | Before (admin16) | After (admin17) |
|------|------------------|-----------------|
| Page chrome | Long Phase A–C description + gold meta strip of every live surface | One short description; hub meta = “Memory CMS”; list/edit = breadcrumbs only (no page H1) |
| Hub intro | Sticky intro paragraph + page description | Single page description only |
| Hub stats | Loud emerald/muted pill badges | Quiet inline `·` metrics |
| Live badges | `Live · /services, /residential, …` path spam | Short **Live** / **Admin** chips; paths as muted one-liners / title |
| Phase groups | Sticky serif “PHASE A — PRODUCTS & FAQS” + sticky stacking | Simple “Phase A” labels + hairline; not sticky |
| Cards | Gold rail, publish-affects footers, hover Open CTA | Flat glass cards; key + title + count + one muted line |
| Filters | Ringed pill toggles | Soft text/fill toggles |
| List | Triple status pills + secondary button back | Type title in sticky; text metrics; text “All types” link |
| Edit | Amber callout box, dual large status tiles, three equal Save buttons | Muted note; segmented status; Draft / Publish + quiet Save |
| Footnotes | Bordered swap-note boxes | Plain muted footnote |

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3017
node scripts/admin17-content-shots.mjs
```
