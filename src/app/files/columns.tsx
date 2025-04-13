'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { MoreHorizontal, Trash, Clipboard } from 'lucide-react';
import { type File } from '@/lib/file-types';
import { FileImage, FileText, FileVideo, FileAudio, FileArchive, FileType2, FileSpreadsheet, Folder, File as IconFile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const fileTypeToIcon = {
    PNG: FileImage,
    TXT: FileText,
    MP4: FileVideo,
    MP3: FileAudio,
    PDF: FileType2,
    ZIP: FileArchive,
    DOCX: FileText,
    XLSX: FileSpreadsheet,
    DIR: Folder
} as const;

export const columns: ColumnDef<File>[] = [
    {
        id: 'icon',
        header: () => null,
        cell: ({ row }) => {
            const type = row.original.type as keyof typeof fileTypeToIcon;
            const Icon = fileTypeToIcon[type] || IconFile;
            return (
                <div className="flex justify-center items-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
            );
        },
        size: 40
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'size',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Size (KB)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'type',
        header: 'Type'
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const file = row.original as File;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            {/* <span className="sr-only">Open menu</span> */}
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="text-muted-foreground">Quick Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(file.name)} className="cursor-pointer">
                            <Clipboard className="mr-2 h-4 w-4" />
                            Copy File Name
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600 focus:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
