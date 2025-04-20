"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { deleteCurrentPath } from '@/lib/path-client';
import { usePath } from '@/lib/path-context';

export default function SignOutPage() {
    const [message, setMessage] = useState('Signing you out...');
    const router = useRouter();
    const { setFileTree } = usePath();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session) {
            setMessage('You are not signed in.');
            return;
        }

        async function doSignOut() {
            const { error } = await authClient.signOut();

            if (error) {
                setMessage('Error signing out: ' + error.message);
            } else {
                setMessage('Signed out successfully!');
                await deleteCurrentPath(); // clear the current path
                setFileTree({}); // clear the file tree
                router.refresh(); // reloads session state
                router.push('/'); // redirect after logout
            }
        }

        doSignOut();
    }, [router, session, setFileTree]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">{message}</h1>
        </div>
    );
}