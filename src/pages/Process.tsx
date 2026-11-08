
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModeSelector from "../components/ModeSelector";
import ImageUploader from "../components/ImageUploader";
import ResultView from "../components/ResultView";
import ErrorMessage from "../components/ErrorMessage";
import { useImageProcess } from "../hooks/useImageProcess";
import { validateFile } from "../utils/validateFile";
import type { Mode } from "../types";

export default function Process() {
  const [mode, setMode] = useState<Mode>("enhance");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { status, resultUrl, error, process, reset } = useImageProcess();

  const isLoading = status === "loading";

  // Create the preview URL and free it when the file changes or the page closes
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelect = (selected: File | null) => {
    reset();
    setFileError(null);
    if (!selected) return setFile(null);

    const problem = validateFile(selected);
    if (problem) {
      setFile(null);
      setFileError(problem);
      return;
    }
    setFile(selected);
  };

  const handleModeChange = (next: Mode) => {
    reset();
    setMode(next);
  };

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="logo">ImageEnhancer</Link>
      </header>

      <main className="hero">
        <h1>Process your image</h1>

        <div className="process-panel">
          <ModeSelector value={mode} onChange={handleModeChange} disabled={isLoading} />
          <ImageUploader previewUrl={previewUrl} onSelect={handleSelect} disabled={isLoading} />

          {fileError && <ErrorMessage message={fileError} />}

          <button
            className="btn-primary"
            disabled={!file || isLoading}
            onClick={() => file && process(file, mode)}
          >
            {isLoading ? "Processing..." : "Process image"}
          </button>

          {status === "error" && error && <ErrorMessage message={error} />}

          <ResultView status={status} resultUrl={resultUrl} mode={mode} />
        </div>

        <Link to="/" className="btn-secondary">← Back to home</Link>
      </main>
    </div>
  );
}