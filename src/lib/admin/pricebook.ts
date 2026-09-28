/** Client-side price book defaults — editable in localStorage, no DB. */

export type PriceBookItem = {
  id: string;
  category: string;
  name: string;
  unit: string;
  unitCents: number;
  notes?: string;
};

export const PRICEBOOK_STORAGE_KEY = "kaba-admin-pricebook-v1";

export const DEFAULT_PRICEBOOK: PriceBookItem[] = [
  {
    id: "pb_wood_lf",
    category: "Wood",
    name: "Privacy fence install",
    unit: "lf",
    unitCents: 4500,
    notes: "Cedar / pine mix · labor + material",
  },
  {
    id: "pb_wood_gate",
    category: "Wood",
    name: "Walk gate",
    unit: "ea",
    unitCents: 35000,
  },
  {
    id: "pb_vinyl_lf",
    category: "Vinyl",
    name: "Privacy vinyl install",
    unit: "lf",
    unitCents: 5200,
  },
  {
    id: "pb_vinyl_gate",
    category: "Vinyl",
    name: "Vinyl walk gate",
    unit: "ea",
    unitCents: 42000,
  },
  {
    id: "pb_alum_lf",
    category: "Aluminum",
    name: "Ornamental aluminum",
    unit: "lf",
    unitCents: 5800,
  },
  {
    id: "pb_chain_lf",
    category: "Chain-link",
    name: "Chain-link install",
    unit: "lf",
    unitCents: 2800,
  },
  {
    id: "pb_deck_sf",
    category: "Deck",
    name: "Deck board replace",
    unit: "sf",
    unitCents: 1800,
  },
  {
    id: "pb_rail",
    category: "Deck",
    name: "Railing section",
    unit: "lf",
    unitCents: 6500,
  },
  {
    id: "pb_post",
    category: "Labor",
    name: "Post set (concrete)",
    unit: "ea",
    unitCents: 9500,
  },
  {
    id: "pb_haul",
    category: "Labor",
    name: "Tear-out & haul",
    unit: "lf",
    unitCents: 1200,
  },
  {
    id: "pb_permit",
    category: "Misc",
    name: "Permit / HOA packet",
    unit: "ea",
    unitCents: 15000,
  },
  {
    id: "pb_travel",
    category: "Misc",
    name: "Trip / mobilization",
    unit: "ea",
    unitCents: 12500,
  },
];
