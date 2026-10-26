import React from 'react';
import { cleanup, render } from '@testing-library/react';
import SideSheet from '../index';

afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    document.body.style.width = '';
});

it.each(['disableScroll', 'getPopupContainer'])('releases the body lock after %s changes', changed => {
    document.body.style.width = '80%';
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = render(<SideSheet visible motion={false} />);
    const next = changed === 'disableScroll' ? { disableScroll: false } : { getPopupContainer: () => container };
    view.rerender(<SideSheet visible motion={false} {...next} />);
    view.rerender(<SideSheet visible={false} motion={false} {...next} />);
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.width).toBe('80%');
    container.remove();
});

it('captures body width for each opening', () => {
    const view = render(<SideSheet visible={false} motion={false} />);
    document.body.style.width = '60%';
    view.rerender(<SideSheet visible motion={false} />);
    view.rerender(<SideSheet visible={false} motion={false} />);
    expect(document.body.style.width).toBe('60%');
});

it('preserves a lock owned by another component', () => {
    document.body.style.overflow = 'hidden';
    document.body.style.width = '70%';
    const view = render(<SideSheet visible motion={false} />);
    view.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.width).toBe('70%');
});
