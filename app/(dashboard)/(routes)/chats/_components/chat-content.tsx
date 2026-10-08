"use client";
import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, File, Loader2, Plus, Send } from "lucide-react";
import React from "react";

interface ShowChatDataProps {
  id: string;
  name: string;
  fileType: "pdf" | "docx" | "xlsx" | "txt";
  sizeBytes: number;
  status: "uploading" | "processing" | "ready" | "failed";
  createdAt: Date;
}

interface ConversationMessages {
  id: string;
  documentId: string;
  messages: {
    id: string;
    content: string;
    role: "user" | "assistant";
    pageNumber: number;
  }[];
}

const ChatContent = ({ data }: { data: ShowChatDataProps[] }) => {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const [isDocumentHasConversation, setIsDocumentHasConversation] =
    React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<string | null>(
    null,
  );
  const [conversation, setConversation] =
    React.useState<ConversationMessages>();
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  console.log("conversation", conversation);

  const items = data.map((doc) => ({ value: doc.id, label: doc.name }));

  // when select a document go to db and get that document has conversation
  React.useEffect(() => {
    async function checkDocumentHasConversation() {
      const response = await fetch(`/api/conversation/${selectedDocument}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("returned data", data.conversation);
      const filteredData = {
        id: data?.conversation?.id,
        documentId: data?.conversation?.documentId,
        messages: data?.conversation?.messages?.map((message: any) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          pageNumber: message.citations?.filter((c: any) => c.number === 1)[0]
            ?.pageNumber,
        })),
      };

      console.log("conversationData", filteredData);
      // setIsDocumentHasConversation(data.hasConversation);
      setConversation(filteredData);
    }
    checkDocumentHasConversation();
  }, [selectedDocument]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const documentData = {
        inputValue: inputValue,
        selectedDocument: selectedDocument,
      };
      const response = await fetch(`/api/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
      });
      const data = await response.json();
      console.log("returned data", data);
      console.log("response", response);
      if (response.status === 400) {
        setIsLoading(false);
        setConversation((prev) => ({
          id: prev?.id ?? "",
          documentId: prev?.documentId ?? "",
          messages: [
            ...(prev?.messages ?? []).concat(
              data.messages.map((m: any) => m.content),
            ),
          ],
        }));
        setInputValue("");
        setIsLoading(false);

        return;
      }
      const filteredData = {
        id: data?.id,
        documentId: data?.documentId,
        messages: data?.messages?.map(
          (message: ConversationMessages["messages"][number]) => ({
            id: message.id,
            content: message.content,
            role: message.role,
            pageNumber: message.pageNumber,
          }),
        ),
      };

      console.log("conversationData", filteredData);

      setIsDocumentHasConversation(data.hasConversation);
      setConversation((prev) => ({
        id: data?.id,
        documentId: data?.documentId,
        // both ways works
        // messages: [...(prev?.messages ?? []), ...filteredData.messages],
        messages: [...(prev?.messages ?? []).concat(filteredData.messages)],
      }));
      setInputValue("");
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-2 border-b px-4 py-3 shrink-0 bg-card">
        <Button variant="outline" size="sm">
          Hide history
        </Button>

        <h3 className="truncate text-sm font-medium">
          {selectedDocument ? (
            <span className="text-foreground">
              {items.find((item) => item.value === selectedDocument)?.label}
            </span>
          ) : (
            <span className="text-muted-foreground">New conversation</span>
          )}
        </h3>
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {conversation?.messages?.length ? (
          <>
            {/* question */}
            {conversation?.messages?.map((message) => {
              return message?.role === "user" ? (
                <div
                  key={message?.id}
                  className={`ml-auto w-fit max-w-[80%] rounded-[10px_10px_3px_10px] px-3.5 py-2 text-sm ${styles.primarySoftBgColor}`}
                >
                  {message?.content}
                </div>
              ) : (
                <div key={message?.id} className="max-w-[85%] space-y-3">
                  <p className="space-y-1.5 text-sm text-black font-normal">
                    {message?.content
                      .replace(/\[\d+\]/g, "") // remove [1], [2]
                      .replace(/\s+([.,;:!?])/g, "$1") // "PostgreSQL ," → "PostgreSQL,"
                      .replace(/([.,;:!?])+([.,;:!?])/g, "$2") // ",." → "."
                      .trim()}
                  </p>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.primarySoftBgColor}`}
            >
              <File className={`h-5 w-5 ${styles.primaryTextColor}`} />
            </div>

            <h2 className="mt-4 text-base font-semibold">
              Nothing to search yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Questions are answered only from documents in this workspace.
              Upload one and it becomes searchable in about a minute.
            </p>
          </div>
        )}
      </div>

      {/* input bar */}
      <div className="border-t p-3 shrink-0 bg-card">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <Select
            items={items}
            onValueChange={(value) => setSelectedDocument(value as string)}
          >
            <SelectTrigger className="h-10 w-48 max-w-[45%] min-w-0 shrink">
              <SelectValue
                placeholder={
                  selectedDocument ? selectedDocument : "Select a document"
                }
              />
            </SelectTrigger>

            <SelectContent
              className="max-h-64 w-80 overflow-y-auto"
              alignItemWithTrigger={false}
              align="start"
            >
              <SelectGroup>
                {data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            placeholder="Type your question"
            className="h-10 min-w-0 flex-1 border-0 shadow-none focus-visible:ring-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!selectedDocument}
          />

          <Button
            type="submit"
            size="icon"
            className={`${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
            disabled={!selectedDocument || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
