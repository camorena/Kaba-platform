import SettingsClient from "@/components/admin/SettingsClient";
import { getAdminPassword } from "@/lib/admin/auth";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const configured = Boolean(getAdminPassword());

  return (
    <SettingsClient configured={configured} />
  );
}
