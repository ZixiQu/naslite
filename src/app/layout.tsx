'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Slash } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbEllipsis, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

type PathNode = {
    label: string;
    href: string;
    parent: string;
};

function BreadcrumbListGenerator(paths: PathNode[]) {
    // This function generates a breadcrumb list based on the provided paths.
    // It can fit any length of paths.
    const long_path = paths.length > 3;
    let rest_paths = paths.slice(1);
    if (paths.length > 3) {
        rest_paths = paths.slice(-2);
    }

    return (
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href={paths[0].href} className="text-lg font-medium">
                    {paths[0].label}
                </BreadcrumbLink>
            </BreadcrumbItem>
            {long_path && (
                <>
                    <BreadcrumbSeparator>
                        <Slash className="w-4 h-4 mx-2" />
                    </BreadcrumbSeparator>
                    <BreadcrumbEllipsis />
                </>
            )}
            {rest_paths.length > 0 && (
                <BreadcrumbSeparator>
                    <Slash className="w-4 h-4 mx-2" />
                </BreadcrumbSeparator>
            )}
            {rest_paths.map((item, index) => (
                <span key={item.href} className="flex items-center">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={item.href} className="text-lg font-medium">
                            {item.label}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < rest_paths.length - 1 && (
                        <BreadcrumbSeparator>
                            <Slash className="w-4 h-4 mx-2" />
                        </BreadcrumbSeparator>
                    )}
                </span>
            ))}
        </BreadcrumbList>
    );
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const paths: PathNode[] = [
        // Root
        { label: 'Home', href: '/', parent: '' },

        // Home branches
        { label: 'Library', href: '/library', parent: '/' },
        { label: 'ECE1724', href: '/ece1724', parent: '/' },

        // hierarchy
        { label: 'Components', href: '/components', parent: '/' },
        { label: 'UI', href: '/components/ui', parent: '/components' },
        { label: 'Button', href: '/components/ui/button', parent: '/components/ui' }
    ];

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50`}>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <main className="flex-1 min-h-screen overflow-hidden relative">
                        <div className="flex items-center px-4 py-2">
                            <SidebarTrigger />
                            <Breadcrumb className={`ml-4 ${session && !isHome ? 'flex' : 'hidden'}`}>
                                {/* <BreadcrumbListGenerator
                                    paths={paths.filter((item) => {
                                        // Filter out the paths that are not in the current path hierarchy
                                        return item.href === pathname || item.parent === pathname;
                                    })}
                                /> */}
                                {BreadcrumbListGenerator(paths)}
                            </Breadcrumb>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-center min-h-full w-full">{children}</div>
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
