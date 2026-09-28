# Admin Templates — minimal craft (admin20)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** `/admin/templates`  
**Prior:** Content admin17 / Settings admin18 / launch admin19  
**Evidence:** `preview/admin20-templates-*.png`

---

## Verdict

**Pass.** Templates reads quieter and more enterprise while keeping the clipboard workflow: soft channel filters with counts, search, card library with snippets, flat glass merge + preview (no gold rails), quiet chips, empty state, tighter EN + Formal Colombian Spanish titles. Brand (gold / charcoal / cream), dark/light, and responsive layouts retained. Bodies stay English (customer-facing NC copy).

---

## What improved

| Area | Before | After (admin20) |
|------|--------|-----------------|
| Page chrome | Long description, no meta | Short description; meta = “Follow-ups” / “Seguimientos” |
| Channel filters | `admin-chip` / `admin-chip-active` navy pills | Soft bronze fill toggles + counts |
| Library | Title-only list rows | Channel chip + bilingual title + body snippet |
| Search | None | Search by title or body |
| Empty | Hard to reach | Quiet dashed empty + clear filters |
| Merge panel | `admin-gold-rail` glass | Flat glass; `{{field}}` hints on labels |
| Preview / copy | Generic title + “Copy to clipboard” | Channel chip, hint, char count, vars used, short Copy → Copied |
| Footnote | Buried in merge hint | Quiet toolbar line: clipboard only |
| Titles | Hardcoded EN in data | `templates.items.*` EN + Formal Colombian Spanish |

---

## Features retained

Eight SMS / email / internal starters, live merge preview, clipboard copy (toast), no messaging API.

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3020
node scripts/admin20-templates-shots.mjs
```
