import SettingsClient from "@/components/admin/SettingsClient";
import { getAdminRolesDoc, APP_ROLE_RANK, getAuthPosture, getCurrentAdmin } from "@/lib/admin/dal";
import { getDataAdapterName, isDatabaseUrlConfigured } from "@/lib/db/adapter";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const posture = getAuthPosture();
  const rolesDoc = getAdminRolesDoc();
  const dataAdapter = getDataAdapterName();
  const databaseUrlConfigured = isDatabaseUrlConfigured();
  const roles = (Object.keys(APP_ROLE_RANK) as Array<keyof typeof APP_ROLE_RANK>).sort(
    (a, b) => APP_ROLE_RANK[b] - APP_ROLE_RANK[a],
  );
  const admin = await getCurrentAdmin();

  return (
    <SettingsClient
      configured={posture.configured}
      authMode={posture.mode}
      stubPasswordConfigured={posture.stubPasswordConfigured}
      credentialsEnabled={posture.credentialsEnabled}
      sessionRole={admin?.role ?? null}
      sessionStub={admin?.stub ?? true}
      rolesDoc={rolesDoc}
      dataAdapter={dataAdapter}
      databaseUrlConfigured={databaseUrlConfigured}
      roles={roles}
    />
  );
}
