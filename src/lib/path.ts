import { cookies } from "next/headers";


// Since DO (DigitalOcean)'s folder are virtual folders, meaning there is no real folders, only full path to items
// DO's key is very strict, no double //.
// We must be very careful with names, avoid double slashes

export function trimAndNormalizePath(path: string) {
    const normalized = path
                        .replace(/^\/+|\/+$/g, "")     // Trim leading/trailing slashes
                        .replace(/\/{2,}/g, "/");      // Replace multiple slashes with one
    return normalized
}

const COOKIE_NAME = "user-current-path";
const isServer = () => typeof window === "undefined";

export async function setCurrentPath(path: string) {
    if (isServer()) {
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, trimAndNormalizePath(path), {
            path: "/",  // cookie will set under any path of the domain. It does not represent default value.
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }
    else {
        const cleaned = trimAndNormalizePath(path);
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleaned)}; path=/; max-age=${60 * 60 * 24 * 7}`;  // this will not overwrite current cookies.
    }
}

/**
 * 
 * @returns cookie(user's current path). If cookie key not set, return ""(empty string) indicating user is at root folder.
 */
export async function getCurrentPath() {
    if (isServer()) {
        const cookieStore = await cookies(); 
        return cookieStore.get(COOKIE_NAME)?.value ?? "";
    }
    else {
        const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
        return match ? decodeURIComponent(match[2]) : "";
    }
    
}