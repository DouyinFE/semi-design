import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it('updates the fullscreen icon when the native fullscreen state changes', () => {
    const descriptor = Object.getOwnPropertyDescriptor(document, 'fullscreenElement');
    const { container, getByRole } = render(<VideoPlayer src="clip.webm" />);
    try {
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: container.firstElementChild });
        fireEvent(document, new Event('fullscreenchange'));
        expect(getByRole('img', { name: 'minimize' })).not.toBeNull();
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        fireEvent(document, new Event('fullscreenchange'));
        expect(getByRole('img', { name: 'maximize' })).not.toBeNull();
    } finally {
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        fireEvent(document, new Event('fullscreenchange'));
        if (descriptor) Object.defineProperty(document, 'fullscreenElement', descriptor);
        else delete (document as any).fullscreenElement;
    }
});
