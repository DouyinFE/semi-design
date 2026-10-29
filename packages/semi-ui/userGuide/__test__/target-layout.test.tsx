import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import UserGuide from '../index';

const OriginalDOMRect = globalThis.DOMRect;
beforeAll(() => {
    globalThis.DOMRect = class {
        constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
        get top() { return this.y; }
        get left() { return this.x; }
        get bottom() { return this.y + this.height; }
        get right() { return this.x + this.width; }
    } as typeof DOMRect;
});
afterAll(() => { globalThis.DOMRect = OriginalDOMRect; });
afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    document.body.style.width = '';
});

it.each(['layout', 'scroll', 'resize'])('keeps the spotlight over its target after %s changes', async change => {
    const parent = document.createElement('div');
    const target = document.createElement('button');
    parent.appendChild(target);
    document.body.appendChild(parent);
    let top = 100;
    target.getBoundingClientRect = () => new DOMRect(100, top, 180, 64);
    const steps = [{ target, title: 'Introduction' }];
    const view = render(<UserGuide visible steps={steps} mask={false} />);
    const spotlight = () => document.querySelector('.semi-userGuide-spotlight-rect');
    try {
        await waitFor(() => expect(spotlight()?.getAttribute('y')).toBe('95'));
        top = 180;
        if (change === 'layout') view.rerender(<UserGuide visible steps={steps} mask={false} />);
        else if (change === 'scroll') fireEvent.scroll(parent);
        else fireEvent(window, new Event('resize'));
        await waitFor(() => expect(spotlight()?.getAttribute('y')).toBe('175'));
    } finally {
        view.unmount();
        parent.remove();
    }
});

it.each(['hidden', 'unmounted'])('stops reading the public target getter when %s', async state => {
    const target = document.createElement('button');
    target.getBoundingClientRect = () => new DOMRect(100, 100, 180, 64);
    document.body.appendChild(target);
    let calls = 0;
    const steps = [{ target: () => { calls++; return target; }, title: 'Introduction' }];
    const view = render(<UserGuide visible steps={steps} />);
    try {
        await waitFor(() => expect(document.querySelector('.semi-userGuide-spotlight-rect')).not.toBeNull());
        if (state === 'hidden') view.rerender(<UserGuide visible={false} steps={steps} />);
        else view.unmount();
        const previous = calls;
        fireEvent.scroll(window);
        fireEvent(window, new Event('resize'));
        expect(calls).toBe(previous);
    } finally {
        view.unmount();
        target.remove();
    }
});
