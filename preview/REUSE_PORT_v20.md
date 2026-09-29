# Reuse port v20 — quote-form email notifications

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Prior:** `preview/REUSE_PORT_v7.md` (transport), `v19.md` (pay-link + receipts)

---

## Status

| Piece | Code | Env on Vercel |
|-------|------|---------------|
| Transport (Resend / SMTP) | `src/lib/mail/*` | Add keys below if not set |
| Quote owner alert | `notifyQuoteCreated` → To `MAIL_TO_OWNERS` + BCC `camoren222@gmail.com` | Needs mail env |
| Quote customer confirmation | same path → elegant HTML | Needs mail env + customer email |
| Templates | `src/lib/mail/templates/*` | — |

Mail secrets are **not** invented or committed — paste them in Vercel / `.env.local`.

---

## What shipped

1. **Owner alert** — HTML + plain text with lead details (name, phone, email, project/service, address, notes, preferred contact, admin link).  
   - **To:** `MAIL_TO_OWNERS` (comma-separated) or published site email fallback (`kabafencellc@gmail.com`).  
   - **Bcc:** `camoren222@gmail.com` always (`QUOTE_OWNER_ALWAYS_COPY`), even when `MAIL_TO_OWNERS` is only the business inbox. Deduped if already listed in To.
2. **Customer confirmation** — agency HTML (muted gold `#c08b3a`, charcoal/cream, Georgia/Arial ≈ Playfair+Inter) + plain-text fallback. Thank you, what happens next, phone `(919) 292-4777`, `kabafencellc@gmail.com`. No fake promises.
3. **Wire** — still `POST /api/quotes` → persist → `notifyQuoteCreated` → patch `notifiedAt` / `notifyAttempts`. `notifiedAt` flips when **owner** notice delivers; customer send is best-effort in the same call.
4. **cc/bcc** support on `sendMail` (Resend + SMTP).
5. Docs: this file, `.env.example`, README mail section.

---

## Env steps (you paste — do not invent keys)

```bash
vercel env add MAIL_FROM production --project kaba-platform
vercel env add MAIL_TO_OWNERS production --project kaba-platform
# recommended value: kabafencellc@gmail.com
vercel env add RESEND_API_KEY production --project kaba-platform
# Same for preview if you use Preview deploys
vercel --prod --yes --project kaba-platform
```

Verify the From domain in the Resend dashboard before expecting delivery.

Without keys: honest no-op + reason in API JSON / logs; quote row still saves.

---

## How to verify

1. Submit `/quote` (or `POST /api/quotes` with the same fields).
2. With mail configured: owner inbox + `camoren222@gmail.com` get the lead alert; customer gets confirmation.
3. Without mail: response `notified: false` and a clear `notifyReason`; lead still in admin.

---

## Non-goals

- Inventing or committing Resend/SMTP secrets  
- Sending real email from the agent session  
- Changing public quote form field contract  
- Bilingual EN/ES customer templates (public form is EN)
