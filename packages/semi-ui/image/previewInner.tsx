/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { CSSProperties } from 'react';
import BaseComponent from '../_base/baseComponent';
import { PreviewInnerProps, PreviewInnerStates, RatioType } from './interface';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/image/constants';
import cls from 'classnames';
import { isEqual, isFunction, isUndefined } from 'lodash';
import Portal from '../_portal';
import { IconArrowLeft, IconArrowRight } from '@douyinfe/semi-icons';
import Header from './previewHeader';
import Footer from './previewFooter';
import { downloadImage, isTargetEmit } from './utils';
import PreviewImage from './previewImage';
import PreviewInnerFoundation, { PreviewInnerAdapter } from '@douyinfe/semi-foundation/image/previewInnerFoundation';
import { PreviewContext, PreviewContextProps } from './previewContext';

const prefixCls = cssClasses.PREFIX;

const NOT_CLOSE_TARGETS = ['icon', 'footer'];
const STOP_CLOSE_TARGET = ['icon', 'footer', 'header'];
let startMouseDown = { x: 0, y: 0 };

let mouseActiveTime: number = null;
let stopTiming = false;
let timer = null;
// let bodyOverflowValue = document.body.style.overflow;

export default class PreviewInner extends BaseComponent<PreviewInnerProps, PreviewInnerStates> {
    static contextType = PreviewContext;
    
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        visible: PropTypes.bool,
        src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        currentIndex: PropTypes.number,
        defaultIndex: PropTypes.number,
        defaultVisible:  PropTypes.bool,
        maskClosable:  PropTypes.bool,
        closable:  PropTypes.bool,
        zoomStep: PropTypes.number,
        infinite:  PropTypes.bool,
        showTooltip: PropTypes.bool,
        closeOnEsc: PropTypes.bool,
        prevTip: PropTypes.string,
        nextTip: PropTypes.string,
        zoomInTip:PropTypes.string,
        zoomOutTip: PropTypes.string,
        downloadTip: PropTypes.string,
        adaptiveTip:PropTypes.string,
        originTip: PropTypes.string,
        lazyLoad: PropTypes.bool,
        lazyLoadGap:  PropTypes.bool,
        animationDuration: PropTypes.number,
        viewerVisibleDelay: PropTypes.number,
        disableDownload:  PropTypes.bool,
        zIndex: PropTypes.number,
        renderHeader: PropTypes.func,
        renderPreviewMenu: PropTypes.func,
        getPopupContainer: PropTypes.func,
        onVisibleChange: PropTypes.func,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onZoomIn: PropTypes.func,
        onZoomOut: PropTypes.func,
        onPrev: PropTypes.func,
        onNext: PropTypes.func,
        onDownload: PropTypes.func,  
        onRatioChange:  PropTypes.func,  
        onRotateChange:  PropTypes.func,  
    }

    static defaultProps = {
        showTooltip: false,
        zoomStep: 0.1,
        viewerVisibleDelay: 2000,
        infinite: false,
        closeOnEsc: true,
    };

    get adapter(): PreviewInnerAdapter<PreviewInnerProps, PreviewInnerStates> {
        return {
            ...super.adapter,
            getIsInGroup: () => this.isInGroup(),
            downloadImage: (src: string, picName: string) => {
                downloadImage(src, picName);
            },
            notifyChange: (index: number) => {
                const { onChange } = this.props;
                isFunction(onChange) && onChange(index);
            },
            notifyZoom: (zoom: number, increase: boolean ) => {
                const { onZoomIn, onZoomOut } = this.props;
                if (increase) {
                    isFunction(onZoomIn) && onZoomIn(zoom);
                } else {
                    isFunction(onZoomOut) && onZoomOut(zoom);
                }
            },
            notifyClose: () => {
                const { onClose } = this.props;
                isFunction(onClose) && onClose();
            },
            notifyVisibleChange: (visible: boolean) => {
                const { onVisibleChange } = this.props;
                isFunction(onVisibleChange) && onVisibleChange(visible);
            },
            notifyRatioChange: (type: string) => {
                const { onRatioChange } = this.props;
                isFunction(onRatioChange) && onRatioChange(type);
            },
            notifyRotateChange: (angle: number) => {
                const { onRotateChange } = this.props;
                isFunction(onRotateChange) && onRotateChange(angle);   
            },
            notifyDownload: (src: string, index: number) => {
                const { onDownload } = this.props;
                isFunction(onDownload) && onDownload(src, index);  
            },
            setOnKeyDownListener: () => {
                if (window) {
                    window.addEventListener('keydown', this.handleKeyDown);
                }
            },
            removeKeyDownListener: () => {
                if (window) {
                    window.removeEventListener('keydown', this.handleKeyDown);
                }
            },
        };
    }

    timer;
    context: PreviewContextProps;
    foundation: PreviewInnerFoundation;


    constructor(props: PreviewInnerProps) {
        super(props);
        this.state = {
            imgSrc: [],
            zoom: 0.1,
            currentIndex: 0,
            ratio: 'adaptation',
            rotation: 0,
            viewerVisible: true,
            visible: false,
        }; 
        this.foundation = new PreviewInnerFoundation(this.adapter);
    }

    static getDerivedStateFromProps(props: PreviewInnerProps, state: PreviewInnerStates) {
        const willUpdateStates: Partial<PreviewInnerStates> = {};
        let src = [];
        if (props.src) {
            // if src in props
            src = Array.isArray(props.src) ? props.src : [props.src];
        } 
        if (!isEqual(src, state.imgSrc)) {
            willUpdateStates.imgSrc = src;
        }
        if ( props.visible !== state.visible) {
            willUpdateStates.visible = props.visible;
        }
        if ( !isUndefined(props.currentIndex) && props.currentIndex !== state.currentIndex ) {
            willUpdateStates.currentIndex = props.currentIndex;
        }
        return willUpdateStates;
    }

    componentDidUpdate(prevProps: PreviewInnerProps, prevState: PreviewInnerStates) {
        if (prevState.visible !== this.props.visible && this.props.visible) {
            mouseActiveTime = new Date().getTime();
            timer && clearInterval(timer);
            timer = setInterval(this.viewChange, 1000);
        }
        // hide => show
        if (!prevProps.visible && this.props.visible) {
            this.foundation.beforeShow();
        }
        // show => hide
        if (prevProps.visible && !this.props.visible) {
            this.foundation.afterHide();
        }
    }

    componentWillUnmount() {
        timer && clearInterval(timer);
    }

    isInGroup() {
        return Boolean(this.context && this.context.isGroup);
    }

    viewChange = () => {
        const nowTime = new Date().getTime();
        if (nowTime - mouseActiveTime > this.props.viewerVisibleDelay && !stopTiming) {
            this.state.viewerVisible && this.setState({
                viewerVisible: false,
            });
        }
    }

    handleSwitchImage = (direction: string) => {
        this.foundation.handleSwitchImage(direction);
    }

    handleDownload = () => {
        this.foundation.handleDownload();
    }

    handlePreviewClose = () => {
        this.foundation.handlePreviewClose();
    }

    handleAdjustRatio = (type: string) => {
        this.foundation.handleAdjustRatio(type);
    }

    handleRotateImage = () => {
        this.foundation.handleRotateImage();
    }

    handleZoomImage = (newZoom: number) => {
        this.foundation.handleZoomImage(newZoom);
    }

    handleMouseUp = (e): void => {
        let couldClose = !isTargetEmit(e.nativeEvent, NOT_CLOSE_TARGETS);
        const { clientX, clientY } = e;
        const { x, y } = startMouseDown;
        if (clientX !== x || y !== clientY) {
            couldClose = false;
        }
        if (couldClose) {
            this.handlePreviewClose();
        }
    }

    handleMouseMove = (e): void => {
        mouseActiveTime = new Date().getTime();
        this.setState({
            viewerVisible: true,
        });
    }

    handleMouseEvent = (e, event) => {
        const isTarget = isTargetEmit(e.nativeEvent, STOP_CLOSE_TARGET);
        if (isTarget && event === 'over') {
            stopTiming = true;
        } else if (isTarget && event === 'out') {
            stopTiming = false;
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.foundation.handleKeyDown(e);
    };

    render() {
        const { 
            src,
            getPopupContainer, 
            zIndex, 
            visible, 
            className, 
            style, 
            infinite, 
            zoomStep,
            prevTip,
            nextTip,
            zoomInTip,
            zoomOutTip,
            rotateTip,
            downloadTip,
            adaptiveTip,
            originTip,
            showTooltip,
            disableDownload,
            renderPreviewMenu,
            renderHeader,
        } = this.props;
        const { currentIndex, imgSrc, zoom, ratio, rotation, viewerVisible } = this.state;
        let wrapperStyle: {
            zIndex?: CSSProperties['zIndex'];
            position?: CSSProperties['position'];
        } = {
            zIndex,
        };
        if (getPopupContainer) {
            wrapperStyle = {
                zIndex,
                position: 'static',
            };
        }
        const previewPrefixCls = `${prefixCls}-preview`;
        const previewWrapperCls = cls(previewPrefixCls, 
            {
                [`${prefixCls}-hide`]: !visible,
                [`${previewPrefixCls}-popup`]: getPopupContainer,
            },
            className,
        );
        // const hideViewerCls = !viewerVisible ? `${previewPrefixCls}-hide` : '';
        const hideViewerCls = '';
        const total = imgSrc.length;
        const showPrev = total !== 1 && (infinite || currentIndex !== 0); 
        const showNext = total !== 1 && (infinite || currentIndex !== total - 1);
        return (
            <Portal 
                getPopupContainer={getPopupContainer}
                style={wrapperStyle}
            >
                {visible && 
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div 
                    className={previewWrapperCls}
                    style={style}
                    onMouseDown={(e): void => {
                        const { clientX, clientY } = e;
                        startMouseDown = { x: clientX, y: clientY };
                    }}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onMouseOver={(e): void => this.handleMouseEvent(e, 'over')}
                    onMouseOut={(e): void => this.handleMouseEvent(e, 'out')}
                >
                    <Header className={cls(hideViewerCls)} onClose={this.handlePreviewClose} renderHeader={renderHeader}/>
                    <PreviewImage 
                        src={imgSrc[currentIndex]}
                        onZoom={this.handleZoomImage}
                        disableDownload={disableDownload}
                        setRatio={(type: RatioType): void => {
                            this.setState({
                                ratio: type,
                            });
                        }}
                        zoom={zoom}
                        ratio={ratio}
                        zoomStep={zoomStep}
                        rotation={rotation}
                    />
                    {showPrev && (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                        <div
                            className={cls(`${previewPrefixCls}-icon`, `${previewPrefixCls}-prev`, hideViewerCls)}
                            onClick={(): void => this.handleSwitchImage('prev')}
                        >
                            <IconArrowLeft size="large" />
                        </div>
                    )}
                    {showNext && (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                        <div
                            className={cls(`${previewPrefixCls}-icon`, `${previewPrefixCls}-next`, hideViewerCls)}
                            onClick={(): void => this.handleSwitchImage('next')}
                        >
                            <IconArrowRight size="large" />
                        </div>
                    )}
                    <Footer
                        className={hideViewerCls}
                        totalNum={total}
                        curPage={currentIndex + 1}
                        disabledPrev={!showPrev}
                        disabledNext={!showNext}
                        zoom={zoom * 100}
                        step={zoomStep * 100}
                        showTooltip={showTooltip}
                        ratio={ratio}
                        prevTip={prevTip}
                        nextTip={nextTip}
                        zoomInTip={zoomInTip}
                        zoomOutTip={zoomOutTip}
                        rotateTip={rotateTip}
                        downloadTip={downloadTip}
                        disableDownload={disableDownload}
                        adaptiveTip={adaptiveTip}
                        originTip={originTip}
                        onPrev={(): void => this.handleSwitchImage('prev')}
                        onNext={(): void => this.handleSwitchImage('next')}
                        onZoomIn={this.handleZoomImage}
                        onZoomOut={this.handleZoomImage}
                        onDownload={this.handleDownload}
                        onRotateLeft={this.handleRotateImage}
                        onAdjustRatio={this.handleAdjustRatio}
                        renderPreviewMenu={renderPreviewMenu}
                    />
                </div>}
            </Portal>
        );
    }
}