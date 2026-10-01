import { db } from "@/db";
import { getMembership } from "@/lib/actions/get-membership";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  console.log("documentId in route.ts", id);
  const membership = await getMembership();
  if (!membership) {
    return NextResponse.json(
      {
        message:
          "You are not a member. Please join an organization to access this feature.",
      },
      { status: 403 },
    );
  }
  if (!id) {
    return NextResponse.json(
      {
        message: "Document ID not found.",
      },
      { status: 400 },
    );
  }
  // check if the document has conversation
  try {
    const conversation = await db.query.conversations.findFirst({
      where: {
        documentId: id,
      },
    });

    if (conversation) {
      return NextResponse.json(
        {
          hasConversation: true,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          hasConversation: false,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error occurred while checking conversation.",
      },
      { status: 500 },
    );
  }
}
