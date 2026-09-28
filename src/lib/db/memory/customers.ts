/**
 * Customers — derived from quotes in the memory adapter.
 * Durable `customers` table exists in the SQL draft for a later Postgres swap.
 */

import type { CustomersRepo } from "@/lib/db/repos/types";
import type { CustomerRecord, QuoteStatus } from "@/lib/db/types";
import { memoryQuotesRepo } from "@/lib/db/memory/quotes";

export const memoryCustomersRepo: CustomersRepo = {
  list() {
    const map = new Map<string, CustomerRecord>();

    for (const q of memoryQuotesRepo.list()) {
      const key = q.email.toLowerCase().trim() || q.phone.trim();
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

    return [...map.values()].sort(
      (a, b) => +new Date(b.latestQuoteAt) - +new Date(a.latestQuoteAt),
    );
  },
};
