# Reuse port v21 — gone-quiet morning digest (+ auto pay-link notes)

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Prior:** `preview/REUSE_PORT_v20.md` (quote owner + customer mail), `v19.md` (pay-link email)

---

## Status

| Piece | Code | Env on Vercel |
|-------|------|---------------|
| Quiet logic | `src/lib/db/quiet.ts` + `listQuietQuotes` (unchanged) | Postgres adapter recommended |
| Digest email | `notifyQuietDigest` + `templates/quiet-digest.ts` | Needs mail env |
| Cron route | `GET/POST /api/cron/quiet-digest` | Needs `CRON_SECRET` (+ mail) |
| Schedule | `vercel.json` → `0 12 * * *` UTC | Deploy to activate |
| Quote notify (v20) | Still wired on `POST /api/quotes` | Needs mail env |
| Auto pay-link | Shipped in **v22** | See `REUSE_PORT_v22.md` |

Mail / Resend secrets are **not** invented or committed — paste them in Vercel / `.env.local`.

---

## What shipped

1. **Morning digest** — elegant HTML (agency shell) + plain text: count, name / status / days silent, deep link per quote + “View all quiet quotes” → `/admin/quotes#gone-quiet`.
2. **Recipients** — same pattern as quote owner copy:
   - **To:** `MAIL_TO_OWNERS` (recommended: `kabafencellc@gmail.com`) or published site email fallback
   - **Bcc:** `camoren222@gmail.com` always (`QUOTE_OWNER_ALWAYS_COPY`), deduped
3. **Cron** — `vercel.json` schedules `GET /api/cron/quiet-digest` at **`0 12 * * *` UTC**  
   ≈ **07:00 America/Chicago** during CDT (UTC−5); **06:00** during CST (UTC−6). Documented in route header + `.env.example`.
4. **Auth** — `CRON_SECRET` Bearer **or** `x-vercel-cron: 1` (`src/lib/cron/auth.ts`). Unauthorized → 401.
5. **Honest no-ops** — if mail is off or the quiet list is empty, route still returns **200** with `reason` for cron logs (never invents keys).
6. **EN copy** — Formal Colombian Spanish mail templates are not present yet (admin UI i18n only); digest stays EN until an ES mail pack lands.
7. **Auto pay-link** — shipped in `preview/REUSE_PORT_v22.md` (`KABA_AUTO_EMAIL_PAY_LINK`, default ON when mail configured).

---

## Env steps (you paste — do not invent keys)

```bash
# If not already set (v19/v20):
vercel env add MAIL_FROM production --project kaba-platform
vercel env add MAIL_TO_OWNERS production --project kaba-platform
# recommended: kabafencellc@gmail.com
vercel env add RESEND_API_KEY production --project kaba-platform

# New for digest cron:
vercel env add CRON_SECRET production --project kaba-platform
# value: openssl rand -hex 32

vercel --prod --yes --project kaba-platform
```

Verify From domain in Resend before expecting delivery. Confirm Cron Jobs in the Vercel project settings after deploy.

---

## How to verify

1. Deploy with `CRON_SECRET` + mail env (or test locally with both in `.env.local`).
2. Manual:
   ```bash
   curl -s -H "Authorization: Bearer $CRON_SECRET" \
     https://kaba-platform.vercel.app/api/cron/quiet-digest
   ```
3. With quiet leads + mail: owners (+ BCC) get the digest.  
   Without mail: JSON `emailed: false` + clear `reason`; still HTTP 200.  
   Empty quiet list: `quietCount: 0`, digest skipped.
4. Quote form path unchanged: `POST /api/quotes` → `notifyQuoteCreated` (owner + customer) still wired.

---

## Confirmed still wired (mail paths)

| Path | Function | Trigger |
|------|----------|---------|
| Quote owner alert + customer confirmation | `notifyQuoteCreated` | `POST /api/quotes` |
| Invoice pay-link email | `notifyInvoicePayLink` | Admin **Email pay link** |
| Payment owner notice + customer receipt | `notifyPaymentReceived` | Stripe webhook / record payment |
| Gone-quiet digest | `notifyQuietDigest` | Cron `/api/cron/quiet-digest` |

---

## Next

Shipped separately: **v22** auto pay-link on sent. Remaining: bilingual EN/ES digest templates when an ES mail pack lands.

---

## Non-goals

- Inventing or committing `RESEND_API_KEY` / `CRON_SECRET`
- Bilingual EN/ES digest templates (no ES mail pack yet)
- Changing quiet threshold (still 3 days) or quiet statuses
