import { getMembership } from "@/lib/actions/get-membership";
import ShowChatData from "./_components/show-data";
import { NextResponse } from "next/server";
import { db } from "@/db";
const Chats = async () => {
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
  // get documents from the database
  // this is inner join query using drizzle-orm
  // const documentsSqlData = await db
  //   .select()
  //   .from(documents)
  //   .where(
  //     and(
  //       eq(documents.organizationId, membership.member.organizationId),
  //       eq(documents.status, "ready"),
  //     ),
  //   )
  //   .innerJoin(user, eq(documents.uploadedBy, user.id));

  // this is query using drizzle-orm with relations

  const documentsData = await db.query.documents.findMany({
    where: {
      organizationId: membership.member.organizationId,
      status: "ready",
    },
    // with: { uploader: true },
  });
  const conversations = await db.query.conversations.findMany({
    where: {
      organizationId: membership.member.organizationId,
      userId: membership.user.id,
    },
    with: { document: true },
  });

  const formatDocumentsData = documentsData.map((doc) => ({
    id: doc.id,
    name: doc.name,
    fileType: doc.fileType,
    sizeBytes: doc.sizeBytes,
    status: doc.status,
    createdAt: doc.createdAt,
  }));

  const formatConversationsData = conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title,
    document_id: conversation.documentId,
    document_name: conversation.document?.name,
    document_type: conversation.document?.fileType,
  }));

  return (
    <ShowChatData
      documentsData={formatDocumentsData}
      conversationsData={formatConversationsData}
    />
  );
};

export default Chats;
