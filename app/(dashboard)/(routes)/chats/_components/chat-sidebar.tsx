import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

import { MoreHorizontal } from "lucide-react";
import ChatActions from "./actions";

interface ChatSidebarProps {
  data: {
    id: string;
    title: string;
    document_id: string;
    document_name: string | undefined;
    document_type: "pdf" | "docx" | "xlsx" | "txt" | undefined;
  }[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  setNewConversation: (isNewConversation: boolean) => void;
  onDelete: (id: string) => void;
}
const ChatSidebar = ({
  data,
  activeId,
  onSelect,
  setNewConversation,
  onDelete,
}: ChatSidebarProps) => {
  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="flex flex-col space-y-2">
        {/* button */}
        <Button
          variant="default"
          className={`w-full justify-start dark:${styles.primaryHoverBgColor} dark:${styles.primaryBgColor} dark:text-white cursor-pointer`}
          onClick={() => setNewConversation(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-xs font-normal text-white">
            New Conversation
          </span>
        </Button>
        <Separator className="" />
        {/* list of conversations */}
        <div className="flex flex-col space-y-1 cursor-pointer">
          {data.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() => {
                onSelect(conversation.document_id);
                setNewConversation(false);
              }}
              className={`w-full flex items-center rounded-md px-3 py-2 ${
                conversation.document_id === activeId
                  ? `${styles.primarySoftBgColor} ${styles.primaryTextColor} font-medium dark:bg-gray-600 dark:text-white `
                  : "hover:bg-muted"
              }`}
            >
              <button className={`w-full rounded-md text-left text-sm`}>
                {/* file type icon */}
                <div className="flex items-center gap-1 w-full">
                  {/* <span className="text-xs font-normal text-muted-foreground dark:text-white">
                    {conversation.document_type?.toUpperCase()}
                  </span>
                  <div className="h-2 bg-blue-400 w-0.5"></div> */}
                  <span className="text-xs font-normal text-foreground">
                    {conversation.title}
                  </span>
                </div>

                {/* action button: delete and rename */}
              </button>
              <div className="ml-auto">
                <ChatActions
                  conversationId={conversation.id}
                  onDelete={onDelete}
                />
              </div>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
