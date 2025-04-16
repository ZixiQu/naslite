'use client';

import React, { useTransition } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { File } from '@/lib/file-types';
import { usePath } from '@/lib/path-context';
import { GetPaths } from './page';
import { ArrowLeft } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [open, setOpen] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const [folderCreated, setfolderCreated] = useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const { Path, setFileTree, setAllPath } = usePath();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: 0,
                pageSize: 15
            }
        }
    });

    function handleCreateNewFolder(folderName: string) {
        if (!folderName || /[\s\/]/.test(folderName)) {
            setError("Folder name is invalid — cannot contain spaces or '/'");
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch(`/api/create_folder?key=${folderName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to create folder');
                }

                const refetchFileTree = await GetPaths();
                if (refetchFileTree.error) {
                    setError(refetchFileTree.error);
                    return;
                }
                setFileTree(refetchFileTree.paths);
                setFolderName('');
                setOpen(false);
                setError('');
                setfolderCreated(true);
            } catch {
                setError('Failed to create folder — name may be duplicate or invalid.');
            }
        });
    }

    function goBack(Path: string) {
        if (!Path) return;
        const parts = Path.split('/').filter(Boolean); // remove empty from leading/trailing slashes
        const newParts = parts.slice(0, -1); // remove last part
        const newPath = newParts.join('/');
        setAllPath(newPath);
    }

    return (
        <div className="flex flex-col space-y-4 w-3/4">
            <div className="flex items-center p-4 justify-between mb-5">
                <Button variant="ghost" size="lg" className="ml-2 max-w-xl h-12 text-md px-5 cursor-pointer" onClick={() => goBack(Path)} disabled={Path === ''}>
                    <ArrowLeft className="w-12 h-12" />
                </Button>

                <Input placeholder="Filter names..." value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)} className="max-w-xl h-12 text-lg px-5" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="ml-2 max-w-xl h-12 text-md px-5 cursor-pointer">
                            Create New Folder
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Folder</DialogTitle>
                        </DialogHeader>

                        <div className="text-md flex flex-col items-center justify-center">
                            <p className="text-center mt-3">Folder name (max 20 chars) in current location</p>
                            <Input
                                className="mt-3 w-4/5 h-10"
                                placeholder="Enter folder name"
                                value={folderName}
                                onChange={e => {
                                    setFolderName(e.target.value);
                                }}
                                maxLength={20}
                            />
                            {error && <p className="text-red-500 text-sm mt-2 mb-1">{error}</p>}
                        </div>

                        <DialogFooter className="mt-2">
                            <Button
                                onClick={() => {
                                    if (folderName.trim()) {
                                        handleCreateNewFolder(folderName.trim());
                                    } else {
                                        setError('Folder name cannot be empty.');
                                    }
                                }}
                                disabled={isPending}
                                className={`h-12 transition-opacity duration-300 ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <SuccessDialog open={folderCreated} message="Folder created successfully." onClose={() => setfolderCreated(false)} />
            <div className="rounded-md">
                <Table className="text-md">
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    {...((row.original as File).type === 'DIR' && {
                                        onClick: () => {
                                            setAllPath((row.original as File).link);
                                        }
                                    })}
                                    className={(row.original as File).type === 'DIR' ? 'hover:underline cursor-pointer' : ''}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No files found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button variant="outline" size="lg" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="lg" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
}
