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

it('keeps the composed callback ref stable across renders and returns the cleanup', () => {
    const cleanup = jest.fn();
    const forwardRef = jest.fn(() => cleanup);
    const instance = React.createRef<VideoPlayerComponent>();
    render(<VideoPlayerComponent {...VideoPlayerComponent.defaultProps} ref={instance} forwardRef={forwardRef} src="clip.webm" />);
    const composed = instance.current.getVideoRef() as (node: HTMLVideoElement | null) => () => void;
    expect(instance.current.getVideoRef()).toBe(composed);

    // React 16 never calls the returned cleanup, so invoke the composed ref the way React 19 does.
    const node = document.createElement('video');
    const returned = composed(node);
    expect(instance.current.adapter.getVideo()).toBe(node);
    expect(typeof returned).toBe('function');
    returned();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(instance.current.adapter.getVideo()).toBeNull();
});

it('returns nothing from the composed ref when the callback has no cleanup', () => {
    const instance = React.createRef<VideoPlayerComponent>();
    render(<VideoPlayerComponent {...VideoPlayerComponent.defaultProps} ref={instance} forwardRef={() => {}} src="clip.webm" />);
    const composed = instance.current.getVideoRef() as (node: HTMLVideoElement | null) => unknown;
    expect(composed(document.createElement('video'))).toBeUndefined();
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
