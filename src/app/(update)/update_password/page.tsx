/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import NotLoggedInPage from '@/app/401/page';
import { authClient } from '@/lib/auth-client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Password() {
    const {
        data: session,
        isPending,
        error //error object
    } = authClient.useSession();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [logging, setLogging] = useState(false);
    const router = useRouter();
    const [_, startTransition] = useTransition();

    async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLogging(true);
        const formData = new FormData(e.currentTarget);

        // Slowing down sign-in speed to ask for more fundings
        await new Promise(r => setTimeout(r, 1000));

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword.length < 8) {
            setLogging(false);
            setMessageType('error');
            setMessage('Password too short, make it longer!');
        } else if (newPassword !== confirmPassword) {
            setLogging(false);
            setMessageType('error');
            setMessage("Passwords doesn't match");
        } else {
            setMessageType(null);
            setMessage('');

            try {
                const response = await authClient.changePassword({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    revokeOtherSessions: true
                });
                // console.log(response); // if success:{ data: {user data}, error: null }; if failed: { data: null, error: {"code": "INVALID_PASSWORD","message": "Invalid password", "status": 400,"statusText": "BAD_REQUEST"}}
                if (!response.error) {
                    setLogging(false);
                    setMessageType('success');
                    setMessage('Update password succeed');
                    startTransition(() => {
                        setTimeout(() => {
                            router.push('/');
                        }, 3000);
                    });
                } else {
                    setLogging(false);
                    setMessageType('error');
                    setMessage(response.error.message ?? 'Failed to update password');
                }
            } catch {
                setLogging(false);
                setMessageType('error');
                setMessage('Failed to update password');
            }
        }
    }

    if (isPending) return <div>Loading...</div>;

    return (
        <div className="w-full flex justify-center">
            {session?.user?.name ? (
                <div className="space-y-6 flex flex-col items-center max-w-lg w-full p-4">
                    <h1 className="text-2xl font-bold">Update Password</h1>
                    <form className="space-y-4 w-full max-w-lg" onSubmit={handleUpdatePassword}>
                        <label className="block text-sm font-medium">Old Password:</label>
                        <input className="border p-2 w-full" type="password" name="currentPassword" required />
                        <label className="block text-sm font-medium">Change Password:</label>
                        <input className="border p-2 w-full" type="password" name="password" required />

                        <label className="block text-sm font-medium">Confirm Password:</label>
                        <input className="border p-2 w-full" type="password" name="confirmPassword" required />
                        <div className="flex justify-center">
                            <Button type="submit" disabled={logging}>
                                {!logging ? (
                                    'Update'
                                ) : (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                    {message && <div className={`w-full max-w-lg px-4 py-3 rounded text-sm border ${messageType === 'error' ? 'bg-red-100 text-red-700 border-red-400' : 'bg-green-100 text-green-700 border-green-400'}`}>{message}</div>}
                </div>
            ) : (
                <NotLoggedInPage />
            )}
        </div>
    );
}
