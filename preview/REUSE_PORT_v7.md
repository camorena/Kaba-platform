# Reuse port v7 — mail notify + CMS content scaffold

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v6.md` (customer pay link + receipt stub)

---

## Shipped this pass

### 1. Optional mail transport (persist-then-notify)

Wire `notifyQuoteCreated` / `notifyPaymentReceived` to **Resend** or **SMTP** via env.

| Env | Role |
|-----|------|
| `MAIL_FROM` | Required From: for either transport |
| `RESEND_API_KEY` | Prefer Resend HTTP API when set with `MAIL_FROM` |
| `SMTP_HOST` (+ `SMTP_PORT` / `USER` / `PASS` / `SECURE`) | Used when Resend is not configured |
| `MAIL_TO_OWNERS` | Comma-separated owner alerts (else `siteConfig.email`) |

- **No keys:** honest no-op; quote/payment rows still save first.  
- **Settings → Platform:** Email notifications badge (`Not configured` / `Resend` / `SMTP`) + key presence.  
- Build stays key-free (`npm run build` without mail env).  
- Code: `src/lib/mail/*`, `src/lib/db/notify.ts`.

### 2. Light CMS registry scaffold (Phase A)

Inspired by prior kaba-fence content-type registry — **without** ripping public `site.ts`.

| Surface | Path |
|---------|------|
| Registry | `src/lib/cms/content-types.ts` |
| Memory store (default) | `src/lib/cms/memory-store.ts` (seeded from `site.ts`) |
| Public roadmap | `src/lib/cms/roadmap.ts` + `preview/CMS_PUBLIC_CONTENT_PLAN.md` |
| Optional SQL | `db/migrations/0005_cms_content.sql` |
| Admin hub | `/admin/content` |
| List / edit stubs | `/admin/content/[type]`, `/admin/content/[type]/[id]` |
| API | `PATCH /api/admin/content/[type]` |

**Phase A types:** `fence-types` · `services` · `projects` · `faqs`.

**Planned (hub “upcoming”):** site-copy, about, testimonials, service-area, materials, media library, optional public bilingual — full phased plan in `preview/CMS_PUBLIC_CONTENT_PLAN.md`.

### 3. i18n

Admin EN + Formal Colombian Spanish for Content nav, hub/list/edit, Settings mail block.

---

## How to enable mail

```bash
# .env.local — pick ONE transport (Resend preferred)
MAIL_FROM="Kaba Fence <noreply@yourdomain.com>"
MAIL_TO_OWNERS="owner@kabafence.example"

# Option A — Resend
RESEND_API_KEY=re_...

# Option B — SMTP (used if Resend unset)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=...
# SMTP_PASS=...
# SMTP_SECURE=false

npm run dev
# Settings → Platform → Email notifications badge should show Resend or SMTP
# Submit a quote or complete a Stripe payment → notify attempts real send
```

Without keys: badge **Not configured**; notifies return `delivered: false` with a clear reason; leads/payments remain saved.

---

## How to demo CMS (no public swap yet)

```bash
npm run dev
# Admin → Content (or /admin/content)
# Open Fence types / Services / Projects / FAQs → Edit → Save
# Edits stay in memory until process restart; live site still uses site.ts
```

Postgres optional: `npm run db:migrate` applies `0005_cms_content` (table ready; runtime still memory until a postgres CMS adapter is added).

---

## Swap path (do not big-bang)

See **`preview/CMS_PUBLIC_CONTENT_PLAN.md`**. Short version:

1. Stabilize admin edits for one type.  
2. Add `getPublished*(type)` with `site.ts` fallback.  
3. Point one marketing page at CMS.  
4. Remove or re-export the `site.ts` slice.  
5. Next type.

---

## Explicitly next

| Item | Why |
|------|-----|
| **Responsive admin agency pass (v7b)** | Mobile/tablet/desktop polish across admin |
| **Phase B content types** | site-copy, about, testimonials, service-area, materials |
| **Phase C media upload** | Alt + provenance before gallery is CMS-owned |
| **Postgres CMS adapter** | When leaving memory for content docs |
| **Publish + revalidate** | When public readers cut over |

---

## Non-goals (this pass)

- Required mail keys for build  
- Live site reading CMS instead of `site.ts`  
- Media binary upload  
- Full draft → review → rollback workflow  

See also: `preview/REUSE_PORT_v1.md` … `v6.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.
