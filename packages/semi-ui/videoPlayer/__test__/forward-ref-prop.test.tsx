import React from 'react';
import { cleanup, render } from '@testing-library/react';
import VideoPlayer, { VideoPlayer as VideoPlayerComponent } from '../index';

afterEach(cleanup);

it('passes the native video to the documented forwardRef prop', () => {
    const forwarded = React.createRef<HTMLVideoElement>();
    const { container, unmount } = render(<VideoPlayer {...VideoPlayerComponent.defaultProps} forwardRef={forwarded} src="clip.webm" />);
    expect(forwarded.current).toBe(container.querySelector('video'));
    unmount();
    expect(forwarded.current).toBeNull();
});

it('supports callback forwardRef and releases it on unmount', () => {
    const received = [];
    const { container, unmount } = render(<VideoPlayer {...VideoPlayerComponent.defaultProps} forwardRef={node => received.push(node)} src="clip.webm" />);
    expect(received).toContain(container.querySelector('video'));
    unmount();
    expect(received[received.length - 1]).toBeNull();
});

it('preserves the standard React ref when both ref forms are supplied', () => {
    const native = React.createRef<HTMLVideoElement>();
    const forwarded = React.createRef<HTMLVideoElement>();
    const { container, unmount } = render(<VideoPlayer {...VideoPlayerComponent.defaultProps} ref={native} forwardRef={forwarded} src="clip.webm" />);
    expect(native.current).toBe(container.querySelector('video'));
    expect(forwarded.current).toBeNull();
    unmount();
    expect(native.current).toBeNull();
});
