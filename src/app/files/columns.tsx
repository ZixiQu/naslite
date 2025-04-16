'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, MoreHorizontal, Trash, Clipboard, Eye } from 'lucide-react';
import { type File , supportedFileTypes} from '@/lib/file-types';
import { FileImage, FileText, FileVideo, FileAudio, FileArchive, FileType2, FileSpreadsheet, Folder, File as IconFile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
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
import { GetPaths } from './page';
import { usePath } from '@/lib/path-context';

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
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() !== 'desc')}>
                    Size (KB)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'type',
        // header: 'Type'
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
            const a = rowA.getValue(columnId);
            const b = rowB.getValue(columnId);

            const aIndex = supportedFileTypes.indexOf(a);
            const bIndex = supportedFileTypes.indexOf(b);

            // Items in the list come first, in order. Others follow after.
            const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
            const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

            return safeA - safeB;
        }
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const file = row.original as File;
            const { setFileTree } = usePath();
            const [open, setOpen] = useState(false);
            const [deleteLink, setdeleteLink] = useState('');

            const handlePreview = async (link: string) => {
                try {
                    const response = await fetch(`/api/file?key=${link}`);
                    if (!response.ok) throw new Error('Something went wrong while fetching the preview link');

                    const { url } = await response.json();

                    toast.info('Opening preview');
                    window.open(url, '_blank');
                } catch {
                    toast.error('Failed to load preview');
                }
            };

            async function handleDelete() {
                try {
                    const response = await fetch(`/api/delete?key=${deleteLink}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        toast.success('File deleted successfully');
                    } else {
                        toast.error(`Failed to delete file`);
                    }
                } catch {
                    toast.error('Something went wrong while deleting the file');
                } finally {
                    const refetchFileTree = await GetPaths();
                    setFileTree(refetchFileTree.paths);
                    setdeleteLink('');
                    setOpen(false);
                }
            }

            const handleDownload = async (link: string) => {
                try {
                    const response = await fetch(`/api/file?key=${link}&mode=download&response-content-disposition=attachment`);
                    if (!response.ok) throw new Error('Something went wrong while fetching the download link');

                    const { url } = await response.json();

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'download';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    toast.success('Download started');
                } catch (error) {
                    toast.error('Failed to download file');
                    console.error('Download error:', error);
                }
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                {/* <span className="sr-only">Open menu</span> */}
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel className="text-muted-foreground">Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(file.name)} className="cursor-pointer">
                                <Clipboard className="mr-2 h-4 w-4" />
                                Copy Name
                            </DropdownMenuItem>

                            {file.type !== 'DIR' && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            handleDownload(file.link);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => handlePreview(file.link)} className="cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            setdeleteLink(file.link);
                                            setOpen(true);
                                        }}
                                        className="text-red-600 focus:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
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
