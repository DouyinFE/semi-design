import React, { CSSProperties } from "react";
import BaseComponent from "../_base/baseComponent";
import { PreviewProps as PreviewInnerProps, PreviewInnerStates } from "./interface";
import PropTypes from "prop-types";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import cls from "classnames";
import { isEqual, isFunction } from "lodash";
import Portal from "../_portal";
import { IconArrowLeft, IconArrowRight } from "@douyinfe/semi-icons";
import Header from "./previewHeader";
import Footer from "./previewFooter";
import PreviewImage from "./previewImage";
import PreviewInnerFoundation, { PreviewInnerAdapter, RatioType } from "@douyinfe/semi-foundation/image/previewInnerFoundation";
import { PreviewContext, PreviewContextProps } from "./previewContext";

const prefixCls = cssClasses.PREFIX;

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
        defaultCurrentIndex: PropTypes.number,
        defaultVisible: PropTypes.bool,
        maskClosable: PropTypes.bool,
        closable: PropTypes.bool,
        zoomStep: PropTypes.number,
        infinite: PropTypes.bool,
        showTooltip: PropTypes.bool,
        closeOnEsc: PropTypes.bool,
        prevTip: PropTypes.string,
        nextTip: PropTypes.string,
        zoomInTip: PropTypes.string,
        zoomOutTip: PropTypes.string,
        downloadTip: PropTypes.string,
        adaptiveTip: PropTypes.string,
        originTip: PropTypes.string,
        lazyLoad: PropTypes.bool,
        preLoad: PropTypes.bool,
        preLoadGap: PropTypes.number,
        disableDownload: PropTypes.bool,
        viewerVisibleDelay: PropTypes.number,
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
        onRatioChange: PropTypes.func,
        onRotateLeft: PropTypes.func,
    }

    static defaultProps = {
        showTooltip: false,
        zoomStep: 0.1,
        infinite: false,
        closeOnEsc: true,
        lazyLoad: false,
        preLoad: true,
        preLoadGap: 2,
        zIndex: 1000,
        maskClosable: true,
        viewerVisibleDelay: 10000,
    };

    private bodyOverflow: string;
    private scrollBarWidth: number;
    private originBodyWidth: string;

    get adapter(): PreviewInnerAdapter<PreviewInnerProps, PreviewInnerStates> {
        return {
            ...super.adapter,
            getIsInGroup: () => this.isInGroup(),
            disabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                this.bodyOverflow = document.body.style.overflow || '';
                if (!getPopupContainer && this.bodyOverflow !== 'hidden') {
                    document.body.style.overflow = 'hidden';
                    document.body.style.width = `calc(${this.originBodyWidth || '100%'} - ${this.scrollBarWidth}px)`;
                }
            },
            enabledBodyScroll: () => {
                const { getPopupContainer } = this.props;
                if (!getPopupContainer && this.bodyOverflow !== 'hidden') {
                    document.body.style.overflow = this.bodyOverflow;
                    document.body.style.width = this.originBodyWidth;
                }
            },
            notifyChange: (index: number, direction: string) => {
                const { onChange, onPrev, onNext } = this.props;
                isFunction(onChange) && onChange(index);
                if (direction === "prev") {
                    onPrev && onPrev(index);
                } else {
                    onNext && onNext(index);
                }
            },
            notifyZoom: (zoom: number, increase: boolean) => {
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
            notifyRatioChange: (type: RatioType) => {
                const { onRatioChange } = this.props;
                isFunction(onRatioChange) && onRatioChange(type);
            },
            notifyRotateChange: (angle: number) => {
                const { onRotateLeft } = this.props;
                isFunction(onRotateLeft) && onRotateLeft(angle);
            },
            notifyDownload: (src: string, index: number) => {
                const { onDownload } = this.props;
                isFunction(onDownload) && onDownload(src, index);
            },
            registerKeyDownListener: () => {
                window && window.addEventListener("keydown", this.handleKeyDown);
            },
            unregisterKeyDownListener: () => {
                window && window.removeEventListener("keydown", this.handleKeyDown);
            },
            getMouseActiveTime: () => {
                return mouseActiveTime;
            },
            getStopTiming: () => {
                return stopTiming;
            },
            setStopTiming: (value) => {
                stopTiming = value;
            },
            getStartMouseDown: () => {
                return startMouseDown;
            },
            setStartMouseDown: (x: number, y: number) => {
                startMouseDown = { x, y };
            },
            setMouseActiveTime: (time: number) => {
                mouseActiveTime = time;
            },
            getSetDownloadFunc: () => {
                return this.context?.setDownloadName ?? this.props.setDownloadName;
            }
        };

    }

    timer;
    context: PreviewContextProps;
    foundation: PreviewInnerFoundation;

    constructor(props: PreviewInnerProps) {
        super(props);
        this.state = {
            imgSrc: [],
            imgLoadStatus: new Map(),
            zoom: 0.1,
            currentIndex: 0,
            ratio: "adaptation",
            rotation: 0,
            viewerVisible: true,
            visible: false,
            preloadAfterVisibleChange: true,
            direction: "",
        };
        this.foundation = new PreviewInnerFoundation(this.adapter);
        this.bodyOverflow = '';
        this.originBodyWidth = '100%';
        this.scrollBarWidth = 0;
    }

    static getDerivedStateFromProps(props: PreviewInnerProps, state: PreviewInnerStates) {
        const willUpdateStates: Partial<PreviewInnerStates> = {};
        let src = [];
        if (props.visible) {
            // if src in props
            src = Array.isArray(props.src) ? props.src : [props.src];
        }
        if (!isEqual(src, state.imgSrc)) {
            willUpdateStates.imgSrc = src;
        }
        if (props.visible !== state.visible) {
            willUpdateStates.visible = props.visible;
            if (props.visible) {
                willUpdateStates.preloadAfterVisibleChange = true;
            }
        }
        if ("currentIndex" in props && props.currentIndex !== state.currentIndex) {
            willUpdateStates.currentIndex = props.currentIndex;
            // ratio will set to adaptation when change picture, 
            // attention: If the ratio is controlled, the ratio should not change as the index changes
            willUpdateStates.ratio = 'adaptation';
        }
        return willUpdateStates;
    }

    static getScrollbarWidth() {
        if (globalThis && Object.prototype.toString.call(globalThis) === '[object Window]') {
            return window.innerWidth - document.documentElement.clientWidth;
        }
        return 0;
    }

    componentDidMount() {
        this.scrollBarWidth = PreviewInner.getScrollbarWidth();
        this.originBodyWidth = document.body.style.width;
        if (this.props.visible) {
            this.foundation.beforeShow();
        }
    }

    componentDidUpdate(prevProps: PreviewInnerProps, prevState: PreviewInnerStates) {
        if (prevState.visible !== this.props.visible && this.props.visible) {
            mouseActiveTime = new Date().getTime();
            timer && clearInterval(timer);
            timer = setInterval(this.viewVisibleChange, 1000);
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

    viewVisibleChange = () => {
        this.foundation.handleViewVisibleChange();
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

    handleAdjustRatio = (type: RatioType) => {
        this.foundation.handleAdjustRatio(type);
    }

    handleRotateImage = (direction) => {
        this.foundation.handleRotateImage(direction);
    }

    handleZoomImage = (newZoom: number) => {
        this.foundation.handleZoomImage(newZoom);
    }

    handleMouseUp = (e): void => {
        this.foundation.handleMouseUp(e.nativeEvent);
    }

    handleMouseMove = (e): void => {
        this.foundation.handleMouseMove(e);
    }

    handleMouseEvent = (e, event: string) => {
        this.foundation.handleMouseMoveEvent(e, event);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.foundation.handleKeyDown(e);
    };

    onImageError = () => {
        this.foundation.preloadSingleImage();
    }

    onImageLoad = (src) => {
        this.foundation.onImageLoad(src);
    }

    handleMouseDown = (e): void => {
        this.foundation.handleMouseDown(e);
    }

    render() {
        const {
            getPopupContainer,
            zIndex,
            visible,
            className,
            style,
            infinite,
            zoomStep,
            crossOrigin,
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
            zIndex?: CSSProperties["zIndex"];
            position?: CSSProperties["position"]
        } = {
            zIndex,
        };

        if (getPopupContainer) {
            wrapperStyle = {
                zIndex,
                position: "static",
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
        const hideViewerCls = !viewerVisible ? `${previewPrefixCls}-hide` : "";
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
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onMouseOver={(e): void => this.handleMouseEvent(e.nativeEvent, "over")}
                    onMouseOut={(e): void => this.handleMouseEvent(e.nativeEvent, "out")}
                >
                    <Header className={cls(hideViewerCls)} onClose={this.handlePreviewClose} renderHeader={renderHeader}/>
                    <PreviewImage
                        src={imgSrc[currentIndex]}
                        onZoom={this.handleZoomImage}
                        disableDownload={disableDownload}
                        setRatio={this.handleAdjustRatio}
                        zoom={zoom}
                        ratio={ratio}
                        zoomStep={zoomStep}
                        rotation={rotation}
                        crossOrigin={crossOrigin} 
                        onError={this.onImageError}
                        onLoad={this.onImageLoad}
                    />
                    {showPrev && (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                        <div
                            className={cls(`${previewPrefixCls}-icon`, `${previewPrefixCls}-prev`, hideViewerCls)}
                            onClick={(): void => this.handleSwitchImage("prev")}
                        >
                            <IconArrowLeft size="large" />
                        </div>
                    )}
                    {showNext && (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                        <div
                            className={cls(`${previewPrefixCls}-icon`, `${previewPrefixCls}-next`, hideViewerCls)}
                            onClick={(): void => this.handleSwitchImage("next")}
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
                        onPrev={(): void => this.handleSwitchImage("prev")}
                        onNext={(): void => this.handleSwitchImage("next")}
                        onZoomIn={this.handleZoomImage}
                        onZoomOut={this.handleZoomImage}
                        onDownload={this.handleDownload}
                        onRotate={this.handleRotateImage}
                        onAdjustRatio={this.handleAdjustRatio}
                        renderPreviewMenu={renderPreviewMenu}
                    />
                </div>}
            </Portal>
        );
    }
}
