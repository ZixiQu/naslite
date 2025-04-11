"use client";

import { useState } from "react";
import { signInWithEmail } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [message, setMessage] = useState("");

  async function handleSignIn(formData: FormData) {
    const result = await signInWithEmail(formData);
    setMessage(result.message);
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