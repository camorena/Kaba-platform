import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import { listActivity } from "@/lib/admin/activity";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

const toneDot: Record<string, string> = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  muted: "bg-ink/30",
};

export default async function AdminActivityPage() {
  const { warning } = await requireAdmin();
  const feed = listActivity(50);

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Activity"
        crumbs={[
          { href: "/admin", label: "Admin" },
          { label: "Activity" },
        ]}
        description="Unified feed of quote updates, invoices, and payments from the in-memory stores."
      />

      {feed.length === 0 ? (
        <EmptyState
          title="Quiet so far"
          description="Pipeline events will stream here as quotes and invoices move."
        />
      ) : (
        <ol className="admin-activity-feed admin-glass-panel admin-gold-rail relative space-y-0 overflow-hidden">
          {feed.map((item, i) => (
            <li key={item.id} className="admin-activity-item relative">
              {i < feed.length - 1 && (
                <span className="admin-activity-line" aria-hidden />
              )}
              <span
                className={`admin-activity-dot ${toneDot[item.tone] ?? toneDot.muted}`}
                aria-hidden
              />
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <time
                    dateTime={item.at}
                    className="text-[0.6875rem] tabular-nums text-muted"
                  >
                    {formatDateTime(item.at)}
                  </time>
                </div>
                <p className="mt-0.5 text-sm capitalize text-muted">{item.detail}</p>
                <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-wider text-bronze/80">
                  {item.kind}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </AdminShell>
  );
}
