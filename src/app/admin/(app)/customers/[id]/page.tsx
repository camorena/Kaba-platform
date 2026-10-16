import CustomerDetailClient from "@/components/admin/CustomerDetailClient";
import { getCustomer, listQuotes } from "@/lib/admin/quotes-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);
  return { title: customer ? customer.name : "Customer" };
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const email = customer.email.toLowerCase().trim();
  const quotes = (await listQuotes())
    .filter(
      (q) =>
        q.customerId === customer.id ||
        (email && q.email.toLowerCase().trim() === email),
    )
    .map((q) => ({
      id: q.id,
      serviceType: q.serviceType,
      status: q.status,
      createdAt: q.createdAt,
    }));

  // Keyed by updatedAt so the edit form resets to fresh server data after a save.
  return (
    <CustomerDetailClient
      key={customer.updatedAt}
      customer={customer}
      quotes={quotes}
    />
  );
}
