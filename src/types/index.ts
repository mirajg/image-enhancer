
export type Mode = "enhance" | "remove-bg";
export type Status = "idle" | "loading" | "success" | "error";

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}