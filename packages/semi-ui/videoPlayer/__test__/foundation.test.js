import VideoPlayerFoundation from '@douyinfe/semi-foundation/videoPlayer/foundation';

describe('VideoPlayer keyboard listener cleanup', () => {
    it.each([false, true])('stops keyboard updates after destroy, cleared video ref: %s', clearVideoRef => {
        let video = document.createElement('video');
        const notifyTime = sinon.spy();
        const foundation = new VideoPlayerFoundation({
            getVideo: () => video,
            getVideoWrapper: () => document.body,
            getProps: () => ({ seekTime: 5 }),
            getStates: () => ({ currentTime: 10, volume: 1 }),
            setCurrentTime: notifyTime,
        });
        const addListener = sinon.spy(document, 'addEventListener');
        const handleKey = sinon.spy(foundation, 'handleBodyKeyDown');
        foundation.registerEvent();
        const keydown = addListener.getCalls().find(call => call.args[0] === 'keydown').args[1];
        try {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            expect(notifyTime.calledOnceWithExactly(15)).toBe(true);
            if (clearVideoRef) video = null;
            foundation.destroy();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            expect(handleKey.callCount).toBe(1);
            expect(notifyTime.callCount).toBe(1);
        } finally {
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('fullscreenchange', foundation.handleFullscreenChange);
            addListener.restore();
            handleKey.restore();
        }
    });
});
