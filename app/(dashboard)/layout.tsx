import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { db } from "@/db";
import { member, user } from "@/db/schema";
import { getUser } from "@/lib/actions/get-user";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Is the user logged in?
  const user = await getUser();
  // 2. Does this person belong to an organization?
  const [membership] = await db
    .select()
    .from(member)
    .where(eq(member.userId, user.id))
    .limit(1);
  if (!membership) redirect("/onboarding");
  // 3. Both checks passed, so show the dashboard page
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
