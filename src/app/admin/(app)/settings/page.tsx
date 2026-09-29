import SettingsClient from "@/components/admin/SettingsClient";
import { getAdminRolesDoc, APP_ROLE_RANK, getAuthPosture, getCurrentAdmin } from "@/lib/admin/dal";
import { getDataAdapterName, isDatabaseUrlConfigured } from "@/lib/db/adapter";
import { getStripeStatus } from "@/lib/stripe/config";
import {
  getAutoEmailPayLinkPosture,
  getAutoVisitRemindersPosture,
  getMailStatus,
} from "@/lib/mail";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const posture = getAuthPosture();
  const rolesDoc = getAdminRolesDoc();
  const dataAdapter = getDataAdapterName();
  const databaseUrlConfigured = isDatabaseUrlConfigured();
  const stripe = getStripeStatus();
  const mail = getMailStatus();
  const autoEmailPayLink = getAutoEmailPayLinkPosture();
  const autoVisitReminders = getAutoVisitRemindersPosture();
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
      stripe={stripe}
      mail={mail}
      autoEmailPayLink={autoEmailPayLink}
      autoVisitReminders={autoVisitReminders}
      roles={roles}
    />
  );
}
