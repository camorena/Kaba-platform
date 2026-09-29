-- Idempotent pay-link email tracking — set when customer was emailed /pay/{token}.
-- Used by auto-email-on-sent and admin "Email pay link" (manual may refresh the stamp).
-- Applied by: DATABASE_URL=… npm run db:migrate
-- © 2026 Datelica LLC — Kaba Fence.

alter table invoices
  add column if not exists pay_link_notified_at timestamptz;

comment on column invoices.pay_link_notified_at is
  'Set when the customer pay-link email was delivered. Null = never emailed (or mail failed). Blocks auto re-send; manual Email pay link may refresh.';
