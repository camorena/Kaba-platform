import AdminPageChrome from "@/components/admin/AdminPageChrome";
import HighlightStatsEditor from "@/components/admin/HighlightStatsEditor";
import StatsDashboard from "@/components/admin/StatsDashboard";
import StatsLoadError from "@/components/admin/StatsLoadError";
import { loadBusinessStats } from "@/lib/admin/stats-server";
import { getRepos } from "@/lib/db/adapter";
import { parseStatsRange, type BusinessStats } from "@/lib/stats/business";
import type { HighlightStatRecord } from "@/lib/stats/highlights";

export const metadata = { title: "Estadísticas" };
export const dynamic = "force-dynamic";

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const range = parseStatsRange((await searchParams).range);
  const [statsRes, highlightsRes] = await Promise.allSettled([
    loadBusinessStats(range),
    getRepos().highlightStats.list(),
  ]);
  const stats: BusinessStats | null =
    statsRes.status === "fulfilled" ? statsRes.value : null;
  const highlights: HighlightStatRecord[] =
    highlightsRes.status === "fulfilled" ? highlightsRes.value : [];
  for (const r of [statsRes, highlightsRes]) {
    if (r.status === "rejected") {
      console.error(
        "[admin/stats] load failed:",
        r.reason instanceof Error ? r.reason.message : r.reason,
      );
    }
  }

  return (
    <>
      <AdminPageChrome page="reports" />
      <div className="space-y-6">
        {stats ? <StatsDashboard stats={stats} /> : <StatsLoadError />}
        <HighlightStatsEditor
          stats={highlights}
          customersCount={stats?.customers.total ?? 0}
        />
      </div>
    </>
  );
}
