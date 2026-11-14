import { useState } from 'react';
import { TextField } from '@mui/material';

export const formatNumber = (number) => {
    if (number === undefined || number === null || number === '') {
        return '';
    }
    if (typeof number !== 'number' || isNaN(number)) {
        return String(number);
    }
    return number.toLocaleString();
}

export const parseNumber = (text) => {
    const cleaned = String(text).replace(/,/g, '').trim();
    if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
        return undefined;
    }
    const parsed = Number(cleaned);
    return isNaN(parsed) ? undefined : parsed;
}

// A text field for numbers that leaves the text alone while you type and only
// adds thousands separators once the field loses focus. Reformatting on every
// keystroke moved the cursor to the end and swallowed things like a trailing
// decimal point ("1." became "1").
const NumberField = ({ value, onChange, ...props }) => {
    const [draft, setDraft] = useState(null);
    const editing = draft !== null;

    const handleFocus = (event) => {
        setDraft(value === undefined || value === null ? '' : String(value));
        props.onFocus?.(event);
    }

    const handleChange = (event) => {
        const text = event.target.value;
        setDraft(text);
        const parsed = parseNumber(text);
        onChange(parsed === undefined ? 0 : parsed);
    }

    const handleBlur = (event) => {
        setDraft(null);
        props.onBlur?.(event);
    }

    return (
        <TextField
            {...props}
            inputProps={{ inputMode: 'decimal', ...props.inputProps }}
            value={editing ? draft : formatNumber(value)}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}

export default NumberField;
