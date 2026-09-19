"use server";

import { db } from "@/db";
import { getUser } from "./get-user";
import { member, organization } from "@/db/schema";

export async function createWorkspace(workspace_name: string) {
  const user = await getUser();
  console.log(user);
  console.log(workspace_name);
  const slug = workspace_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  //   create workspace
  const [org] = await db
    .insert(organization)
    .values({
      name: workspace_name,
      slug: slug,
    })
    .returning();
  // create member
  await db.insert(member).values({
    organizationId: org.id,
    userId: user.id,
    role: "owner",
  });

  return org;
}
