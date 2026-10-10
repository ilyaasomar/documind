"use client";
import React from "react";
import ChatSidebar from "./chat-sidebar";
import ChatContent from "./chat-content";
interface ShowChatDataProps {
  id: string;
  name: string;
  fileType: "pdf" | "docx" | "xlsx" | "txt";
  sizeBytes: number;
  status: "uploading" | "processing" | "ready" | "failed";
  createdAt: Date;
}
[];

interface ConversationMessages {
  id: string;
  title: string;
  document_id: string;
  document_name: string | undefined;
  document_type: "pdf" | "docx" | "xlsx" | "txt" | undefined;
}
const ShowChatData = ({
  documentsData,
  conversationsData,
}: {
  documentsData: ShowChatDataProps[];
  conversationsData: ConversationMessages[];
}) => {
  const [activeDocumentId, setActiveDocumentId] = React.useState<string | null>(
    null,
  );
  const [newConversation, setNewConversation] = React.useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/40 sm:p-2">
      <div className="mt-4 min-h-0 flex-1 sm:px-2">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-4">
          <div className="min-h-0 overflow-hidden rounded-lg bg-card md:col-span-1">
            <ChatSidebar
              data={conversationsData}
              activeId={activeDocumentId}
              setNewConversation={setNewConversation}
              onSelect={setActiveDocumentId}
            />
          </div>
          <div className="min-h-0 overflow-hidden rounded-lg bg-card md:col-span-3">
            <ChatContent
              data={documentsData}
              activeDocumentId={activeDocumentId}
              onSelect={setActiveDocumentId}
              newConversation={newConversation}
              setNewConversation={setNewConversation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowChatData;
