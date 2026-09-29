# Reuse port v24 — Calendar polish + editable scheduled_for

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live:** https://kaba-platform.vercel.app  
**Prior:** `preview/REUSE_PORT_v23.md` (visit reminders)

---

## Status

| Piece | Code | Notes |
|-------|------|-------|
| Editable visit day | Quote detail date control → `PATCH /api/quotes/[id]` `scheduledFor` | Clear when status is `scheduled` / `won`; disabled + honest hint otherwise |
| Adapters | Memory + Postgres already persist `scheduled_for` | Changing the day clears `visit_reminder_sent_at` (v23) |
| Calendar | Prefers `quotes.scheduled_for`; stub fallback if missing | Localized EN + Formal Colombian Spanish; phone/tablet/desktop polish |
| Drag-drop onto calendar | **Not** shipped | Low-risk path is date on quote detail |

Mail / `CRON_SECRET` are **not** invented — see v23.

---

## What changed

1. **Quote detail** — Site visit / install window date (`type="date"`) next to status. Saves immediately via existing PATCH. Hint explains Chicago calendar day + visit reminders. Link to Schedule when a day is set.
2. **API** — `PATCH` accepts `scheduledFor: YYYY-MM-DD | null` alongside `status` / `notes`.
3. **Calendar UX** — Status-tinted event chips, today marker, filter applies to month grid + upcoming list, locale month title, Formal ES kind/time labels, stub “Suggested day” when `scheduled_for` is missing, empty state → quotes, quiet footnote. Upcoming list first on phone.
4. **Copy** — Schedule page description no longer claims a booking engine; points operators to the quote date.

---

## How to verify

1. Open a quote → mark **Scheduled** or **Won** → set the visit / install day → save toast.
2. `/admin/calendar` shows the job on that day; click through back to the quote.
3. Change the day → calendar updates; reminder stamp clears (v23) so a reschedule can remind again.
4. Toggle EN / ES — Schedule + detail strings localize (usted Formal Colombian Spanish).
5. `npx tsc --noEmit` clean.

---

## Non-goals

- Inventing mail / cron secrets  
- Vercel project delete/rename / env invention  
- Calendar drag-and-drop booking  
- Separate visits table  
