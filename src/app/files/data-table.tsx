'use client';

import React, { useTransition } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SuccessDialog } from '@/components/ui/success-dialog';

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
                setFolderName('');
                setOpen(false);
                setError('');
                setfolderCreated(true);
                console.log('Folder created successfully:', folderName);
            } catch {
                setError('Failed to create folder — name may be duplicate or invalid.');
            }
        });
    }

    return (
        <div className="flex flex-col space-y-4 w-3/4">
            <div className="flex items-center p-4 justify-between mb-5">
                <Input placeholder="Filter names..." value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)} className="max-w-xl h-12 text-lg px-5" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="ml-2 max-w-xl h-12 text-md px-5">
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
                                className={`h-12 transition-opacity duration-300 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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
