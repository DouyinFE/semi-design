import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import UserGuide from '../index';
import ConfigProvider from '../../configProvider';

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

describe('spotlight mask container', () => {
    const steps = (target: Element) => [{ target, title: 'Introduction' }];
    let target: HTMLElement;
    let container: HTMLElement;
    beforeEach(() => {
        target = createTarget();
        container = document.createElement('div');
        container.style.position = 'relative';
        container.style.zIndex = '1';
        document.body.appendChild(container);
    });
    afterEach(() => {
        container.remove();
        target.remove();
    });

    it('puts the mask and the card in the same container with the mask below the card', async () => {
        render(<UserGuide visible steps={steps(target)} getPopupContainer={() => container} zIndex={3000} />);
        await waitFor(() => expect(container.querySelector('.semi-userGuide-spotlight')).not.toBeNull());
        await waitFor(() => expect(container.querySelector('[role="dialog"]')).not.toBeNull());
        const mask = container.querySelector('.semi-userGuide-spotlight') as SVGElement;
        const card = container.querySelector('[role="dialog"]').closest('.semi-portal') as HTMLElement;
        expect(Number(mask.closest<HTMLElement>('.semi-portal').style.zIndex)).toBeLessThan(Number(card.style.zIndex));
        expect(mask.style.zIndex).toBe('2999');
        expect(card.style.zIndex).toBe('3000');
    });

    it('follows a container configured through ConfigProvider', async () => {
        render(
            <ConfigProvider getPopupContainer={() => container}>
                <UserGuide visible steps={steps(target)} zIndex={3000} />
            </ConfigProvider>
        );
        await waitFor(() => expect(container.querySelector('[role="dialog"]')).not.toBeNull());
        expect(container.querySelector('.semi-userGuide-spotlight')).not.toBeNull();
    });

    it('keeps the mask out of the custom container when no container is passed', async () => {
        render(<UserGuide visible steps={steps(target)} zIndex={3000} />);
        await waitFor(() => expect(document.querySelector('.semi-userGuide-spotlight')).not.toBeNull());
        expect(container.querySelector('.semi-userGuide-spotlight')).toBeNull();
    });

    it('leaves nothing in the container after hide or unmount', async () => {
        const view = render(<UserGuide visible steps={steps(target)} getPopupContainer={() => container} />);
        await waitFor(() => expect(container.querySelector('.semi-userGuide-spotlight')).not.toBeNull());
        view.rerender(<UserGuide visible={false} steps={steps(target)} getPopupContainer={() => container} />);
        await waitFor(() => expect(container.childElementCount).toBe(0));
        view.rerender(<UserGuide visible steps={steps(target)} getPopupContainer={() => container} />);
        await waitFor(() => expect(container.querySelector('.semi-userGuide-spotlight')).not.toBeNull());
        view.unmount();
        expect(container.childElementCount).toBe(0);
    });

    it('cancels the containing block offset of a transformed container', async () => {
        const original = SVGElement.prototype.getBoundingClientRect;
        // jsdom has no layout; emulate an svg whose fixed containing block starts at (20, 30) while it is pinned at left/top 0.
        SVGElement.prototype.getBoundingClientRect = function (this: SVGElement) {
            const left = parseFloat(this.style.left) || 0;
            const top = parseFloat(this.style.top) || 0;
            return new DOMRect(20 + left, 30 + top, 0, 0);
        };
        try {
            render(<UserGuide visible steps={steps(target)} getPopupContainer={() => container} />);
            await waitFor(() => {
                const mask = container.querySelector('.semi-userGuide-spotlight') as SVGElement;
                expect(mask?.style.left).toBe('-20px');
                expect(mask?.style.top).toBe('-30px');
            });
        } finally {
            SVGElement.prototype.getBoundingClientRect = original;
        }
    });
});
