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

it('does not let the old timer fire while a Toast.close leave animation runs', async () => {
    jest.useFakeTimers();
    const Message = ToastFactory.create();
    const onClose = jest.fn();
    try {
        act(() => { Message.info({ id: 'a', content: 'Saving', duration: 1, onClose }); });
        act(() => { jest.advanceTimersByTime(800); });
        act(() => { Message.close('a'); });
        act(() => { jest.advanceTimersByTime(201); });
        expect(onClose).not.toHaveBeenCalled();
    } finally {
        await act(async () => { Message.destroyAll(); });
    }
});

describe('activating a toast again while it leaves', () => {
    const closeButton = () => document.querySelector('.semi-toast-close-button button');

    it('notifies once when the close button is activated twice', async () => {
        jest.useFakeTimers();
        const Message = ToastFactory.create();
        const onClose = jest.fn();
        try {
            act(() => { Message.info({ id: 'a', content: 'Saving', duration: 1, onClose }); });
            fireEvent.click(closeButton());
            expect(document.querySelector('.semi-toast-animation-hide')).not.toBeNull();
            fireEvent.click(closeButton());
            act(() => { jest.advanceTimersByTime(1500); });
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(document.querySelector('.semi-toast-animation-hide')).not.toBeNull();
        } finally {
            await act(async () => { Message.destroyAll(); });
        }
    });

    it('does not notify from a timer restarted by mouse leave', async () => {
        jest.useFakeTimers();
        const Message = ToastFactory.create();
        const onClose = jest.fn();
        try {
            act(() => { Message.info({ id: 'a', content: 'Saving', duration: 1, onClose }); });
            fireEvent.click(closeButton());
            fireEvent.mouseLeave(document.querySelector('.semi-toast'));
            act(() => { jest.advanceTimersByTime(1500); });
            expect(onClose).toHaveBeenCalledTimes(1);
        } finally {
            await act(async () => { Message.destroyAll(); });
        }
    });

    it('stays silent after Toast.close', async () => {
        jest.useFakeTimers();
        const Message = ToastFactory.create();
        const onClose = jest.fn();
        try {
            act(() => { Message.info({ id: 'a', content: 'Saving', duration: 1, onClose }); });
            act(() => { Message.close('a'); });
            fireEvent.mouseLeave(document.querySelector('.semi-toast'));
            fireEvent.click(closeButton());
            act(() => { jest.advanceTimersByTime(1500); });
            expect(onClose).not.toHaveBeenCalled();
            expect(document.querySelector('.semi-toast-animation-hide')).not.toBeNull();
        } finally {
            await act(async () => { Message.destroyAll(); });
        }
    });

    it('notifies the reopened generation normally', async () => {
        jest.useFakeTimers();
        const Message = ToastFactory.create();
        const onClose = jest.fn();
        try {
            act(() => { Message.info({ id: 'a', content: 'Old', duration: 0, onClose }); });
            fireEvent.click(closeButton());
            fireEvent.click(closeButton());
            act(() => { Message.info({ id: 'a', content: 'New', duration: 2, onClose }); });
            act(() => { jest.advanceTimersByTime(1999); });
            expect(onClose).toHaveBeenCalledTimes(1);
            act(() => { jest.advanceTimersByTime(1); });
            expect(onClose).toHaveBeenCalledTimes(2);
            act(() => { Message.info({ id: 'a', content: 'Again', duration: 0, onClose }); });
            fireEvent.click(closeButton());
            expect(onClose).toHaveBeenCalledTimes(3);
        } finally {
            await act(async () => { Message.destroyAll(); });
        }
    });
});

describe('old timer after close and same-id reopen', () => {
    const closers = {
        'close button': () => fireEvent.click(document.querySelector('.semi-toast-close-button button')),
        'Toast.close': (Message: ReturnType<typeof ToastFactory.create>) => Message.close('a'),
    };

    Object.entries(closers).forEach(([name, close]) => {
        it(`does not close or notify the reopened toast via ${name}`, async () => {
            jest.useFakeTimers();
            const Message = ToastFactory.create();
            const onClose = jest.fn();
            try {
                act(() => { Message.info({ id: 'a', content: 'Old', duration: 1 }); });
                act(() => { jest.advanceTimersByTime(800); });
                act(() => { close(Message); });
                act(() => { Message.info({ id: 'a', content: 'New', duration: 0, onClose }); });
                act(() => { jest.advanceTimersByTime(201); });
                expect(onClose).not.toHaveBeenCalled();
            } finally {
                await act(async () => { Message.destroyAll(); });
            }
        });
    });
});
