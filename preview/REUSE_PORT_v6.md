# Reuse port v6 — customer pay link + receipt stub

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v5.md` (Stripe Checkout scaffolding + webhook ledger)

---

## Shipped this pass

1. **Opaque pay token on every invoice** — `InvoiceRecord.payToken`  
   Generated at create time (`generatePayToken()`). Memory demo seeds use stable tokens (`kf_pay_demo_1001_alicia`, …).  
   Migration `db/migrations/0004_pay_token.sql` adds unique `invoices.pay_token` (backfills existing rows).

2. **Customer-facing pay page** — `GET /pay/[token]` (no admin cookie)  
   Shows invoice summary, balance, suggested deposit.  
   - **With** `STRIPE_SECRET_KEY`: “Pay deposit securely” → `POST /api/pay/[token]/checkout` → Stripe Hosted Checkout.  
   - **Without** keys: honest offline message + phone/email (no fake card UI).  
   EN + Formal Colombian Spanish toggle on the page. `robots.txt` disallows `/pay` indexing (`noindex` metadata too).

3. **Admin invoice UI — copy / share pay link**  
   Invoice detail: **Copy pay link** + **Share pay link** (Web Share API when available, else clipboard). Sidebar shows the `/pay/…` path.

4. **Receipt stub + notify hook after webhook**  
   - `buildPaymentReceiptStub()` — local receipt shape for the success return URL.  
   - `notifyPaymentReceived()` — persist-then-notify no-op (same contract as `notifyQuoteCreated`).  
   Webhook still writes the payment row first; notify is best-effort and never rolls back the ledger.

5. **Build stays key-free** — no Stripe keys required for `npm run build`. Memory adapter demo works offline.

---

## How to demo

```bash
npm run dev
# Admin (stub): ADMIN_PASSWORD from .env.local → /admin/login
# Open any open invoice (e.g. KF-1001 or KF-1002) → Copy pay link
# Or go straight to:
open http://localhost:3000/pay/kf_pay_demo_1002_chris
# Without Stripe keys: offline message + contact CTAs.
# With test keys: Pay deposit → Stripe Checkout → webhook records payment →
#   return URL shows receipt stub when session matches a ledger row.
```

| Demo token | Invoice | Notes |
|------------|---------|--------|
| `kf_pay_demo_1001_alicia` | KF-1001 | Partial — remaining balance |
| `kf_pay_demo_1002_chris` | KF-1002 | Draft — full suggested deposit |
| `kf_pay_demo_1003_sam` | KF-1003 | Paid — “paid in full” message |

### Stripe test path (optional)

```bash
# .env.local — test keys only
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...   # from: stripe listen --forward-to localhost:3000/api/stripe/webhook
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

stripe listen --forward-to localhost:3000/api/stripe/webhook
# Customer: /pay/kf_pay_demo_1002_chris → Pay deposit
# Admin can still use “Collect deposit (Stripe)” on invoice detail.
```

Postgres (optional): `npm run db:migrate` applies `0004_pay_token`; `npm run db:seed` includes stable demo tokens.

---

## API

| Method | Path | Auth | Effect |
|--------|------|------|--------|
| GET | `/pay/[token]` | pay token | Customer invoice + pay / offline UI |
| POST | `/api/pay/[token]/checkout` | pay token | Create Checkout Session (deposit) |
| POST | `/api/payments/checkout` | admin | Unchanged (admin deposit) |
| POST | `/api/stripe/webhook` | Stripe sig | Record payment → notify stub + receipt log |

Without `STRIPE_SECRET_KEY`, public checkout returns **503** with `{ stripe }` posture (same honesty as admin).

---

## Explicitly next

| Item | Why later |
|------|-----------|
| **Payment Intents / Elements** | Embedded card UI (publishable key) |
| **Email receipts** | Wire `notifyPaymentReceived` to mail transport |
| **Token rotation / expiry** | Before wide public distribution |
| **Auth.js OAuth / MFA** | Before public internet exposure of admin |

---

## Non-goals (this pass)

- Live charges without keys  
- Required Stripe keys for `npm run build`  
- Emailed receipts (stub only)  
- Fake “paid” without webhook or manual ledger row  

See also: `preview/REUSE_PORT_v1.md` … `v5.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.
