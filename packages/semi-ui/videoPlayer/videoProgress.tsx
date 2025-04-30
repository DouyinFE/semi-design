import React from 'react';
import cls from 'classnames';
import '@douyinfe/semi-foundation/videoPlayer/videoPlayer.scss';
import { cssClasses } from '@douyinfe/semi-foundation/videoPlayer/constants';
import Tooltip from '../tooltip';
import { noop } from 'lodash';
import { Marker } from './index';
import { formatTime } from './utils';

interface VideoProgressProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    max: number;
    showTooltip?: boolean;
    markers?: Marker[];
    bufferedValue: number
}

interface VideoProgressState {
    isDragging: boolean;
    isHandleHovering: boolean;
    movingInfo: { progress: number; offset: number } | null;
    activeIndex: number
}

interface MarkerListItem {
    time: number;
    title: string;
    left: string;
    width: string;
    endTime: number
}

export default class VideoProgress extends React.Component<VideoProgressProps, VideoProgressState> {
    static defaultProps = {
        value: 0,
        onChange: noop,
        max: 100,
        showTooltip: true,
    };

    private sliderRef: React.RefObject<HTMLDivElement>;
    private handleRef: React.RefObject<HTMLDivElement>;
    private markersList: MarkerListItem[];

    constructor(props: VideoProgressProps) {
        super(props);
        this.state = {
            isDragging: false,
            isHandleHovering: false,
            movingInfo: null,
            activeIndex: -1 // Used to determine which slider the current handle is on under the dragging state
        };

        this.sliderRef = React.createRef();
        this.handleRef = React.createRef();
        this.markersList = this.getMarkerList();
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleDocumentMouseMove);
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    }

    // add left and width to markers
    getMarkerList = () => {
        const { markers, max } = this.props;
        const hasMarkers = markers && markers.length > 0;
        const defaultMarker: MarkerListItem = {
            time: 0,
            title: '',
            left: '0px',
            width: '100%',
            endTime: max
        };
        const newMarkers = hasMarkers ? [defaultMarker, ...markers] : [defaultMarker];
        const markersList: MarkerListItem[] = hasMarkers ? newMarkers.map((marker: MarkerListItem | Marker, index: number) => {
            const endTime = index === newMarkers.length - 1 ? max : newMarkers[index + 1].time;
            if (!(marker.time > max || endTime > max)) {
                return {};
            }
            return {
                left: `${(marker.time / max) * 100}%`,
                width: `${max ? (endTime - marker.time) / max * 100 : 100}%`,
                endTime: endTime
            };
        }) : [defaultMarker];
        return markersList;
    }

    handleDocumentMouseMove = (e: MouseEvent) => {
        if (this.state.isDragging) {
            this.handleMouseEvent(e, true);
        }
    };

    handleDocumentMouseUp = () => {
        if (this.state.isDragging) {
            this.setState({ isDragging: false });
        }
    };

    handleMouseDown = (e: any) => {
        this.setState({ isDragging: true });
        this.handleMouseEvent(e, true);
    };

    handleMouseUp = () => {
        if (this.state.isDragging) {
            this.setState({ isDragging: false });
        }
    };

    handleMouseEnter = (e: any) => {
        this.handleMouseEvent(e, false);
    }

    handleMouseMove = (e: any) => {
        this.handleMouseEvent(e, true);
    }

    handleMouseEvent = (e: any, shouldSetValue: boolean = true) => {
        if (!this.sliderRef.current) return;
        const rect = this.sliderRef.current.getBoundingClientRect();
        const offset = (e.clientX - rect.left);
        const total = rect.width;
        const percentage = Math.min(Math.max(offset / total, 0), 1);
        const value = percentage * this.props.max;
        
        if (shouldSetValue && (this.state.isDragging || e.type === 'mousedown')) {
            this.setActiveIndex(value);
            this.props.onChange(value);
        }

        this.setState({
            movingInfo: {
                progress: percentage,
                offset: offset - rect.width / 2
            },
        });
    };

    handleSliderMouseEnter = (index: number) => {
        const { value: currentValue } = this.props;
        const currentSlider = this.markersList[index];
        if (currentSlider.time < currentValue && currentSlider.endTime > currentValue) {
            this.setState({ isHandleHovering: true });
        } else {
            this.setState({ isHandleHovering: false });
        }
    }

    handleSliderMouseLeave = (index: number) => {
        const { value: currentValue } = this.props;
        const currentSlider = this.markersList[index];
        if (currentSlider.time < currentValue && currentSlider.endTime > currentValue) {
            this.setState({ isHandleHovering: false });
        }
    }

    // Get the width of the video being played
    getPlayedWidth = (marker: MarkerListItem) => {
        const { value: currentValue } = this.props;
        const { time, endTime } = marker;
        if (currentValue > endTime) {
            return 'calc(100% - 2px)';
        } else if (currentValue < time) {
            return '0%';
        } else {
            return `${(currentValue - time) / (endTime - time) * 100}%`;
        }
    }

    getLoadedWidth = (marker: MarkerListItem) => {
        const { bufferedValue } = this.props;
        const { time, endTime } = marker;
        if (bufferedValue > endTime) {
            return 'calc(100% - 2px)';
        } else if (bufferedValue < time) {
            return '0%';
        } else {
            return `${(bufferedValue - time) / (endTime - time) * 100}%`;
        }
    }

    setActiveIndex = (currentValue: number) => {
        this.markersList.map((marker: MarkerListItem, index: number) => {
            if (currentValue < marker.endTime && currentValue > marker.time) {
                this.setState({ activeIndex: index, isHandleHovering: true });
            }
        });
    }

    render() {
        const { showTooltip, max, value: currentValue, bufferedValue } = this.props;
        const { movingInfo, isHandleHovering, isDragging, activeIndex } = this.state;
        const sliderContent = (
            <div
                role="slider"
                tabIndex={0}
                aria-valuenow={currentValue as number}
                ref={this.sliderRef}
                className={cls(`${cssClasses.PREFIX_PROGRESS}-wrapper`)}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseMove}
            >
                <div className={cls(`${cssClasses.PREFIX_PROGRESS}-markers`)}>
                    {
                        this.markersList.map((marker: MarkerListItem, index: number) => (
                            <div
                                key={marker.time}
                                className={cls(`${cssClasses.PREFIX_PROGRESS}-slider`,
                                    { [`${cssClasses.PREFIX_PROGRESS}-slider-active`]: index === activeIndex && isDragging }
                                )}
                                style={{ left: marker.left, width: marker.width }}
                                onMouseEnter={() => this.handleSliderMouseEnter(index)}
                                onMouseLeave={() => this.handleSliderMouseLeave(index)}
                            >
                                <div className={cls(`${cssClasses.PREFIX_PROGRESS}-slider-list`)} />
                                <div
                                    className={cls(`${cssClasses.PREFIX_PROGRESS}-slider-buffered`)}
                                    style={{ width: this.getLoadedWidth(marker) }}
                                />
                                <div
                                    className={cls(`${cssClasses.PREFIX_PROGRESS}-slider-played`)}
                                    style={{ width: this.getPlayedWidth(marker) }}
                                />
                            </div>
                        ))
                    }
                </div>
                <div
                    ref={this.handleRef}
                    className={cls(`${cssClasses.PREFIX_PROGRESS}-handle`)}
                    style={{
                        left: `calc(${((max ? (currentValue || 1) / max : 0) * 100)}% - 8px)`,
                        top: 2,
                        transform: 'translateY(-50%)',
                        opacity: (isHandleHovering || isDragging) ? 1 : 0,
                        transition: 'opacity 0.3s',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        );

        return showTooltip ? (
            <Tooltip
                position={'top'}
                content={movingInfo && formatTime(movingInfo.progress * max)}
                // spacing={-5}
                style={{ 'left': movingInfo?.offset }}
            >
                {sliderContent}
            </Tooltip>
        ) : sliderContent;
    }
}