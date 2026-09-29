import { cn } from "cn";
import React from "react";

const STATUS_STYLE = {
  ready: {
    box: "bg-[#e8f3ec] text-[#15703c]",
    dot: "bg-[#1a8347]",
    label: "Ready",
  },
  processing: {
    box: "bg-[#fdf3e3] text-[#8a5c0c]",
    dot: "bg-[#c2870f]",
    label: "Processing",
  },
  failed: {
    box: "bg-[#fdeceb] text-[#a51f18]",
    dot: "bg-[#c8332a]",
    label: "Failed",
  },
  uploading: {
    box: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Uploading",
  },
};

type Status = keyof typeof STATUS_STYLE;
const StatusHolder = ({ status }: { status: Status }) => {
  const style = STATUS_STYLE[status];
  return (
    <div
      className={cn(
        `px-2 py-1 rounded-sm gap-2 w-fit flex items-center`,
        style.box,
      )}
    >
      <div className={cn(`w-2 h-2 rounded-full`, style.dot)}></div>
      <span className={cn(`text-xs font-semibold`, style.label)}>{style.label}</span>
    </div>
  );
};

export default StatusHolder;
