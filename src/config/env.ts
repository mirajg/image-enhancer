export const env = {
  maxFileMB: Number(import.meta.env.VITE_MAX_FILE_MB) || 4,
} as const;