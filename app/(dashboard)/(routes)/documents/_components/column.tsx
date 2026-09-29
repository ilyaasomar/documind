"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableFeatures } from "./data-table-features";
import StatusHolder from "./statusHolder";
import DocumentActions from "./actions";

export type DocumentColumn = {
  id: string;
  organizationId: string;
  name: string;
  fileType: "pdf" | "docx" | "xlsx" | "txt";
  sizeBytes: number;
  status: "uploading" | "processing" | "ready" | "failed";
  uploadedBy: string | null;
  uploaded_by_name: string;
  createdAt: string;
};
// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, DocumentColumn>();

export const columns = columnHelper.columns([
  //   columnHelper.accessor("id", {
  //     header: "ID",
  //   }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            Added {row.original.createdAt} by {row.original.uploaded_by_name}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor("fileType", {
    header: "Type",
    cell: ({ row }) => {
      if (row.original.fileType === "pdf") {
        return "PDF";
      }
    },
  }),
  columnHelper.accessor("sizeBytes", {
    header: "Size",
    cell: ({ row }) => {
      const sizeInMB = row.original.sizeBytes / 1000000;
      return `${sizeInMB.toFixed(2)} MB`;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      if (row.original.status === "ready") {
        return <StatusHolder status={row.original.status} />;
      } else if (row.original.status === "processing") {
        return <StatusHolder status={row.original.status} />;
      } else if (row.original.status === "failed") {
        return <StatusHolder status={row.original.status} />;
      }
    },
  }),

  // call action buttons here
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DocumentActions />,
  }),
]);
