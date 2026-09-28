-- Kaba Fence ops foundation — quotes → invoices → payments (+ notes, customers, trust).
--
-- Draft for Postgres (Supabase, Neon, RDS, or local). Not applied automatically.
-- Default runtime remains the in-memory adapter (KABA_DATA_ADAPTER=memory).
--
-- Flip later:
--   1. Provision Postgres; set DATABASE_URL (and KABA_DATA_ADAPTER=postgres when implemented).
--   2. Apply this file (psql / drizzle-kit / supabase db push).
--   3. Implement Postgres* repos behind the same interfaces in src/lib/db/repos/.
--   4. Keep Memory* as the default so builds and demos need no cloud credentials.
--
-- © 2026 Datelica LLC — Kaba Fence.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums (align with src/lib/admin/status.ts + dal AppRole)
-- ---------------------------------------------------------------------------

create type app_role as enum ('owner', 'editor', 'viewer');

create type quote_status as enum (
  'new', 'contacted', 'scheduled', 'won', 'lost'
);

create type invoice_status as enum (
  'draft', 'sent', 'partial', 'paid', 'void'
);

create type payment_method as enum (
  'check', 'cash', 'ach', 'card', 'other'
);

create type payment_status as enum (
  'recorded', 'pending', 'failed'
);

-- ---------------------------------------------------------------------------
-- Customers (optional durable table; memory adapter may still derive from quotes)
-- ---------------------------------------------------------------------------

create table customers (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null check (length(btrim(name)) > 0),
  email        text        not null default '',
  phone        text        not null default '',
  notes        text        not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint customers_need_contact
    check (length(btrim(email)) > 0 or length(btrim(phone)) > 0)
);

create unique index customers_email_lower_uidx
  on customers (lower(email))
  where length(btrim(email)) > 0;

create index customers_phone_idx on customers (phone)
  where length(btrim(phone)) > 0;

-- ---------------------------------------------------------------------------
-- Quotes (leads / estimates) — persist-then-notify fields included
-- ---------------------------------------------------------------------------

create table quotes (
  id                 uuid primary key default gen_random_uuid(),
  customer_id        uuid        references customers (id) on delete set null,
  name               text        not null check (length(btrim(name)) > 0),
  phone              text        not null default '',
  email              text        not null default '',
  service_type       text        not null default '',
  address            text        not null default '',
  description        text        not null default '',
  preferred_contact  text        not null default 'phone',
  source             text        not null default 'api',
  status             quote_status not null default 'new',
  -- Denormalized staff scratch pad (UI textarea). Append-only history → quote_notes.
  notes              text        not null default '',
  notified_at        timestamptz,
  notify_attempts    integer     not null default 0 check (notify_attempts >= 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint quotes_need_contact
    check (length(btrim(phone)) > 0 or length(btrim(email)) > 0)
);

comment on column quotes.notified_at is
  'Null until owner notification succeeds. Row is source of truth either way (persist-then-notify).';

create index quotes_status_updated_idx on quotes (status, updated_at);
create index quotes_unnotified_idx on quotes (created_at)
  where notified_at is null;
create index quotes_customer_idx on quotes (customer_id)
  where customer_id is not null;

-- ---------------------------------------------------------------------------
-- Quote notes (append-only internal history)
-- ---------------------------------------------------------------------------

create table quote_notes (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid        not null references quotes (id) on delete cascade,
  author_id   uuid, -- future profiles.id; null under stub auth
  author_label text       not null default 'ops',
  body        text        not null check (length(btrim(body)) > 0),
  created_at  timestamptz not null default now()
);

create index quote_notes_quote_idx on quote_notes (quote_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Invoices + line items
-- ---------------------------------------------------------------------------

create table invoices (
  id              uuid primary key default gen_random_uuid(),
  number          text        not null unique,
  quote_id        uuid        references quotes (id) on delete set null,
  customer_id     uuid        references customers (id) on delete set null,
  customer_name   text        not null,
  customer_email  text        not null default '',
  customer_phone  text        not null default '',
  address         text        not null default '',
  status          invoice_status not null default 'draft',
  notes           text        not null default '',
  demo            boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index invoices_status_idx on invoices (status, created_at desc);
create index invoices_quote_idx on invoices (quote_id) where quote_id is not null;

create table invoice_lines (
  id           uuid primary key default gen_random_uuid(),
  invoice_id   uuid        not null references invoices (id) on delete cascade,
  description  text        not null,
  quantity     numeric(12, 2) not null default 1 check (quantity > 0),
  unit_cents   integer     not null check (unit_cents >= 0),
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now()
);

create index invoice_lines_invoice_idx on invoice_lines (invoice_id, sort_order);

-- ---------------------------------------------------------------------------
-- Payments (stub ledger until Stripe)
-- ---------------------------------------------------------------------------

create table payments (
  id               uuid primary key default gen_random_uuid(),
  invoice_id       uuid           not null references invoices (id) on delete restrict,
  amount_cents     integer        not null check (amount_cents > 0),
  method           payment_method not null default 'other',
  status           payment_status not null default 'recorded',
  reference        text           not null default '',
  notes            text           not null default '',
  demo             boolean        not null default true,
  created_at       timestamptz    not null default now()
);

create index payments_invoice_idx on payments (invoice_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Trust claims / site settings (owner-asserted; default false)
-- ---------------------------------------------------------------------------

create table site_settings (
  id                     boolean primary key default true check (id),
  claim_free_estimates   boolean not null default false,
  claim_locally_owned    boolean not null default false,
  updated_at             timestamptz not null default now()
);

insert into site_settings (id) values (true) on conflict do nothing;

comment on column site_settings.claim_free_estimates is
  'Owner-asserted. Public trust badge only when true.';
comment on column site_settings.claim_locally_owned is
  'Owner-asserted. Public trust badge only when true.';

-- ---------------------------------------------------------------------------
-- Staff profiles (for real auth later — not used by ADMIN_PASSWORD stub)
-- ---------------------------------------------------------------------------

create table profiles (
  id          uuid primary key, -- auth.users.id when wired
  email       text        not null,
  full_name   text        not null default '',
  role        app_role    not null default 'viewer',
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table profiles is
  'Staff accounts when real auth lands. role is authoritative; never trust a client JWT claim alone.';
