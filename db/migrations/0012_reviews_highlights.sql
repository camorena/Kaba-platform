-- 0012: customer reviews (admin-managed, publish-gated) + public highlight stats.
-- Idempotent: safe to re-run. No seed rows — only real reviews / owner-entered stats.

create table if not exists reviews (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text        not null check (char_length(customer_name) between 1 and 80),
  city           text        not null default '' check (char_length(city) <= 80),
  rating         smallint    not null check (rating between 1 and 5),
  body           text        not null check (char_length(body) between 1 and 2000),
  source         text        not null default 'direct'
                 check (source in ('google', 'nextdoor', 'facebook', 'direct', 'other')),
  source_url     text        check (source_url is null or char_length(source_url) <= 500),
  review_date    date        not null,
  customer_id    uuid        references customers (id) on delete set null,
  published      boolean     not null default false,
  featured       boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists reviews_published_date_idx
  on reviews (published, review_date desc);
create index if not exists reviews_customer_idx
  on reviews (customer_id) where customer_id is not null;

comment on table reviews is
  'Real customer reviews entered by staff. Public only when published = true.';

create table if not exists highlight_stats (
  id           uuid primary key default gen_random_uuid(),
  label        text        not null check (char_length(label) between 1 and 60),
  value        text        not null default '' check (char_length(value) <= 20),
  visible      boolean     not null default false,
  auto_source  text        check (auto_source is null or auto_source in ('customers_count')),
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table highlight_stats is
  'Owner-entered public figures. Shown publicly only when visible and set.';
