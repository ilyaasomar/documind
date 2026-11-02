import React from "react";
import TopCards from "./cards";

const cardsData = [
  {
    title: "Total Documents",
    count: 10,
  },
  {
    title: "Questions asked this month",
    count: 30,
  },
  {
    title: "Questions asked",
    count: 52,
  },
];
const recent = [
  {
    question: "What is the notice period in the Nordwind supplier agreement?",
    time: "14 minutes ago",
    document: "Supplier agreement – Nordwind GmbH.pdf",
    type: "PDF",
  },
  {
    question: "How many vacation days do employees get after five years?",
    time: "2 hours ago",
    document: "Employee handbook 2026.docx",
    type: "DOCX",
  },
  {
    question: "Which invoices from Metzler are still unpaid this quarter?",
    time: "Yesterday, 16:40",
    document: "Invoice 2026-0417 – Metzler Logistik.pdf",
    type: "PDF",
  },
  {
    question: "Can I claim a taxi to the airport under the travel policy?",
    time: "Yesterday, 09:12",
    document: "Travel expense policy.txt",
    type: "TXT",
  },
];

const documents = [
  {
    name: "Supplier agreement – Nordwind GmbH.pdf",
    type: "PDF",
    size: "2.4 MB",
    status: "Ready",
  },
  {
    name: "Employee handbook 2026.docx",
    type: "DOCX",
    size: "1.1 MB",
    status: "Ready",
  },
  {
    name: "Q2 budget forecast.xlsx",
    type: "XLSX",
    size: "840 KB",
    status: "Processing",
  },
  {
    name: "Invoice 2026-0417 – Metzler Logistik.pdf",
    type: "PDF",
    size: "320 KB",
    status: "Ready",
  },
  {
    name: "Office lease – Hauptstrasse 12.pdf",
    type: "PDF",
    size: "5.8 MB",
    status: "Failed",
  },
] as const;

const typeColors = {
  PDF: "bg-[#eef2f8] text-[#1d4f9c]",
  DOCX: "bg-[#eef2f8] text-[#31527e]",
  XLSX: "bg-[#e8f3ec] text-[#15703c]",
  TXT: "bg-[#f1f2f5] text-[#4a5058]",
};

const statusColors = {
  Ready: "bg-[#e8f3ec] text-[#15703c]",
  Processing: "bg-[#fdf3e3] text-[#8a5c0c]",
  Failed: "bg-[#fdeceb] text-[#a51f18]",
};

const dotColors = {
  Ready: "bg-[#1a8347]",
  Processing: "bg-[#c2870f]",
  Failed: "bg-[#c8332a]",
};

const DashboardPage = () => {
  return (
    <div className="flex max-w-295 flex-col gap-4 px-4 pt-5 pb-10">
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cardsData.map((data, index) => (
          <div className="flex flex-col gap-3 shadow-md rounded-lg border py-5">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm text-muted-foreground">
                {data.title}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4">
              <p className="text-3xl font-semibold">{data.count}</p>
              {/* <span className="text-sm text-muted-foreground">Documents</span> */}
            </div>
          </div>
        ))}
      </div>
      {/* recent conversations */}
      <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:bg-[#0a0a0a] dark:border-[#2c2c2c]">
        <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3">
          <h2 className="text-sm font-semibold">Recent conversations</h2>
          <button className="text-[13px] text-[#1d4f9c]">Open chat</button>
        </div>

        {recent.map((item) => (
          <div
            key={item.question}
            className="border-t border-[#f1f2f5] px-4 py-3 hover:bg-[#fafbfc] dark:hover:bg-[#2c2c2c] cursor-pointer"
          >
            <div className="flex items-baseline gap-4">
              <span className="flex-1 text-[13.5px] font-medium">
                {item.question}
              </span>
              <span className="text-xs text-[#8b9199]">{item.time}</span>
            </div>

            <div className="mt-2 flex">
              <span className="flex items-center gap-1.5 rounded-[5px] border border-[#e3e5e9] dark:text-white bg-[#fafbfc] dark:bg-[#0a0a0a] px-2 py-0.5 text-[11.5px] text-[#4a5058]">
                <span className="text-[9px] font-semibold text-[#8b9199] dark:text-white">
                  {item.type}
                </span>
                {item.document}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* documents */}
      <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:bg-[#0a0a0a] dark:border-[#2c2c2c]">
        <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3">
          <h2 className="text-sm font-semibold">Documents</h2>
          <button className="text-[13px] text-[#1d4f9c]">View all 8</button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-155 grid-cols-[1fr_76px_92px_200px] border-b border-[#edeef1] dark:border-[#2c2c2c] dark:bg-[#0a0a0a] bg-[#fafbfc] px-4 py-2 text-[11.5px] text-[#6b7280]">
            <div>Name</div>
            <div>Type</div>
            <div>Size</div>
            <div>Status</div>
          </div>

          {documents.map((doc) => (
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
    </div>
  );
};

export default DashboardPage;
