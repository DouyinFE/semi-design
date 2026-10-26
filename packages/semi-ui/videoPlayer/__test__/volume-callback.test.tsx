import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import VideoPlayer, { VideoPlayer as VideoPlayerComponent } from '../index';

afterEach(cleanup);

it('reports the output volume when muting and restoring sound', () => {
    const changes = [];
    const { container, getByRole } = render(<VideoPlayer {...VideoPlayerComponent.defaultProps} src="clip.webm" volume={70} onVolumeChange={value => changes.push(value)} />);
    const video = container.querySelector('video');
    expect(changes).toEqual([]);
    fireEvent.click(getByRole('img', { name: 'volume_2' }).closest('button'));
    expect(video.volume).toBe(0);
    fireEvent.click(getByRole('img', { name: 'mute' }).closest('button'));
    expect(video.volume).toBe(0.7);
    expect(changes).toEqual([0, 70]);
});

it('reports the selected slider volume without notifying on initialization', async () => {
    const changes = [];
    const { container, getByRole } = render(<VideoPlayer {...VideoPlayerComponent.defaultProps} src="clip.webm" volume={70} onVolumeChange={value => changes.push(value)} />);
    expect(changes).toEqual([]);
    fireEvent.mouseEnter(getByRole('img', { name: 'volume_2' }).closest('button'));
    await waitFor(() => expect(document.querySelector('.semi-videoPlayer-controls-volume .semi-audio-player-slider')).not.toBeNull());
    const slider = document.querySelector('.semi-videoPlayer-controls-volume .semi-audio-player-slider');
    slider.getBoundingClientRect = () => ({ left: 0, top: 0, bottom: 120, width: 4, height: 120 } as DOMRect);
    fireEvent.mouseDown(slider, { clientX: 2, clientY: 60 });
    fireEvent.mouseUp(slider);
    expect(container.querySelector('video').volume).toBe(0.5);
    expect(changes).toEqual([50]);
});
