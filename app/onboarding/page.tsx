import { getUser } from "@/lib/actions/get-user";
import OnboardingForm from "./onboarding-form";
import { redirect } from "next/navigation";
import { member } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

const Onboarding = async () => {
  //1. redirects to /signin if there is no session
  const user = await getUser();

  // 2. if the user belongs to an organization, redirect to /
  const [membership] = await db
    .select()
    .from(member)
    .where(eq(member.userId, user.id))
    .limit(1);
  if (membership) return redirect("/");

  return <OnboardingForm />;
};

export default Onboarding;
