import React from 'react';
import { cleanup, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it('uses an updated playbackRateList without remounting the player', () => {
    const { rerender, getByText, queryByText } = render(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '旧1倍', value: 1 }]} />);
    rerender(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '新1倍', value: 1 }, { label: '1.5倍', value: 1.5 }]} />);
    expect(getByText('新1倍')).not.toBeNull();
    expect(queryByText('旧1倍')).toBeNull();
});

it('shows the actual rate and keeps it when the current rate is removed from playbackRateList', () => {
    const { container, rerender, getByText } = render(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '1倍', value: 1 }, { label: '2倍', value: 2 }]} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(getByText('1倍')).not.toBeNull();
    rerender(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '2倍', value: 2 }]} />);
    expect(getByText('1x')).not.toBeNull();
    expect(video.playbackRate).toBe(1);
});
