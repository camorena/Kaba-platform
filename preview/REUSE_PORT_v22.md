# Reuse port v22 — auto email pay link when invoice is sent

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Prior:** `preview/REUSE_PORT_v21.md` (gone-quiet digest), `v19.md` (manual Email pay link)

---

## Status

| Piece | Code | Env |
|-------|------|-----|
| Elegant pay-link email | `notifyInvoicePayLink` + `templates/invoice-pay-link.ts` | Needs mail |
| Manual **Email pay link** | `POST /api/invoices/[id]/email-pay-link` | Unchanged; stamps notified |
| Auto on first `sent` | `maybeAutoEmailInvoicePayLink` via `PATCH …/invoices/[id]` | Default ON when mail ready |
| Idempotency | `invoices.pay_link_notified_at` (`0008_pay_link_notified.sql`) | Migrate on Postgres |
| Toggle | `KABA_AUTO_EMAIL_PAY_LINK` | Optional; see below |

Mail / Resend / `CRON_SECRET` are **not** invented or committed — paste in Vercel / `.env.local`.

---

## Behavior

1. **Admin marks invoice `sent`** (`PATCH` status → `sent`, and previous status was not `sent`):
   - If auto enabled → call `notifyInvoicePayLink` (customer only; **no** owner BCC).
   - On deliver → set `payLinkNotifiedAt`.
   - If already stamped, mail off, or toggle off → honest skip / no-op (status still updates).
2. **Manual Email pay link** — always sends when mail is ready (may re-send); stamps `payLinkNotifiedAt` **before** soft-marking draft → `sent`, so auto does not double-send.
3. **Toggle (keep simple):**
   - Unset + mail configured → **ON** (default)
   - Unset + mail off → off (notify is a no-op anyway)
   - `KABA_AUTO_EMAIL_PAY_LINK=false` → force off
   - `KABA_AUTO_EMAIL_PAY_LINK=true` → force on (still no-ops inside notify if keys missing)
4. Settings → Platform shows auto badge + env chip.

---

## Migration

```bash
DATABASE_URL=… npm run db:migrate   # applies 0008_pay_link_notified.sql
```

Memory adapter: field on `InvoiceRecord` (seed null).

---

## How to verify

1. Mail configured; open a **draft** invoice with customer email + pay token.
2. Change status to **Sent** (not via Email pay link) → customer receives elegant pay-link email once; `payLinkNotifiedAt` set.
3. Mark sent again / refresh → no second auto email.
4. Click **Email pay link** → still sends (manual).
5. With mail off or `KABA_AUTO_EMAIL_PAY_LINK=false` → status change succeeds; no email; clear reason in `autoPayLink` JSON when applicable.

---

## Non-goals

- Inventing mail / cron secrets  
- BCC on customer pay-link (owner BCC remains quote alerts + quiet digest only)  
- Auto-send on create-from-quote (still creates **draft**)
