"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setCurrentPath } from '@/lib/path-client';

export default function SignOutPage() {
    const [message, setMessage] = useState('Signing you out...');
    const router = useRouter();

    useEffect(() => {
        async function doSignOut() {
            const { error } = await authClient.signOut();

            if (error) {
                setMessage('Error signing out: ' + error.message);
            } else {
                setMessage('Signed out successfully!');
                setCurrentPath(''); // reset current path to root folder
                router.refresh(); // reloads session state
                router.push('/'); // redirect after logout (optional)
            }
        }

        doSignOut();
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">{message}</h1>
        </div>
    );
}