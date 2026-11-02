import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Calendar from '../index';

afterEach(cleanup);

it('moves a retained event to the start when its overlapping predecessor is replaced', () => {
    const displayValue = new Date(2026, 9, 26);
    const events = ['A', 'B'].map(key => ({ key,
        start: new Date(2026, 9, 26, 9), end: new Date(2026, 9, 26, 10), children: <span>{key}</span>
    }));
    const { getByText, rerender } = render(<Calendar mode="day" displayValue={displayValue} events={events} showCurrTime={false} />);
    const retained = getByText('B').closest('li');
    expect(retained.style.insetInlineStart || retained.style.left).toBe('50%');
    const replacement = { key: 'C', start: new Date(2026, 9, 26, 8), end: new Date(2026, 9, 26, 9), children: <span>C</span> };
    rerender(<Calendar mode="day" displayValue={displayValue} events={[replacement, events[1]]} showCurrTime={false} />);
    expect(getByText('B').closest('li')).toBe(retained);
    expect(parseFloat(retained.style.insetInlineStart || retained.style.left)).toBe(0);
});
