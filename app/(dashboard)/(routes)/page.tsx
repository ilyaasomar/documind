import { Navbar } from "@/components/navbar";
import { db } from "@/db";
import { member, organization } from "@/db/schema";
import { getUser } from "@/lib/actions/get-user";
import { eq } from "drizzle-orm";

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
    <>
      <Navbar
        title="Dashboard"
        description={`Your workspace at ${organization_name}`}
      />
      <div className="flex-1 p-4 sm:p-6">Hello from page.tsx</div>
    </>
  );
}
