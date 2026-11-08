
import type { Mode, Status } from "../types";

interface Props {
    status: Status;
    resultUrl: string | null;
    mode: Mode;
}

export default function ResultView({ status, resultUrl, mode }: Props) {
    const handleDownload = async () => {
        if (!resultUrl) return;
        try {
            const blob = await (await fetch(resultUrl)).blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${mode}-result.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch {
            // Direct download can be blocked by CORS, so open the image instead
            window.open(resultUrl, "_blank", "noopener");
        }
    };

    return (
        <div className="field">
            <span className="field-label">Result</span>
            <div className={`preview-box ${mode === "remove-bg" ? "checker" : ""}`}>
                {status === "loading" && <div className="spinner" aria-label="Processing" />}
                {status === "success" && resultUrl && <img src={resultUrl} alt="Processed result" />}
                {(status === "idle" || status === "error") && (
                    <span className="placeholder">Processed image appears here</span>
                )}
            </div>
            {status === "success" && resultUrl && (
                <button className="btn-primary" onClick={handleDownload}>
                    Download
                </button>
            )}
        </div>
    );
}