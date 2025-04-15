'use client';

import { authClient } from '@/lib/auth-client'; // import the auth client
import { columns } from './columns';
import { type File, type FileTree } from '@/lib/file-types';
import { DataTable } from './data-table';
import { FileUpload } from './FileUpload';
import NotLoggedInPage from '../401/page';
import { setCurrentPath, getCurrentPath } from '@/lib/path';
import { Suspense, useEffect, useState } from 'react';

// GET /api/list
async function GetPaths(): Promise<{ paths: FileTree; error?: string }> {
    try {
        const result = await fetch('/api/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!result.ok) {
            throw new Error('Failed to fetch paths');
        }

        const data = await result.json();
        return { paths: data as FileTree };
    } catch {
        return { paths: {}, error: 'Failed to fetch paths' };
    }
}

function DataTableSection() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [currentPath, setPath] = useState('');

    useEffect(() => {
        async function fetchData() {
            const { paths, error } = await GetPaths();
            if (error) {
                setError(error);
                return;
            }

            console.log('Paths:', currentPath);

            if (!currentPath) {
                setFiles(Object.values(paths) as unknown as File[]);
            } else {
                //TODO
                setFiles([]);
            }
        }

        fetchData();
    }, [currentPath]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <DataTable columns={columns} data={files} setPath={setPath} />;
}

export default function Page() {
    // Retrieve the session using Better Auth's server-side API
    const {
        data: session,
        isPending, //loading state
        error //error object
    } = authClient.useSession();

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full">
            {session?.user?.name ? (
                <div className="flex">
                    <div className="flex w-full">
                        {/* Left section: 2/3 */}
                        <div className="w-2/3 flex items-center justify-center">
                            <Suspense fallback={<div>Loading...</div>}>
                                <DataTableSection />
                            </Suspense>
                        </div>

                        {/* Right section: 1/3 */}
                        <div className="w-1/3 flex items-center justify-center p-4 border-l">
                            <FileUpload />
                        </div>
                    </div>
                </div>
            ) : (
                <NotLoggedInPage />
            )}
        </div>
    );
}

export const dynamic = 'force-dynamic';
