import React from 'react';
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import Toast from '../toast';
import { ToastFactory } from '../index';

afterEach(() => {
    cleanup();
    jest.useRealTimers();
});

it('does not notify again when a close animation outlasts the timer', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    const { container } = render(<Toast content="Saving" duration={2} onClose={onClose} />);
    fireEvent.click(container.querySelector('.semi-toast-close-button button'));
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(onClose).toHaveBeenCalledTimes(1);
});

it('starts a fresh duration when the same id reopens during leave', async () => {
    jest.useFakeTimers();
    const Message = ToastFactory.create();
    const onClose = jest.fn();
    try {
        act(() => { Message.info({ id: 'saving', content: 'Saving', duration: 2, onClose }); });
        fireEvent.click(document.querySelector('.semi-toast-close-button button'));
        act(() => { jest.advanceTimersByTime(500); });
        act(() => { Message.info({ id: 'saving', content: 'Reopened', duration: 2, onClose }); });
        act(() => { jest.advanceTimersByTime(1900); });
        expect(onClose).toHaveBeenCalledTimes(1);
        act(() => { jest.advanceTimersByTime(100); });
        expect(onClose).toHaveBeenCalledTimes(2);
    } finally {
        await act(async () => { Message.destroyAll(); });
    }
});
