"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { signInWithEmail } from "@/lib/auth-actions";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const callbackURL = "/greeting"; //Replace
  
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      // callbackURL,
    });
  
    console.log("Sign-in response:", { data, error });

    if (error) {
      setMessage(`Error: ${error.message || "An unexpected error occurred"}`);
      setMessageType("error");
    } else {
      setMessage("Sign-in successful!");
      setMessageType("success");
    }
    
    // Redirect to the callback URL after successful sign-in
    if (data) {
      formData.set("email", "");
      formData.set("password", "");
      setMessage("");
      setMessageType(null);
      router.push(callbackURL);
    }
  }

  return (
    <div className="space-y-6 flex flex-col items-center justify-center max-w-lg w-full p-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form className="space-y-4 w-full max-w-lg" action={handleSignIn}>
        <label className="block text-sm font-medium">Email:</label>
        <input className="border p-2 w-full" type="email" name="email" required />

        <label className="block text-sm font-medium">Password:</label>
        <input className="border p-2 w-full" type="password" name="password" required />

        <div className="flex justify-center">
          <Button type="submit">Sign In</Button>
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
      <div className="text-sm text-gray-500">
        Don&apos;t have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
      </div>
    </div>
  );
}