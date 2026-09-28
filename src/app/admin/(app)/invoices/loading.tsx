import { Skeleton, SkeletonTable } from "@/components/admin/Skeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading invoices">
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-28 w-full rounded-xl" />
      <SkeletonTable rows={5} />
    </div>
  );
}
