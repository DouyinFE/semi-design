import React from 'react';
import { cleanup, render } from '@testing-library/react';
import UserGuide from '../index';

afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    document.body.style.width = '';
});

const steps = [{ title: 'Introduction' }];

it('locks the body when initially visible', () => {
    render(<UserGuide visible steps={steps} />);
    expect(document.body.style.overflow).toBe('hidden');
});

it('restores the width captured when opening', () => {
    document.body.style.width = '80%';
    const view = render(<UserGuide steps={steps} />);
    view.rerender(<UserGuide visible steps={steps} />);
    view.rerender(<UserGuide visible={false} steps={steps} />);
    expect(document.body.style.width).toBe('80%');
});

it('does not release another component lock after closing', () => {
    const view = render(<UserGuide steps={steps} />);
    view.rerender(<UserGuide visible steps={steps} />);
    view.rerender(<UserGuide visible={false} steps={steps} />);
    document.body.style.overflow = 'hidden';
    view.unmount();
    expect(document.body.style.overflow).toBe('hidden');
});

it('does not release another component lock when never opened', () => {
    document.body.style.overflow = 'hidden';
    const view = render(<UserGuide steps={steps} />);
    view.unmount();
    expect(document.body.style.overflow).toBe('hidden');
});
