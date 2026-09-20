"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, Settings2, Upload, User2 } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";
import { Routes } from "@/lib/routes";
import { styles } from "@/app/styles";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Navbar({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-card/80 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-start gap-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {children}
        </div>
      </div>
    </header>
  );
}
