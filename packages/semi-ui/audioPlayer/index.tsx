import { BaseProps } from '_base/baseComponent';
import React from 'react';
import cls from 'classnames';
import '@douyinfe/semi-foundation/audioPlayer/audioPlayer.scss';
import { cssClasses } from '@douyinfe/semi-foundation/audioPlayer/constants';
import Button from '../button';
import Image from '../image';
import { IconBackward, IconFastForward, IconMusic, IconPause, IconPlay, IconRefresh, IconRestart, IconVolume2 } from '@douyinfe/semi-icons';
export interface AudioPlayerProps extends BaseProps {
    audioUrl: string | string[];
    autoPlay: boolean;
    audioCover?: string;
    audioTitle?: string;
    className?: string;
    style?: React.CSSProperties
}

export interface AudioPlayerState {
    isPlaying: boolean;
    currentIndex: number;
    totalTime: number;
    currentTime: number
}


const prefixCls = cssClasses.PREFIX;
class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {
    audioRef = React.createRef<HTMLAudioElement>();
    static defaultProps: Partial<AudioPlayerProps> = {
        autoPlay: false,
    };

    constructor(props: AudioPlayerProps) {
        super(props);
        this.state = {
            isPlaying: false,
            currentIndex: 0,
            totalTime: 0,
            currentTime: 0,
        };
        this.audioRef = React.createRef<HTMLAudioElement>();
    }

    handleClick = () => {
        if (!this.audioRef.current) return;
        if (this.state.isPlaying) {
            this.audioRef.current.pause();
        } else {
            this.audioRef.current.play();
        }
        this.setState({
            isPlaying: !this.state.isPlaying,
        });
    }

    componentDidMount() {
        console.log(this.audioRef.current?.duration);
    }

    render() {
        const { audioUrl, autoPlay, className, style, audioTitle, audioCover } = this.props as AudioPlayerProps;
        const { currentIndex } = this.state;
        const isAudioUrlArray = Array.isArray(audioUrl);
        const src = isAudioUrlArray ? audioUrl[currentIndex] : audioUrl;
        const iconClass = cls(`${prefixCls}-control-button-icon`);
        return (
            <div className={cls(prefixCls, className)} style={style}>
                <audio src={src} autoPlay={autoPlay} className={cls(prefixCls, className)} style={style} ref={this.audioRef}>
                    <track kind="captions" src={src} />
                </audio>
                <div className={cls(`${prefixCls}-control`)}>
                    {isAudioUrlArray && <Button icon={<IconRestart size='large' className={iconClass} />} className={cls(`${prefixCls}-control-button`)} />}
                    <Button onClick={this.handleClick} icon={this.state.isPlaying ? <IconPause size='large' /> : <IconPlay size='large' />} className={cls(`${cssClasses.PREFIX}-control-button`, `${cssClasses.PREFIX}-control-button-play`)} />
                    {isAudioUrlArray && <Button icon={<IconRestart size='large' rotate={180} className={iconClass} />} className={cls(`${cssClasses.PREFIX}-control-button`)} />}
                </div>
                <div className={cls(`${prefixCls}-info-cover`)}>
                    {audioCover && <Image src={audioCover} width={50} height={50} />}
                    <div className={cls(`${prefixCls}-info`)}>
                        {audioTitle && <div className={cls(`${prefixCls}-info-title`)}>{audioTitle}</div>}
                        <div className={cls(`${prefixCls}-info-time`)}>
                            <span>00:50</span>
                            <div style={{ width: 323, height: 4, background: '#3295FB', borderRadius: 9999 }}></div>
                            <span>01:40</span>
                        </div>
                    </div>
                </div>
                <div className={cls(`${prefixCls}-control`)}>
                    <Button icon={<IconVolume2 className={iconClass} />} />
                    <Button icon={<IconBackward className={iconClass} />} />
                    <Button icon={<IconFastForward className={iconClass} />} />
                    <div className={cls(`${prefixCls}-control-speed`)}>
                        <span>1.0x</span>
                    </div>
                    <Button icon={<IconRefresh style={{ transform: 'rotateY(180deg)' }} className={iconClass} />} />
                    <Button icon={<IconMusic className={iconClass} />} />
                </div>
            </div>
        );
    }
}

export default AudioPlayer;