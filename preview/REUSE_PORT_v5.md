# Reuse port v5 — Stripe Checkout scaffolding + webhook ledger

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v4.md` (credentials auth + trust claims server save)

---

## Shipped this pass

1. **Stripe env posture** — `src/lib/stripe/config.ts`  
   | Variable | Role |
   |----------|------|
   | `STRIPE_SECRET_KEY` | Create Checkout Sessions (server) |
   | `STRIPE_WEBHOOK_SECRET` | Verify `POST /api/stripe/webhook` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Documented for future Elements; Checkout redirect needs secret only |

   Without keys: Payments UI shows honest **“not connected”**; Settings → Platform badge matches.  
   With secret only: badge **Checkout ready**. Secret + webhook: **Connected**.

2. **Checkout Session for invoice deposit** — `POST /api/payments/checkout` (admin auth)  
   Default amount = 50% of invoice total, capped at remaining balance (override with `amountCents`).  
   Opens Stripe-hosted Checkout; metadata carries `invoiceId`.

3. **Webhook → payments repo (persist-then-notify style)** — `POST /api/stripe/webhook`  
   On `checkout.session.completed`: write payment row first (idempotent by Stripe `event.id`), then invoice status sync inside `payments.record`.  
   Migration `db/migrations/0003_stripe.sql` adds `stripe_event_id` (unique) + `stripe_checkout_session_id`.

4. **Settings → Platform** shows live per-key status (EN + Formal Colombian Spanish).

5. **Build stays key-free** — `stripe` is a dependency but never constructed without `STRIPE_SECRET_KEY`. No live charges in demo without keys.

---

## How to enable Stripe (test mode)

```bash
# 1. Stripe Dashboard → Developers → API keys (test)
#    Add to .env.local:
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...   # from CLI listen or Dashboard endpoint

# 2. Optional Postgres (webhook ledger durable):
# docker compose up -d
# DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate  # includes 0003
# KABA_DATA_ADAPTER=postgres

# 3. Forward webhooks locally:
# stripe listen --forward-to localhost:3000/api/stripe/webhook
# → paste the whsec_… into STRIPE_WEBHOOK_SECRET

# 4. Restart next → /admin/payments or invoice detail → “Collect deposit (Stripe)”
```

Memory adapter also accepts webhook writes (in-process; resets on cold start).

### Dashboard webhook (hosted)

Endpoint URL: `https://<your-host>/api/stripe/webhook`  
Events: at least `checkout.session.completed`.

---

## API

| Method | Path | Auth | Effect |
|--------|------|------|--------|
| POST | `/api/payments/checkout` | admin | Create Checkout Session for invoice deposit |
| POST | `/api/stripe/webhook` | Stripe signature | Record payment (idempotent by `event.id`) |
| POST | `/api/payments` | admin | Manual ledger row (unchanged) |

Without `STRIPE_SECRET_KEY`, checkout returns **503** with `{ stripe }` posture.  
Without secret + webhook secret, webhook returns **503**.

---

## Explicitly next

| Item | Why later |
|------|-----------|
| **Customer-facing pay link** | Public tokenized invoice page (no admin cookie) |
| **Payment Intents / Elements** | Embedded card UI (publishable key) |
| **Receipts + email** | After mail transport (`notifyQuoteCreated` path) |
| **Auth.js OAuth** | Optional; credentials path already uses profiles.role |
| **MFA / rate limits** | Before public internet exposure |

---

## Non-goals (this pass)

- Live charges without keys (demo stays safe)  
- Required Stripe keys for `npm run build`  
- Connect / multi-party payouts  
- Fake “paid” without a webhook or manual record  

See also: `preview/REUSE_PORT_v1.md` … `v4.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.
