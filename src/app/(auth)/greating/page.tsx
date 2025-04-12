"use client"

import { authClient } from "@/lib/auth-client" // import the auth client

export default function Page() {
  // Retrieve the session using Better Auth's server-side API
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession() 

  console.log(session);
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  

  return (
    <div>
      {session?.user?.name ? (
        <h1 className="text-6xl font-bold mb-4">Welcome, {session.user.name}!</h1>
      ) : (
        <h1 className="text-6xl font-bold mb-4">Not logged in</h1>
      )}
    </div>
  );
}
