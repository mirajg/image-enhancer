
import type { Mode } from "../types";

interface Props {
    value: Mode;
    onChange: (mode: Mode) => void;
    disabled?: boolean;
}

export default function ModeSelector({ value, onChange, disabled }: Props) {
    return (
        <label className="field">
            <span className="field-label">What do you want to do?</span>
            <select
                className="select"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value as Mode)}
            >
                <option value="enhance">Enhance image</option>
                <option value="remove-bg">Remove background</option>
            </select>
        </label>
    );
}