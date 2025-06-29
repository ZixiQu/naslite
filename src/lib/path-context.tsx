'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentPath } from '@/lib/path-client';
import { FileTree } from '@/lib/file-types';
import { setCurrentPath } from '@/lib/path-client';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const isHome =
    pathname === '/' ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/404' ||
    pathname === '/signout';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
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
            'Content-Type': 'application/json',
          },
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
  }, [session, isHome, status, pathname]);

  function setAllPath(path: string) {
    setPath(path);
    setCurrentPath(path);
  }

  if (loading) {
    return <div className="text-4xl flex justify-center item-center">Loading...</div>;
  }

  return (
    <SessionProvider>
      <PathContext.Provider value={{ Path, FileTree, setFileTree, setAllPath }}>
        {children}
      </PathContext.Provider>
    </SessionProvider>
  );
}

export function usePath() {
    const context = useContext(PathContext);
    if (!context) {
        throw new Error('usePath must be used within a PathProvider');
    }
    return context;
}
