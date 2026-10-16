/**
 * Customers — durable customers table (company + address) merged with
 * quote-derived contacts (same shape as the memory adapter).
 */

import { query } from "@/lib/db/postgres/connection";
import { mapCustomer, type CustomerRow } from "@/lib/db/postgres/mappers";
import { createPostgresQuotesRepo } from "@/lib/db/postgres/quotes";
import { CustomerEmailTakenError } from "@/lib/db/customer-errors";
import { mergeCustomers } from "@/lib/db/customers-merge";
import type { CustomersRepo } from "@/lib/db/repos/types";
import { CUSTOMER_PATCH_FIELDS } from "@/lib/db/types";

const COLUMNS =
  "id, name, email, phone, notes, company, street, city, state, zip, created_at, updated_at";

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function createPostgresCustomersRepo(): CustomersRepo {
  const quotes = createPostgresQuotesRepo();

  return {
    async list() {
      const { rows } = await query<CustomerRow>(
        `select ${COLUMNS} from customers order by updated_at desc`,
      );
      return mergeCustomers(await quotes.list(), rows.map(mapCustomer));
    },

    async get(id) {
      if (!isUuid(id)) return undefined;
      const { rows } = await query<CustomerRow>(
        `select ${COLUMNS} from customers where id = $1`,
        [id],
      );
      return rows[0] ? mapCustomer(rows[0]) : undefined;
    },

    async update(id, patch) {
      if (!isUuid(id)) return undefined;
      const sets: string[] = [];
      const values: unknown[] = [];
      for (const field of CUSTOMER_PATCH_FIELDS) {
        const value = patch[field];
        if (value === undefined) continue;
        values.push(value);
        sets.push(`${field} = $${values.length}`);
      }
      if (sets.length === 0) return this.get(id);
      values.push(id);
      try {
        const { rows } = await query<CustomerRow>(
          `update customers set ${sets.join(", ")}, updated_at = now()
           where id = $${values.length} returning ${COLUMNS}`,
          values,
        );
        return rows[0] ? mapCustomer(rows[0]) : undefined;
      } catch (err) {
        if ((err as { code?: string })?.code === "23505") {
          throw new CustomerEmailTakenError();
        }
        throw err;
      }
    },
  };
}
