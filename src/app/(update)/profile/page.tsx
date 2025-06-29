/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NotLoggedInPage from "@/app/401/page";
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const [logging, setLogging] = useState(false);

  if (status === 'unauthenticated') {
    return <NotLoggedInPage />;
  }

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLogging(true);
    const formData = new FormData(e.currentTarget);

    // Slowing down sign-in speed to ask for more fundings
    await new Promise((r) => setTimeout(r, 1000));
    const name = formData.get('name') as string;

    if (!name) {
      setLogging(false);
      setMessageType('error');
      setMessage('Username not provided');
    } else if (name.length > 20) {
      setLogging(false);
      setMessageType('error');
      setMessage('Username cannot exceed 20 characters');
    } else {
      setLogging(false);
      setMessageType(null);
      setMessage('');

      try {
        const response = await fetch('/api/users/update-name', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        const data = await response.json();

        if (!data.error) {
          setMessageType('success');
          setMessage('Update user profile is successful');
        } else {
          setMessageType('error');
          setMessage(data.error.message ?? 'Failed to update user profile');
        }
      } catch (error) {
        setMessageType('error');
        setMessage('Error updating user profile');
      }
    }
  }
  return (
    <div className="w-full flex justify-center">
      {session?.user?.name ? (
        <div className="space-y-6 flex flex-col items-center max-w-lg w-full p-4">
          <h1 className="text-2xl font-bold boarder-d">Profile</h1>
          <form className="space-y-4 w-full max-w-lg" onSubmit={handleUpdateProfile}>
            <label className="block text-sm font-medium">Name:</label>
            <input
              className="border p-2 w-full"
              type="text"
              defaultValue={session.user.name}
              name="name"
              required
            />

            <label className="block text-sm font-medium">Email: (Cannot Change) </label>
            <input
              className="border p-2 w-full"
              type="email"
              defaultValue={session.user.email ?? ''}
              name="email"
              required
              disabled
            />

            <label className="block text-sm font-medium">Password:</label>
            <div className="text-sm text-gray-500 pb-[10px]">
              To change password, visit{' '}
              <a href="/update_password" className="text-blue-500">
                change password page
              </a>
            </div>

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
          {message && (
            <div
              className={`w-full max-w-lg px-4 py-3 rounded text-sm border ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-700 border-red-400'
                  : 'bg-green-100 text-green-700 border-green-400'
              }`}
            >
              {message}
            </div>
          )}
          {/* <div className="space-y-6 flex flex-col items-center max-w-lg w-full p-4">
            <h1 className="text-2xl font-bold boarder-d">Password: </h1>
            <div className="text-sm text-gray-500"> 
              To change password, visit{" "}
              <a href="/update_password" className="text-blue-500"> 
                change password page
              </a>
            </div>
          </div> */}
        </div>
      ) : (
        <NotLoggedInPage />
      )}
    </div>
  );
}
