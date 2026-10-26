import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it('updates visible chapter widths when markers change at the same duration', () => {
    const { container, rerender } = render(<VideoPlayer src="clip.webm" markers={[{ start: 0, title: '开始' }, { start: 10, title: '旧章节' }]} />);
    const video = container.querySelector('video');
    Object.defineProperty(video, 'duration', { configurable: true, value: 20 });
    fireEvent.durationChange(video);
    expect((container.querySelector('.semi-videoPlayer-progress-slider') as HTMLElement).style.width).toBe('50%');
    rerender(<VideoPlayer src="clip.webm" markers={[{ start: 0, title: '开始' }, { start: 5, title: '新章节' }]} />);
    expect((container.querySelector('.semi-videoPlayer-progress-slider') as HTMLElement).style.width).toBe('25%');
});
