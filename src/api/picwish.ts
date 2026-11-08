
import { env } from "../config/env";
import { ApiError } from "../types";
import type { Mode } from "../types";

const ENDPOINTS: Record<Mode, string> = {
    enhance: "/api/tasks/visual/scale",
    "remove-bg": "/api/tasks/visual/segmentation",
};

const REQUEST_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 1_500;
const MAX_POLLS = 20;

interface PicwishResponse {
    status?: number;
    message?: string;
    data?: { task_id?: string; state?: number; image?: string };
}

function mapError(httpStatus: number, message?: string): ApiError {
    switch (httpStatus) {
        case 401:
        case 403:
            return new ApiError("The API key is invalid or not allowed.", httpStatus);
        case 402:
            return new ApiError("No API credits left. Please top up your PicWish account.", httpStatus);
        case 413:
            return new ApiError("The image is too large for the service.", httpStatus);
        case 429:
            return new ApiError("Too many requests. Please wait a moment and try again.", httpStatus);
        default:
            return new ApiError(message || "The image could not be processed. Please try another one.", httpStatus);
    }
}

async function request(url: string, init: RequestInit = {}): Promise<PicwishResponse> {
    const apiKey = env.picwishApiKey; // throws a clear error if missing
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: { "X-API-KEY": apiKey },
        });

        let body: PicwishResponse | null = null;
        try {
            body = await res.json();
        } catch {
            /* response had no JSON body */
        }

        if (!res.ok || (body?.status && body.status !== 200)) {
            throw mapError(res.ok ? body?.status ?? 500 : res.status, body?.message);
        }
        if (!body) throw new ApiError("Empty response from the service.");
        return body;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new ApiError("The request timed out. Please try again.");
        }
        throw new ApiError("Network error. Check your connection and try again.");
    } finally {
        clearTimeout(timer);
    }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pollTask(mode: Mode, taskId: string): Promise<string> {
    const url = `${env.picwishBaseUrl}${ENDPOINTS[mode]}/${taskId}`;

    for (let i = 0; i < MAX_POLLS; i++) {
        const { data } = await request(url);
        if (data?.state === 1 && data.image) return data.image;
        if (data?.state !== undefined && data.state < 0) {
            throw new ApiError("Processing failed. Please try another image.");
        }
        await sleep(POLL_INTERVAL_MS);
    }
    throw new ApiError("Processing is taking too long. Please try again.");
}

/** Uploads the image and returns the URL of the processed result. */
export async function processImage(file: File, mode: Mode): Promise<string> {
    const form = new FormData();
    form.append("image_file", file);
    form.append("sync", "1"); // try to get the result in one call
    if (mode === "enhance") form.append("type", "clean");

    const { data } = await request(`${env.picwishBaseUrl}${ENDPOINTS[mode]}`, {
        method: "POST",
        body: form,
    });

    if (data?.state === 1 && data.image) return data.image;
    if (data?.task_id) return pollTask(mode, data.task_id);
    throw new ApiError("Unexpected response from the service.");
}