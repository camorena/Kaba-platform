# Reuse port v26 — Pre-production review checklist

**Date:** 2026-09-30 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app (`prj_4KoYIwmpM332ccXaUBH2HUpEg70z`)  
**Team:** `carlos-s-projects-39e2de15`  
**Prior:** `preview/REUSE_PORT_v25.md` (Option A — old `kaba-fence` paused)  
**Deploy (this pass):** `dpl_2XPHR3bDKHkQQgSrPbDmD1uKWqtU` → READY · aliased to production  
**Deployment URL:** https://kaba-platform-i3zuws73e-carlos-s-projects-39e2de15.vercel.app  
**Git (local main at deploy):** `c395090` (v25 docs; this checklist is the follow-on commit)

---

## What this pass did

1. Confirmed **kaba-platform was not paused** (already serving READY production).
2. **Redeployed production** (`vercel deploy --prod`) so latest main tree is live.
3. Confirmed **kaba-fence left paused** (public URL **503**). Do not resume unless explicitly requested.
4. Verified production env **names** present (values not printed).
5. Wrote this pre-production review checklist.

### Env names present (Production)

`AUTH_SECRET` · `DATABASE_URL` · `KABA_DATA_ADAPTER` · `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` · `CRON_SECRET` · `RESEND_API_KEY` · `MAIL_FROM` · `MAIL_TO_OWNERS` · (+ `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`)

### Smoke (HTTP)

| Route | Result |
|-------|--------|
| `GET /` | **200** |
| `GET /admin` | **307** → `/admin/login` |
| `GET /admin/login` | **200** |
| `GET /about`, `/contact`, `/services` | **200** |
| `GET /quote` | **307** → `/contact` (quote entry via contact) |
| `GET /pay/fake-token` | **200** (pay page shell; invalid token UX) |
| `https://kaba-fence.vercel.app` | **503** (still paused — intentional) |

---

## Pre-production review checklist

Use https://kaba-platform.vercel.app. Login: `mariajose@kabafence.example` (owner). Keep Stripe in **test** mode.

### 1. Auth

- [ ] `/admin` redirects to `/admin/login` when logged out
- [ ] Owner login succeeds; bad password rejected
- [ ] Logout clears session; protected routes bounce back to login
- [ ] Confirm whether demo `owner@kabafence.example` still exists — **retire / rotate password** before go-live

### 2. Public pages

- [ ] Home, About, Services, Residential, Commercial, Gallery, FAQ, How it works, Materials, Reviews, Service area, Privacy, Terms — load and look correct EN + Formal ES
- [ ] Contact form reachable; `/quote` still redirects to contact (expected)
- [ ] Mobile + desktop nav; no broken images / obvious layout breaks

### 3. Quote + mail

- [ ] Submit a test lead/quote from contact (or admin create quote)
- [ ] Owner notification arrives via Resend (`MAIL_FROM` → `MAIL_TO_OWNERS`)
- [ ] Quote appears in `/admin/quotes` with expected status
- [ ] If Resend key was ever chat-exposed: **rotate key** in Vercel + Resend, then retest

### 4. Pay links / Stripe (test only)

- [ ] From an invoice, send / open pay link (`/pay/[token]`)
- [ ] Checkout uses **Stripe test** keys; complete a test card payment
- [ ] Webhook updates payment / invoice status in admin
- [ ] **Do not** switch Stripe to live until domain + go-live gate

### 5. Calendar / `scheduled_for`

- [ ] On a quote marked Scheduled/Won, set visit/install day (`scheduled_for`)
- [ ] `/admin/calendar` shows the job on that day; deep-link back to quote
- [ ] Changing the day updates calendar and clears visit-reminder stamp (v23/v24)

### 6. Crons

| Cron | Path | Schedule (UTC) |
|------|------|----------------|
| Quiet digest | `/api/cron/quiet-digest` | `0 12 * * *` |
| Visit reminders | `/api/cron/visit-reminders` | `15 12 * * *` |

- [ ] Both listed in Vercel project → Cron Jobs
- [ ] Auth via `CRON_SECRET` (unauthorized = reject)
- [ ] Optional: trigger once manually with secret header; confirm mail side-effects in test

### 7. Admin responsive

- [ ] Phone / tablet / desktop: quotes, calendar, invoices, pipeline, settings
- [ ] No horizontal scroll traps; primary actions reachable (see prior admin responsive reviews)

### 8. Known blockers / go-live gates (do not bypass in this review)

| Blocker | Status | Action |
|---------|--------|--------|
| **kabafence.com** still Squarespace Coming Soon | Not cut over | DNS / domain attach only when ready — **no DNS change this pass** |
| Stripe **test** mode | Intentional | Stay on test until launch checklist signed off |
| Resend API key | May have been chat-exposed historically | Rotate if still the old key |
| Demo owner account | May still exist | Retire or force password change |
| Old **kaba-fence** Vercel project | Paused + git disconnected (Option A) | Leave paused; do not resume |

---

## Explicitly not done this pass

- Resume / unpause `kaba-fence`
- Stripe live-mode keys
- DNS / Squarespace / `kabafence.com` cutover
- Printing or rotating secrets in chat

---

## Remaining pre-prod risks (short)

1. Custom domain still on Squarespace — production traffic is only on `*.vercel.app`.
2. Payments are test-mode only — no real charges until live keys + webhook re-point.
3. Credential hygiene: rotate Resend if exposed; remove/rotate demo owner.
4. Cron mail depends on Resend + correct `MAIL_*` — verify once with a real scheduled quote before launch.
5. Two Vercel projects historically confused deploys — keep using **kaba-platform** only; leave **kaba-fence** paused.
