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

it.each(['popup', 'modal'] as const)('mounts the %s card in the requested container at the requested z-index', async mode => {
    const target = createTarget();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = render(<UserGuide visible mode={mode} steps={[{ target, title: 'Introduction' }]} getPopupContainer={() => container} zIndex={3000} />);
    try {
        await waitFor(() => expect(container.querySelector('[role="dialog"]')).not.toBeNull());
        const portal = container.querySelector('[role="dialog"]').closest('.semi-portal') as HTMLElement;
        expect(portal.style.zIndex).toBe('3000');
    } finally {
        view.unmount();
        container.remove();
        target.remove();
    }
});
