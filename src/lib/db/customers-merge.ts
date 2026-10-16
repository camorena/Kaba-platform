/**
 * Shared customer directory merge — quotes grouped by customer id / email / phone,
 * enriched with durable customer rows (company + address), plus customers with no quotes.
 */

import type {
  CustomerAddressFields,
  CustomerProfile,
  CustomerRecord,
  QuoteRecord,
  QuoteStatus,
} from "@/lib/db/types";

const EMPTY_ADDRESS: CustomerAddressFields = {
  company: "",
  street: "",
  city: "",
  state: "",
  zip: "",
};

function addressFields(c: CustomerProfile): CustomerAddressFields {
  return {
    company: c.company,
    street: c.street,
    city: c.city,
    state: c.state,
    zip: c.zip,
  };
}

/** One-line mailing address ("street, city, ST zip"), '' when nothing is set. */
export function formatCustomerAddress(c: CustomerAddressFields): string {
  const stateZip = [c.state, c.zip].filter((p) => p.trim()).join(" ");
  return [c.street, c.city, stateZip].filter((p) => p.trim()).join(", ");
}

export function mergeCustomers(
  allQuotes: QuoteRecord[],
  profiles: CustomerProfile[],
): CustomerRecord[] {
  const byId = new Map(profiles.map((c) => [c.id, c]));
  const byEmail = new Map(
    profiles
      .filter((c) => c.email.trim())
      .map((c) => [c.email.toLowerCase().trim(), c]),
  );
  const map = new Map<string, CustomerRecord>();
  const linked = new Set<string>();

  for (const q of allQuotes) {
    const key = q.customerId || q.email.toLowerCase().trim() || q.phone.trim();
    const existing = map.get(key);
    if (!existing) {
      const profile =
        (q.customerId ? byId.get(q.customerId) : undefined) ??
        byEmail.get(q.email.toLowerCase().trim());
      if (profile) linked.add(profile.id);
      map.set(key, {
        key,
        id: profile?.id ?? q.customerId,
        name: q.name,
        email: q.email,
        phone: q.phone,
        ...(profile ? addressFields(profile) : EMPTY_ADDRESS),
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
  for (const c of profiles) {
    if (linked.has(c.id) || map.has(c.id)) continue;
    map.set(c.id, {
      key: c.id,
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      ...addressFields(c),
      quoteCount: 0,
      latestQuoteAt: c.updatedAt || new Date(0).toISOString(),
      addresses: [],
      statuses: [],
    });
  }

  return [...map.values()].sort((a, b) => {
    const byDate = +new Date(b.latestQuoteAt) - +new Date(a.latestQuoteAt);
    return byDate !== 0 ? byDate : a.name.localeCompare(b.name);
  });
}
