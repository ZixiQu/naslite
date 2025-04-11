"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";


export default function SignUpPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  async function handleSignUp(formData: FormData) {
    const result = await signUpWithEmail(formData);
    console.log("Sign-up response:", result);
    if (result.success) {
      setMessage("Sign-up successful!");
      setMessageType("success");
    } else {
      setMessage(`${result.message || "Something went wrong."}`);
      setMessageType("error");
      return;
    }
  }

  return (
    <div className="space-y-6 flex flex-col items-center justify-center w-full max-w-lg p-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <form action={handleSignUp} className="space-y-4 w-full max-w-lg">
        <label htmlFor="email" className="block text-sm font-medium">Email:</label>
        <input type="email" name="email" className="border p-2 w-full" required />

        <label htmlFor="password" className="block text-sm font-medium">Password:</label>
        <input type="password" name="password" className="border p-2 w-full" required />

        <label htmlFor="name" className="block text-sm font-medium">Name:</label>
        <input type="text" name="name" className="border p-2 w-full" required />

        <div className="flex justify-center">
          <Button type="submit">Sign Up</Button>
        </div>
      </form>

      {message && (
        <div
          className={`w-full max-w-lg px-4 py-3 rounded text-sm border ${
            messageType === "error"
              ? "bg-red-100 text-red-700 border-red-400"
              : "bg-green-100 text-green-700 border-green-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}