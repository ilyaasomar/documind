"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { ModeToggle } from "./theme-toggle";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const session = useSession();
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-card/80 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="flex justify-between w-full">
        <div className=""></div>

        <div className="ml-auto flex items-center gap-4 md:mr-3">
          {/* name */}
          <h1 className="text-[15px] font-semibold tracking-tight">
            {session.data?.user.name ? session.data.user.name : "User"}
          </h1>
          {/* theme toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
