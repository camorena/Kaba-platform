# Reuse port v15 — brand / address / social + invoice letterhead

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v14.md` (remaining contact CTAs + fencing/legal nav labels)

---

## Shipped this pass

### 1. Brand name / tagline / description ← `getPublishedHeroCopy()`

| Surface | Notes |
|---------|-------|
| Root `generateMetadata` + OG/Twitter | `site.name` / description (+ “Free estimates.” on root description) |
| Home `generateMetadata` + OG | Absolute title + description from published hero |
| Footer brand column + copyright bar | `brand.name` / `brand.tagline` props |
| Pay layout chrome + footer strip | Name / tagline from hero helper |
| Pay 404 home link | Published brand name |
| JSON-LD LocalBusiness + WebSite | Name / description options |
| Invoice print letterhead | Name / tagline via server-passed `letterhead` |

Seeded site-copy key: **`site.name`** (group `hero`). Tagline / description already seeded.

### 2. Address + social URLs ← `getPublishedContactInfo()`

| Field keys | Surfaces |
|------------|----------|
| `contact.address.{city,state,zip,region}` | Footer region, pay footer, JSON-LD PostalAddress, invoice letterhead region |
| `contact.social.{facebook,instagram,linkedin}` | Footer Follow Us icons |

Per-key published site-copy (group `contact`) → else `site.ts`. Empty ZIP still falls back cleanly (map skips blank values).

### 3. Invoice letterhead contact (safe client path)

`InvoiceDetailClient` is a client component (`server-only` CMS readers cannot import there). Admin invoice detail **server page** calls `getPublishedContactInfo` + `getPublishedHeroCopy` and passes a `letterhead` prop (phone/email/region/name/tagline). Client defaults remain `site.ts`.

### 4. Docs + i18n

- Roadmap `site-copy` `publicPaths` / notes → v15 (brand/address/social/metadata/invoice-letterhead).
- `preview/CMS_PUBLIC_CONTENT_PLAN.md` → v15 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note → v15.
- This note is the v15 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content → Site copy
# Edit site.name → Published → refresh tab title / footer copyright / pay header
# Edit site.tagline / site.description → footer script line + home OG description
# Edit contact.address.region → footer + pay footer + invoice print letterhead
# Edit contact.social.facebook → footer Follow Us link
# Draft all contact.address.* / social.* → surfaces fall back to site.ts
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| Everything from v14 | Unused `howItWorks.*` seeds |
| Brand name/tagline/description on metadata/OG/footer/pay/JSON-LD/invoice letterhead | Header logo text brand name |
| Address region (+ city/state/zip in JSON-LD) | Body copy `siteConfig.name` on marketing pages (about/services/etc.) |
| Social URLs in footer | Page-level metadata titles that hardcode `siteConfig.name` (non-home) |
| Invoice letterhead phone/email/region/brand | Chatbot brand/address strings; notify subjects; QuoteForm brand labels |
| | Trust-claims Settings (separate) |
| | Media binaries; `siteUrl` / sitemap / `defaultOgImage` |

Admin edits for non-cutover types/keys remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Media binary upload | Only with alt + EXIF strip |
| Wire Settings trust-claims → public badges | Optional; keep honest |
| Remove unused `howItWorks.*` seeds | Cleanup |
| Header / chatbot / body-copy brand name | Optional chrome polish |
| Per-page metadata titles ← published brand | Optional SEO consistency |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Merging About CMS with Settings trust-claims  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Public Spanish marketing site  

See also: `preview/REUSE_PORT_v1.md` … `v14.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
