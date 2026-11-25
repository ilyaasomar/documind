import { Header } from "@/components/header";
import ShowSettingsData from "./_components/show-data";
import { db } from "@/db";
import { organization, plans } from "@/db/schema";
import { getMembership } from "@/lib/actions/get-membership";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getUsage } from "@/lib/actions/usage";
const Settings = async () => {
  const membership = await getMembership();
  if (!membership) redirect("/signin");
  const workspace = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      uploaded_bytes: organization.uploadedBytes,
      questions_used: organization.questionsUsed,
      plan: plans.name,
      upload_bytes_limit: plans.uploadBytesLimit,
      questions_limit: plans.questionsLimit,
    })
    .from(organization)
    .innerJoin(plans, eq(organization.planId, plans.id))
    .where(eq(organization.id, membership.member.organizationId));

  // const usage = await getUsage(membership.member.organizationId);
  return <ShowSettingsData workspace={workspace} />;
};

export default Settings;
