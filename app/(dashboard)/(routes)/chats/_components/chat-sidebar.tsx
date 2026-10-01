import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React from "react";

const ChatSidebar = () => {
  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="flex flex-col space-y-2">
        {/* button */}
        <Button variant="default" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-xs font-normal text-white cursor-pointer">
            New Conversation
          </span>
        </Button>
        <Separator className="" />
        {/* list of conversations */}
        <div className="flex flex-col space-y-2">
          <button className="flex items-center gap-2 p-2 rounded text-left hover:bg-gray-100 cursor-pointer">
            {/* file type icon */}
            <span className="text-xs font-normal text-muted-foreground">
              PDF
            </span>
            <span className="text-xs font-normal text-foreground">
              Conversation 1
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
