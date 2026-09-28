-- Customer-facing pay links — opaque token per invoice (no admin cookie).
-- Applied by: DATABASE_URL=… npm run db:migrate
-- Runtime: /pay/[token] + POST /api/pay/[token]/checkout (see preview/REUSE_PORT_v6.md).
-- © 2026 Datelica LLC — Kaba Fence.

alter table invoices
  add column if not exists pay_token text;

comment on column invoices.pay_token is
  'Opaque public pay-link token. Customers open /pay/{token} without an admin session.';

-- Backfill any rows missing a token (URL-safe base64url-ish).
update invoices
set pay_token = 'kf_' || rtrim(
  translate(encode(gen_random_bytes(18), 'base64'), '+/', '-_'),
  '='
)
where pay_token is null or btrim(pay_token) = '';

alter table invoices
  alter column pay_token set not null;

create unique index if not exists invoices_pay_token_uidx
  on invoices (pay_token);
