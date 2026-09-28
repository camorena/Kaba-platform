# Reuse port v14 — remaining contact CTAs + fencing/legal nav labels

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v13.md` (nav/footer/contact + materials FAQ + JSON-LD towns)

---

## Shipped this pass

### 1. Remaining phone/email CTAs ← `getPublishedContactInfo()`

Surfaces that still read `siteConfig.phone` / `email` directly now prefer published site-copy contact (group `contact`) with `site.ts` fallback:

| Surface | Notes |
|---------|-------|
| `/faq`, `/`, `/residential`, `/commercial` | Hero / CTA call links |
| `/about`, `/services`, `/materials`, `/service-area` | Bottom / hero call links |
| `QuoteForm` confirmation | Prop from `/contact` |
| `/pay` layout + token page + offline CTAs | Layout + PayPageClient props |
| `/privacy`, `/terms` | Contact blocks + inline copy |
| `not-found` | Phone CTA + Header/Footer published props |
| Launch-blockers dashboard hours row | Phone/email/hours from published contact |
| Mail `resolveOwnerEmails` + notify `replyTo` | Published email when env unset |

Header / Footer / `/contact` / JSON-LD / chatbot contact were already cut over in v13.

### 2. `fencingOptionsNav` + `legalLinks` labels from site-copy

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedFencingOptionsNav()` | Header fencing dropdown, Footer fencing column | Per-slug `fencingNav.{slug}.label` → else `site.ts` |
| `getPublishedLegalLinks()` | Footer legal bar | Per-slug `legal.{slug}.label` → else `site.ts` |

- Seeded into site-copy group **nav** (label option now “Nav / footer / fencing / legal”).
- Hrefs stay from `site.ts`. Marketing layout + `not-found` pass props into Header / Footer.

### 3. Docs + i18n

- Roadmap `site-copy` `publicPaths` / notes → v14 (fencingNav, legal, CTAs, pay).
- `preview/CMS_PUBLIC_CONTENT_PLAN.md` → v14 snapshot.
- Admin EN + Formal Colombian Spanish content hub description/meta/swap note → v14.
- This note is the v14 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content → Site copy
# Edit fencingNav.wood.label → Published → refresh header fencing dropdown
# Edit legal.privacy.label → Published → footer legal bar
# Draft all contact.phone → FAQ / home / pay / QuoteForm / 404 fall back to site.ts phone
# Edit contact.email → Published → pay footer + mail owner fallback (when MAIL_TO_OWNERS unset)
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| Everything from v13 | Address / social URLs |
| Remaining Call/email CTAs listed above | Brand `name` / description / unused `howItWorks.*` |
| Fencing dropdown + footer fencing labels | Admin invoice letterhead phone/email |
| Footer legal labels | Trust-claims Settings (separate) |
| | Media binaries |

Admin edits for non-cutover types/keys remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Media binary upload | Only with alt + EXIF strip |
| Wire Settings trust-claims → public badges | Optional; keep honest |
| Remove unused `howItWorks.*` seeds | Cleanup |
| Address / social ← site-copy | Optional chrome polish |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Merging About CMS with Settings trust-claims  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  
- Public Spanish marketing site  

See also: `preview/REUSE_PORT_v1.md` … `v13.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
