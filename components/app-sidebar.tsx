"use client"

import type * as React from "react"
import {
  Activity,
  Calendar,
  FileText,
  Home,
  Pill,
  Stethoscope,
  TestTube,
  Wallet,
  Bed,
  Bell,
  UserPlus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Reception",
    url: "/reception",
    icon: UserPlus,
  },
  {
    title: "Triage",
    url: "/triage",
    icon: Activity,
  },
  {
    title: "Consultation",
    url: "/consultation",
    icon: Stethoscope,
  },
  {
    title: "Laboratory",
    url: "/laboratory",
    icon: TestTube,
  },
  {
    title: "Pharmacy",
    url: "/pharmacy",
    icon: Pill,
  },
  {
    title: "Ward Management",
    url: "/ward-management",
    icon: Bed,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Wallet,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">HIMS</span>
            <span className="truncate text-xs">Hospital Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hospital Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
          <p>Hospital Information Management System</p>
          <p>Version 1.0.0</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
