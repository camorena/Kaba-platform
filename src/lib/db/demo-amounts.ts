/** Synthetic unit prices (cents) for demo invoices — not real bids. */
export const DEMO_SERVICE_UNIT_CENTS: Record<string, number> = {
  "Wood Fence": 485000,
  "Vinyl Fence": 620000,
  "Aluminum Fence": 840000,
  "Deck Repair": 245000,
  "Deck Install": 920000,
  "Chain Link": 280000,
};

export function demoUnitCentsForService(serviceType: string): number {
  return (
    DEMO_SERVICE_UNIT_CENTS[serviceType] ??
    350000 + (serviceType.length % 7) * 25000
  );
}
