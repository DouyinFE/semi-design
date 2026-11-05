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

function createTarget() {
    const target = document.createElement('button');
    document.body.appendChild(target);
    target.getBoundingClientRect = () => new DOMRect(100, 100, 180, 64);
    return target;
}

it.each(['popup', 'modal'] as const)('updates %s step classes and preserves component styles', async mode => {
    const target = createTarget();
    const steps = [{ target, title: 'First', className: 'first-step' }, { target, title: 'Second', className: 'second-step' }];
    const view = render(<UserGuide visible mode={mode} current={0} steps={steps} className="guide-global" style={{ borderWidth: 3 }} />);
    try {
        await waitFor(() => expect(document.querySelector('.guide-global.first-step')).not.toBeNull());
        const styledElement = document.querySelector(mode === 'popup' ? '.guide-global.first-step' : '.semi-modal') as HTMLElement;
        expect(styledElement.style.borderWidth).toBe('3px');
        view.rerender(<UserGuide visible mode={mode} current={1} steps={steps} className="guide-global" style={{ borderWidth: 3 }} />);
        await waitFor(() => expect(document.querySelector('.guide-global.second-step')).not.toBeNull());
        expect(document.querySelector('.guide-global.first-step')).toBeNull();
    } finally {
        view.unmount();
        target.remove();
    }
});

it.each([
    ['popup', true], ['popup', false], ['modal', true], ['modal', false]
] as const)('uses %s step masks before global mask=%s', async (mode, mask) => {
    const target = createTarget();
    const steps = [{ target, title: 'First', mask: false }, { target, title: 'Second', mask: true }, { target, title: 'Third' }];
    const view = render(<UserGuide visible mode={mode} current={0} steps={steps} mask={mask} />);
    const maskSelector = mode === 'popup' ? '.semi-userGuide-spotlight > rect[fill="var(--semi-color-overlay-bg)"]' : '.semi-modal-mask';
    const waitForStep = async () => {
        await waitFor(() => expect(document.querySelector(mode === 'popup' ? '.semi-userGuide-spotlight-rect' : '.semi-modal')).not.toBeNull());
    };
    try {
        await waitForStep();
        expect(document.querySelector(maskSelector)).toBeNull();
        view.rerender(<UserGuide visible mode={mode} current={1} steps={steps} mask={mask} />);
        await waitFor(() => expect(document.querySelector(maskSelector)).not.toBeNull());
        view.rerender(<UserGuide visible mode={mode} current={2} steps={steps} mask={mask} />);
        expect(Boolean(document.querySelector(maskSelector))).toBe(mask);
    } finally {
        view.unmount();
        target.remove();
    }
});
