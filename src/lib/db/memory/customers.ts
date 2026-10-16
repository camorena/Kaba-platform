/**
 * Customers — derived from quotes in the memory adapter, plus an in-process
 * map standing in for the durable `customers` table (company + address).
 * Empty by default; the Postgres adapter is the source of truth in production.
 */

import { CustomerEmailTakenError } from "@/lib/db/customer-errors";
import { mergeCustomers } from "@/lib/db/customers-merge";
import { memoryQuotesRepo } from "@/lib/db/memory/quotes";
import type { CustomersRepo } from "@/lib/db/repos/types";
import type { CustomerProfile } from "@/lib/db/types";

const globalStore = globalThis as unknown as {
  __kabaMemoryCustomers?: Map<string, CustomerProfile>;
};

function store(): Map<string, CustomerProfile> {
  if (!globalStore.__kabaMemoryCustomers) {
    globalStore.__kabaMemoryCustomers = new Map();
  }
  return globalStore.__kabaMemoryCustomers;
}

/** Test/dev helper — seed a durable customer row in memory. */
export function memoryUpsertCustomer(profile: CustomerProfile): void {
  store().set(profile.id, { ...profile });
}

export const memoryCustomersRepo: CustomersRepo = {
  async list() {
    const profiles = [...store().values()].sort(
      (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
    );
    return mergeCustomers(await memoryQuotesRepo.list(), profiles);
  },

  async get(id) {
    const c = store().get(id);
    return c ? { ...c } : undefined;
  },

  async update(id, patch) {
    const current = store().get(id);
    if (!current) return undefined;
    if (patch.email !== undefined && patch.email.trim()) {
      const email = patch.email.toLowerCase().trim();
      for (const other of store().values()) {
        if (other.id !== id && other.email.toLowerCase().trim() === email) {
          throw new CustomerEmailTakenError();
        }
      }
    }
    const next: CustomerProfile = {
      ...current,
      ...Object.fromEntries(
        Object.entries(patch).filter(([, v]) => v !== undefined),
      ),
      updatedAt: new Date().toISOString(),
    };
    store().set(id, next);
    return { ...next };
  },
};
