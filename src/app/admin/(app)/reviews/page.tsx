import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ReviewsManager, { type ReviewCustomerOption } from "@/components/admin/ReviewsManager";
import StatsLoadError from "@/components/admin/StatsLoadError";
import { getRepos } from "@/lib/db/adapter";
import type { ReviewRecord } from "@/lib/reviews/model";

export const metadata = { title: "Reseñas" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const repos = getRepos();
  const [reviewsRes, customersRes] = await Promise.allSettled([
    repos.reviews.list(),
    repos.customers.list(),
  ]);
  if (reviewsRes.status === "rejected") {
    console.error(
      "[admin/reviews] load failed:",
      reviewsRes.reason instanceof Error ? reviewsRes.reason.message : reviewsRes.reason,
    );
  }
  const reviews: ReviewRecord[] = reviewsRes.status === "fulfilled" ? reviewsRes.value : [];
  const customers: ReviewCustomerOption[] =
    customersRes.status === "fulfilled"
      ? customersRes.value
          .filter((c): c is typeof c & { id: string } => Boolean(c.id))
          .map((c) => ({ id: c.id, name: c.name || c.email || c.id }))
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

  return (
    <>
      <AdminPageChrome page="reviews" />
      {reviewsRes.status === "rejected" ? (
        <StatsLoadError />
      ) : (
        <ReviewsManager reviews={reviews} customers={customers} />
      )}
    </>
  );
}
