"use client";
import { useRouter } from "next/navigation";
import React from "react";

const typeColors: Record<string, string> = {
  PDF: "bg-[#eef2f8] text-[#1d4f9c]",
  DOCX: "bg-[#eef2f8] text-[#31527e]",
  XLSX: "bg-[#e8f3ec] text-[#15703c]",
  TXT: "bg-[#f1f2f5] text-[#4a5058]",
};

const statusColors: Record<string, string> = {
  Uploading: "bg-[#f1f2f5] text-[#4a5058]",
  Ready: "bg-[#e8f3ec] text-[#15703c]",
  Processing: "bg-[#fdf3e3] text-[#8a5c0c]",
  Failed: "bg-[#fdeceb] text-[#a51f18]",
};

const dotColors: Record<string, string> = {
  Uploading: "bg-[#8b9199]",
  Ready: "bg-[#1a8347]",
  Processing: "bg-[#c2870f]",
  Failed: "bg-[#c8332a]",
};

type DocumentInterface = {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "XLSX" | "TXT";
  size: string;
  status: "Uploading" | "Processing" | "Ready" | "Failed";
}[];

const DocumentTable = ({
  document_data,
  count,
}: {
  document_data: DocumentInterface;
  count: number;
}) => {
  const router = useRouter();
  return (
    <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:bg-[#0a0a0a] dark:border-[#2c2c2c]">
      <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3">
        <h2 className="text-sm font-semibold">Documents</h2>
        <button
          className="text-[13px] text-[#1d4f9c] cursor-pointer"
          onClick={() => router.push("/documents")}
        >
          View all {count}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-155 grid-cols-[1fr_76px_92px_200px] border-b border-[#edeef1] dark:border-[#2c2c2c] dark:bg-[#0a0a0a] bg-[#fafbfc] px-4 py-2 text-[11.5px] text-[#6b7280]">
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
          <div>Status</div>
        </div>

        {document_data.map((doc) => (
          <div
            key={doc.name}
            className="grid min-w-155 grid-cols-[1fr_76px_92px_200px] items-center border-b border-[#f1f2f5] px-4 py-2.5 text-[13.5px]"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-[5px] text-[8.5px] font-semibold ${typeColors[doc.type]}`}
              >
                {doc.type}
              </span>
              {doc.name}
            </div>

            <div className="text-[12.5px] text-[#6b7280]">{doc.type}</div>
            <div className="text-[12.5px] text-[#6b7280]">{doc.size}</div>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-[5px] px-2 py-0.75 text-[11.5px] font-medium ${statusColors[doc.status]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${dotColors[doc.status]}`}
                />
                {doc.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTable;
