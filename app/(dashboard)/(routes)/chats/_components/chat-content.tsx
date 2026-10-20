"use client";
import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { router } from "better-auth/api";
import { ArrowLeft, ArrowRight, File, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
    pageNumber?: number;
  }[];
}

const ChatContent = ({
  data,
  activeDocumentId,
  onSelect,
  newConversation,
  setNewConversation,
  hideSidebar,
  setHideSidebar,
}: {
  data: ShowChatDataProps[];
  activeDocumentId: string | null;
  onSelect: (id: string | null) => void;
  newConversation: boolean;
  setNewConversation: (isNewConversation: boolean) => void;
  hideSidebar: boolean;
  setHideSidebar: (hideSidebar: boolean) => void;
}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [conversation, setConversation] = useState<ConversationMessages>();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const items = data.map((doc) => ({ value: doc.id, label: doc.name }));
  // this useEffect is works only when click on new conversation button
  useEffect(() => {
    if (newConversation) {
      onSelect(null);
      setConversation(undefined);
      data = [];
    }
  }, [newConversation]);

  const lastMessage =
    conversation?.messages?.[conversation.messages.length - 1]?.content;
  // this useEffect scrolls the the conversation all the way to the bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [lastMessage, activeDocumentId]);

  // when select a document go to db and get that document has conversation
  useEffect(() => {
    if (!activeDocumentId) return;
    async function checkDocumentHasConversation() {
      const response = await fetch(`/api/conversation/${activeDocumentId}`, {
        method: "GET",
      });
      const data = await response.json();
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

      setConversation(filteredData);
    }
    checkDocumentHasConversation();
  }, [activeDocumentId]);

  // put text into the last message (the empty assistant one)
  function replaceLastMessage(content: string) {
    setConversation((prev) => {
      if (!prev) return prev;

      const lastIndex = prev.messages.length - 1;

      const messages = prev.messages.map((message, index) =>
        index === lastIndex ? { ...message, content } : message,
      );

      return { ...prev, messages };
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const question = inputValue;
    setInputValue("");
    // 1. show the question and an empty answer right away
    setConversation((prev) => ({
      id: prev?.id ?? "",
      documentId: activeDocumentId ?? "",
      messages: [
        ...(prev?.messages ?? []),
        {
          id: "question-" + Date.now(),
          role: "user",
          content: question,
          pageNumber: undefined,
        },
        {
          id: "answer-" + Date.now(),
          role: "assistant",
          content: "",
          pageNumber: undefined,
        },
      ],
    }));

    try {
      const response = await fetch(`/api/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputValue: question,
          selectedDocument: activeDocumentId,
        }),
      });

      // 2. errors come back as JSON
      if (!response.ok) {
        const data = await response.json();
        replaceLastMessage(data.message);
        return;
      }

      // 3. fill the empty answer while the text arrives
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        answer = answer + decoder.decode(value);
        replaceLastMessage(answer);
      }

      inputRef.current?.focus();
      router.refresh();
    } catch (error) {
      console.log("error", error);
      replaceLastMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-2 border-b px-4 py-3 shrink-0 bg-card">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHideSidebar(!hideSidebar)}
        >
          {hideSidebar ? (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Show chat
            </>
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Hide chat
            </>
          )}
        </Button>

        <h3 className="truncate text-sm font-medium">
          {activeDocumentId ? (
            <span className="text-foreground">
              {items.find((item) => item.value === activeDocumentId)?.label}
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
                  className={`ml-auto w-fit max-w-[80%] rounded-[10px_10px_3px_10px] px-3.5 py-2 text-sm ${styles.primarySoftBgColor} dark:bg-gray-600 dark:text-white`}
                >
                  {message?.content}
                </div>
              ) : (
                <div key={message?.id} className="max-w-[85%] space-y-3">
                  <p className="space-y-1.5 text-sm text-black font-normal dark:text-white">
                    {message.role === "assistant" && message.content === "" ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking…
                      </div>
                    ) : (
                      <p className="text-sm">
                        {" "}
                        {/* without markdown */}
                        {/* {message?.content
                          .replace(/\[\d+\]/g, "") // remove [1], [2]
                          .replace(/\s+([.,;:!?])/g, "$1") // "PostgreSQL ," → "PostgreSQL,"
                          .replace(/([.,;:!?])+([.,;:!?])/g, "$2") // ",." → "."
                          .trim()} */}
                        {/* with markdown */}
                        <Markdown>
                          {message.content.replace(/\[\d+\]/g, "").trim()}
                        </Markdown>
                      </p>
                    )}
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
        <div ref={scrollRef} />
      </div>

      {/* input bar */}
      <div className="border-t p-3 shrink-0 bg-card">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <Select
            items={items}
            onValueChange={(value) => {
              onSelect(value as string);
              setNewConversation(false);
            }}
            value={activeDocumentId ?? ""}
          >
            <SelectTrigger className="h-10 w-48 max-w-[45%] min-w-0 shrink">
              <SelectValue placeholder={"Select a document"}>
                {(value) =>
                  data.find((doc) => doc.id === value)?.name ??
                  "Select a document"
                }
              </SelectValue>
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
            ref={inputRef}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!activeDocumentId || isLoading}
          />

          <Button
            type="submit"
            size="icon"
            className={`${styles.primaryBgColor} ${styles.primaryHoverBgColor} dark:${styles.primaryHoverBgColor} dark:${styles.primaryBgColor} dark:text-white cursor-pointer`}
            disabled={!activeDocumentId || isLoading || !inputValue}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
