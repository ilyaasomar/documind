import { Button } from "@/components/ui/button";
import React from "react";

const DocumentActions = () => {
  return (
    <div className="flex items-center justify-center gap-x-2 mr-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className=" px-2 cursor-pointer font-normal"
      >
        Chat
      </Button>
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
      >
        Delete
      </Button>
    </div>
  );
};

export default DocumentActions;
