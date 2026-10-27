"use client";
import DeleteDialog from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DocumentActions = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function deleteDocument() {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("data", data);
      toast.add({
        type: "success",
        description: data.message,
      });
      router.refresh();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  return (
    <>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        onConfirm={deleteDocument}
        loading={loading}
      />
      <div className="flex items-center justify-center gap-x-2 mr-1">
        {/* <Button
        type="button"
        size="sm"
        variant="outline"
        className=" px-2 cursor-pointer font-normal"
      >
        Chat
      </Button> */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className=" px-2 cursor-pointer font-normal"
        >
          Open
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className=" px-2 cursor-pointer font-normal text-red-600 hover:text-red-600"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default DocumentActions;
