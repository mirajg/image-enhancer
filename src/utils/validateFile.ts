
import { env } from "../config/env";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/** Returns an error message, or null if the file is valid. */
export function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return "Please choose a JPG, PNG or WebP image.";
    }
    if (file.size > env.maxFileMB * 1024 * 1024) {
        return `Image is too large. Maximum size is ${env.maxFileMB}MB.`;
    }
    return null;
}