
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PICWISH_API_KEY: string;
    readonly VITE_PICWISH_BASE_URL?: string;
    readonly VITE_MAX_FILE_MB?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}