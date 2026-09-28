# Reuse port v10 — fence-types + services public cutover

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v9.md` (testimonials + projects cutover)

---

## Shipped this pass

### 1. Safe public cutovers

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedFenceTypes(audience?)` | `/services`, `/residential`, `/commercial`, home fencing cards | `site.ts` `fencingServices` when no published CMS rows |
| `getPublishedServices(audience?)` | `/services` (deck section), `/residential`, `/commercial` | `site.ts` `deckServices` when no published CMS rows |
| Prior: faqs / testimonials / projects | unchanged | unchanged from v8–v9 |

- Audience filter: `residential` | `commercial` matches that value **or** `both`.
- `/services` now surfaces deck offerings (README parity: fencing + deck).
- Commercial gains fencing material cards from CMS (audience commercial/both).
- Home + services + residential + commercial are `force-dynamic` so memory CMS edits show in dev.
- **Chatbot** still imports `fencingServices` / `deckServices` from `site.ts`.

### 2. Live badges

- Hub / list / edit: **Live · {paths}** for `fence-types` and `services` (driven by `publicCutover` on roadmap).
- Paths: fence-types → `/services, /residential, /commercial, home`; services → `/services, /residential, /commercial`.

### 3. Docs + i18n

- `preview/CMS_PUBLIC_CONTENT_PLAN.md` updated to v10 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note.
- This note is the v10 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content
# Fence types / Services cards show Live badges
# Edit a fence type → Save as Draft (when all draft, /services falls back to site.ts)
# Save as Published → refresh /services, /, /residential, /commercial
# Set Audience = commercial on a fence type → appears on commercial; residential filter hides it
# Deck services: edit under Services → appear in /services deck section + residential
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion + FAQ JSON-LD | Chatbot FAQ + fencing/deck name lists |
| `/reviews` + home review cards | `yourNeeds`, about, materials, service-area |
| `/gallery` + home work teaser | Site copy, how-it-works, nav/footer |
| `/services` fencing + deck sections | Media binary paths (until mediaId cutover) |
| `/residential` fencing + deck cards | |
| `/commercial` fencing (+ deck if audience matches) | |
| Home fencing option cards | |

Admin edits for non-cutover types remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Materials cutover | Low claim risk after review |
| Service-area / trust cutover | Higher claim risk — gate carefully |
| Media binary upload | Only with alt + EXIF strip |
| Chatbot ← CMS FAQs / services | Optional; keep answers price-free |
| `yourNeeds` / site-copy cutover | Home needs still site.ts |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Cutting over service-area or about without claim review  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Chatbot reading CMS fence-types / services  

See also: `preview/REUSE_PORT_v1.md` … `v9.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
