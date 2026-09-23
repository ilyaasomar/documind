import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { member } from "@/db/schema";

// check if the user belongs to an organization
export async function getMembership() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const [membership] = await db
    .select()
    .from(member)
    .where(eq(member.userId, session.user.id))
    .limit(1);
  if (!membership) return null;

  return { user: session.user, member: membership };
}
