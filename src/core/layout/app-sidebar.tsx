"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  Building2Icon,
  BoxIcon,
  UsersRound,
  FileText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/main",
      icon: LayoutDashboardIcon,
      isActive: (pathname: string) => pathname === "/main",
    },
    {
      title: "Cementerios",
      url: "/cementerio",
      icon: Building2Icon,
      isActive: (pathname: string) => pathname.startsWith("/cementerio"),
    },
    {
      title: "Personas",
      url: "/persons",
      icon: UsersRound,
      isActive: (pathname: string) => pathname === "/persons",
    },
    {
      title: "Nichos",
      url: "/nichos",
      icon: BoxIcon,
      isActive: (pathname: string) => pathname.startsWith("/nichos"),
    },
    {
      title: "Mapa",
      url: "/map",
      icon: ListIcon,
      isActive: (pathname: string) => pathname === "/map",
    },
     {
      title: "Requisito Inhumaciones",
      url: "/requisitos-inhumacion",
      icon: FileText,
      isActive: (pathname: string) =>
        pathname.startsWith("/requisitos-inhumaciones"),
    },
    {
      title: "Inhumaciones",
      url: "/inhumaciones",
      icon: FileText,
      isActive: (pathname: string) => pathname.startsWith("/inhumaciones"),
    },
   
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">
                  Gestión de cementerios
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
