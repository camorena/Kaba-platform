import { Skeleton, SkeletonTable } from "@/components/admin/Skeleton";

export default function QuotesLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading quotes">
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}
