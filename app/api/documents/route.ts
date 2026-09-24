import { createDocument } from "@/lib/actions/document";
import { getMembership } from "@/lib/actions/get-membership";
import { after, NextRequest, NextResponse } from "next/server";
import { processDocument } from "../../../lib/actions/document";

export async function POST(request: NextRequest) {
  const membership = await getMembership();
  if (!membership)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File;
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file received" }, { status: 400 });
  }
  try {
    const result = await createDocument({
      file,
      organizationId: membership.member.organizationId,
      userId: membership.user.id,
    });
    if (result.duplicate) {
      return NextResponse.json(
        {
          message: "This document is already in your workspace.",
          data: result.document,
        },
        { status: 409 },
      );
    }

    after(() => processDocument(result.document.id));
    
    return NextResponse.json(
      { message: "Document uploaded.", data: result.document },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    console.error("createDocument failed:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
