# Reuse port v11 — about + materials + service-area (+ process site-copy)

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v10.md` (fence-types + services cutover)

---

## Shipped this pass

### 1. Safe public cutovers

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedAboutLocalTrust` / `AboutStats` / `CompanyValues` | `/about` | `site.ts` when that kind has no published CMS rows |
| `getPublishedServiceTowns()` | `/service-area`, about coverage teaser | `site.ts` `serviceTowns` |
| `getPublishedFenceMaterials` / `DeckMaterials` / `MaterialGuidance` / `MaterialComparison` | `/materials` | `site.ts` materials when that kind has no published rows; comparison derived from fence materials |
| `getPublishedProcessTimeline()` | `/how-it-works` | `site.ts` `processTimeline` unless a full published `process.*` set exists |
| Prior cutovers | unchanged | unchanged from v8–v10 |

- About / materials / service-area / how-it-works are `force-dynamic`.
- **Trust-claims** (Settings) stay separate from About CMS — `trustPoints` and `kabaExperience` still `site.ts`.
- **JSON-LD `areaServed`** stays hardcoded in `jsonld.ts` (geographic claim honesty).
- Site-copy Live badge paths: `/how-it-works` only (`process.*`). Hero / trust / experience / `howItWorks.*` still `site.ts`.
- Materials: no dollar prices; `materialFaqs` still `site.ts`.

### 2. Live badges

- Hub / list / edit: **Live · {paths}** for `about`, `materials`, `service-area`, and `site-copy` (process-only).
- Paths: about → `/about`; materials → `/materials`; service-area → `/service-area, /about`; site-copy → `/how-it-works`.

### 3. Docs + i18n

- `preview/CMS_PUBLIC_CONTENT_PLAN.md` updated to v11 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note.
- This note is the v11 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content
# About / Materials / Service area / Site copy cards show Live badges
# Draft all about local-trust rows → /about trust cards fall back to site.ts
# Publish a town → refresh /service-area and about coverage strip
# Edit process.01.title in Site copy → Save Published → refresh /how-it-works
# Draft all process.* → timeline falls back to site.ts
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion + FAQ JSON-LD | Chatbot FAQ + fencing/deck name lists |
| `/reviews` + home review cards | `yourNeeds`, hero/tagline, trustPoints, kabaExperience |
| `/gallery` + home work teaser | `howItWorks.*` site-copy keys (unused on public) |
| `/services` fencing + deck sections | Nav/footer labels, media binaries |
| `/residential` / `/commercial` cards | Materials FAQ accordion |
| Home fencing option cards | JSON-LD `areaServed` |
| `/about` stats + local trust + values | Trust-claims Settings (separate) |
| `/about` coverage teaser towns | |
| `/service-area` town cards | |
| `/materials` fence/deck/guidance + compare table | |
| `/how-it-works` process timeline (`process.*`) | |

Admin edits for non-cutover types/keys remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Hero / trustPoints / kabaExperience site-copy | Home still site.ts |
| JSON-LD areaServed ← CMS towns | Only after claim review |
| Media binary upload | Only with alt + EXIF strip |
| Chatbot ← CMS FAQs / services | Optional; keep answers price-free |
| `yourNeeds` cutover | Home needs still site.ts |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Merging About CMS with Settings trust-claims  
- Auto-updating JSON-LD towns from CMS  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Chatbot reading CMS fence-types / services  

See also: `preview/REUSE_PORT_v1.md` … `v10.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
