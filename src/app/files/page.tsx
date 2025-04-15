'use client';

import { authClient } from '@/lib/auth-client';
import { columns } from './columns';
import { type File, type FileTree } from '@/lib/file-types';
import { DataTable } from './data-table';
import { FileUpload } from './FileUpload';
import NotLoggedInPage from '../401/page';
import { Suspense, useEffect, useState } from 'react';
import { usePath } from '@/lib/path-context';

// GET /api/list
export async function GetPaths(): Promise<{ paths: FileTree; error?: string }> {
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
    const { Path, FileTree, setFileTree } = usePath();

    useEffect(() => {
        async function fetchData() {
            const { paths, error } = await GetPaths();
            if (error) {
                setError(error);
                return;
            }

            setFileTree(paths);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!FileTree) return;

        if (!Path) {
            setFiles(Object.values(FileTree) as unknown as File[]);
        } else {
            const pathElement = Path.split('/');
            let nestedFile: FileTree | undefined = FileTree;

            for (const next_path of pathElement) {
                if (!nestedFile[next_path] || nestedFile[next_path].type !== 'DIR') break;
                nestedFile = nestedFile[next_path].children || {};
            }

            setFiles(Object.values(nestedFile) as unknown as File[]);
        }
    }, [Path, FileTree]);


    if (error) {
        return <div>Error: {error}</div>;
    }

    return <DataTable columns={columns} data={files} />;
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
