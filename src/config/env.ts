
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
    // Getter: the error is thrown only when the key is used, so the app still
    // loads and the UI can show a readable message instead of a blank page.
    get picwishApiKey(): string {
        return requireEnv("VITE_PICWISH_API_KEY");
    },
    picwishBaseUrl:
        import.meta.env.VITE_PICWISH_BASE_URL?.trim() || "https://techhk.aoscdn.com",
    maxFileMB: Number(import.meta.env.VITE_MAX_FILE_MB) || 10,
} as const;