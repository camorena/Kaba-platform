-- Stripe scaffolding — idempotent payment rows by Stripe event id.
-- Applied by: DATABASE_URL=… npm run db:migrate
-- Runtime stays key-free until STRIPE_* env vars are set (see preview/REUSE_PORT_v5.md).
-- © 2026 Datelica LLC — Kaba Fence.

alter table payments
  add column if not exists stripe_event_id text;

alter table payments
  add column if not exists stripe_checkout_session_id text;

comment on column payments.stripe_event_id is
  'Stripe event.id that created this row. Unique when set — webhook retries are idempotent.';

comment on column payments.stripe_checkout_session_id is
  'Checkout Session id (cs_…) when payment came from Stripe Checkout.';

create unique index if not exists payments_stripe_event_uidx
  on payments (stripe_event_id)
  where stripe_event_id is not null;

create index if not exists payments_stripe_session_idx
  on payments (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
