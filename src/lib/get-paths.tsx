import { FileTree } from './file-types';

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
