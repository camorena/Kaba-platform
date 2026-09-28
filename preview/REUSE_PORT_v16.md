# Reuse port v16 — brand holdouts + content CMS agency UX

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v15.md` (brand/address/social + invoice letterhead)

---

## Part 1 — Brand holdouts finished

Remaining `siteConfig.name` / `tagline` / `description` / `address` chrome now reads published CMS via `getPublishedHeroCopy()` + `getPublishedContactInfo()`, with **site.ts fallback**.

| Surface | Wiring |
|---------|--------|
| Header logo label | `brandName` prop from marketing layout |
| Page metadata titles/descriptions | `generateMetadata()` + brand on all marketing pages |
| Body copy (about/services/residential/commercial/service-area/materials/privacy/terms/…) | Server `brand` / `contact` locals |
| Chatbot + ChatWidget | Catalog `brand` + contact address city/state |
| QuoteForm labels | `brand` prop from contact page |
| Notify subjects | `getPublishedHeroCopy().name` on quote/payment mail |

Client defaults remain `site.ts` (Header / ChatWidget / QuoteForm / chatbot catalog).

---

## Part 2 — Content module redesign (agency)

`/admin/content` hub + type list + edit form restyled to gold/charcoal/cream enterprise craft:

- Phase groups, Live / Admin-only badges, search + live filter
- Dense calm cards/tables, mobile cards, sticky toolbars, empty/filter empty states
- Edit: status chips, field group, dirty badge, Save draft / Save & publish / Save bar (mobile-safe)
- EN + Formal Colombian Spanish (usted) strings

Screenshots: `preview/admin16-content-*.png`  
Optional review: `preview/ADMIN_CONTENT_UX_REVIEW.md`

---

## How to demo

```bash
npm run dev
# Edit site.name → Published → refresh header logo, tab titles, chatbot header, quote confirm, notify subject
# Draft site.name → surfaces fall back to site.ts “Kaba Fence”
# Admin → Content → search “faq”, filter Live, open edit, Save & publish
```

---

## Still site.ts (by design)

| Item | Why |
|------|-----|
| Unused `howItWorks.*` seeds | Cleanup later |
| Trust-claims Settings | Separate store |
| Media binaries; `siteUrl` / sitemap / `defaultOgImage` alt | Not brand cutover |
| Client component defaults | Safe when props omitted |

---

## Non-goals

- Postgres CMS adapter  
- Big-bang delete of `site.ts`  
- Public Spanish marketing site  

See also: `preview/REUSE_PORT_v1.md` … `v15.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
