/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAX_FILE_MB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}