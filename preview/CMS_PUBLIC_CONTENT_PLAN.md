# Public site content — admin CMS plan

**Date:** 2026-09-28 (America/Chicago)  
**Code:** `src/lib/cms/` · registry `content-types.ts` · roadmap `roadmap.ts` · public readers `public.ts`  
**Companion:** `preview/REUSE_PORT_v15.md`

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
| **A (v7)** | `fence-types`, `services`, `projects`, `faqs` | Hub + list + edit | **faqs → `/faq` (v8) + chatbot (v12)**; **projects → `/gallery` + home (v9)**; **fence-types + services → `/services`, residential/commercial, home (v10) + chatbot (v12)** |
| **B (v8)** | `site-copy`, `about`, `testimonials`, `service-area`, `materials` | Same registry CRUD | **testimonials → `/reviews` + home (v9)**; **about / materials / service-area + process.* (v11)**; **hero/trust/experience/needs site-copy → home (+ residential needs) (v12)**; **nav/footer/contact + materials FAQ + JSON-LD towns (v13)**; **fencingNav/legal + remaining contact CTAs (v14)**; **brand/address/social + metadata/OG/footer/pay/invoice letterhead (v15)** |
| **C (v8)** | `media` | Media library scaffold | Projects still path strings (+ beforeImage in CMS) |
| **D** | `i18n-public` | Locale fields on documents | Optional `/es` marketing |

Machine-readable inventory: `CMS_PUBLIC_ROADMAP` in `src/lib/cms/roadmap.ts`. Hub UI groups Phase A–C as editable and D as “upcoming”.

---

## Phase A — shipped (v7) + public cutovers (v8–v10)

| Key | Mirrors today | Public routes | Live reader |
|-----|---------------|---------------|-------------|
| `fence-types` | `fencingServices` | `/services`, residential/commercial, home cards, chatbot | **`getPublishedFenceTypes()`** (CMS published → else `site.ts`) |
| `services` | `deckServices` | `/services`, residential/commercial, chatbot | **`getPublishedServices()`** (CMS published → else `site.ts`) |
| `projects` | `galleryProjects` | `/gallery`, home teaser | **`getPublishedProjects()`** (CMS published → else `site.ts`) |
| `faqs` | `faqs` | `/faq`, chatbot | **`getPublishedFaqs()`** (CMS published → else `site.ts`) |

**Storage:** memory default (`src/lib/cms/memory-store.ts`), seeded from `site.ts`. Optional SQL: `db/migrations/0005_cms_content.sql` + `0006_cms_content_phase_bc.sql`.

**Admin:** `/admin/content` · `/admin/content/[type]` · `/admin/content/[type]/[id]` · `PATCH /api/admin/content/[type]`.

**Chatbot (v12):** published FAQs + fence-types + services lists via marketing layout catalog (CMS → `site.ts` fallback).

---

## Phase B — copy & structured pages (v8 admin)

| Key | Replaces in site.ts | Notes |
|-----|---------------------|--------|
| `site-copy` | `siteConfig` name/tagline/description/hero/contact/address/social, `howItWorks`, `processTimeline`, `kabaExperience`, `trustPoints`, `yourNeeds`, `navLinks`, `footerLinks`, `fencingOptionsNav`, `legalLinks` | **Cut over (v12):** hero/trust/experience/needs → home; `process.*` → `/how-it-works`. **(v13):** nav/footer labels + contact phone/email/hours. **(v14):** fencingNav/legal labels + remaining phone/email CTAs. **(v15):** brand name/tagline/description (metadata/OG/footer/pay/JSON-LD/invoice); address + social URLs. `howItWorks.*` unused on public |
| `about` | `aboutLocalTrust`, `aboutStats`, `companyValues` | **Cut over (v11):** `/about`. Trust-claims Settings stay separate |
| `testimonials` | `testimonials` | **Cut over (v9):** name + town + quote; no fake ratings |
| `service-area` | `serviceTowns` | **Cut over (v11):** `/service-area` + about teaser. **(v13):** JSON-LD `areaServed` from published towns |
| `materials` | `fenceMaterials`, `materialGuidance`, `deckMaterials`, `materialFaqs` | **Cut over (v11):** `/materials` cards/guidance. **(v13):** FAQ accordion (`kind=faq`). No dollar prices |

Admin list/edit seeded from `site.ts`. Public cutovers through v15: faqs (+ chatbot), testimonials, projects, fence-types (+ chatbot), services (+ chatbot), about, materials (+ FAQ), service-area (+ JSON-LD), site-copy (hero/trust/experience/needs/process/nav/footer/fencingNav/legal/contact/brand/address/social + remaining CTAs + metadata/OG/invoice letterhead).

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

v15: publishing **FAQs**, **testimonials**, **projects**, **fence-types**, **services**, **about**, **materials** (incl. FAQ kind), **service-area**, or **site-copy** (hero/trust/experience/needs/process/nav/footer/fencingNav/legal/contact/brand/address/social) changes their cutover surfaces (including chatbot catalogs, JSON-LD towns/name/address, pay/404 CTAs, mail owner fallback, metadata/OG, invoice letterhead). Other types/keys stay admin-only.

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
**Done (v12):** `site-copy` hero/tagline/trust/experience/needs → home (+ residential needs); chatbot ← published FAQs + fence-types + services.  
**Done (v13):** nav/footer labels + contact phone/email/hours; materials FAQ accordion; JSON-LD `areaServed` ← published towns; chatbot contact.  
**Done (v14):** fencingOptionsNav + legalLinks labels from site-copy; remaining phone/email CTAs (FAQ/home/residential/commercial/about/services/materials/service-area/QuoteForm/pay/privacy/terms/404/launch-blockers/mail) via `getPublishedContactInfo`.  
**Done (v15):** brand `site.name` / tagline / description → metadata/OG/footer/pay/JSON-LD/invoice letterhead; address + social URLs → footer/pay/JSON-LD/invoice; invoice letterhead phone/email via published contact (server→client prop).

Document each cutover in a new `REUSE_PORT_vN.md` note.

---

## Live vs site.ts (v15 snapshot)

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
| `/materials` fence/deck/guidance + compare + FAQ | CMS published materials (`getPublished*Materials*` / `MaterialFaqs`) |
| `/how-it-works` process timeline | CMS published site-copy `process.*` (`getPublishedProcessTimeline`) |
| Home hero / tagline / trust bar / needs / experience | CMS published site-copy (`getPublishedHeroCopy` / `TrustPoints` / `YourNeeds` / `KabaExperience`) |
| `/residential` needs cards | `getPublishedYourNeeds()` |
| Header / Footer nav + footer labels | CMS site-copy nav/footer (`getPublishedNavLinks` / `FooterLinks`) |
| Header / Footer / `/contact` phone/email (+ hours keys) | CMS site-copy contact (`getPublishedContactInfo`) |
| Remaining Call/email CTAs (FAQ/home/res/com/about/services/materials/service-area/QuoteForm/pay/privacy/terms/404) | Same contact helper |
| Launch-blockers hours/contact + mail owner/reply-to fallback | Same contact helper |
| JSON-LD LocalBusiness `areaServed` + phone/email | CMS towns + contact |
| Chatbot FAQ / fencing / deck lists + contact | Same helpers via layout catalog |
| Header fencing dropdown + footer fencing column labels | CMS site-copy `fencingNav.*` (`getPublishedFencingOptionsNav`) |
| Footer legal link labels | CMS site-copy `legal.*` (`getPublishedLegalLinks`) |
| Brand name / tagline / description (metadata/OG/footer/pay/JSON-LD/invoice) | CMS site-copy hero (`getPublishedHeroCopy`, incl. `site.name`) |
| Address region (+ city/state/zip in JSON-LD) + social URLs | CMS site-copy contact (`getPublishedContactInfo`) |
| Admin invoice print letterhead | Published brand + contact (server page → client `letterhead` prop) |
| Header logo text brand name; body-copy `siteConfig.name`; non-home page metadata titles; chatbot brand/address; notify subjects; unused `howItWorks.*` | `site.ts` |
| Trust-claims (Settings) | Separate memory store — not About CMS / not home trust bar |
| Admin Content hub list/edit (all Phase A–C types) | CMS memory (seeded from `site.ts`) |
| `siteUrl` / sitemap / `defaultOgImage` | `site.ts` |

---

## Non-goals (until named phase)

- Ripping `site.ts` wholesale  
- Live media binary upload without alt/provenance  
- Public Spanish site without explicit product ask  
- Full draft→review→rollback before an editor owns content daily  
- Merging About CMS with Settings trust-claims  
