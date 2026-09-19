import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function Routes() {
  const pathname = usePathname();
  const routes = [
    {
      id: 1,
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      id: 2,
      title: "Documents",
      url: "/documents",
      icon: FileText,
      isActive: pathname.includes("/documents"),
    },
    {
      id: 3,
      title: "Chats",
      url: "/chats",
      icon: MessageSquare,
      isActive: pathname.includes("/chats"),
    },
    {
      id: 4,
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      isActive: pathname.includes("/settings"),
    },
  ];

  return routes;
}
