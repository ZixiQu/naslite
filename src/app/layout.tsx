'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ChevronDownIcon, Slash } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbEllipsis, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileTree, type File } from '@/lib/file-types';
import { PathProvider } from '@/lib/path-context';
import { usePath } from '@/lib/path-context';
import { JSX } from 'react';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

function BreadcrumbSubPart(rest_paths: string[], fileTree: FileTree, setAllPath: (path: string) => void): JSX.Element[] {
    const items: JSX.Element[] = [];
    console.log('Rest paths:', rest_paths);
    console.log('File tree:', fileTree);
    let currentFile: FileTree = fileTree;

    rest_paths.forEach((item, index) => {
        const siblings = (Object.values(currentFile) as File[]).filter(file => file.name !== item);
        const dropdown = siblings.length > 0;

        items.push(
            <span key={index} className="flex items-center">
                <BreadcrumbItem>
                    {dropdown ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-lg font-medium cursor-pointer hover:underline">
                                {item}
                                <ChevronDownIcon className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {siblings.map((sibling, i) => (
                                    <DropdownMenuItem key={i} onClick={() => setAllPath(sibling.link)}>
                                        {sibling.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <BreadcrumbLink className="text-lg font-medium cursor-pointer hover:underline" onClick={() => setAllPath(currentFile[item].link)}>
                            {item}
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>

                {index < rest_paths.length - 1 && (
                    <BreadcrumbSeparator>
                        <Slash className="w-4 h-4 mx-2" />
                    </BreadcrumbSeparator>
                )}
            </span>
        );

        console.log(item);

        currentFile = currentFile[item].children || {};
    });

    return items;
}

function BreadcrumbListGenerator(Path: string, setAllPath: (path: string) => void, fileTree: FileTree) {
    // This function generates a breadcrumb list based on the provided data.
    // It can fit any length of paths.
    if (!Path) {
        return (
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className="text-lg font-medium hover:cursor-pointer" onClick={() => setAllPath('')}>
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        );
    } else {
        const pathElement = Path.split('/');
        const long_path = pathElement.length > 3;
        let rest_paths = pathElement;
        let newFileTree: FileTree = fileTree;
        if (long_path) {
            rest_paths = pathElement.slice(-2);
            for (const next_path of pathElement.slice(0, -2)) {
                if (!newFileTree[next_path] || newFileTree[next_path].type !== 'DIR') break;
                newFileTree = newFileTree[next_path].children || {};
            }
        }

        return (
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className="text-lg font-medium hover:cursor-pointer" onClick={() => setAllPath('')}>
                        Home
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

                <BreadcrumbSeparator>
                    <Slash className="w-4 h-4 mx-2" />
                </BreadcrumbSeparator>

                {BreadcrumbSubPart(rest_paths, newFileTree, setAllPath)}
            </BreadcrumbList>
        );
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 justify-center items-center flex flex-col`}>
                <PathProvider>
                    <Layout>{children}</Layout>
                </PathProvider>
            </body>
        </html>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const { Path, FileTree, setAllPath } = usePath();

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="flex-1 min-h-screen overflow-hidden relative">
                <div className="flex items-center px-4 py-2">
                    <SidebarTrigger />
                    <Breadcrumb className={`ml-4 ${session && !isHome ? 'flex' : 'hidden'}`}>{BreadcrumbListGenerator(Path, setAllPath, FileTree)}</Breadcrumb>
                </div>

                <div className="flex items-center justify-center min-h-full w-full">{children}</div>
            </main>
        </SidebarProvider>
    );
}