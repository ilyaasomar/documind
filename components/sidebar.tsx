"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronUp, LogOut, User, User2 } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


const ACTIVE_CLASSES = `bg-primary dark:bg-[#1d4f9c] text-white hover:bg-primary hover:text-white rounded-sm focus:bg-primary focus:text-white active:bg-primary active:text-white data-[state=open]:bg-primary data-[state=open]:text-white`;
export function AppSidebar() {
  const session = useSession();
  const routes = Routes();
  const { state } = useSidebar(); // "expanded" | "collapsed" | "hidden"
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              //   render={state === "expanded" ? <Logo /> : <LogoIcon />}
              render={
                state === "expanded" ? <div>Logo</div> : <div>LogoIcon</div>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {routes.map((route) => (
                <SidebarMenuItem key={route.id}>
                  <SidebarMenuButton
                    className={cn(
                      route.isActive ? ACTIVE_CLASSES : "hover:bg-muted",
                    )}
                    render={
                      <Link
                        href={route.url}
                        className={cn(
                          "transition-all w-full flex items-center gap-2 font-sans font-medium text-[14px] hover:rounded-sm",
                          route.isActive
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700",
                        )}
                      >
                        <route.icon />
                        <span>{route.title}</span>
                      </Link>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* sidebar footer */}
      <SidebarFooter>
        <SidebarMenu
          className={`bg-white border-2 border-muted-foreground/30 dark:bg-[#4191F9] text-white rounded-md py-1`}
        >
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="bg-white text-primary dark:bg-[#4191F9] hover:bg-white dark:hover:bg-[#4191F9]/90 hover:text-primary dark:active:bg-[#4191F9]/90 dark:active:text-white dark:data-[state=open]:bg-[#4191F9]/90 dark:data-[state=open]:text-white cursor-pointer">
                    <User2 />
                    <div className="flex flex-col">
                      <span className="font-semibold text-md dark:text-white">
                        {session.data?.user?.name}
                      </span>
                      <span className="text-xs dark:text-white">
                        {session.data?.user?.email}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto dark:text-white" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
