# Public site content — admin CMS plan

**Date:** 2026-09-28 (America/Chicago)  
**Code:** `src/lib/cms/` · registry `content-types.ts` · roadmap `roadmap.ts`  
**Companion:** `preview/REUSE_PORT_v7.md`

Goal: give Kaba Fence **admin pages to manage the PUBLIC marketing site** (images, text, services, gallery/projects, about, FAQs, etc.) without ripping `src/lib/site.ts` until each type is ready.

---

## Principles

1. **Allow-list registry** — route params select a content-type *key*, never a raw SQL table name (prior kaba-fence pattern).
2. **Persist public truth carefully** — claims (towns served, authorship, prices) stay gated; FAQ answers never carry dollar prices.
3. **site.ts until cutover** — marketing pages keep importing `site.ts`. Admin stubs edit a parallel memory (or optional Postgres) store. Cut over **one type at a time**.
4. **Admin EN + Formal Colombian Spanish** already; public bilingual is optional Phase D.
5. **Media later** — Phase A stores image *paths*; Phase C adds upload, alt required, EXIF strip, provenance.

---

## Phases

| Phase | Types | Admin | Public swap |
|-------|--------|-------|-------------|
| **A (v7)** | `fence-types`, `services`, `projects`, `faqs` | Hub + list + edit stubs | Still `site.ts` |
| **B** | `site-copy`, `about`, `testimonials`, `service-area`, `materials` | Same registry CRUD | Swap readers per type |
| **C** | `media` | Media library | Projects/services reference media ids |
| **D** | `i18n-public` | Locale fields on documents | Optional `/es` marketing |

Machine-readable inventory: `CMS_PUBLIC_ROADMAP` in `src/lib/cms/roadmap.ts`. Hub UI lists Phase A as editable and B–D as “upcoming”.

---

## Phase A — shipped stubs (v7)

| Key | Mirrors today | Public routes |
|-----|---------------|---------------|
| `fence-types` | `fencingServices` | `/services`, home cards |
| `services` | `deckServices` | `/services`, residential/commercial |
| `projects` | `galleryProjects` | `/gallery`, home teaser |
| `faqs` | `faqs` | `/faq`, chatbot later |

**Storage:** memory default (`src/lib/cms/memory-store.ts`), seeded from `site.ts`. Optional SQL: `db/migrations/0005_cms_content.sql` (`cms_documents`).

**Admin:** `/admin/content` · `/admin/content/[type]` · `/admin/content/[type]/[id]` · `PATCH /api/admin/content/[type]`.

---

## Phase B — copy & structured pages

| Key | Replaces in site.ts | Notes |
|-----|---------------------|--------|
| `site-copy` | `siteConfig` hero/tagline, `howItWorks`, `processTimeline`, `kabaExperience`, `trustPoints`, nav labels | Keyed strings, not raw HTML |
| `about` | `aboutLocalTrust`, `aboutStats`, `companyValues` | Keep trust-claims separate |
| `testimonials` | `testimonials` | Name + town + quote; no fake ratings |
| `service-area` | `serviceTowns` | Geographic claim — honesty required |
| `materials` | `fenceMaterials`, comparisons, `deckMaterials` | Guidance only; no prices |

---

## Phase C — media upload

- New `media` type + storage (Supabase Storage or equivalent; prior ADR preferred Storage over Blob).
- Fields: file, **alt** (required), provenance (`kaba` | `stock` | `other`), width/height.
- Projects / fence-types reference `mediaId` instead of `/gallery/...` paths.
- Strip EXIF on upload; refuse publish without alt.

---

## Phase D — public bilingual (optional)

- Admin UI is already EN + es-CO.
- Add `fields_en` / `fields_es` (or locale map) per document only if the product wants a Spanish marketing site.
- Do **not** block Phase A–C on public i18n.

---

## Publish workflow (target)

1. **draft** → editor saves in admin (memory/SQL).  
2. **in_review** (optional, Phase B+) → owner check for claims.  
3. **published** → on cutover, public `getPublished(type)` reads CMS; `revalidatePath` / tag.  
4. **rollback** — keep previous published JSON snapshot (prior CMS had this; add when editors are non-technical).

v7 stubs only expose draft | published on the memory row; **publishing does not change the live site yet**.

---

## Swap path (per type)

```text
1. Admin edits work in memory/SQL and look correct in /admin/content/[type].
2. Add src/lib/cms/public.ts → getPublishedFenceTypes() etc. with site.ts fallback.
3. Change one marketing page to call getPublished* instead of site.ts export.
4. When stable, remove the site.ts export (or re-export from CMS for one release).
5. Repeat for the next type. Never big-bang delete site.ts.
```

Document each cutover in a new `REUSE_PORT_vN.md` note.

---

## Non-goals (until named phase)

- Ripping `site.ts` in v7  
- Live media upload without alt/provenance  
- Public Spanish site without explicit product ask  
- Full draft→review→rollback before an editor owns content daily  
