import React from "react";
import TopCards from "./cards";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { getMembership } from "@/lib/actions/get-membership";
import { conversations, documents, messages } from "@/db/schema";
import DocumentTable from "./document_table";

const recent = [
  {
    question: "What is the notice period in the Nordwind supplier agreement?",
    time: "14 minutes ago",
    document: "Supplier agreement – Nordwind GmbH.pdf",
    type: "PDF",
  },
  {
    question: "How many vacation days do employees get after five years?",
    time: "2 hours ago",
    document: "Employee handbook 2026.docx",
    type: "DOCX",
  },
  {
    question: "Which invoices from Metzler are still unpaid this quarter?",
    time: "Yesterday, 16:40",
    document: "Invoice 2026-0417 – Metzler Logistik.pdf",
    type: "PDF",
  },
  {
    question: "Can I claim a taxi to the airport under the travel policy?",
    time: "Yesterday, 09:12",
    document: "Travel expense policy.txt",
    type: "TXT",
  },
];

const DashboardPage = async () => {
  // get membership
  const membership = await getMembership();

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
    .where(eq(documents?.organizationId, membership?.member?.organizationId));

  // question
  const allQuestions = await db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      content: messages.content,
      role: messages.role,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(
      and(
        eq(conversations.organizationId, membership?.member?.organizationId),
        eq(messages.role, "user"),
      ),
    );

  console.log("allQuestions", allQuestions);

  // last 5 documents
  const last_documents = allDocuments.slice(-5).reverse();
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
  const last_documents_formatted = last_documents.map((doc) => {
    const file_size = formatFileSize(doc.sizeBytes);
    const file_type =
      doc.fileType === "pdf"
        ? "PDF"
        : doc.fileType === "docx"
          ? "DOCX"
          : doc.fileType === "xlsx"
            ? "XLSX"
            : doc.fileType === "txt"
              ? "TXT"
              : "";
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
  const cardsData = [
    {
      title: "Total Documents",
      count: allDocuments.length,
    },
    {
      title: "Questions asked this month",
      count: 30,
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
      <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:bg-[#0a0a0a] dark:border-[#2c2c2c]">
        <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3">
          <h2 className="text-sm font-semibold">Recent conversations</h2>
          <button className="text-[13px] text-[#1d4f9c]">Open chat</button>
        </div>

        {recent.map((item) => (
          <div
            key={item.question}
            className="border-t border-[#f1f2f5] px-4 py-3 hover:bg-[#fafbfc] dark:hover:bg-[#2c2c2c] cursor-pointer"
          >
            <div className="flex items-baseline gap-4">
              <span className="flex-1 text-[13.5px] font-medium">
                {item.question}
              </span>
              <span className="text-xs text-[#8b9199]">{item.time}</span>
            </div>

            <div className="mt-2 flex">
              <span className="flex items-center gap-1.5 rounded-[5px] border border-[#e3e5e9] dark:text-white bg-[#fafbfc] dark:bg-[#0a0a0a] px-2 py-0.5 text-[11.5px] text-[#4a5058]">
                <span className="text-[9px] font-semibold text-[#8b9199] dark:text-white">
                  {item.type}
                </span>
                {item.document}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* documents */}
      <DocumentTable
        document_data={last_documents_formatted as any}
        count={allDocuments.length}
      />
    </div>
  );
};

export default DashboardPage;
