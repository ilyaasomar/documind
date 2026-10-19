"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteDialog from "@/components/delete-dialog";

const ChatActions = ({ conversationId }: { conversationId: string }) => {
  //   console.log("action open", actionOpen);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  console.log("selected conversation id", conversationId);

  const handleDelete = () => {
    console.log("delete");
    console.log("deletingId", deletingId);
  };

  return (
    <div>
      <DeleteDialog open={open} setOpen={setOpen} onConfirm={handleDelete} />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setOpen(true);
                setDeletingId(conversationId);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatActions;
