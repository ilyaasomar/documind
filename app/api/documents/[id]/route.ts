import { db } from "@/db";
import { documents } from "@/db/schema";
import { getMembership } from "@/lib/actions/get-membership";
import { deleteObject } from "@/lib/r2";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);
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
    const document = await db.query.documents.findFirst({
      where: {
        id: id,
      },
    });
    if (!document) {
      return NextResponse.json(
        {
          message: "Document not found.",
        },
        { status: 404 },
      );
    } else if (document.organizationId !== membership.member.organizationId) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this document.",
        },
        { status: 403 },
      );
    } else if (document.uploadedBy !== membership.user.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this document.",
        },
        { status: 403 },
      );
    }

    const deleteDocument = await db
      .delete(documents)
      .where(eq(documents.id, id));
    if (deleteDocument) {
      //   delete the file from R2
      await deleteObject(document.storageKey);
    }
    return NextResponse.json(
      {
        status: "success",
        message: "Document deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete document",
      },
      { status: 500 },
    );
  }
}
