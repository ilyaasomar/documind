import { Header } from "@/components/header";
import { db } from "@/db";
import { member, organization } from "@/db/schema";
import { getUser } from "@/lib/actions/get-user";
import { eq } from "drizzle-orm";
import DashboardPage from "./_dashboard/page";

export default async function Home() {
  const user = await getUser();
  const [organizations] = await db
    .select()
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(eq(member.userId, user.id))
    .limit(1);
  const organization_name = organizations.organization.name;

  return (
    <div className="flex-1 sm:p-2 overflow-auto">
      <Header
        title="Dashboard"
        description={`Your workspace at ${organization_name}`}
      />
      <DashboardPage />
    </div>
  );
}
