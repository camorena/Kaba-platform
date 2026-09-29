import { listQuotes } from "@/lib/admin/quotes-store";
import type { QuoteRecord } from "@/lib/db/types";
import {
  addCalendarDaysYmd,
  chicagoYmd,
  defaultScheduledFor,
  visitKindLabel,
  visitTimeLabel,
} from "@/lib/db/visits";

export type ScheduleJob = {
  id: string;
  quoteId: string;
  title: string;
  customer: string;
  address: string;
  serviceType: string;
  status: QuoteRecord["status"];
  /** Scheduled day (ISO date YYYY-MM-DD in America/Chicago). */
  day: string;
  timeLabel: string;
  notes: string;
};

/** Derive install / site-visit jobs from scheduled + won quotes. */
export async function listScheduleJobs(): Promise<ScheduleJob[]> {
  const jobs: ScheduleJob[] = [];
  const quotes = (await listQuotes()).filter(
    (q) => q.status === "scheduled" || q.status === "won",
  );

  for (const q of quotes) {
    const day =
      q.scheduledFor ||
      defaultScheduledFor(q.status) ||
      addCalendarDaysYmd(chicagoYmd(new Date(q.updatedAt || q.createdAt)), 2);
    jobs.push({
      id: `job_${q.id}`,
      quoteId: q.id,
      title: visitKindLabel(q.status),
      customer: q.name,
      address: q.address,
      serviceType: q.serviceType,
      status: q.status,
      day,
      timeLabel: visitTimeLabel(q.status),
      notes:
        q.notes ||
        (q.scheduledFor
          ? "Scheduled visit day on quote."
          : "Stub schedule — set scheduledFor on the quote for a real day."),
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
