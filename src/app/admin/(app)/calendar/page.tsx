import CalendarClient from "@/components/admin/CalendarClient";
import { listScheduleJobs, monthGrid } from "@/lib/admin/schedule";

export const metadata = { title: "Schedule" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const jobs = await listScheduleJobs();
  const { label, weeks } = monthGrid(new Date());
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <CalendarClient
      label={label}
      weeks={weeks}
      todayKey={todayKey}
      jobs={jobs.map((j) => ({
        id: j.id,
        quoteId: j.quoteId,
        day: j.day,
        timeLabel: j.timeLabel,
        title: j.title,
        customer: j.customer,
        serviceType: j.serviceType,
        address: j.address,
        status: j.status,
      }))}
    />
  );
}
