
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_URL = process.env.PICWISH_BASE_URL || "https://techhk.aoscdn.com";
const TIMEOUT_MS = 30_000;
const MAX_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is about 4.5MB

const ENDPOINTS: Record<string, string> = {
    enhance: "/api/tasks/visual/scale",
    "remove-bg": "/api/tasks/visual/segmentation",
};
const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

async function readBody(req: VercelRequest): Promise<Buffer> {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BYTES) throw new Error("TOO_LARGE");
        chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const apiKey = process.env.PICWISH_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: "Server is not configured." });
    }

    const mode = String(req.query.mode ?? "");
    const endpoint = ENDPOINTS[mode];
    if (!endpoint) return res.status(400).json({ message: "Invalid mode." });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        let upstream: Response;

        if (req.method === "POST") {
            const type = String(req.headers["content-type"] ?? "");
            const ext = EXTENSIONS[type];
            if (!ext) return res.status(415).json({ message: "Unsupported image type." });

            const body = await readBody(req);
            const form = new FormData();
            form.append("image_file", new Blob([body], { type }), `image.${ext}`);
            form.append("sync", "1");
            if (mode === "enhance") form.append("type", "clean");

            upstream = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "X-API-KEY": apiKey },
                body: form,
                signal: controller.signal,
            });
        } else if (req.method === "GET") {
            const taskId = String(req.query.taskId ?? "");
            if (!/^[\w-]+$/.test(taskId)) {
                return res.status(400).json({ message: "Invalid task id." });
            }
            upstream = await fetch(`${BASE_URL}${endpoint}/${taskId}`, {
                headers: { "X-API-KEY": apiKey },
                signal: controller.signal,
            });
        } else {
            return res.status(405).json({ message: "Method not allowed." });
        }

        const data = await upstream.json().catch(() => null);
        return res
            .status(upstream.status)
            .json(data ?? { message: "Invalid response from the service." });
    } catch (err) {
        if (err instanceof Error && err.message === "TOO_LARGE") {
            return res.status(413).json({ message: "Image is too large." });
        }
        if (err instanceof Error && err.name === "AbortError") {
            return res.status(504).json({ message: "The service timed out." });
        }
        return res.status(502).json({ message: "Could not reach the service." });
    } finally {
        clearTimeout(timer);
    }
}