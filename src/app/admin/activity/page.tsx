import AdminShell from "@/components/admin/AdminShell";
import ActivityClient from "@/components/admin/ActivityClient";
import { listActivity } from "@/lib/admin/activity";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const { warning } = await requireAdmin();
  const feed = listActivity(50);

  return (
    <AdminShell warning={warning}>
      <ActivityClient
        feed={feed.map((item) => ({
          id: item.id,
          kind: item.kind,
          at: item.at,
          subject: item.subject,
          status: item.status,
          extra: item.extra,
          href: item.href,
          tone: item.tone,
        }))}
      />
    </AdminShell>
  );
}
