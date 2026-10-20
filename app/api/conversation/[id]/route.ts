import { db } from "@/db";
import { conversations } from "@/db/schema";
import { getMembership } from "@/lib/actions/get-membership";
import { eq } from "drizzle-orm";
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
      with: {
        messages: {
          with: { citations: true },
        },
      },
    });

    if (conversation) {
      return NextResponse.json(
        {
          hasConversation: true,
          conversation: conversation,
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  console.log("deletingId", id);
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
  try {
    const conversation = await db.query.conversations.findFirst({
      where: {
        id: id,
      },
    });
    if (!conversation) {
      return NextResponse.json(
        {
          message: "Conversation not found.",
        },
        { status: 404 },
      );
    }
    await db.delete(conversations).where(eq(conversations.id, id));

    return NextResponse.json(
      {
        documentId: conversation.documentId,
        message: "Conversation deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error occurred while deleting conversation.",
      },
      { status: 500 },
    );
  }
}
