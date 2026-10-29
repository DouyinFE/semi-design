import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { ToastFactory } from '../index';

it('keeps an updated stacked toast paused while hovered', async () => {
    jest.useFakeTimers();
    const Toast = ToastFactory.create();
    const onClose = jest.fn();
    try {
        act(() => { Toast.info({ id: 'hover', content: 'Initial', duration: 2, stack: true, onClose }); });
        act(() => { Toast.info({ id: 'hover', content: 'Updated', duration: 2, stack: true, onClose }); });
        fireEvent.mouseEnter(document.querySelector('.semi-toast'));
        act(() => { jest.advanceTimersByTime(2500); });
        expect(onClose).not.toHaveBeenCalled();
    } finally {
        await act(async () => { Toast.destroyAll(); });
        jest.useRealTimers();
    }
});
