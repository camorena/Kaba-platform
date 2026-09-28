# Reuse port v8 — CMS Phase B/C + FAQ cutover

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v7.md` (mail notify + CMS Phase A)

---

## Shipped this pass

### 1. Phase B content types (admin list/edit)

Expand allow-list registry + memory seed from `site.ts`:

| Key | Seeded from |
|-----|-------------|
| `site-copy` | `siteConfig` hero/tagline/description, `howItWorks`, `processTimeline`, `kabaExperience`, `trustPoints` |
| `about` | `aboutLocalTrust`, `aboutStats`, `companyValues` |
| `testimonials` | `testimonials` |
| `service-area` | `serviceTowns` |
| `materials` | `fenceMaterials`, `deckMaterials`, `materialGuidance` |

Same hub / list / edit / `PATCH /api/admin/content/[type]` as Phase A. **Public pages for these types still read `site.ts`.**

### 2. Phase C media scaffold

| Field | Notes |
|-------|--------|
| `path` | Public URL path (`/gallery/...`) |
| `alt` | Required for accessibility |
| `provenance` | `kaba` \| `stock` \| `other` |
| width / height | Optional |
| notes | Local-folder guidance |

**No paid storage:** drop files in `public/gallery/` (and `before/`). Binary upload + EXIF strip deferred. Seeded from gallery project images.

### 3. Safe partial cutover — FAQs

- `src/lib/cms/public.ts` → `getPublishedFaqs()` (published CMS → fallback `site.ts`).
- `/faq` + `faqPageJsonLd(items)` use CMS when published.
- **Chatbot** still uses `site.ts` `faqs` (no risky swap).
- Hub shows a **Live on /faq** badge on the FAQs card.

### 4. i18n + SQL + docs

- Admin EN + Formal Colombian Spanish for Phase B/C hub labels and updated content copy.
- Optional SQL: `db/migrations/0006_cms_content_phase_bc.sql` (expand type check).
- `preview/CMS_PUBLIC_CONTENT_PLAN.md` updated; this note is the v8 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content
# Phase A / B / C cards are editable
# Edit an FAQ → Save as Published → refresh /faq (dev memory store)
# Edit site-copy / about / materials / media → admin only; live pages unchanged
# Media: set path to /gallery/your-file.jpg after placing file in public/gallery/
```

Postgres optional: `npm run db:migrate` applies `0006` (table allow-list; runtime still memory until a postgres CMS adapter).

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion | Home, services, gallery, about, reviews |
| FAQ JSON-LD on `/faq` | Materials, service-area, how-it-works, nav/footer |
| | Chatbot FAQ matching |
| | All Phase B/C public consumers |

Admin edits for non-FAQ types are **memory-only** and do not change marketing until a future `getPublished*` cutover.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist content beyond process restart |
| Next low-risk cutover | e.g. testimonials or materials (after review) |
| Media binary upload | Only with alt required + EXIF strip |
| Service-area / trust cutover | Higher claim risk — gate carefully |
| Phase D public bilingual | Only if product asks |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Cutting over service-area or about without claim review  
- Paid object storage / cloud upload  
- Chatbot reading CMS FAQs  
- Full draft → review → rollback workflow  

See also: `preview/REUSE_PORT_v1.md` … `v7.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.
