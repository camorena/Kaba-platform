# Reuse port v23 — visit reminders (day before)

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Prior:** `preview/REUSE_PORT_v22.md` (auto pay-link), `v21.md` (gone-quiet digest)

---

## Status

| Piece | Code | Env |
|-------|------|-----|
| Entity | Quotes with status `scheduled` (site visit) or `won` (install window) + `scheduled_for` date | No separate visits table |
| Reminder email | `notifyVisitReminder` + `templates/visit-reminder.ts` | Needs mail |
| Cron route | `GET/POST /api/cron/visit-reminders` | Needs `CRON_SECRET` (+ mail) |
| Schedule | `vercel.json` → `15 12 * * *` UTC | Deploy to activate |
| Idempotency | `quotes.visit_reminder_sent_at` (`0009_visit_reminders.sql`) | Migrate on Postgres |
| Toggle | `KABA_AUTO_VISIT_REMINDERS` | Optional; see below |

Mail / Resend / `CRON_SECRET` are **not** invented or committed — paste in Vercel / `.env.local`.

---

## What we found (data model)

There is **no** `visits` / `appointments` table. Admin Calendar (`listScheduleJobs`) already derives “Site visit” / “Install window” stubs from quotes in status `scheduled` or `won` (previously from `updatedAt` + offset).

v23 persists that day on the quote:

- `quotes.scheduled_for` (`date`) — visit / install calendar day (America/Chicago)
- `quotes.visit_reminder_sent_at` (`timestamptz`) — reminder delivered stamp

Migration backfills existing `scheduled`/`won` rows using the prior stub offsets (+2d / +5d from `updated_at` in Chicago). Marking a quote `scheduled`/`won` without a date auto-assigns the same defaults. Changing `scheduled_for` clears the reminder stamp so a reschedule can remind again.

---

## Behavior

1. **Cron** (`15 12 * * *` UTC ≈ **07:15 America/Chicago** CDT; **06:15** CST) — at least 15 minutes after quiet digest (`0 12 * * *` UTC).
2. Selects quotes where:
   - status ∈ `scheduled` | `won`
   - `scheduled_for` = tomorrow (America/Chicago calendar day)
   - `visit_reminder_sent_at` is null
   - customer `email` present
3. For each: elegant HTML + plain text to the **customer**; **Bcc** `MAIL_TO_OWNERS` (or published site email) **and** always `camoren222@gmail.com` (`QUOTE_OWNER_ALWAYS_COPY`), deduped, excluding the customer address — same owner-awareness pattern as quote alerts, on a single customer-facing send.
4. On deliver → set `visit_reminder_sent_at`.
5. **Toggle:**
   - Unset + mail configured → **ON** (default)
   - Unset + mail off → off (notify is a no-op anyway)
   - `KABA_AUTO_VISIT_REMINDERS=false` → force off
   - `KABA_AUTO_VISIT_REMINDERS=true` → force on (still no-ops inside notify if keys missing)
6. Settings → Platform shows auto badge + env chip (same language as pay-link auto).
7. **No** manual “Send reminder” UI — calendar/quote detail has no pay-link-equivalent surface; cron is the path.

---

## Migration

```bash
DATABASE_URL=… npm run db:migrate   # applies 0009_visit_reminders.sql
```

Memory adapter: fields on `QuoteRecord` (demo scheduled seed uses tomorrow for easy local cron checks).

---

## How to verify

1. Mail + `CRON_SECRET` configured; a `scheduled`/`won` quote with customer email and `scheduled_for` = tomorrow (Chicago).
2. Manual:
   ```bash
   curl -s -H "Authorization: Bearer $CRON_SECRET" \
     https://kaba-platform.vercel.app/api/cron/visit-reminders
   ```
3. Customer receives reminder; owners (+ always-copy) on BCC; `visit_reminder_sent_at` set.
4. Re-run → idempotent skip for that quote.
5. With mail off or `KABA_AUTO_VISIT_REMINDERS=false` → HTTP 200 + clear `reason`; no email.

---

## Non-goals

- Inventing mail / cron secrets  
- Separate visits table  
- Manual send-reminder button (no clear UI surface)  
- Bilingual ES mail templates (admin i18n only for Settings badges)
