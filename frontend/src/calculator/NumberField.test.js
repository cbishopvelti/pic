import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberField from './NumberField';

const Harness = ({ initial, onValue }) => {
    const [value, setValue] = useState(initial);
    return <NumberField label="field" value={value} onChange={(v) => { setValue(v); onValue?.(v); }} />;
}

test('shows formatted value when not focused', () => {
    render(<Harness initial={365000} />);
    expect(screen.getByLabelText('field')).toHaveValue('365,000');
});

test('keeps a trailing decimal point while typing', () => {
    const onValue = jest.fn();
    render(<Harness initial={5} onValue={onValue} />);
    const input = screen.getByLabelText('field');
    userEvent.clear(input);
    userEvent.type(input, '1.6');
    expect(input).toHaveValue('1.6');
    expect(onValue).toHaveBeenLastCalledWith(1.6);
});

test('does not insert separators while typing, formats on blur', () => {
    render(<Harness initial={0} />);
    const input = screen.getByLabelText('field');
    userEvent.clear(input);
    userEvent.type(input, '1234567');
    expect(input).toHaveValue('1234567');
    userEvent.tab();
    expect(input).toHaveValue('1,234,567');
});

test('editing in the middle keeps the cursor in place', () => {
    render(<Harness initial={250000} />);
    const input = screen.getByLabelText('field');
    userEvent.click(input);
    input.setSelectionRange(1, 1);
    userEvent.type(input, '9', { initialSelectionStart: 1, initialSelectionEnd: 1 });
    expect(input).toHaveValue('2950000');
});

test('a cleared field counts as zero', () => {
    const onValue = jest.fn();
    render(<Harness initial={600} onValue={onValue} />);
    const input = screen.getByLabelText('field');
    userEvent.clear(input);
    expect(input).toHaveValue('');
    expect(onValue).toHaveBeenLastCalledWith(0);
});
