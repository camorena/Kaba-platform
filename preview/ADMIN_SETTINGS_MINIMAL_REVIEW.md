# Admin Settings — minimal craft (admin18)

**Date:** 2026-09-28 (America/Chicago)  
**Scope:** `/admin/settings` (profile, appearance, trust, security, platform, about)  
**Prior:** admin11 agency Settings + admin15 responsive  
**Reference:** Content admin17 (`f9967b4`)  
**Evidence:** `preview/admin18-settings-*.png`

---

## Verdict

**Pass.** Settings reads quieter and more minimal while keeping every feature: quieter chips, soft section nav, flat glass cards (no gold rails), muted notes instead of amber callouts, tighter EN + Formal Colombian Spanish. Brand (gold / charcoal / cream), dark/light, and responsive layouts retained.

---

## What simplified

| Area | Before | After (admin18) |
|------|--------|-----------------|
| Page chrome | Long workspace description + “Workspace · preferences” | Short description; meta = “Workspace” |
| Section nav | Uppercase bold pills with border/shadow/inset gold rail | Soft text/fill toggles (content-filter style) |
| Badges | Loud emerald/amber/violet `admin-badge` pills | Quiet `admin-settings-chip` (ok / warn / info / danger) |
| Cards | `admin-gold-rail` + stacked section labels | Flat glass; title + chip; less label stacking |
| Callouts | Amber bordered boxes | Plain muted footnotes |
| Definition lists | Bordered rounded panels | Hairline rows, no box chrome |
| Pref / key rows | Bordered nested tiles | Soft fill stats |
| Copy | Long honest paragraphs | Tighter EN + usted ES — same facts |

---

## Features retained

Profile (session form), appearance (language + theme), trust claims (server/local), security (auth mode, status, roles, rotate note), platform (data adapter, Stripe badges, mail badges), about (ops + craft + Datelica credit).

---

## How to re-shot

```bash
npm run build && npm run start -- -p 3018
node scripts/admin18-settings-shots.mjs
```
