'use client';

import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

function handleCreateNewFolder(folderName: string) {
    // TODO: Implement create a new folder here
    console.log('Create New Folder: ', folderName);
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [folderName, setFolderName] = useState('');
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

    return (
        <div className="flex flex-col space-y-4 w-3/4">
            <div className="flex items-center p-4 justify-between mb-5">
                <Input placeholder="Filter names..." value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)} className="max-w-xl h-12 text-lg px-5" />
                <Dialog>
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
                                    if (e.target.value.length <= 20) {
                                        setFolderName(e.target.value);
                                    }
                                }}
                                maxLength={20}
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                onClick={() => {
                                    if (folderName.trim()) {
                                        handleCreateNewFolder(folderName.trim());
                                        setFolderName('');
                                    }
                                }}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
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
