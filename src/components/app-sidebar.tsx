"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogIn, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client" // import the auth client

export function AppSidebar() {
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()

  if (isPending) {
    return (
      <Sidebar>
        <SidebarContent className="p-4 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </SidebarContent>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <SidebarContent className="p-4 text-sm text-red-500">
          Error: {error.message}
        </SidebarContent>
      </Sidebar>
    );
  }

  const items = session
    ? [
        {
          title: "Sign Out",
          url: "/signout",
          icon: LogIn,
        },
      ]
    : [
        {
          title: "Sign In",
          url: "/signin",
          icon: LogIn,
        },
        {
          title: "Sign Up",
          url: "/signup",
          icon: UserPlus,
        },
      ];

  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="space-y-6">NASlite</SidebarGroupLabel>
          <SidebarGroupContent className="mt-6">
          <SidebarMenu className="flex flex-col gap-3">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-2 p-5">
                    <item.icon className="w-5 h-5" />
                    <span className="text-lg">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}