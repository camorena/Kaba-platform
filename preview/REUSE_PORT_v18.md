# Reuse port v18 — Stripe deposits + webhooks + mail launch prep

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Vercel project:** `kaba-platform`  
**Prior:** `preview/REUSE_PORT_v5.md` (Stripe scaffold), `v6.md` (pay links), `v7.md` (mail), `v17.md` (Postgres + credentials)

---

## Status

| Piece | Code | Env on Vercel |
|-------|------|---------------|
| Checkout Session (admin) | `POST /api/payments/checkout` | Needs `STRIPE_SECRET_KEY` |
| Checkout Session (public) | `POST /api/pay/[token]/checkout` | Needs `STRIPE_SECRET_KEY` |
| Public pay page | `GET /pay/[token]` | Works offline without keys |
| Webhook (idempotent) | `POST /api/stripe/webhook` | Needs `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` |
| Mail notify (quotes + payments) | `src/lib/mail` + `src/lib/db/notify.ts` | Needs `MAIL_FROM` + `RESEND_API_KEY` or `SMTP_*` |

Code path is production-ready and build-safe without Stripe/mail keys. Live deposits require you to paste keys (do not invent them).

---

## Env vars to set (names only)

### Stripe (required for real deposits)

| Name | Where | Purpose |
|------|-------|---------|
| `STRIPE_SECRET_KEY` | Vercel Production + Preview | Create Checkout Sessions (`sk_test_…` or `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Vercel Production + Preview | Verify webhook signatures (`whsec_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel Production + Preview | Documented / future Elements (`pk_test_…` / `pk_live_…`) |
| `NEXT_PUBLIC_SITE_URL` | Vercel Production (+ Preview if desired) | Canonical origin for Checkout success/cancel URLs — `https://kaba-platform.vercel.app` |

CLI (values from Stripe Dashboard — never commit):

```bash
# From repo root; paste each value when prompted (or pipe via printf)
vercel env add STRIPE_SECRET_KEY production --project kaba-platform
vercel env add STRIPE_SECRET_KEY preview --project kaba-platform
vercel env add STRIPE_WEBHOOK_SECRET production --project kaba-platform
vercel env add STRIPE_WEBHOOK_SECRET preview --project kaba-platform
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --project kaba-platform
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview --project kaba-platform
vercel env add NEXT_PUBLIC_SITE_URL production --project kaba-platform
# value: https://kaba-platform.vercel.app
```

### Mail (optional — receipt/owner alerts)

| Name | Purpose |
|------|---------|
| `MAIL_FROM` | Required From: (e.g. `Kaba Fence <noreply@yourdomain.com>`) |
| `RESEND_API_KEY` | Prefer Resend when set with `MAIL_FROM` |
| `MAIL_TO_OWNERS` | Comma-separated owner alert recipients |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | Used when Resend is unset |

Without mail keys, `notifyQuoteCreated` / `notifyPaymentReceived` / `notifyInvoicePayLink` are honest no-ops (ledger still writes). Admin Email pay link: v19.

---

## Stripe Dashboard — webhook endpoint

Register once for the production host:

| Field | Value |
|-------|-------|
| Endpoint URL | `https://kaba-platform.vercel.app/api/stripe/webhook` |
| Events | `checkout.session.completed` |
| Signing secret | paste into `STRIPE_WEBHOOK_SECRET` on Vercel |

Local forward (optional):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# → paste the printed whsec_… into .env.local STRIPE_WEBHOOK_SECRET
```

After env changes: redeploy (or wait for the next push deploy).

---

## Public pay link pattern

| Item | Value |
|------|-------|
| URL pattern | `https://kaba-platform.vercel.app/pay/{token}` |
| Demo tokens (seed) | `kf_pay_demo_1001_alicia`, `kf_pay_demo_1002_chris`, `kf_pay_demo_1003_sam` |
| Example | https://kaba-platform.vercel.app/pay/kf_pay_demo_1002_chris |
| Admin | Invoice detail → **Copy / Share / Email pay link** (email needs mail env — see v19) |
| Public checkout | Pay page → **Pay deposit** → Stripe Hosted Checkout |

No admin cookie required. Token lives on each invoice (`pay_token` / `payToken`).

---

## Deposit flow (happy path)

1. Admin opens invoice (or customer opens `/pay/{token}`).
2. Suggested deposit = 50% of invoice total, capped at remaining balance (min $0.50).
3. `stripe.checkout.sessions.create` with `metadata.invoiceId` (+ `payToken` on public path).
4. Customer pays on Stripe-hosted Checkout.
5. Webhook verifies signature → records payment (idempotent by `event.id` and `cs_…` session id) → syncs invoice `partial`/`paid`.
6. Best-effort `notifyPaymentReceived` (mail when configured).

---

## Migrations

Already in tree:

- `0003_stripe.sql` — `stripe_event_id` (unique) + `stripe_checkout_session_id`
- `0004_pay_token.sql` — opaque `pay_token` on invoices
- `0007_stripe_session_uidx.sql` — unique index on checkout session id

Against Neon / production:

```bash
DATABASE_URL=… npm run db:migrate
# seed once if needed: DATABASE_URL=… npm run db:seed
```

---

## Manual checklist (you)

1. Stripe Dashboard → API keys (test first) → set the three `STRIPE_*` / publishable vars on Vercel Production + Preview.
2. Add webhook endpoint URL above → copy `whsec_…` → `STRIPE_WEBHOOK_SECRET`.
3. Confirm `NEXT_PUBLIC_SITE_URL=https://kaba-platform.vercel.app` on Production.
4. Redeploy; Settings → Platform should show Stripe **Connected** (secret + webhook).
5. Open a demo pay link, pay with test card `4242…`, confirm payment row + invoice status.
6. Add Resend/SMTP + `MAIL_FROM` for pay-link email + receipt/owner notices — see `preview/REUSE_PORT_v19.md`.

---

## Non-goals this pass

- Inventing or committing Stripe/mail secrets  
- Stripe Elements / Payment Intents UI (Hosted Checkout only)  
- PDF receipts  
- Live-mode keys for demos  

See also: `.env.example`, Settings → Platform, `preview/REUSE_PORT_v5.md` … `v7.md`.
