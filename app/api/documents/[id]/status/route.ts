import { db } from "@/db";
import { documents } from "@/db/schema";
import { getMembership } from "@/lib/actions/get-membership";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const membership = await getMembership();
  if (!membership) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const [document] = await db
    .select({
      status: documents.status,
      stage: documents.stage,
      progress: documents.progress,
      errorMessage: documents.errorMessage,
    })
    .from(documents)
    .where(
      and(
        eq(documents.id, id),
        eq(documents.organizationId, membership.member.organizationId),
      ),
    )
    .limit(1);

  if (!document) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
