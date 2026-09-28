-- Stripe Checkout session uniqueness — webhook retries / duplicate events
-- must not double-record the same cs_… session.
-- Applied by: DATABASE_URL=… npm run db:migrate
-- © 2026 Datelica LLC — Kaba Fence.

create unique index if not exists payments_stripe_session_uidx
  on payments (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
