import { Skeleton } from "@/components/admin/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading settings">
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
