import React from "react";
import TopCards from "./cards";
import { db } from "@/db";
import { and, desc, eq } from "drizzle-orm";
import { getMembership } from "@/lib/actions/get-membership";
import { conversations, documents, messages } from "@/db/schema";
import DocumentTable from "./document_table";
import { redirect } from "next/navigation";
import RecentConversations from "./recent_conversations";
// formats the hours and minutes as ago

const DashboardPage = async () => {
  // get membership
  const membership = await getMembership();
  if (!membership) redirect("/signin");

  const allDocuments = await db
    .select({
      id: documents.id,
      organizationId: documents.organizationId,
      name: documents.name,
      fileType: documents.fileType,
      sizeBytes: documents.sizeBytes,
      status: documents.status,
      uploadedBy: documents.uploadedBy,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents?.organizationId, membership?.member?.organizationId))
    .orderBy(desc(documents.createdAt));

  // question
  const allQuestions = await db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      content: messages.content,
      role: messages.role,
      createdAt: messages.createdAt,
      file_name: documents.name,
      file_type: documents.fileType,
    })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .innerJoin(documents, eq(conversations.documentId, documents.id))
    .where(
      and(
        eq(conversations.organizationId, membership?.member?.organizationId),
        eq(messages.role, "user"),
      ),
    )
    .orderBy(desc(messages.createdAt));

  // get total questions asked this month
  const currentMonthQuestions = allQuestions.filter((question) => {
    const questionDate = new Date(question.createdAt);
    const currentDate = new Date();
    return (
      questionDate.getMonth() === currentDate.getMonth() &&
      questionDate.getUTCFullYear() === currentDate.getFullYear()
    );
  });
  console.log("currentMonthQuestions", currentMonthQuestions.length);

  // get the last 5 documents and conversations
  const last_documents = allDocuments.slice(0, 5);
  const last_conversations = allQuestions.slice(0, 5);

  // format the sizeBytes to KB, MB, GB
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1048576) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1073741824) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    }
  };
  const formatFileType = (fileType: string): string => {
    switch (fileType) {
      case "pdf":
        return "PDF";
      case "docx":
        return "DOCX";
      case "xlsx":
        return "XLSX";
      case "txt":
        return "TXT";
      default:
        return "Unknown";
    }
  };
  const documents_formatted = last_documents.map((doc) => {
    const file_size = formatFileSize(doc.sizeBytes);
    const file_type = formatFileType(doc.fileType);
    const status =
      doc.status === "ready"
        ? "Ready"
        : doc.status === "processing"
          ? "Processing"
          : doc.status === "failed"
            ? "Failed"
            : "";
    return {
      id: doc.id,
      name: doc.name,
      type: file_type,
      size: file_size,
      status: status,
    };
  });

  // formatted conversations
  const conversations_formatted = last_conversations.map((conv) => {
    const file_type = formatFileType(conv.file_type);
    return {
      id: conv.id,
      question: conv.content,
      document: conv.file_name,
      type: file_type,
      createdAt: conv.createdAt,
    };
  });

  const cardsData = [
    {
      title: "Total Documents",
      count: allDocuments.length,
    },
    {
      title: "Questions asked this month",
      count: currentMonthQuestions.length,
    },
    {
      title: "Questions asked",
      count: allQuestions.length,
    },
  ];

  return (
    <div className="flex max-w-295 flex-col gap-4 px-4 pt-5 pb-10">
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cardsData.map((data, index) => (
          <TopCards key={index} data={data} />
        ))}
      </div>
      {/* recent conversations */}
      <RecentConversations recent={conversations_formatted} />

      {/* documents */}
      <DocumentTable
        document_data={documents_formatted as any}
        count={allDocuments.length}
      />
    </div>
  );
};

export default DashboardPage;
