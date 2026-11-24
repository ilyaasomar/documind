"use client";
import { ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const members = [
  {
    id: 1,
    initials: "KL",
    name: "Katrin Lehmann",
    email: "k.lehmann@hartmann.de",
    role: "owner",
    lastActive: "Just now",
  },
  {
    id: 2,
    initials: "MS",
    name: "Martin Sauer",
    email: "m.sauer@hartmann.de",
    role: "admin",
    lastActive: "2 hours ago",
  },
  {
    id: 3,
    initials: "TB",
    name: "Tanja Brandt",
    email: "t.brandt@hartmann.de",
    role: "member",
    lastActive: "Yesterday",
  },
  {
    id: 4,
    initials: "AR",
    name: "Alex Reuter",
    email: "a.reuter@hartmann.de",
    role: "member",
    lastActive: "3 days ago",
  },
  {
    id: 5,
    initials: "JF",
    name: "Jonas Fischer",
    email: "j.fischer@hartmann.de",
    role: "member",
    lastActive: "Invite pending",
  },
];

const TeamMembers = () => {
  const router = useRouter();

  const changeRole = async (memberId: number, role: string) => {
    await fetch(`/api/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  };

  return (
    <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:border-[#2c2c2c] dark:bg-[#0a0a0a]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3 dark:border-[#2c2c2c]">
        <div>
          <h2 className="text-sm font-semibold">Team members</h2>
          <p className="mt-0.5 text-[12.5px] text-[#6b7280]">
            {members.length} people can access this workspace
          </p>
        </div>

        <button className="cursor-pointer rounded-md border border-[#d7dae0] bg-white px-3 py-1.5 text-[13px] hover:bg-[#f6f7f9] dark:border-[#2c2c2c] dark:bg-[#0a0a0a] dark:hover:bg-[#2c2c2c]">
          Invite member
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* table head */}
        <div className="grid min-w-155 grid-cols-[minmax(200px,1fr)_160px_120px_110px] border-b border-[#edeef1] bg-[#fafbfc] px-4 py-2 text-[11.5px] text-[#6b7280] dark:border-[#2c2c2c] dark:bg-[#0a0a0a]">
          <div>Name</div>
          <div>Role</div>
          <div>Last active</div>
          <div></div>
        </div>

        {/* rows */}
        {members.map((member) => (
          <div
            key={member.id}
            className="grid min-w-155 grid-cols-[minmax(200px,1fr)_160px_120px_110px] items-center border-b border-[#f1f2f5] px-4 py-2.5 text-[13.5px] dark:border-[#2c2c2c]"
          >
            {/* name */}
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#dfe3e8] text-[10.5px] font-semibold text-[#4a5058]">
                {member.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate">{member.name}</span>
                <span className="block text-[11.5px] text-[#8b9199]">
                  {member.email}
                </span>
              </span>
            </div>

            {/* role — this is the dropdown */}
            <div>
              {member.role === "owner" ? (
                <span className="inline-block rounded-md border border-[#e3e5e9] bg-[#fafbfc] px-2.5 py-1 text-[12.5px] text-[#4a5058] dark:border-[#2c2c2c] dark:bg-[#141414] dark:text-white">
                  Owner
                </span>
              ) : (
                <div className="relative inline-flex">
                  <select
                    defaultValue={member.role}
                    onChange={(e) => changeRole(member.id, e.target.value)}
                    className="cursor-pointer appearance-none rounded-md border border-[#d7dae0] bg-white py-1 pr-7 pl-2.5 text-[12.5px] text-[#4a5058] hover:border-[#1d4f9c] focus:border-[#1d4f9c] focus:outline-none dark:border-[#2c2c2c] dark:bg-[#0a0a0a] dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-[#8b9199]" />
                </div>
              )}
            </div>

            {/* last active */}
            <div className="text-[12.5px] text-[#6b7280]">
              {member.lastActive}
            </div>

            {/* remove */}
            <div className="flex justify-end">
              {member.role !== "owner" && (
                <button className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e3e5e9] bg-white px-2.5 py-1 text-[12.5px] text-[#4a5058] hover:border-[#f5c6c3] hover:bg-[#fdeceb] hover:text-[#b3261e] dark:border-[#2c2c2c] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#5c2b2e] dark:hover:bg-[#2a1215] dark:hover:text-[#ff8a80]">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
