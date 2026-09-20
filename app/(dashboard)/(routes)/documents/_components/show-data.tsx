"use client";
import { useState } from "react";
import { styles } from "@/app/styles";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import DocumentDialog from "./dialog";
import DocumentActions from "./document-actions";

const ShowDocumentData = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar title="Documents" description="Upload and manage your files">
        <Button
          type="button"
          className={`h-10 px-4 w-full cursor-pointer ${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
          onClick={() => setOpen(true)}
        >
          Upload Document
        </Button>
      </Navbar>
      <div className="flex-1 p-4 sm:p-6">
        {/* document action here: insert, update */}
        <DocumentActions open={open} setOpen={setOpen} />
        Documents
      </div>
    </>
  );
};

export default ShowDocumentData;
