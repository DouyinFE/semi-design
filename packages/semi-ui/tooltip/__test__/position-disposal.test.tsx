import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import Tooltip from '../index';

afterEach(() => {
    cleanup();
    jest.useRealTimers();
});

it.each([true, false])('does not call getPopupContainer after unmount with ResizeObserver=%s', hasResizeObserver => {
    jest.useFakeTimers();
    const resizeObserver = global.ResizeObserver;
    if (!hasResizeObserver) global.ResizeObserver = undefined;
    const getPopupContainer = sinon.spy(() => document.body);
    try {
        const { getByText, unmount } = render(
            <Tooltip mouseEnterDelay={0} motion={false} content="Content" getPopupContainer={getPopupContainer}>
                <button>Trigger</button>
            </Tooltip>
        );
        fireEvent.mouseEnter(getByText('Trigger'));
        expect(document.querySelector('.semi-portal-inner')).not.toBeNull();
        unmount();
        getPopupContainer.resetHistory();
        act(() => { jest.advanceTimersByTime(100); });
        expect(getPopupContainer.called).toBe(false);
    } finally {
        global.ResizeObserver = resizeObserver;
    }
});
