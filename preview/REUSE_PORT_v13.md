# Reuse port v13 — nav/footer/contact + materials FAQ + JSON-LD towns

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v12.md` (home site-copy + chatbot CMS catalogs)

---

## Shipped this pass

### 1. Nav / footer labels + contact from site-copy

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedNavLinks()` | Header + Footer quick links | Per-link `nav.{slug}.label` → else `site.ts` `navLinks` |
| `getPublishedFooterLinks()` | Footer Explore links | Per-link `footer.{slug}.label` → else `site.ts` `footerLinks` |
| `getPublishedContactInfo()` | Header phone, Footer contact, `/contact`, JSON-LD phone/email, chatbot contact | Per-key `contact.*` (group contact) → else `site.ts` `siteConfig` |

- Seeded nav/footer label keys and contact phone/email/hours/serviceArea into site-copy.
- New site-copy group option: **contact**.
- Marketing layout passes props into Header / Footer / ChatWidget; hrefs stay from `site.ts`.

### 2. Materials FAQ accordion

| Helper | Surface | Fallback |
|--------|---------|----------|
| `getPublishedMaterialFaqs()` | `/materials` FAQ accordion | Published materials `kind=faq` → else `site.ts` `materialFaqs` |

- Registry adds materials kind **faq** (question → `name`, answer → `tip`).
- Seeded from `materialFaqs`.

### 3. JSON-LD `areaServed` ← published towns

- `localBusinessJsonLd({ towns, contact })` builds City (+ AdministrativeArea region) entries from `getPublishedServiceTowns()`, plus GeoCircle blurb from contact/serviceArea.
- Hardcoded Triangle list remains only if an empty towns array is passed (layout always passes published/fallback towns).
- Telephone / email on LocalBusiness also prefer published contact.

### 4. Live badges + docs + i18n

- Roadmap `publicPaths` updated: site-copy → nav/footer/contact/chatbot; service-area → JSON-LD; materials notes FAQ.
- `preview/CMS_PUBLIC_CONTENT_PLAN.md` → v13 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note → v13.
- This note is the v13 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content → Site copy
# Live badge mentions nav, footer, contact, chatbot
# Edit nav.residential.label → Published → refresh header
# Draft all contact.phone → header/footer fall back to site.ts phone
# Materials → edit a kind=faq tip → Published → /materials accordion
# Service area → draft all towns → JSON-LD + /service-area fall back to site.ts towns
# Publish a new town → LocalBusiness areaServed includes it
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion + FAQ JSON-LD | `howItWorks.*` site-copy (unused on public) |
| `/reviews` + home review cards | `fencingOptionsNav` labels (dropdown) |
| `/gallery` + home work teaser | Legal links |
| `/services` fencing + deck sections | Address / social URLs |
| `/residential` / `/commercial` cards | Trust-claims Settings (separate) |
| Home fencing option cards | Media binaries |
| `/about` stats + local trust + values | QuoteForm still reads `siteConfig` phone for confirmation copy |
| `/about` coverage teaser towns | |
| `/service-area` town cards | |
| `/materials` fence/deck/guidance + compare + FAQ | |
| `/how-it-works` process timeline | |
| Home hero / tagline / trust bar / needs / experience | |
| `/residential` needs cards | |
| Header/Footer nav + footer labels | |
| Header/Footer/contact phone/email (+ hours via contact keys) | |
| JSON-LD `areaServed` towns + LocalBusiness phone/email | |
| Chatbot FAQ + fencing/deck lists + contact | |

Admin edits for non-cutover types/keys remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Media binary upload | Only with alt + EXIF strip |
| Wire Settings trust-claims → public badges | Optional; keep honest |
| QuoteForm / pay pages ← published contact | Consistency |
| `fencingOptionsNav` labels ← fence-types | Optional chrome polish |
| Remove unused `howItWorks.*` seeds | Cleanup |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Merging About CMS with Settings trust-claims  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Public Spanish marketing site  

See also: `preview/REUSE_PORT_v1.md` … `v12.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
