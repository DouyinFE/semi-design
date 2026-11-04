import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import Notification from '../index';

it('does not restart an updated notification timer when its entrance ends', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    try {
        act(() => { Notification.info({ id: 'updated', title: 'Initial', duration: 3, onClose }); });
        act(() => { jest.advanceTimersByTime(100); });
        act(() => { Notification.info({ id: 'updated', title: 'Updated', duration: 3, onClose }); });
        act(() => { jest.advanceTimersByTime(1900); });
        fireEvent.animationEnd(document.querySelector('.semi-notification-notice'));
        act(() => { jest.advanceTimersByTime(1100); });
        expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
        await act(async () => { Notification.destroyAll(); });
        jest.useRealTimers();
    }
});
