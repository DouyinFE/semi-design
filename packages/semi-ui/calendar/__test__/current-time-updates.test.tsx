import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Calendar from '../index';

afterEach(cleanup);
const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
const line = '.semi-calendar-grid-curr-line';

it('removes the current-time line when the day changes and restores it on today', () => {
    const { container, rerender } = render(<Calendar mode="day" displayValue={today} />);
    expect(container.querySelectorAll(line).length).toBe(1);
    rerender(<Calendar mode="day" displayValue={tomorrow} />);
    expect(container.querySelectorAll(line).length).toBe(0);
    rerender(<Calendar mode="day" displayValue={today} />);
    expect(container.querySelectorAll(line).length).toBe(1);
});

it.each(['day', 'week', 'range'] as const)('enables and disables the current-time line in %s mode', mode => {
    const range = [today, tomorrow];
    const { container, rerender } = render(<Calendar mode={mode} range={range} displayValue={today} showCurrTime={false} />);
    expect(container.querySelectorAll(line).length).toBe(0);
    rerender(<Calendar mode={mode} range={range} displayValue={today} showCurrTime />);
    expect(container.querySelectorAll(line).length).toBe(1);
    rerender(<Calendar mode={mode} range={range} displayValue={today} showCurrTime={false} />);
    expect(container.querySelectorAll(line).length).toBe(0);
});

it('keeps at most one time-update frame and cancels it when hidden or unmounted', () => {
    const frames = new Map();
    let nextFrame = 0;
    const request = jest.spyOn(global, 'requestAnimationFrame').mockImplementation(callback => {
        frames.set(++nextFrame, callback);
        return nextFrame;
    });
    const cancel = jest.spyOn(global, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id); });
    try {
        const { rerender, unmount } = render(<Calendar mode="day" displayValue={today} />);
        expect(frames.size).toBe(1);
        rerender(<Calendar mode="day" displayValue={new Date(today.getTime() + 1)} />);
        expect(frames.size).toBe(1);
        rerender(<Calendar mode="day" displayValue={tomorrow} />);
        expect(frames.size).toBe(0);
        rerender(<Calendar mode="day" displayValue={today} />);
        expect(frames.size).toBe(1);
        rerender(<Calendar mode="day" displayValue={today} showCurrTime={false} />);
        expect(frames.size).toBe(0);
        rerender(<Calendar mode="day" displayValue={today} />);
        expect(frames.size).toBe(1);
        unmount();
        expect(frames.size).toBe(0);
    } finally {
        request.mockRestore();
        cancel.mockRestore();
    }
});
