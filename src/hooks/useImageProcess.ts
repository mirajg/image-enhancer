
import { useCallback, useRef, useState } from "react";
import { processImage } from "../api/picwish";
import type { Mode, Status } from "../types";

export function useImageProcess() {
    const [status, setStatus] = useState<Status>("idle");
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const runId = useRef(0); // ignores results from outdated requests

    const process = useCallback(async (file: File, mode: Mode) => {
        const id = ++runId.current;
        setStatus("loading");
        setError(null);
        setResultUrl(null);

        try {
            const url = await processImage(file, mode);
            if (id !== runId.current) return;
            setResultUrl(url);
            setStatus("success");
        } catch (err) {
            if (id !== runId.current) return;
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setStatus("error");
        }
    }, []);

    const reset = useCallback(() => {
        runId.current++;
        setStatus("idle");
        setResultUrl(null);
        setError(null);
    }, []);

    return { status, resultUrl, error, process, reset };
}