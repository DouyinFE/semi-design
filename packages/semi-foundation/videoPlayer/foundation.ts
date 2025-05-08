import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { numbers } from './constants';
import { throttle } from 'lodash';

export interface VideoPlayerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getVideo: () => HTMLVideoElement | null;
    getVideoWrapper: () => HTMLDivElement | null;
    notifyPause: () => void;
    notifyPlay: () => void;
    notifyQualityChange: (quality: string) => void;
    notifyRateChange: (rate: number) => void;
    notifyRouteChange: (route: string) => void;
    notifyVolumeChange: (volume: number) => void;
    setBufferedValue: (bufferedValue: number) => void;
    setCurrentTime: (currentTime: number) => void;
    setIsError: (isError: boolean) => void;
    setIsMirror: (isMirror: boolean) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setMuted: (muted: boolean) => void;
    setNotificationContent: (content: string) => void;
    setPlaybackRate: (rate: number) => void;
    setQuality: (quality: string) => void;
    setRoute: (route: string) => void;
    setShowControls: (showControls: boolean) => void;
    setShowNotification: (showNotification: boolean) => void;
    setTotalTime: (totalTime: number) => void;
    setVolume: (volume: number) => void
}

export default class VideoPlayerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<VideoPlayerAdapter<P, S>, P, S> {
    constructor(adapter: VideoPlayerAdapter<P, S>) {
        super({ ...adapter });
    }

    private controlsTimer: NodeJS.Timeout | null;

    init() {
        const { volume, muted } = this.getProps();
        const video = this._adapter.getVideo();
        if (video) {
            this._adapter.setTotalTime(video.duration);
            this.handleVolumeChange(muted ? 0 : volume);
        }
        this.registerEvent();
    }

    destroy() {
        this.unregisterEvent();
        this.clearTimer();
    }

    shouldShowControlItem(name: string) {
        const { controlsList } = this.getProps();
        if (controlsList.includes(name)) {
            return true;
        }
        return false;
    }

    clearTimer() {
        if (this.controlsTimer) {
            clearTimeout(this.controlsTimer);
        }
    }

    handleMouseMove = throttle(() => {
        this._adapter.setShowControls(true);
        this.clearTimer();
        this.controlsTimer = setTimeout(() => {
            this._adapter.setShowControls(false);
        }, 3000);
    }, 200);


    handleTimeChange(value: number) {
        const video = this._adapter.getVideo();
        if (!video) return;
        video.currentTime = value;
        this._adapter.setCurrentTime(value);
    }

    handleTimeUpdate() {
        const video = this._adapter.getVideo();
        if (!video) return;
        this._adapter.setCurrentTime(video.currentTime);
    }

    handleDurationChange() {
        const video = this._adapter.getVideo();
        if (!video) return;
        this._adapter.setTotalTime(video.duration);
    }

    handleError() {
        this._adapter.setIsError(true);
    }

    handlePlayOrPause() {
        const video = this._adapter.getVideo();
        if (!video) return;
        video.paused ? this.handlePlay() : this.handlePause();
    }

    handlePlay() {
        const video = this._adapter.getVideo();
        if (video) {
            video.play();
            this._adapter.setIsPlaying(true);
            this._adapter.notifyPlay();
        }
    }

    handlePause() {
        const video = this._adapter.getVideo();
        if (video) {
            video.pause();
            this._adapter.setIsPlaying(false);
            this._adapter.notifyPause();
        }
    }

    handleCanPlay = () => {
        this._adapter.setShowNotification(false);
    }

    handleWaiting = () => {
        this._adapter.setNotificationContent('loading...');
        this._adapter.setShowNotification(true);
    }

    handleStalled = () => {
        this._adapter.setNotificationContent('loading failed');
        this._adapter.setShowNotification(true);
    }

    handleProgress = () => {
        const video = this._adapter.getVideo();
        if (video && video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            this._adapter.setBufferedValue(bufferedEnd);
        }
    }

    handleVolumeChange(value: number) {
        const video = this._adapter.getVideo();
        if (!video) return;
        const volume = Math.floor(value);
        video.volume = volume / 100;
        this._adapter.setVolume(volume);
        this._adapter.setMuted(volume === 0 ? true : false);
    }

    handleVolumeSilent = () => {
        const video = this._adapter.getVideo();
        const { volume, muted } = this.getStates();
        if (!video) return;
        if (muted) {
            video.volume = volume / 100;
            this._adapter.setVolume(volume);
            this._adapter.setMuted(false);
        } else {
            video.volume = 0;
            this._adapter.setMuted(true);
        }
    }

    checkFullScreen() {
        const videoWrapper = this._adapter.getVideoWrapper();
        if (!videoWrapper) return false;
        return !!(
            document.fullscreenElement === videoWrapper ||
            // @ts-ignore
            document?.webkitFullscreenElement === videoWrapper ||
            // @ts-ignore
            document?.mozFullScreenElement === videoWrapper ||
            // @ts-ignore
            document?.msFullscreenElement === videoWrapper ||
            // @ts-ignore
            videoWrapper?.webkitDisplayingFullscreen  // iOS Safari 特殊处理
        );
    }

    handleFullscreen = () => {
        const videoWrapper = this._adapter.getVideoWrapper();
        const isFullScreen = this.checkFullScreen();
        if (videoWrapper) {
            isFullScreen ? document.exitFullscreen() : videoWrapper.requestFullscreen();
        }
    }

    handleRateChange(rate: { label: string; value: number }) {
        const video = this._adapter.getVideo();
        if (!video) return;
        video.playbackRate = rate.value;
        this._adapter.setPlaybackRate(rate.value);
        this._adapter.notifyRateChange(rate.value);
        this.handleTemporaryNotification(`Switching Rate to ${rate.label}`);
    }

    handleQualityChange(quality: { label: string; value: string }) {
        this._adapter.setQuality(quality.value);
        this._adapter.notifyQualityChange(quality.value);
        this.handleTemporaryNotification(`Switching to ${quality.label}`);
        this.restorePlayPosition();
    }

    handleRouteChange(route: { label: string; value: string }) {
        this._adapter.setRoute(route.value);
        this._adapter.notifyRouteChange?.(route.value);
        this.handleTemporaryNotification(`Switching to ${route.label}`);
        this.restorePlayPosition();
    }

    handleMirror = () => {
        const { isMirror } = this.getStates();
        this._adapter.setIsMirror(!isMirror);
        this.handleTemporaryNotification(!isMirror ? `Video mirrored` : `Video mirrored cancelled`);
    }

    handlePictureInPicture = () => {
        const video = this._adapter.getVideo();
        if (!video) return;
        video.requestPictureInPicture();
    }

    handleLeavePictureInPicture = () => {
        const video = this._adapter.getVideo();
        if (!video) return;
        this._adapter.setIsPlaying(!video.paused);
    };

    handleTemporaryNotification = (content: string) => {
        this._adapter.setNotificationContent(content);
        this._adapter.setShowNotification(true);
        setTimeout(() => {
            this._adapter.setShowNotification(false);
        }, 1000);
    }

    restorePlayPosition() {
        const video = this._adapter.getVideo();
        if (!video) return;
        const wasPlaying = !video.paused;
        const currentTime = video.currentTime;

        const handleLoaded = () => {
            video.currentTime = currentTime;
            if (wasPlaying) {
                video.play();
            }
            video.removeEventListener('loadeddata', handleLoaded);
        };
        video.addEventListener('loadeddata', handleLoaded);
    }

    handleMouseEnterWrapper = () => {
        this._adapter.setShowControls(true);
    }

    handleMouseLeaveWrapper = () => {
        const { isPlaying } = this.getStates();
        if (isPlaying) {
            this._adapter.setShowControls(false);
        }
    }

    handleFullscreenChange = () => {
        const isFullScreen = this.checkFullScreen();
        if (isFullScreen) {
            document.addEventListener('mousemove', this.handleMouseMove);
        } else {
            document.removeEventListener('mousemove', this.handleMouseMove);
        }
    }

    registerEvent = () => {
        const video = this._adapter.getVideo();
        if (!video) return;
        document.addEventListener('keydown', (e) => this.handleBodyKeyDown(e));
        document.addEventListener('fullscreenchange', this.handleFullscreenChange);
        video.addEventListener('leavepictureinpicture', this.handleLeavePictureInPicture);
    }

    unregisterEvent = () => {
        const video = this._adapter.getVideo();
        if (!video) return;
        document.removeEventListener('keydown', (e) => this.handleBodyKeyDown(e));
        document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
        video.removeEventListener('leavepictureinpicture', this.handleLeavePictureInPicture);
    }

    handleBodyKeyDown(e: KeyboardEvent) {
        const { currentTime, volume } = this.getStates();
        const { seekTime } = this.getProps();
        if (e.key === ' ') {
            this.handlePlayOrPause();
        } else if (e.key === 'ArrowUp') {
            this.handleVolumeChange(volume + numbers.DEFAULT_VOLUME_STEP);
        } else if (e.key === 'ArrowDown') { 
            this.handleVolumeChange(volume - numbers.DEFAULT_VOLUME_STEP);   
        } else if (e.key === 'ArrowLeft') {
            this.handleTimeChange(currentTime - seekTime);
        } else if (e.key === 'ArrowRight') {
            this.handleTimeChange(currentTime + seekTime);
        }
    }
} 