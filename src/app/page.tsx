'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Cloud } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const { data: session } = authClient.useSession();

    return (
        <div className="flex flex-col items-center justify-center">
            <Cloud size={60} className="mb-3 text-blue-500" />
            <h1 className="text-6xl font-bold mb-4">Welcome to NASlite</h1>
            <p className="text-xl mb-8">Your lightweight NAS solution.</p>

            {session && (
                <div className="flex justify-center mt-5">
                    <Button className="text-xl mt-5 p-8" size="lg" variant="outline">
                        <Link href="/files">Browse My Files</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
