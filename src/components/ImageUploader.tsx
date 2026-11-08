
import { ALLOWED_TYPES } from "../utils/validateFile";

interface Props {
    previewUrl: string | null;
    onSelect: (file: File | null) => void;
    disabled?: boolean;
}

export default function ImageUploader({ previewUrl, onSelect, disabled }: Props) {
    return (
        <div className="field">
            <span className="field-label">Choose an image</span>
            <input
                className="file-input"
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                disabled={disabled}
                onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
            />
            <div className="preview-box">
                {previewUrl ? (
                    <img src={previewUrl} alt="Selected" />
                ) : (
                    <span className="placeholder">Image preview appears here</span>
                )}
            </div>
        </div>
    );
}