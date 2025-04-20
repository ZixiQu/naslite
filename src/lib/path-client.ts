// Since DO (DigitalOcean)'s folder are virtual folders, meaning there is no real folders, only full path to items
// DO's key is very strict, no double //.
// We must be very careful with names, avoid double slashes
function trimAndNormalizePath(path: string) {
    const normalized = path
        .replace(/^\/+|\/+$/g, '') // Trim leading/trailing slashes
        .replace(/\/{2,}/g, '/'); // Replace multiple slashes with one
    return normalized;
}

const COOKIE_NAME = 'user-current-path';

export async function setCurrentPath(path: string) {
    const cleaned = trimAndNormalizePath(path);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleaned)}; path=/; max-age=${60 * 60 * 24 * 7}`; // this will not overwrite current cookies.
}

/**
 *
 * @returns cookie(user's current path). If cookie key not set, return ""(empty string) indicating user is at root folder.
 */
export async function getCurrentPath() {
    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : '';
}

export async function deleteCurrentPath() {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
