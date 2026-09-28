import ActivityClient from "@/components/admin/ActivityClient";
import { listActivity } from "@/lib/admin/activity";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const feed = await listActivity(50);

  return (
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
  );
}
