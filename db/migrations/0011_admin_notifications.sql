-- Admin notifications bell — per-user read state.
-- Items themselves are derived from quotes / invoices / payments at read time
-- (no fake rows, nothing to backfill). Idempotent; safe to re-run.

create table if not exists admin_notification_reads (
  profile_id        uuid        not null references profiles (id) on delete cascade,
  notification_key  text        not null check (length(notification_key) between 1 and 200),
  read_at           timestamptz not null default now(),
  primary key (profile_id, notification_key)
);

create index if not exists admin_notification_reads_read_at_idx
  on admin_notification_reads (read_at);

-- "Mark all as read": everything that started before this instant counts as read.
alter table profiles add column if not exists notifications_cleared_at timestamptz;
