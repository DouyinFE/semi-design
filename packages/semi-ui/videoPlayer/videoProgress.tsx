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
    movingInfo: { progress: number; offset: number; value: number } | null;
    activeIndex: number
}

interface MarkerListItem {
    start: number;
    end: number;
    title: string;
    left: string;
    width: string
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
            activeIndex: -1, // Used to determine which slider the current handle is on under the dragging state
        };

        this.sliderRef = React.createRef();
        this.handleRef = React.createRef();
        this.markersList = this.getMarkerList();
    }

    // add left and width to markers
    getMarkerList = () => {
        const { markers, max } = this.props;
        const hasMarkers = markers && markers.length > 0;
        const defaultMarker: MarkerListItem = {
            start: 0,
            end: max,
            title: '',
            left: '0px',
            width: '100%',
        };
        const newMarkers = hasMarkers ? [defaultMarker, ...markers] : [defaultMarker];
        let markersList: MarkerListItem[] = [];
        if (hasMarkers) {
            newMarkers.forEach((marker: MarkerListItem | Marker, index: number) => {
                const end = index === newMarkers.length - 1 ? max : newMarkers[index + 1].start;
                if (!(marker.start > max || end > max)) {
                    const item = {
                        left: `${(marker.start / max) * 100}%`,
                        width: `${max ? (end - marker.start) / max * 100 : 100}%`,
                        end: end,
                        start: marker.start,
                        title: marker.title
                    };
                    markersList.push(item);
                }
            });
        } else {
            markersList.push(defaultMarker);
        }
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
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    };

    handleMouseDown = (e: any) => {
        this.setState({ isDragging: true });
        this.handleMouseEvent(e, true);
        document.addEventListener('mousemove', this.handleDocumentMouseMove);
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
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
                offset: offset - rect.width / 2,
                value
            },
        });
    };

    handleSliderMouseEnter = (index: number) => {
        const { value: currentValue } = this.props;
        const currentSlider = this.markersList[index];
        if (currentSlider.start < currentValue && currentSlider.end > currentValue) {
            this.setState({ isHandleHovering: true });
        } else {
            this.setState({ isHandleHovering: false });
        }
    }

    handleSliderMouseLeave = (index: number) => {
        const { value: currentValue } = this.props;
        const currentSlider = this.markersList[index];
        if (currentSlider.start < currentValue && currentSlider.end > currentValue) {
            this.setState({ isHandleHovering: false });
        }
    }

    // Get the width of the video being played
    getPlayedWidth = (marker: MarkerListItem) => {
        const { value: currentValue } = this.props;
        const { start, end } = marker;
        if (currentValue > end) {
            return 'calc(100% - 2px)';
        } else if (currentValue < start) {
            return '0%';
        } else {
            return `${(currentValue - start) / (end - start) * 100}%`;
        }
    }

    getLoadedWidth = (marker: MarkerListItem) => {
        const { bufferedValue } = this.props;
        const { start, end } = marker;
        if (bufferedValue > end) {
            return 'calc(100% - 2px)';
        } else if (bufferedValue < start) {
            return '0%';
        } else {
            return `${(bufferedValue - start) / (end - start) * 100}%`;
        }
    }

    setActiveIndex = (currentValue: number) => {
        this.markersList.map((marker: MarkerListItem, index: number) => {
            if (currentValue < marker.end && currentValue > marker.start) {
                this.setState({ activeIndex: index, isHandleHovering: true });
            }
        });
    }

    renderTooltipContent = () => {
        const { movingInfo } = this.state;
        if (this.markersList.length > 0 && movingInfo) {
            const hoverIndex = this.markersList.findIndex((marker: MarkerListItem) => {
                return movingInfo?.value > marker.start && movingInfo?.value < marker.end;
            });
            return (
                <>
                    <div className={cls(`${cssClasses.PREFIX_PROGRESS}-tooltip-content`)}>
                        {this.markersList[hoverIndex]?.title}
                    </div>
                    <div className={cls(`${cssClasses.PREFIX_PROGRESS}-tooltip-content`)}>
                        {formatTime(movingInfo.progress * this.props.max)}
                    </div>
                </>
            );
        }
        return movingInfo && formatTime(movingInfo.progress * this.props.max);
    }

    render() {
        const { showTooltip, max, value: currentValue } = this.props;
        const { movingInfo, isHandleHovering, isDragging, activeIndex } = this.state;
        const sliderContent = (
            <div
                role="slider"
                tabIndex={0}
                aria-valuenow={currentValue as number}
                ref={this.sliderRef}
                className={cls(`${cssClasses.PREFIX_PROGRESS}`)}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseMove}
            >
                <div className={cls(`${cssClasses.PREFIX_PROGRESS}-markers`)}>
                    {
                        this.markersList.map((marker: MarkerListItem, index: number) => (
                            <div
                                key={`${marker.start}-${index}`}   
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
                className={cls(`${cssClasses.PREFIX_PROGRESS}-tooltip`)}
                content={this.renderTooltipContent()}
                style={{ 'left': movingInfo?.offset }}
            >
                {sliderContent}
            </Tooltip>
        ) : sliderContent;
    }
}