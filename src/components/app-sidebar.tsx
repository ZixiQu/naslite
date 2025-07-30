'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LogIn, UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function AppSidebar() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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

  if (!status) {
    return (
      <Sidebar>
        <SidebarContent className="p-4 text-sm text-red-500">Error</SidebarContent>
      </Sidebar>
    );
  }

  const items = session
    ? [
        {
          title: session.user.name,
          url: '/profile',
          // icon: future work, include user.image as icon
        },
        {
          title: 'Sign Out',
          url: '/signout',
          icon: LogIn,
        },
      ]
    : [
        {
          title: 'Sign In',
          url: '/signin',
          icon: LogIn,
        },
        {
          title: 'Sign Up',
          url: '/signup',
          icon: UserPlus,
        },
      ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <Link href="/" className="cursor-pointer">
              NASlite
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6">
            <SidebarMenu className="flex flex-col gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 p-5">
                      {item.icon && <item.icon className="w-5 h-5" />}
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
  );
}
