/**
 * Customers — prefer durable customers table when populated;
 * otherwise derive from quotes (same as memory adapter).
 */

import { query } from "@/lib/db/postgres/connection";
import { createPostgresQuotesRepo } from "@/lib/db/postgres/quotes";
import type { CustomersRepo } from "@/lib/db/repos/types";
import type { CustomerRecord, QuoteStatus } from "@/lib/db/types";

export function createPostgresCustomersRepo(): CustomersRepo {
  const quotes = createPostgresQuotesRepo();

  return {
    async list() {
      // Prefer durable customers rows when present; enrich with quote stats.
      const { rows: customerRows } = await query<{
        id: string;
        name: string;
        email: string;
        phone: string;
      }>(`select id, name, email, phone from customers order by updated_at desc`);

      const allQuotes = await quotes.list();
      const map = new Map<string, CustomerRecord>();

      for (const q of allQuotes) {
        const key =
          q.customerId ||
          q.email.toLowerCase().trim() ||
          q.phone.trim();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            key,
            id: q.customerId,
            name: q.name,
            email: q.email,
            phone: q.phone,
            quoteCount: 1,
            latestQuoteAt: q.createdAt,
            addresses: [q.address],
            statuses: [q.status],
          });
        } else {
          existing.quoteCount += 1;
          if (+new Date(q.createdAt) > +new Date(existing.latestQuoteAt)) {
            existing.latestQuoteAt = q.createdAt;
            existing.name = q.name;
          }
          if (!existing.addresses.includes(q.address)) {
            existing.addresses.push(q.address);
          }
          existing.statuses.push(q.status as QuoteStatus);
        }
      }

      // Ensure customers with no quotes still appear.
      for (const c of customerRows) {
        const key = c.id;
        if (!map.has(key) && !map.has(c.email.toLowerCase().trim())) {
          map.set(key, {
            key,
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            quoteCount: 0,
            latestQuoteAt: new Date(0).toISOString(),
            addresses: [],
            statuses: [],
          });
        }
      }

      return [...map.values()].sort(
        (a, b) => +new Date(b.latestQuoteAt) - +new Date(a.latestQuoteAt),
      );
    },
  };
}
