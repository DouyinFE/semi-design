import BaseComponent, { BaseProps } from '../_base/baseComponent';
import React from 'react';
import cls from 'classnames';
import '@douyinfe/semi-foundation/audioPlayer/audioPlayer.scss';
import { cssClasses } from '@douyinfe/semi-foundation/audioPlayer/constants';
import Button from '../button';
import Dropdown from '../dropdown';
import Image from '../image';
import Tooltip from '../tooltip';
import Popover from '../popover';
import { IconBackward, IconFastForward, IconMiniPlayer, IconPause, IconPlay, IconRefresh, IconRestart, IconVolume2 } from '@douyinfe/semi-icons';
import AudioSlider from './audioSlider';
import AudioPlayerFoundation from '@douyinfe/semi-foundation/audioPlayer/foundation';
import { AudioPlayerAdapter } from '@douyinfe/semi-foundation/audioPlayer/foundation';
import { formatTime } from './utils';

type AudioSrc = string
type AudioSrcArray = string[]
type AudioInfo = {
    title?: string;
    cover?: string;
    src: string
}
type AudioInfoArray = AudioInfo[]

type AudioUrl = AudioSrc | AudioSrcArray | AudioInfo | AudioInfoArray

export interface AudioPlayerProps extends BaseProps {
    audioUrl: AudioUrl;
    autoPlay: boolean;
    showToolbar?: boolean;
    skipDuration?: number;
    theme?: 'dark' | 'light';
    className?: string;
    style?: React.CSSProperties
}

export interface AudioPlayerState {
    isPlaying: boolean;
    currentIndex: number;
    totalTime: number;
    currentTime: number;
    currentRate: { label: string; value: number };
    volume: number
}


const prefixCls = cssClasses.PREFIX;
class AudioPlayer extends BaseComponent<AudioPlayerProps, AudioPlayerState> {
    audioRef = React.createRef<HTMLAudioElement>();
    static defaultProps: Partial<AudioPlayerProps> = {
        autoPlay: false,
        showToolbar: true,
        skipDuration: 10,
        theme: 'dark',
    };

    rateOptions = [
        { label: '0.5x', value: 0.5 },
        { label: '0.75x', value: 0.75 },
        { label: '1.0x', value: 1 },
        { label: '1.5x', value: 1.5 },
        { label: '2.0x', value: 2 },
    ];

    foundation!: AudioPlayerFoundation;

    constructor(props: AudioPlayerProps) {
        super(props);
        this.state = {
            isPlaying: false,
            currentIndex: 0,
            totalTime: 0,
            currentTime: 0,
            currentRate: { label: '1.0x', value: 1 },
            volume: 100,
        };
        this.audioRef = React.createRef<HTMLAudioElement>();
        this.foundation = new AudioPlayerFoundation(this.adapter);
    }

    get adapter(): AudioPlayerAdapter<AudioPlayerProps, AudioPlayerState> {
        return {
            ...super.adapter,
            initAudio: () => {
                if (this.audioRef.current) {
                    this.audioRef.current.addEventListener('loadedmetadata', () => {
                        this.setState({
                            totalTime: this.audioRef.current?.duration || 0,
                            volume: this.audioRef.current?.volume * 100 || 100,
                            currentRate: { label: '1.0x', value: this.audioRef.current?.playbackRate || 1 },
                        });
                    });
                }
            },
            handleStatusClick: () => {
                if (!this.audioRef.current) return;
                if (this.state.isPlaying) {
                    this.audioRef.current.pause();
                } else {
                    this.audioRef.current.play();
                }
                this.setState({
                    isPlaying: !this.state.isPlaying,
                });
            },
            getAudioRef: () => this.audioRef,
            resetAudioState: () => {
                this.setState({
                    isPlaying: true,
                    currentTime: 0,
                    currentRate: { label: '1.0x', value: 1 }
                }, () => {
                    if (this.audioRef.current) {
                        this.audioRef.current.currentTime = this.state.currentTime;
                        this.audioRef.current.playbackRate = this.state.currentRate.value;
                        this.audioRef.current.play();
                    }
                });
            },
            handleTimeUpdate: () => {
                if (!this.audioRef.current) return;
                this.setState({
                    currentTime: this.audioRef.current.currentTime,
                });
            },
            handleTrackChange: (direction: 'next' | 'prev') => {
                if (!this.audioRef.current) return;
                const { audioUrl } = this.props as AudioPlayerProps;
                const isAudioUrlArray = Array.isArray(audioUrl);
                if (isAudioUrlArray) {
                    if (direction === 'next') {
                        this.setState({
                            currentIndex: (this.state.currentIndex + 1) % audioUrl.length,
                        });
                    } else {
                        this.setState({
                            currentIndex: (this.state.currentIndex - 1 + audioUrl.length) % audioUrl.length,
                        });
                    }
                }
                this.foundation.resetAudioState();
            },
            handleTimeChange: (value: number) => {
                if (!this.audioRef.current) return;
                this.audioRef.current.currentTime = value;
                this.setState({
                    currentTime: value,
                });
            },
            handleRefresh: () => {
                if (!this.audioRef.current) return;
                this.audioRef.current.currentTime = 0;
                this.setState({
                    currentTime: 0,
                });
            },
            handleSpeedChange: (value: { label: string; value: number }) => {
                if (!this.audioRef.current) return;
                this.audioRef.current.playbackRate = value.value;
                this.setState({
                    currentRate: value,
                });
            },
            handleSeek: (direction: number) => {
                if (!this.audioRef.current) return;
                const { skipDuration = 10 } = this.props;
                const newTime = Math.min(
                    Math.max(this.audioRef.current.currentTime + (direction * skipDuration), 0),
                    this.audioRef.current.duration
                );
                this.audioRef.current.currentTime = newTime;
            },
            handleVolumeChange: (value: number) => {
                if (!this.audioRef.current) return;
                const volume = Math.round(value);
                this.audioRef.current.volume = volume / 100;
                this.setState({
                    volume: volume,
                });
            },
        };
    }

    handleStatusClick = () => {
        this.foundation.handleStatusClick();
    }

    handleTrackChange = (direction: 'next' | 'prev') => {
        this.foundation.handleTrackChange(direction);
    }

    handleTimeChange = (value: number) => {
        this.foundation.handleTimeChange(value);
    }

    handleRefresh = () => {
        this.foundation.handleRefresh();
    }

    handleSpeedChange = (value: { label: string; value: number }) => {
        this.foundation.handleSpeedChange(value);
    }

    handleSeek = (direction: number) => {
        this.foundation.handleSeek(direction);
    }

    handleTimeUpdate = () => {
        this.foundation.handleTimeUpdate();
    }

    handleVolumeChange = (value: number) => {
        this.foundation.handleVolumeChange(value);
    }


    componentDidMount() {
        this.foundation.initAudio();
    }

    getAudioInfo = (audioUrl: AudioUrl) => {
        const isAudioUrlArray = Array.isArray(audioUrl);
        if (isAudioUrlArray) {
            const audioInfo = audioUrl[this.state.currentIndex];
            if (typeof audioInfo === 'string') {
                return { src: audioInfo, audioTitle: null, audioCover: null };
            } else {
                return { src: audioInfo.src, audioTitle: audioInfo.title, audioCover: audioInfo.cover };
            }
        } else if (typeof audioUrl === 'string') {
            return { src: audioUrl, audioTitle: null, audioCover: null };
        } else {
            return { src: audioUrl.src, audioTitle: audioUrl.title, audioCover: audioUrl.cover };
        }
    }

    render() {
        const { audioUrl, autoPlay, className, style, showToolbar = true, skipDuration = 10, theme = 'dark' } = this.props as AudioPlayerProps;
        const { currentTime, totalTime, volume } = this.state;
        const isAudioUrlArray = Array.isArray(audioUrl);
        const { src, audioTitle, audioCover } = this.getAudioInfo(audioUrl);
        const iconClass = cls(`${prefixCls}-control-button-icon`);
        const circleStyle = {
            borderRadius: '50%',
        };
        const transparentStyle = {
            background: 'transparent',
        };
        return (
            <div className={cls(prefixCls, className, `${prefixCls}-${theme}`)} style={style}>
                <audio src={src} autoPlay={autoPlay} className={cls(prefixCls, className)} style={style} ref={this.audioRef} onTimeUpdate={this.handleTimeUpdate}>
                    <track kind="captions" src={src} />
                </audio>
                <div className={cls(`${prefixCls}-control`)}>
                    {isAudioUrlArray && <Tooltip content='Previous' autoAdjustOverflow showArrow={false}>
                        <Button style={{ ...circleStyle, ...transparentStyle }} size='large' icon={<IconRestart size='large' className={iconClass} />} onClick={() => this.handleTrackChange('prev')} />
                    </Tooltip>}
                    <Button style={circleStyle} size='large' onClick={this.handleStatusClick} icon={this.state.isPlaying ? <IconPause size='large' /> : <IconPlay size='large' />} className={cls(`${cssClasses.PREFIX}-control-button-play`)} />
                    {isAudioUrlArray && <Tooltip content='Next' autoAdjustOverflow showArrow={false}>
                        <Button style={{ ...circleStyle, ...transparentStyle }} size='large' icon={<IconRestart size='large' rotate={180} className={iconClass} />} onClick={() => this.handleTrackChange('next')} />
                    </Tooltip>}
                </div>
                <div className={cls(`${prefixCls}-info-cover`)}>
                    {audioCover && <Image src={audioCover} width={50} height={50} />}
                    <div className={cls(`${prefixCls}-info`)}>
                        {audioTitle && <div className={cls(`${prefixCls}-info-title`)}>{audioTitle}</div>}
                        <div className={cls(`${prefixCls}-info-time`)}>
                            <span>{formatTime(currentTime)}</span>
                            <div className={cls(`${prefixCls}-slider-container`)}>
                                <AudioSlider value={currentTime} max={totalTime} onChange={this.handleTimeChange} />
                            </div>
                            <span>{formatTime(totalTime)}</span>
                        </div>
                    </div>
                </div>
                {showToolbar && <div className={cls(`${prefixCls}-control`)}>
                    <Popover content={
                        <div className={cls(`${prefixCls}-control-volume`)}>
                            <div className={cls(`${prefixCls}-control-volume-title`)}>{volume}%</div>
                            <AudioSlider value={volume} max={100} vertical height={120} showTooltip={false} onChange={this.handleVolumeChange} />
                        </div>
                    }>
                        <Button style={transparentStyle} icon={<IconVolume2 className={iconClass} />} />
                    </Popover>
                    <Tooltip content={`Backward ${skipDuration}s`} autoAdjustOverflow showArrow={false}>
                        <Button
                            style={transparentStyle}
                            icon={<IconBackward className={iconClass} />}
                            onClick={() => this.handleSeek(-1)}
                        />
                    </Tooltip>
                    <Tooltip content={`Forward ${skipDuration}s`} autoAdjustOverflow showArrow={false}>
                        <Button
                            style={transparentStyle}
                            icon={<IconFastForward className={iconClass} />}
                            onClick={() => this.handleSeek(1)}
                        />
                    </Tooltip>
                    <Dropdown render={<Dropdown.Menu className={cls(`${prefixCls}-control-speed-menu`)}>
                        {this.rateOptions.map((option) => (
                            <Dropdown.Item className={cls(`${prefixCls}-control-speed-menu-item`)} key={option.value} onClick={() => this.handleSpeedChange(option)} active={option.value === this.state.currentRate.value}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>} onChange={this.handleSpeedChange}>
                        <div className={cls(`${prefixCls}-control-speed`)}>
                            <span>{this.state.currentRate.label}</span>
                        </div>
                    </Dropdown>
                    <Button style={transparentStyle} icon={<IconRefresh style={{ transform: 'rotateY(180deg)' }} className={iconClass} onClick={() => this.handleRefresh()} />} />
                    <Button style={transparentStyle} icon={<IconMiniPlayer className={iconClass} />} />
                </div>}
            </div>
        );
    }
}

export default AudioPlayer;