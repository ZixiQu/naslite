'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentPath } from '@/lib/path-client';
import { FileTree } from '@/lib/file-types';
import { setCurrentPath } from '@/lib/path-client';
import { usePathname } from 'next/navigation';

type PathContextType = {
    Path: string;
    FileTree: FileTree;
    setFileTree: (fileTree: FileTree) => void;
    setAllPath: (path: string) => void;
};

const PathContext = createContext<PathContextType | undefined>(undefined);

export function PathProvider({ children }: { children: ReactNode }) {
    const [Path, setPath] = useState('');
    const [FileTree, setFileTree] = useState<FileTree>({});
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const isHome = pathname === '/' || pathname === '/signin' || pathname === '/signup' || pathname === '/404' || pathname === '/signout';

    useEffect(() => {
        if (isHome) {
            setLoading(false);
            return;
        }

        const loadInitial = async () => {
            try {
                const savedPath = await getCurrentPath();
                setPath(savedPath);

                const result = await fetch('/api/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!result.ok) throw new Error('Failed to fetch paths');

                const data = await result.json();
                setFileTree(data as FileTree);
            } catch (err) {
                console.error('Failed to initialize PathProvider:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitial();
    }, [isHome]);

    function setAllPath(path: string) {
        setPath(path);
        setCurrentPath(path);
    }

    if (loading) {
        return <div className="text-4xl flex justify-center item-center">Loading...</div>;
    }

    return <PathContext.Provider value={{ Path, FileTree, setFileTree, setAllPath }}>{children}</PathContext.Provider>;
}

export function usePath() {
    const context = useContext(PathContext);
    if (!context) {
        throw new Error('usePath must be used within a PathProvider');
    }
    return context;
}
