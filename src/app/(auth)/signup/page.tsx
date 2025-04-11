"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";


export default function SignUpPage() {
  const [message, setMessage] = useState("");

  async function handleSignUp(formData: FormData) {
    const result = await signUpWithEmail(formData);
    setMessage(result.message);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form action={handleSignUp} className="space-y-4">
        <label htmlFor="email" className="block text-sm font-medium">Email:</label>
        <input type="email" name="email" className="border p-2 w-full" required />

        <label htmlFor="password" className="block text-sm font-medium">Password:</label>
        <input type="password" name="password" className="border p-2 w-full" required />

        <label htmlFor="name" className="block text-sm font-medium">Name:</label>
        <input type="text" name="name" className="border p-2 w-full" required />

        {/* <button type="submit">Sign Up</button> */}
        <Button type="submit">Sign Up</Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}