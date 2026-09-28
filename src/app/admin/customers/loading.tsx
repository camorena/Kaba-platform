import { Skeleton, SkeletonTable } from "@/components/admin/Skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading customers">
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="h-8 w-44" />
      </div>
      <SkeletonTable rows={5} />
    </div>
  );
}
