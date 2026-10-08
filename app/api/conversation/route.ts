import { db } from "@/db";
import { getMembership } from "@/lib/actions/get-membership";
import { processConversation } from "@/lib/actions/conversation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { inputValue: prompt, selectedDocument: selectedDocumentId } =
    await request.json();
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
  if (!prompt || !selectedDocumentId) {
    return NextResponse.json(
      {
        message: "Prompt or selected document ID not found.",
      },
      { status: 400 },
    );
  }

  try {
    // check if the document id exist
    const document = await db.query.documents.findFirst({
      where: { id: selectedDocumentId },
    });

    if (!document) {
      return NextResponse.json(
        {
          message: "Document not found.",
        },
        { status: 404 },
      );
    }
    const userId = membership.member.userId;
    const organizationId = membership.member.organizationId;

    const result = await processConversation(
      prompt,
      selectedDocumentId,
      userId,
      organizationId,
      document.name,
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Error processing conversation:", error);
    return NextResponse.json(
      {
        // id: error.id,
        documentId: selectedDocumentId,
        messages: [
          {
            id: undefined,
            role: "user",
            content: prompt,
            pageNumber: undefined,
          },
          {
            id: undefined,
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "An error occurred while processing the conversation.",
            pageNumber: undefined,
          },
        ],
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while processing the conversation.",
      },
      { status: 500 },
    );
  }
}
