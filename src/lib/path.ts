import { cookies } from "next/headers";


const COOKIE_NAME = "user-current-path";
export async function setCurrentPath(path: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, path, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
}

/**
 * 
 * @returns cookie(user's current path). If cookie key not set, return "/" indicating user is at root folder.
 */
export async function getCurrentPath() {
    const cookieStore = await cookies(); 
    return cookieStore.get(COOKIE_NAME)?.value ?? "/";
}