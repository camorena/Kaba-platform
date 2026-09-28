# Reuse port v12 — home site-copy + chatbot CMS catalogs

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v11.md` (about + materials + service-area cutover)

---

## Shipped this pass

### 1. Safe public cutovers — site-copy (home)

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedHeroCopy()` | Home hero + experience tagline script | Per-key `site.ts` `siteConfig` when that key is unpublished |
| `getPublishedTrustPoints()` | Home trust bar | `site.ts` `trustPoints` unless full `trust.1..N` published |
| `getPublishedYourNeeds()` | Home needs cards; `/residential` needs | `site.ts` `yourNeeds` unless full `need.*` title+description set |
| `getPublishedKabaExperience()` | Home experience steps | `site.ts` `kabaExperience` unless full `experience.*` set |
| Prior: `getPublishedProcessTimeline()` | `/how-it-works` | unchanged |

- Seeded `need.{id}.title|description|image|icon` into site-copy (group `needs`).
- Icons for trust/experience stay aligned with `site.ts` (CMS stores copy; icon enums validated).
- **Trust-claims Settings** stay separate from the home trust bar (site-copy labels).
- `howItWorks.*` site-copy keys remain unused on public pages.

### 2. Chatbot ← CMS FAQs + fence-types + services

- `ChatbotCatalog` passed from marketing layout (server) into `ChatWidget`.
- `getBotReply(input, catalog)` matches FAQs / fencing / deck from published CMS via `getPublishedFaqs` / `FenceTypes` / `Services`, with `site.ts` fallback when none published.
- Phone, hours, area blurb, and trust-about reply still use `siteConfig` / `trustPoints` from `site.ts` (contact claims stay gated).

### 3. Live badges

- Hub / list / edit paths driven by roadmap `publicPaths`:
  - site-copy → `home, /how-it-works, /residential`
  - faqs → `/faq, chatbot`
  - fence-types → `/services, /residential, /commercial, home, chatbot`
  - services → `/services, /residential, /commercial, chatbot`

### 4. Docs + i18n

- `preview/CMS_PUBLIC_CONTENT_PLAN.md` updated to v12 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note → v12.
- This note is the v12 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content
# Site copy card: Live · home, /how-it-works, /residential
# FAQs / Fence types / Services cards mention chatbot
# Edit hero.headline → Save Published → refresh /
# Draft all trust.* → home trust bar falls back to site.ts
# Edit an FAQ answer → Published → ask chatbot a matching question
# Draft all fence-types → chatbot fencing list falls back to site.ts
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion + FAQ JSON-LD | `howItWorks.*` site-copy (unused on public) |
| `/reviews` + home review cards | Nav/footer labels |
| `/gallery` + home work teaser | Materials FAQ accordion |
| `/services` fencing + deck sections | JSON-LD `areaServed` |
| `/residential` / `/commercial` cards | Contact phone/email/hours (`siteConfig`) |
| Home fencing option cards | Trust-claims Settings (separate) |
| `/about` stats + local trust + values | Media binaries |
| `/about` coverage teaser towns | |
| `/service-area` town cards | |
| `/materials` fence/deck/guidance + compare | |
| `/how-it-works` process timeline | |
| Home hero / tagline / trust bar / needs / experience | |
| `/residential` needs cards | |
| Chatbot FAQ + fencing/deck name & detail lists | |

Admin edits for non-cutover types/keys remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| JSON-LD areaServed ← CMS towns | Only after claim review |
| Media binary upload | Only with alt + EXIF strip |
| Wire Settings trust-claims → public badges | Optional; keep honest |
| Nav/footer site-copy | Low urgency labels |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Merging About CMS with Settings trust-claims  
- Auto-updating JSON-LD towns from CMS  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Chatbot reading CMS for phone/hours/service-area claims  

See also: `preview/REUSE_PORT_v1.md` … `v11.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
