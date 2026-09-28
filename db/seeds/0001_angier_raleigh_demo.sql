-- Kaba Fence synthetic demo seed — Angier / Raleigh NC fencing ops.
-- Safe to re-run: truncates ops tables (keeps schema) then inserts demo rows.
-- Amounts are DEMO ONLY — not real bids. © 2026 Datelica LLC.

begin;

-- Wipe ops data (profiles left empty — auth stub unchanged)
truncate table
  payments,
  invoice_lines,
  invoices,
  quote_notes,
  quotes,
  customers
restart identity cascade;

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------

insert into customers (id, name, email, phone, notes, created_at, updated_at) values
  ('a1000001-0001-4000-8000-000000000001', 'Jordan Miles',   'jordan.miles@example.com', '(919) 555-0188', 'Backyard privacy fence — Angier.',           now() - interval '12 days', now() - interval '5 days'),
  ('a1000001-0001-4000-8000-000000000002', 'Priya Shah',     'priya.shah@example.com',   '(919) 555-0133', 'Deck repair — North Raleigh.',              now() - interval '14 days', now() - interval '6 days'),
  ('a1000001-0001-4000-8000-000000000003', 'Chris Nguyen',   'chris.n@example.com',      '(919) 555-0172', 'HOA vinyl — Fuquay-Varina.',                now() - interval '9 days',  now() - interval '2 days'),
  ('a1000001-0001-4000-8000-000000000004', 'Alicia Brooks',  'alicia.b@example.com',     '(919) 555-0199', 'Pool-code aluminum — Cary.',                now() - interval '18 days', now() - interval '4 days'),
  ('a1000001-0001-4000-8000-000000000005', 'Marcus Webb',    'marcus.webb@example.com',  '(919) 555-0144', 'Chain-link driveway — Garner.',             now() - interval '3 days',  now() - interval '90 minutes'),
  ('a1000001-0001-4000-8000-000000000006', 'Sam Ortega',     'sam.o@example.com',        '(919) 555-0160', 'Deck boards — Holly Springs (past job).',   now() - interval '40 days', now() - interval '20 days'),
  ('a1000001-0001-4000-8000-000000000007', 'Elena Vargas',   'elena.v@example.com',      '(919) 555-0112', 'Cedar privacy — Apex.',                     now() - interval '16 days', now() - interval '10 days'),
  ('a1000001-0001-4000-8000-000000000008', 'Derek Holt',     'derek.holt@example.com',   '(919) 555-0155', 'Commercial chain-link — Wake Forest.',      now() - interval '22 days', now() - interval '11 days'),
  ('a1000001-0001-4000-8000-000000000009', 'Nina Patel',     'nina.patel@example.com',   '(919) 555-0121', 'Vinyl + gate — Clayton.',                   now() - interval '7 days',  now() - interval '1 day'),
  ('a1000001-0001-4000-8000-00000000000a', 'Tom Brennan',    'tom.brennan@example.com',  '(919) 555-0180', 'Aluminum ornamental — Knightdale.',         now() - interval '28 days', now() - interval '15 days');

-- ---------------------------------------------------------------------------
-- Quotes (several gone-quiet: new/contacted/scheduled + updated_at ≥ 3 days)
-- ---------------------------------------------------------------------------

insert into quotes (
  id, customer_id, name, phone, email, service_type, address, description,
  preferred_contact, source, status, notes, notified_at, notify_attempts,
  created_at, updated_at
) values
  -- Quiet: new, 5 days stale
  ('b2000001-0001-4000-8000-000000000001',
   'a1000001-0001-4000-8000-000000000001',
   'Jordan Miles', '(919) 555-0188', 'jordan.miles@example.com',
   'Wood Fence', '214 Maple St, Angier, NC 27501',
   'Replace leaning backyard privacy fence (~120 ft) with cedar.',
   'phone', 'seed', 'new', '',
   null, 0,
   now() - interval '5 days', now() - interval '5 days'),

  -- Quiet: contacted, 6 days since last touch
  ('b2000001-0001-4000-8000-000000000002',
   'a1000001-0001-4000-8000-000000000002',
   'Priya Shah', '(919) 555-0133', 'priya.shah@example.com',
   'Deck Repair', '8808 Lead Mine Rd, Raleigh, NC 27615',
   'Loose railing and two soft boards near stairs.',
   'email', 'seed', 'contacted',
   'Left voicemail. Prefers Saturday morning. No reply since.',
   now() - interval '8 days', 1,
   now() - interval '8 days', now() - interval '6 days'),

  -- Active: scheduled yesterday
  ('b2000001-0001-4000-8000-000000000003',
   'a1000001-0001-4000-8000-000000000003',
   'Chris Nguyen', '(919) 555-0172', 'chris.n@example.com',
   'Vinyl Fence', '312 Oak Grove Ln, Fuquay-Varina, NC 27526',
   'New white vinyl privacy fence for HOA lot (~140 ft).',
   'text', 'seed', 'scheduled',
   'Site visit Tue 10am. HOA guidelines attached in email.',
   now() - interval '2 days', 1,
   now() - interval '2 days', now() - interval '20 hours'),

  -- Won — ready to invoice / deposit
  ('b2000001-0001-4000-8000-000000000004',
   'a1000001-0001-4000-8000-000000000004',
   'Alicia Brooks', '(919) 555-0199', 'alicia.b@example.com',
   'Aluminum Fence', '102 Briarcliff Dr, Cary, NC 27511',
   'Pool-code aluminum fence, ~90 ft, black.',
   'phone', 'seed', 'won',
   'Approved demo estimate. Deposit invoice open.',
   now() - interval '10 days', 1,
   now() - interval '10 days', now() - interval '4 days'),

  -- Fresh new lead (< 3 days — not quiet)
  ('b2000001-0001-4000-8000-000000000005',
   'a1000001-0001-4000-8000-000000000005',
   'Marcus Webb', '(919) 555-0144', 'marcus.webb@example.com',
   'Chain Link', '44 Timber Dr, Garner, NC 27529',
   'Replace damaged chain-link along driveway (~60 ft).',
   'phone', 'seed', 'new', '',
   null, 0,
   now() - interval '90 minutes', now() - interval '90 minutes'),

  -- Quiet: contacted, Apex cedar
  ('b2000001-0001-4000-8000-000000000006',
   'a1000001-0001-4000-8000-000000000007',
   'Elena Vargas', '(919) 555-0112', 'elena.v@example.com',
   'Wood Fence', '19 Beaver Creek Ct, Apex, NC 27502',
   'Cedar privacy fence replacement after storm (~100 ft).',
   'phone', 'web', 'contacted',
   'Sent estimate PDF. Waiting on HOA color approval.',
   now() - interval '12 days', 2,
   now() - interval '16 days', now() - interval '10 days'),

  -- Quiet: scheduled but no-show / stale
  ('b2000001-0001-4000-8000-000000000007',
   'a1000001-0001-4000-8000-000000000008',
   'Derek Holt', '(919) 555-0155', 'derek.holt@example.com',
   'Chain Link', '2200 Capital Blvd, Wake Forest, NC 27587',
   'Commercial chain-link for equipment yard (~220 ft + gates).',
   'email', 'referral', 'scheduled',
   'Site walk was postponed. No new date confirmed.',
   now() - interval '18 days', 1,
   now() - interval '22 days', now() - interval '11 days'),

  -- Active contacted
  ('b2000001-0001-4000-8000-000000000008',
   'a1000001-0001-4000-8000-000000000009',
   'Nina Patel', '(919) 555-0121', 'nina.patel@example.com',
   'Vinyl Fence', '78 Church St, Clayton, NC 27520',
   'White vinyl + double gate for side yard.',
   'text', 'seed', 'contacted',
   'Texted measurements request — replied same day.',
   now() - interval '2 days', 1,
   now() - interval '3 days', now() - interval '1 day'),

  -- Lost
  ('b2000001-0001-4000-8000-000000000009',
   'a1000001-0001-4000-8000-00000000000a',
   'Tom Brennan', '(919) 555-0180', 'tom.brennan@example.com',
   'Aluminum Fence', '501 Smithfield Rd, Knightdale, NC 27545',
   'Ornamental aluminum across front porch (~45 ft).',
   'email', 'seed', 'lost',
   'Chose another contractor on price.',
   now() - interval '25 days', 1,
   now() - interval '28 days', now() - interval '15 days'),

  -- Past won (Sam — invoice paid)
  ('b2000001-0001-4000-8000-00000000000a',
   'a1000001-0001-4000-8000-000000000006',
   'Sam Ortega', '(919) 555-0160', 'sam.o@example.com',
   'Deck Repair', '9 Holly Tree Way, Holly Springs, NC 27540',
   'Replace soft deck boards and re-seal.',
   'phone', 'seed', 'won',
   'Job complete — paid in full (demo).',
   now() - interval '35 days', 1,
   now() - interval '40 days', now() - interval '20 days'),

  -- Quiet new: no contact yet after form submit
  ('b2000001-0001-4000-8000-00000000000b',
   null,
   'Riley Quinn', '(919) 555-0190', 'riley.q@example.com',
   'Deck Install', '55 Lillington Hwy, Angier, NC 27501',
   'New composite deck ~12x16, stairs to grade.',
   'phone', 'web', 'new', '',
   null, 0,
   now() - interval '4 days', now() - interval '4 days'),

  -- Quiet contacted: Raleigh aluminum
  ('b2000001-0001-4000-8000-00000000000c',
   null,
   'Hannah Cole', '(919) 555-0177', 'hannah.cole@example.com',
   'Aluminum Fence', '4100 Beryl Rd, Raleigh, NC 27606',
   'Black aluminum around dog run (~70 ft).',
   'email', 'web', 'contacted',
   'Email bounce on first send — resent from ops@.',
   now() - interval '9 days', 2,
   now() - interval '9 days', now() - interval '7 days');

-- ---------------------------------------------------------------------------
-- Quote notes (append-only)
-- ---------------------------------------------------------------------------

insert into quote_notes (id, quote_id, author_id, author_label, body, created_at) values
  ('c3000001-0001-4000-8000-000000000001',
   'b2000001-0001-4000-8000-000000000002', null, 'ops',
   'Left voicemail. Prefers Saturday morning. No reply since.',
   now() - interval '6 days'),
  ('c3000001-0001-4000-8000-000000000002',
   'b2000001-0001-4000-8000-000000000003', null, 'ops',
   'Site visit Tue 10am. HOA guidelines attached in email.',
   now() - interval '20 hours'),
  ('c3000001-0001-4000-8000-000000000003',
   'b2000001-0001-4000-8000-000000000004', null, 'ops',
   'Customer approved demo aluminum estimate. Creating deposit invoice.',
   now() - interval '4 days'),
  ('c3000001-0001-4000-8000-000000000004',
   'b2000001-0001-4000-8000-000000000006', null, 'ops',
   'Sent cedar estimate PDF. Waiting on HOA color approval.',
   now() - interval '10 days'),
  ('c3000001-0001-4000-8000-000000000005',
   'b2000001-0001-4000-8000-000000000006', null, 'ops',
   'Follow-up call — voicemail full. Trying email next.',
   now() - interval '10 days' + interval '2 hours'),
  ('c3000001-0001-4000-8000-000000000006',
   'b2000001-0001-4000-8000-000000000007', null, 'ops',
   'Site walk postponed by customer. No new date confirmed.',
   now() - interval '11 days'),
  ('c3000001-0001-4000-8000-000000000007',
   'b2000001-0001-4000-8000-000000000008', null, 'ops',
   'Texted for side-yard measurements — reply received.',
   now() - interval '1 day'),
  ('c3000001-0001-4000-8000-000000000008',
   'b2000001-0001-4000-8000-00000000000c', null, 'ops',
   'First email bounced. Resent from ops address.',
   now() - interval '7 days');

-- ---------------------------------------------------------------------------
-- Invoices + lines
-- ---------------------------------------------------------------------------

insert into invoices (
  id, number, quote_id, customer_id, customer_name, customer_email, customer_phone,
  address, status, notes, demo, created_at, updated_at
) values
  ('d4000001-0001-4000-8000-000000000001', 'KF-1001',
   'b2000001-0001-4000-8000-000000000004',
   'a1000001-0001-4000-8000-000000000004',
   'Alicia Brooks', 'alicia.b@example.com', '(919) 555-0199',
   '102 Briarcliff Dr, Cary, NC 27511', 'partial',
   'Demo invoice. 50% deposit recorded.', true,
   now() - interval '80 hours', now() - interval '72 hours'),

  ('d4000001-0001-4000-8000-000000000002', 'KF-1002',
   'b2000001-0001-4000-8000-000000000003',
   'a1000001-0001-4000-8000-000000000003',
   'Chris Nguyen', 'chris.n@example.com', '(919) 555-0172',
   '312 Oak Grove Ln, Fuquay-Varina, NC 27526', 'draft',
   'Draft from scheduled quote — not sent. Demo amounts only.', true,
   now() - interval '48 hours', now() - interval '48 hours'),

  ('d4000001-0001-4000-8000-000000000003', 'KF-1003',
   'b2000001-0001-4000-8000-00000000000a',
   'a1000001-0001-4000-8000-000000000006',
   'Sam Ortega', 'sam.o@example.com', '(919) 555-0160',
   '9 Holly Tree Way, Holly Springs, NC 27540', 'paid',
   'Paid in full — demo seed.', true,
   now() - interval '200 hours', now() - interval '160 hours'),

  ('d4000001-0001-4000-8000-000000000004', 'KF-1004',
   'b2000001-0001-4000-8000-000000000006',
   'a1000001-0001-4000-8000-000000000007',
   'Elena Vargas', 'elena.v@example.com', '(919) 555-0112',
   '19 Beaver Creek Ct, Apex, NC 27502', 'sent',
   'Estimate invoice sent while waiting on HOA. Demo only.', true,
   now() - interval '9 days', now() - interval '9 days'),

  ('d4000001-0001-4000-8000-000000000005', 'KF-1005',
   null,
   'a1000001-0001-4000-8000-000000000008',
   'Derek Holt', 'derek.holt@example.com', '(919) 555-0155',
   '2200 Capital Blvd, Wake Forest, NC 27587', 'void',
   'Voided after site walk cancelled. Demo only.', true,
   now() - interval '12 days', now() - interval '11 days');

insert into invoice_lines (id, invoice_id, description, quantity, unit_cents, sort_order) values
  ('e5000001-0001-4000-8000-000000000001', 'd4000001-0001-4000-8000-000000000001',
   'Aluminum pool fence — materials & labor (~90 ft)', 1, 840000, 0),
  ('e5000001-0001-4000-8000-000000000002', 'd4000001-0001-4000-8000-000000000001',
   'Gate hardware upgrade', 1, 18500, 1),
  ('e5000001-0001-4000-8000-000000000003', 'd4000001-0001-4000-8000-000000000002',
   'White vinyl privacy fence — estimate (demo)', 1, 620000, 0),
  ('e5000001-0001-4000-8000-000000000004', 'd4000001-0001-4000-8000-000000000003',
   'Deck board replacement (demo)', 1, 245000, 0),
  ('e5000001-0001-4000-8000-000000000005', 'd4000001-0001-4000-8000-000000000004',
   'Cedar privacy fence — storm replacement (~100 ft, demo)', 1, 485000, 0),
  ('e5000001-0001-4000-8000-000000000006', 'd4000001-0001-4000-8000-000000000005',
   'Commercial chain-link — cancelled estimate (demo)', 1, 280000, 0);

-- ---------------------------------------------------------------------------
-- Payments (stub ledger)
-- ---------------------------------------------------------------------------

insert into payments (
  id, invoice_id, amount_cents, method, status, reference, notes, demo, created_at
) values
  ('f6000001-0001-4000-8000-000000000001',
   'd4000001-0001-4000-8000-000000000001', 429250, 'check', 'recorded',
   'CHK-44821', '50% deposit — demo', true, now() - interval '70 hours'),
  ('f6000001-0001-4000-8000-000000000002',
   'd4000001-0001-4000-8000-000000000003', 245000, 'ach', 'recorded',
   'ACH-demo-991', 'Paid in full — demo', true, now() - interval '155 hours'),
  ('f6000001-0001-4000-8000-000000000003',
   'd4000001-0001-4000-8000-000000000004', 50000, 'card', 'recorded',
   'CARD-demo-220', 'Small goodwill deposit while HOA pending — demo', true,
   now() - interval '8 days');

-- After partial deposit on KF-1004, mark invoice partial
update invoices set status = 'partial', updated_at = now() - interval '8 days'
  where id = 'd4000001-0001-4000-8000-000000000004';

-- ---------------------------------------------------------------------------
-- Trust / site_settings
-- ---------------------------------------------------------------------------

insert into site_settings (id, claim_free_estimates, claim_locally_owned, updated_at)
values (true, true, true, now())
on conflict (id) do update set
  claim_free_estimates = excluded.claim_free_estimates,
  claim_locally_owned = excluded.claim_locally_owned,
  updated_at = excluded.updated_at;

commit;

-- Summary (for migrate/seed logs)
select 'customers' as entity, count(*)::text as n from customers
union all select 'quotes', count(*)::text from quotes
union all select 'quote_notes', count(*)::text from quote_notes
union all select 'invoices', count(*)::text from invoices
union all select 'invoice_lines', count(*)::text from invoice_lines
union all select 'payments', count(*)::text from payments
union all select 'quiet_quotes', count(*)::text from quotes
  where status in ('new','contacted','scheduled')
    and updated_at <= now() - interval '3 days'
order by 1;
