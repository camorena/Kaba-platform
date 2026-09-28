import SettingsClient from "@/components/admin/SettingsClient";
import { getAdminPassword } from "@/lib/admin/auth";
import { getAdminRolesDoc, APP_ROLE_RANK } from "@/lib/admin/dal";
import { getDataAdapterName, isDatabaseUrlConfigured } from "@/lib/db/adapter";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const configured = Boolean(getAdminPassword());
  const rolesDoc = getAdminRolesDoc();
  const dataAdapter = getDataAdapterName();
  const databaseUrlConfigured = isDatabaseUrlConfigured();
  const roles = (Object.keys(APP_ROLE_RANK) as Array<keyof typeof APP_ROLE_RANK>).sort(
    (a, b) => APP_ROLE_RANK[b] - APP_ROLE_RANK[a],
  );

  return (
    <SettingsClient
      configured={configured}
      rolesDoc={rolesDoc}
      dataAdapter={dataAdapter}
      databaseUrlConfigured={databaseUrlConfigured}
      roles={roles}
    />
  );
}
