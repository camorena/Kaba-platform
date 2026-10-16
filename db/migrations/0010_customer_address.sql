-- Customer company + mailing address (legacy customer import, admin Customers page).
-- Nullable text columns; idempotent so it is safe to re-run.

alter table customers add column if not exists company text;
alter table customers add column if not exists street  text;
alter table customers add column if not exists city    text;
alter table customers add column if not exists state   text;
alter table customers add column if not exists zip     text;
