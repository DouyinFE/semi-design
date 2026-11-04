import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it.each([false, true])('respects clickToPlay=%s when clicking the video', enabled => {
    const { container } = render(<VideoPlayer src="clip.webm" clickToPlay={enabled} />);
    const video = container.querySelector('video');
    const play = jest.spyOn(video, 'play').mockImplementation(() => Promise.resolve());
    fireEvent.click(video);
    expect(play).toHaveBeenCalledTimes(enabled ? 1 : 0);
});
