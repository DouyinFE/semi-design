import React from 'react';
import { cleanup, render } from '@testing-library/react';
import UserGuide from '../index';

afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    document.body.style.width = '';
});

it('does not lock the body for empty steps', () => {
    const view = render(<UserGuide steps={[]} />);
    view.rerender(<UserGuide visible steps={[]} />);
    expect(document.body.style.overflow).toBe('');
});

it('releases the body when visible steps become empty', () => {
    const view = render(<UserGuide steps={[{ title: 'Introduction' }]} />);
    view.rerender(<UserGuide visible steps={[{ title: 'Introduction' }]} />);
    view.rerender(<UserGuide visible steps={[]} />);
    expect(document.body.style.overflow).toBe('');
});
