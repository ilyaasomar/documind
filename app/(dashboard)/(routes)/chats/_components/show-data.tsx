import { Header } from "@/components/header";
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
const ShowChatData = ({
  documentsData,
}: {
  documentsData: ShowChatDataProps[];
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/40 sm:p-2">
      {/* <Header title="Chats" description="One document per conversation" /> */}

      <div className="mt-4 min-h-0 flex-1 sm:px-2">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-4">
          <div className="min-h-0 overflow-hidden rounded-lg bg-card md:col-span-1">
            <ChatSidebar />
          </div>
          <div className="min-h-0 overflow-hidden rounded-lg bg-card md:col-span-3">
            <ChatContent data={documentsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowChatData;
