import { db } from "@/db";
import { organization, plans } from "@/db/schema";
import { eq } from "drizzle-orm";

// const PLAN_LIMITS = {
//   free: { uploadBytes: 20 * 1024 * 1024, questions: 40 },
//   pro: { uploadBytes: 2 * 1024 * 1024 * 1024, questions: 1000 },
// };

const LIMITS = {
  uploadBytes: 2 * 1024 * 1024, // 20 MB
  questions: 5,
};

// first day of next month, at midnight
function nextMonth() {
  const now = new Date();
  console.log("now", now);
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export async function getUsage(organizationId: string) {
  const [row] = await db
    .select()
    .from(organization)
    .innerJoin(plans, eq(organization.planId, plans.id))
    .where(eq(organization.id, organizationId));

  const org = row.organization;
  const plan = row.plans;
  let uploadedBytes = org.uploadedBytes;
  let questionsUsed = org.questionsUsed;

  //   if new month started begin again
  if (new Date() >= org.usageResetAt) {
    await db
      .update(organization)
      .set({
        uploadedBytes: 0,
        questionsUsed: 0,
        usageResetAt: nextMonth(),
      })
      .where(eq(organization.id, organizationId));

    uploadedBytes = 0;
    questionsUsed = 0;
  }

  return {
    planName: plan.name,
    uploadedBytes,
    uploadLimit: plan.uploadBytesLimit,
    questionsUsed,
    questionsLimit: plan.questionsLimit,
  };
}
