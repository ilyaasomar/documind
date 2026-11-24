"use client";
import { useState } from "react";

const plan_name = "Free";
const plan_detail = "3,000 questions / month";

const usage = [
  { label: "Questions this month", value: "1,842 / 3,000", percent: 61 },
  { label: "Storage", value: "4.2 GB / 25 GB", percent: 17 },
  { label: "Team members", value: "24 / 30", percent: 80 },
];

type WorkspaceProps = {
  id: string;
  name: string;
  slug: string;
  uploaded_bytes: number;
  questions_used: number;
}[];

const WorkspaceSetting = ({ workspace }: { workspace: WorkspaceProps }) => {
  const [workspace_name, setWorkspace_name] = useState(workspace[0].name);

  const plan_info = {
    label: "Free",
    count: workspace[0].uploaded_bytes,
  };
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
            <span className="text-[13.5px] font-medium">{plan_name}</span>
            <span className="text-xs text-[#6b7280]">{plan_detail}</span>
            <button className="ml-auto cursor-pointer text-[12.5px] text-[#1d4f9c]">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* usage bars */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        {usage.map((item) => (
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
