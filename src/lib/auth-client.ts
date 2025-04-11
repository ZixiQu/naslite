import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  /** the base url of auth server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
});