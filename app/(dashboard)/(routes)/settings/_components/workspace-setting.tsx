"use client";
import { useState } from "react";

type WorkspaceProps = {
  id: string;
  name: string;
  slug: string;
  uploaded_bytes: number;
  questions_used: number;
  plan: string;
  upload_bytes_limit: number;
  questions_limit: number;
}[];

const WorkspaceSetting = ({ workspace }: { workspace: WorkspaceProps }) => {
  const [workspace_name, setWorkspace_name] = useState(workspace[0].name);
  const {
    uploaded_bytes,
    questions_used,
    upload_bytes_limit,
    plan,
    questions_limit,
  } = workspace[0];

  // size format
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1048576) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1073741824) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
    }
  };

  const plan_usage = [
    {
      label: "Questions this month",
      value: `${questions_used} / ${questions_limit}`,
      percent: (questions_used / questions_limit) * 100,
    },
    {
      label: "Storage",
      value: `${formatFileSize(uploaded_bytes)} / ${formatFileSize(upload_bytes_limit)}`,
      percent: (uploaded_bytes / upload_bytes_limit) * 100,
    },
    // { label: "Team members", value: "24 / 30", percent: 80 },
  ];
  return (
    <div className="rounded-[10px] border border-[#e3e5e9] bg-white p-4 dark:border-[#2c2c2c] dark:bg-[#0a0a0a]">
      <h2 className="mb-3 text-sm font-semibold">Workspace</h2>

      {/* name + plan */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
        <div>
          <span className="mb-1.5 block text-[12.5px] text-[#6b7280]">
            Workspace name
          </span>
          <input
            value={workspace_name}
            onChange={(e) => setWorkspace_name(e.target.value)}
            className="w-full rounded-md border border-[#d7dae0] px-2.5 py-2 text-[13.5px] outline-none focus:border-[#1d4f9c] dark:border-[#2c2c2c] dark:bg-[#0a0a0a]"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-[12.5px] text-[#6b7280]">
            Plan
          </span>
          <div className="flex items-center gap-2.5 rounded-md border border-[#e3e5e9] bg-[#fafbfc] px-2.5 py-2 dark:border-[#2c2c2c] dark:bg-[#141414]">
            <span className="text-[13.5px] font-medium">{plan}</span>
            <span className="text-xs text-[#6b7280]">{`${questions_limit} questions / month`}</span>
            <button className="ml-auto cursor-pointer text-[12.5px] text-[#1d4f9c]">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* usage bars */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        {plan_usage.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-[12.5px] text-[#6b7280]">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="mt-1.5 h-1.25 overflow-hidden rounded-[3px] bg-[#e6e8ec] dark:bg-[#2c2c2c]">
              <div
                className="h-full bg-[#1d4f9c]"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceSetting;
