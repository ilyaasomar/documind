"use client";
import { useState } from "react";
import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import DocumentActions from "./document-actions";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Header } from "@/components/header";
import { DocumentInterface } from "../page";

const ShowDocumentData = ({ data }: { data: DocumentInterface[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex-1 sm:p-2">
      <Header title="Documents" description="Upload and manage your files">
        <Button
          type="button"
          className={`h-10 px-4 w-full cursor-pointer ${styles.primaryBgColor} ${styles.primaryHoverBgColor} dark:${styles.primaryHoverBgColor} dark:${styles.primaryBgColor} dark:text-white`}
          onClick={() => setOpen(true)}
        >
          Upload Document
        </Button>
      </Header>
      {/* document action here: insert, update */}
      <DocumentActions open={open} setOpen={setOpen} />
      {/* calling data table */}

      <div className="mt-4 sm:px-2">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ShowDocumentData;
