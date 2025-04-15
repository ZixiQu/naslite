'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Slash } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { setCurrentPath, getCurrentPath } from '@/lib/path';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbEllipsis, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileTree } from '@/lib/file-types';
import { useState } from 'react';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

function BreadcrumbListGenerator(currentPath: string, paths: FileTree) {
    // This function generates a breadcrumb list based on the provided paths.
    // It can fit any length of paths.

    if (!currentPath) {
        return (
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-lg font-medium">
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        );
    }

    // const long_path = paths.length > 3;
    // let rest_paths = paths.slice(1);
    // if (paths.length > 3) {
    //     rest_paths = paths.slice(-2);
    // }

    // return (
    //     <BreadcrumbList>
    //         <BreadcrumbItem>
    //             <BreadcrumbLink href={paths[0].href} className="text-lg font-medium">
    //                 {paths[0].label}
    //             </BreadcrumbLink>
    //         </BreadcrumbItem>
    //         {long_path && (
    //             <>
    //                 <BreadcrumbSeparator>
    //                     <Slash className="w-4 h-4 mx-2" />
    //                 </BreadcrumbSeparator>
    //                 <BreadcrumbEllipsis />
    //             </>
    //         )}
    //         {rest_paths.length > 0 && (
    //             <BreadcrumbSeparator>
    //                 <Slash className="w-4 h-4 mx-2" />
    //             </BreadcrumbSeparator>
    //         )}
    //         {rest_paths.map((item, index) => (
    //             <span key={item.href} className="flex items-center">
    //                 <BreadcrumbItem>
    //                     <BreadcrumbLink href={item.href} className="text-lg font-medium">
    //                         {item.label}
    //                     </BreadcrumbLink>
    //                 </BreadcrumbItem>
    //                 {index < rest_paths.length - 1 && (
    //                     <BreadcrumbSeparator>
    //                         <Slash className="w-4 h-4 mx-2" />
    //                     </BreadcrumbSeparator>
    //                 )}
    //             </span>
    //         ))}
    //     </BreadcrumbList>
    // );
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [currentPath, setCurrentPath] = useState('');

    const paths = [
        {
            name: 'sandbox.txt',
            type: 'TXT', // type is not "DIR", no children
            href: '/sandbox.txt'
        },
        {
            name: 'Components',
            type: 'DIR', // type is "DIR", must have children (Object[]), even is empty (empty folder)
            href: '/Components/',
            children: [
                {
                    name: 'ui',
                    type: 'DIR',
                    href: '/Components/ui',
                    children: [
                        {
                            name: 'Button.tsx',
                            href: '/Components/ui/Button.tsx',
                            type: 'UNKNOWN' // althought we can visualize (display icon) as file, this is not yet supported.
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50`}>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <main className="flex-1 min-h-screen overflow-hidden relative">
                        <div className="flex items-center px-4 py-2">
                            <SidebarTrigger />
                            <Breadcrumb className={`ml-4 ${session && !isHome ? 'flex' : 'hidden'}`}>{BreadcrumbListGenerator(currentPath, paths)}</Breadcrumb>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-center min-h-full w-full">{children}</div>
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
