'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, MoreHorizontal, Trash, Clipboard, Eye } from 'lucide-react';
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

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';

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
            const handlePreview = () => {
                console.log('Previewing:', file.name);
            };
            const handleDelete = () => {
                console.log('Deleted:', file.name);
                setOpen(false);
            };
            const handleDownload = () => {
                console.log('Downloading:', file.name);
            };
            const [open, setOpen] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                {/* <span className="sr-only">Open menu</span> */}
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel className="text-muted-foreground">Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handlePreview} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(file.name)} className="cursor-pointer">
                                <Clipboard className="mr-2 h-4 w-4" />
                                Copy Name
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600 focus:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-red">
                                    This will permanently delete <strong>{file.name}</strong>.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        }
    }
];
