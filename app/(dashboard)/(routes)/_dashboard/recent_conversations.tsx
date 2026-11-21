"use client";
import React from "react";
import TimeAgo from "./time-ago";
import { useRouter } from "next/navigation";

type RecentConversationsProps = {
  id: string;
  question: string;
  document: string;
  type: string;
  createdAt: Date;
}[];

const RecentConversations = ({
  recent,
}: {
  recent: RecentConversationsProps;
}) => {
  const router = useRouter();
  return (
    <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:bg-[#0a0a0a] dark:border-[#2c2c2c]">
      <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3">
        <h2 className="text-sm font-semibold">Recent conversations</h2>
        <button
          className="text-[13px] text-[#1d4f9c] cursor-pointer"
          onClick={() => router.push("/chats")}
        >
          View all
        </button>
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
            <span className="text-xs text-[#8b9199]">
              {/* {item.time} */}
              <TimeAgo date={item.createdAt} />
            </span>
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
  );
};

export default RecentConversations;
