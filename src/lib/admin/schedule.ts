import { listQuotes, type QuoteRecord } from "@/lib/admin/quotes-store";

export type ScheduleJob = {
  id: string;
  quoteId: string;
  title: string;
  customer: string;
  address: string;
  serviceType: string;
  status: QuoteRecord["status"];
  /** Stub scheduled day (ISO date YYYY-MM-DD in America/Chicago approx). */
  day: string;
  timeLabel: string;
  notes: string;
};

/** Derive install / site-visit stubs from scheduled + won quotes. */
export function listScheduleJobs(): ScheduleJob[] {
  const jobs: ScheduleJob[] = [];
  const quotes = listQuotes().filter(
    (q) => q.status === "scheduled" || q.status === "won",
  );

  for (const q of quotes) {
    const base = new Date(q.updatedAt || q.createdAt);
    // Spread stub jobs across the coming week for a usable calendar
    const offsetDays = q.status === "scheduled" ? 2 : 5;
    const day = new Date(base);
    day.setDate(day.getDate() + offsetDays);
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, "0");
    const d = String(day.getDate()).padStart(2, "0");
    jobs.push({
      id: `job_${q.id}`,
      quoteId: q.id,
      title: q.status === "won" ? "Install window" : "Site visit",
      customer: q.name,
      address: q.address,
      serviceType: q.serviceType,
      status: q.status,
      day: `${y}-${m}-${d}`,
      timeLabel: q.status === "scheduled" ? "10:00 AM" : "8:00 AM",
      notes: q.notes || "Stub schedule — wire real calendar later.",
    });
  }

  return jobs.sort((a, b) => a.day.localeCompare(b.day));
}

export function monthGrid(anchor = new Date()): {
  label: string;
  weeks: (string | null)[][];
} {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad = first.getDay(); // 0 Sun
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push(`${year}-${m}-${dd}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  const label = anchor.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Chicago",
  });
  return { label, weeks };
}
