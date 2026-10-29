import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import UserGuide from '../index';

const originalDOMRect = globalThis.DOMRect;
beforeAll(() => {
    globalThis.DOMRect = class {
        constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
        get top() { return this.y; }
        get left() { return this.x; }
        get bottom() { return this.y + this.height; }
        get right() { return this.x + this.width; }
    } as typeof DOMRect;
});
afterAll(() => { globalThis.DOMRect = originalDOMRect; });

afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    document.body.style.width = '';
});

it.each([false, true])('preserves zero spotlight padding on the %s step', stepPadding => {
    const target = document.createElement('button');
    document.body.appendChild(target);
    target.getBoundingClientRect = () => new DOMRect(100, 100, 180, 64);
    const view = render(<UserGuide visible spotlightPadding={stepPadding ? 10 : 0}
        steps={[{ target, title: 'Target', ...(stepPadding ? { spotlightPadding: 0 } : {}) }]} />);
    return waitFor(() => {
        expect(document.querySelector('.semi-userGuide-spotlight-rect')?.getAttribute('width')).toBe('180');
    }).finally(() => {
        view.unmount();
        target.remove();
    });
});
