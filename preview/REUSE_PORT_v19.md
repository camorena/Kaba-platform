# Reuse port v19 — email pay link + payment receipts

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Vercel project:** `kaba-platform`  
**Prior:** `preview/REUSE_PORT_v7.md` (mail transport), `v18.md` (Stripe + launch prep)

---

## Status

| Piece | Code | Env on Vercel (as of this pass) |
|-------|------|----------------------------------|
| Transport (Resend / SMTP) | `src/lib/mail/*` | **Not set** — add keys below |
| Quote owner alert | `notifyQuoteCreated` | Needs mail env |
| Payment receipt + owner notice | `notifyPaymentReceived` (separate sends) | Needs mail env |
| Admin **Email pay link** | `POST /api/invoices/[id]/email-pay-link` + Invoice detail | Needs mail env |
| Settings → Platform mail badge | Honest Not configured / Resend / SMTP | Reflects env presence |

Stripe is already connected on Vercel. Mail keys are **not** invented or committed — you paste them.

---

## What shipped

1. **`notifyInvoicePayLink`** — customer email with invoice summary + absolute `/pay/{token}` URL (`NEXT_PUBLIC_SITE_URL` / `publicAppOrigin`).
2. **Admin action** — Invoice detail → **Email pay link** (beside Copy/Share). Clear toast when mail is off, no customer email, or no pay token. Draft invoices soft-mark **sent** after a successful send.
3. **`notifyPaymentReceived`** — split into owner notice (`MAIL_TO_OWNERS` or site email) + customer receipt (invoice email). Persist-then-notify unchanged.
4. **`invoicePayUrl` / `publicAppOrigin`** helpers in `src/lib/pay/origin.ts`.
5. Docs: this file, `.env.example`, Settings mail plan copy (EN/ES).

---

## Env vars you must add (Resend preferred)

| Name | Required | Purpose |
|------|----------|---------|
| `MAIL_FROM` | Yes | From: e.g. `Kaba Fence <noreply@yourdomain.com>` — verify domain in Resend |
| `RESEND_API_KEY` | Yes (or SMTP) | Resend API key (`re_…`) |
| `MAIL_TO_OWNERS` | Recommended | Comma-separated owner alerts; else published site email |
| `SMTP_HOST` (+ `PORT` / `USER` / `PASS` / `SECURE`) | Alt | Used only when Resend is unset |

CLI (paste values when prompted — never commit):

```bash
vercel env add MAIL_FROM production --project kaba-platform
vercel env add MAIL_FROM preview --project kaba-platform
vercel env add MAIL_TO_OWNERS production --project kaba-platform
vercel env add MAIL_TO_OWNERS preview --project kaba-platform
vercel env add RESEND_API_KEY production --project kaba-platform
vercel env add RESEND_API_KEY preview --project kaba-platform
# Then redeploy Production
vercel --prod --yes --project kaba-platform
```

After deploy: **Settings → Platform → Email notifications** should show **Resend**.

---

## How to verify

1. Open an invoice with `customerEmail` + `payToken` (demo: Chris / `kf_pay_demo_1002_chris`).
2. Click **Email pay link** — with keys: customer receives summary + `https://kaba-platform.vercel.app/pay/…`; without keys: clear error toast / 503.
3. Complete a Stripe test deposit → webhook → customer receipt + owner notice (when mail ready).
4. Submit a public quote → owner alert (when mail ready).

---

## Non-goals

- Inventing or committing mail secrets  
- Sending real email from this agent session  
- PDF attachments / HTML design system beyond plain text + `<pre>`  
- Auto-email on every status change (admin action is explicit)

See also: `.env.example`, Settings → Platform, `preview/REUSE_PORT_v7.md`, `v18.md`.
