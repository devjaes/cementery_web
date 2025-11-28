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
  RotateCcw,
  Hammer,
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
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const data = {
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
      title: "Inhumaciones",
      url: "/requisitos-inhumacion",
      icon: FileText,
      isActive: (pathname: string) =>
        pathname.startsWith("/requisitos-inhumaciones"),
    },
    {
      title: "Mejoras en Tumbas",
      url: "/mejoras",
      icon: Hammer,
      isActive: (pathname: string) => pathname.startsWith("/mejoras"),
    },
    {
      title: "Exhumaciones",
      url: "/exhumaciones",
      icon: RotateCcw,
      isActive: (pathname: string) => pathname.startsWith("/exhumaciones"),
    },
  ],
};

import { CemeterySwitcher } from "@/features/cementery/presentation/components/cemetery-switcher.component";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser();

  // Create formatted user object for NavUser
  const formattedUser = user
    ? {
        name: `${user.nombre} ${user.apellido}`,
        email: user.email || user.cedula, // Use email if exists, otherwise cedula
        avatar: "", // Empty avatar by default
      }
    : {
        name: "Usuario",
        email: "Sin sesión",
        avatar: "",
      };

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
        <div className="mt-2 px-2">
          <CemeterySwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={formattedUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
