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
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

const ChatActions = ({
  conversationId,
  onDelete,
}: {
  conversationId: string;
  onDelete: (id: string) => void;
}) => {
  //   console.log("action open", actionOpen);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    console.log("delete");
    console.log("deletingId", conversationId);
    setLoading(true);
    try {
      const response = await fetch(`/api/conversation/${conversationId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data) {
        onDelete(data.documentId);
        router.refresh();
        toast.add({
          type: "success",
          description: data.message,
        });
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        loading={loading}
      />
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
              onClick={() => setOpen(true)}
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
