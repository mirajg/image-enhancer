
const requireEnv = (key: keyof ImportMetaEnv): string => {
    const value = import.meta.env[key];
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(
            `Missing environment variable ${key}. Add it to your .env file and restart the dev server.`
        );
    }
    return value.trim();
};


export const env = {
  maxFileMB: Number(import.meta.env.VITE_MAX_FILE_MB) || 4,
} as const;