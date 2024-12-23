

import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface AudioPlayerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    initAudio: () => void;
    resetAudioState: () => void;
    handleStatusClick: () => void;
    handleTimeUpdate: () => void;
    handleTrackChange: (direction: 'next' | 'prev') => void;
    getAudioRef: () => React.RefObject<HTMLAudioElement>;
    handleTimeChange: (value: number) => void;
    handleSpeedChange: (value: { label: string; value: number }) => void;
    handleSeek: (direction: number) => void;
    handleRefresh: () => void;
    handleVolumeChange: (value: number) => void
}

class AudioPlayerFoundation extends BaseFoundation<AudioPlayerAdapter> {
    constructor(adapter: AudioPlayerAdapter) {
        super({ ...AudioPlayerFoundation, ...adapter });
    }

    initAudio() {
        this._adapter.initAudio();
    }

    resetAudioState() {
        this._adapter.resetAudioState();
    }

    handleStatusClick() {
        this._adapter.handleStatusClick();
    }

    handleTimeUpdate() {
        this._adapter.handleTimeUpdate();
    }

    handleTrackChange(direction: 'next' | 'prev') {
        this._adapter.handleTrackChange(direction);
    }

    getAudioRef() {
        return this._adapter.getAudioRef();
    }

    handleTimeChange(value: number) {
        this._adapter.handleTimeChange(value);
    }

    handleSpeedChange(value: { label: string; value: number }) {
        this._adapter.handleSpeedChange(value);
    }

    handleSeek(direction: number) {
        this._adapter.handleSeek(direction);
    }

    handleRefresh() {
        this._adapter.handleRefresh();
    }

    handleVolumeChange(value: number) {
        this._adapter.handleVolumeChange(value);
    }
}

export default AudioPlayerFoundation;
