-- Visit reminders — calendar day on quotes + idempotent stamp.
-- Entity: quotes with status scheduled (site visit) or won (install window).
-- No separate visits table exists; calendar already derives jobs from these quotes.
-- Applied by: DATABASE_URL=… npm run db:migrate
-- © 2026 Datelica LLC — Kaba Fence.

alter table quotes
  add column if not exists scheduled_for date;

alter table quotes
  add column if not exists visit_reminder_sent_at timestamptz;

comment on column quotes.scheduled_for is
  'Visit / install calendar day (America/Chicago date). Null = not scheduled on calendar; cron skips.';

comment on column quotes.visit_reminder_sent_at is
  'Set when the tomorrow visit-reminder email was delivered. Cleared when scheduled_for changes.';

create index if not exists quotes_scheduled_for_idx
  on quotes (scheduled_for)
  where scheduled_for is not null
    and status in ('scheduled', 'won');

-- Backfill stub calendar days used by listScheduleJobs (scheduled +2d, won +5d from updated_at).
update quotes
set scheduled_for = (
  (updated_at at time zone 'America/Chicago')::date
  + case when status = 'scheduled' then 2 else 5 end
)
where status in ('scheduled', 'won')
  and scheduled_for is null;
