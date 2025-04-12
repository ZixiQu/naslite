"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { signInWithEmail } from "@/lib/auth-actions";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const callbackURL = "/";
  
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      // callbackURL,
    });
  
    console.log("Sign-in response:", { data, error });

    if (error) {
      setMessage(`Error: ${error.message || "An unexpected error occurred"}`)
    }
    else {
      setMessage("Sign-in successful!");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form className="space-y-4" action={handleSignIn}>
        <label className="block text-sm font-medium">Email:</label>
        <input className="border p-2 w-full" type="email" name="email" required />

        <label className="block text-sm font-medium">Password:</label>
        <input className="border p-2 w-full" type="password" name="password" required />

        {/* <button type="submit">Sign In</button> */}
        <Button type="submit">Sign In</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}