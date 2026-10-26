import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it('restores the configured volume after starting muted and unmuting', () => {
    const { container, getByRole } = render(<VideoPlayer src="clip.webm" volume={70} muted />);
    const video = container.querySelector('video');
    expect(video.volume).toBe(0);
    fireEvent.click(getByRole('img', { name: 'mute' }).closest('button'));
    expect(video.volume).toBe(0.7);
});
