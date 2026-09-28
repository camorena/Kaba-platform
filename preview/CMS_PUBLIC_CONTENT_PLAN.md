# Public site content — admin CMS plan

**Date:** 2026-09-28 (America/Chicago)  
**Code:** `src/lib/cms/` · registry `content-types.ts` · roadmap `roadmap.ts` · public readers `public.ts`  
**Companion:** `preview/REUSE_PORT_v11.md`

Goal: give Kaba Fence **admin pages to manage the PUBLIC marketing site** (images, text, services, gallery/projects, about, FAQs, etc.) without ripping `src/lib/site.ts` until each type is ready.

---

## Principles

1. **Allow-list registry** — route params select a content-type *key*, never a raw SQL table name (prior kaba-fence pattern).
2. **Persist public truth carefully** — claims (towns served, authorship, prices) stay gated; FAQ answers never carry dollar prices.
3. **site.ts until cutover** — marketing pages keep importing `site.ts` except types with an explicit `getPublished*` cutover.
4. **Admin EN + Formal Colombian Spanish** already; public bilingual is optional Phase D.
5. **Media** — Phase C stores path/alt/provenance; drop files in `public/gallery/` (no paid storage required). Binary upload + EXIF strip later.

---

## Phases

| Phase | Types | Admin | Public swap |
|-------|--------|-------|-------------|
| **A (v7)** | `fence-types`, `services`, `projects`, `faqs` | Hub + list + edit | **faqs → `/faq` (v8)**; **projects → `/gallery` + home (v9)**; **fence-types + services → `/services`, residential/commercial, home (v10)** |
| **B (v8)** | `site-copy`, `about`, `testimonials`, `service-area`, `materials` | Same registry CRUD | **testimonials → `/reviews` + home (v9)**; **about / materials / service-area + process.* site-copy (v11)** |
| **C (v8)** | `media` | Media library scaffold | Projects still path strings (+ beforeImage in CMS) |
| **D** | `i18n-public` | Locale fields on documents | Optional `/es` marketing |

Machine-readable inventory: `CMS_PUBLIC_ROADMAP` in `src/lib/cms/roadmap.ts`. Hub UI groups Phase A–C as editable and D as “upcoming”.

---

## Phase A — shipped (v7) + public cutovers (v8–v10)

| Key | Mirrors today | Public routes | Live reader |
|-----|---------------|---------------|-------------|
| `fence-types` | `fencingServices` | `/services`, residential/commercial, home cards | **`getPublishedFenceTypes()`** (CMS published → else `site.ts`) |
| `services` | `deckServices` | `/services`, residential/commercial | **`getPublishedServices()`** (CMS published → else `site.ts`) |
| `projects` | `galleryProjects` | `/gallery`, home teaser | **`getPublishedProjects()`** (CMS published → else `site.ts`) |
| `faqs` | `faqs` | `/faq` | **`getPublishedFaqs()`** (CMS published → else `site.ts`) |

**Storage:** memory default (`src/lib/cms/memory-store.ts`), seeded from `site.ts`. Optional SQL: `db/migrations/0005_cms_content.sql` + `0006_cms_content_phase_bc.sql`.

**Admin:** `/admin/content` · `/admin/content/[type]` · `/admin/content/[type]/[id]` · `PATCH /api/admin/content/[type]`.

**Not cut over:** chatbot still imports `faqs`, `fencingServices`, and `deckServices` from `site.ts`.

---

## Phase B — copy & structured pages (v8 admin)

| Key | Replaces in site.ts | Notes |
|-----|---------------------|--------|
| `site-copy` | `siteConfig` hero/tagline, `howItWorks`, `processTimeline`, `kabaExperience`, `trustPoints` | **Partial (v11):** `process.*` → `/how-it-works`; other keys still site.ts |
| `about` | `aboutLocalTrust`, `aboutStats`, `companyValues` | **Cut over (v11):** `/about`. Trust-claims Settings stay separate |
| `testimonials` | `testimonials` | **Cut over (v9):** name + town + quote; no fake ratings |
| `service-area` | `serviceTowns` | **Cut over (v11):** `/service-area` + about teaser. JSON-LD still hardcoded |
| `materials` | `fenceMaterials`, `materialGuidance`, `deckMaterials` | **Cut over (v11):** `/materials`. Guidance only; no dollar prices |

Admin list/edit seeded from `site.ts`. Public cutovers through v11: faqs, testimonials, projects, fence-types, services, about, materials, service-area, process.* site-copy.

---

## Phase C — media scaffold (v8)

- Type `media` with fields: **path**, **alt** (required), **provenance** (`kaba` | `stock` | `other`), optional width/height, notes.
- **No paid storage:** place binaries under `public/gallery/` (and `public/gallery/before/`). Path field stores the public URL path.
- Upload stub / EXIF strip deferred — refuse to claim cloud upload until wired.
- Seeded from `galleryProjects` image + before paths.
- Projects / fence-types still reference path strings until a later mediaId cutover.

---

## Phase D — public bilingual (optional)

- Admin UI is already EN + es-CO.
- Add `fields_en` / `fields_es` (or locale map) per document only if the product wants a Spanish marketing site.
- Do **not** block Phase A–C on public i18n.

---

## Publish workflow (target)

1. **draft** → editor saves in admin (memory/SQL).  
2. **in_review** (optional) → owner check for claims.  
3. **published** → for cut-over types, public `getPublished(type)` reads CMS; `revalidatePath` / tag when leaving memory.  
4. **rollback** — keep previous published JSON snapshot when editors are non-technical.

v11: publishing **FAQs**, **testimonials**, **projects**, **fence-types**, **services**, **about**, **materials**, **service-area**, or **site-copy `process.*`** changes their cutover surfaces. Other types/keys stay admin-only.

---

## Swap path (per type)

```text
1. Admin edits work in memory/SQL and look correct in /admin/content/[type].
2. Add src/lib/cms/public.ts → getPublished*() with site.ts fallback.
3. Change one marketing page to call getPublished* instead of site.ts export.
4. When stable, remove the site.ts export (or re-export from CMS for one release).
5. Repeat for the next type. Never big-bang delete site.ts.
```

**Done (v8):** `faqs` → `/faq` + JSON-LD.  
**Done (v9):** `testimonials` → `/reviews` + home; `projects` → `/gallery` + home teaser.  
**Done (v10):** `fence-types` → `/services` + residential/commercial + home cards; `services` → `/services` deck section + residential/commercial.  
**Done (v11):** `about` → `/about`; `materials` → `/materials`; `service-area` → `/service-area` + about teaser; `site-copy` `process.*` → `/how-it-works`.

Document each cutover in a new `REUSE_PORT_vN.md` note.

---

## Live vs site.ts (v11 snapshot)

| Surface | Source |
|---------|--------|
| `/faq` accordion + FAQ JSON-LD | CMS published FAQs (`getPublishedFaqs`) |
| `/reviews` + home review cards | CMS published testimonials (`getPublishedTestimonials`) |
| `/gallery` + home work teaser | CMS published projects (`getPublishedProjects`) |
| `/services` fencing + deck sections | CMS published fence-types + services (`getPublishedFenceTypes` / `getPublishedServices`) |
| `/residential` fencing + deck cards | Same helpers (audience `residential`) |
| `/commercial` fencing (+ deck if audience matches) | Same helpers (audience `commercial`) |
| Home fencing option cards | `getPublishedFenceTypes()` |
| `/about` stats + local trust + values | CMS published about (`getPublishedAbout*`) |
| `/about` coverage teaser | CMS published service towns |
| `/service-area` town cards | CMS published service-area (`getPublishedServiceTowns`) |
| `/materials` fence/deck/guidance + compare | CMS published materials (`getPublished*Materials*`) |
| `/how-it-works` process timeline | CMS published site-copy `process.*` (`getPublishedProcessTimeline`) |
| Chatbot FAQ / fencing / deck lists | `site.ts` |
| Hero/tagline, trustPoints, kabaExperience, `yourNeeds`, nav, materialFaqs, JSON-LD areaServed | `site.ts` |
| Trust-claims (Settings) | Separate memory store — not About CMS |
| Admin Content hub list/edit (all Phase A–C types) | CMS memory (seeded from `site.ts`) |

---

## Non-goals (until named phase)

- Ripping `site.ts` wholesale  
- Live media binary upload without alt/provenance  
- Public Spanish site without explicit product ask  
- Full draft→review→rollback before an editor owns content daily  
- Auto-updating JSON-LD areaServed from CMS towns without claim review  
- Merging About CMS with Settings trust-claims  
