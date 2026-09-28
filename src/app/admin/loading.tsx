import { Skeleton, SkeletonStatRow, SkeletonTable } from "@/components/admin/Skeleton";

export default function AdminLoading() {
  return (
    <div className="admin-app min-h-full px-3 py-4 sm:px-5 lg:px-6" aria-busy="true" aria-label="Loading admin">
      <div className="mb-5 space-y-2">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <SkeletonStatRow />
      <div className="mt-5">
        <SkeletonTable rows={6} />
      </div>
    </div>
  );
}
