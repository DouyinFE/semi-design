import React from "react";
import BaseComponent from "../_base/baseComponent";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import { PreviewImageProps, PreviewImageStates } from "./interface";
import PropTypes from "prop-types";
import Spin from "../spin";
import PreviewImageFoundation, { PreviewImageAdapter } from "@douyinfe/semi-foundation/image/previewImageFoundation";

const prefixCls = cssClasses.PREFIX;
const preViewImgPrefixCls = `${prefixCls}-preview-image`;
let originImageWidth = null;
let originImageHeight = null;
let startMouseMove = false;
// startMouseOffset：The offset of the mouse relative to the left and top of the picture
let startMouseOffset = { x: 0, y: 0 };

export default class PreviewImage extends BaseComponent<PreviewImageProps, PreviewImageStates> {
    static propTypes = {
        src: PropTypes.string,
        rotation: PropTypes.number,
        style: PropTypes.object,
        maxZoom: PropTypes.number,
        minZoom: PropTypes.number,
        zoomStep: PropTypes.number,
        zoom: PropTypes.number,
        ratio: PropTypes.string,
        disableDownload: PropTypes.bool,
        clickZoom: PropTypes.number,
        setRatio: PropTypes.func,
        onZoom: PropTypes.func,
        onLoad: PropTypes.func,
        onError: PropTypes.func,
    }

    static defaultProps = {
        maxZoom: 5,
        minZoom: 0.1,
        zoomStep: 0.1,
        zoom: undefined,
    };

    get adapter(): PreviewImageAdapter<PreviewImageProps, PreviewImageStates> {
        return {
            ...super.adapter,
            getOriginImageSize: () => ({ originImageWidth, originImageHeight }),
            setOriginImageSize: (size: { originImageWidth: number; originImageHeight: number }) => {
                originImageWidth = size.originImageWidth;
                originImageHeight = size.originImageHeight;
            },
            getContainer: () => {
                return this.containerRef.current;
            },
            getImage: () => {
                return this.imageRef;
            },
            getMouseMove: () => startMouseMove,
            setStartMouseMove: (move: boolean) => { startMouseMove = move; },
            getMouseOffset: () => startMouseOffset,
            setStartMouseOffset: (offset: { x: number; y: number }) => { startMouseOffset = offset; },
            setLoading: (loading: boolean) => { 
                this.setState({
                    loading,
                });
            },
            setImageCursor: (canDrag: boolean) => {
                this.imageRef.style.cursor = canDrag ? "grab" : "default";
            }
        };
    }

    containerRef: React.RefObject<HTMLDivElement>;
    imageRef: HTMLImageElement | null;
    foundation: PreviewImageFoundation;

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            loading: true,
            offset: { x: 0, y: 0 },
            currZoom: 0,
            top: 0,
            left: 0,
        };
        this.containerRef = React.createRef<HTMLDivElement>();
        this.imageRef = null;
        this.foundation = new PreviewImageFoundation(this.adapter);
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    componentDidUpdate(prevProps: PreviewImageProps, prevStates: PreviewImageStates) {
        // If src changes, start a new loading
        if (this.props.src && this.props.src !== prevProps.src) {
            this.foundation.setLoading(true);
        } 
        // If the incoming zoom changes, other content changes are determined based on the new zoom value
        if ("zoom" in this.props && this.props.zoom !== prevStates.currZoom) {
            this.handleZoomChange(this.props.zoom, null);
        }
        // When the incoming ratio is changed, if it"s adaptation, then resizeImage is triggered to make the image adapt to the page
        // else if it"s adaptation is realSize, then onZoom(1) is called to make the image size the original size;
        if ("ratio" in this.props && this.props.ratio !== prevProps.ratio) {
            if (originImageWidth && originImageHeight) {
                if (this.props.ratio === "adaptation") {
                    this.resizeImage();
                } else {
                    this.props.onZoom(1);
                }
            }
        }
        // When the incoming rotation angle of the image changes, it needs to be resized to make the image fit on the page
        if ("rotation" in this.props && this.props.rotation !== prevProps.rotation) {
            this.onWindowResize();
        }
    }

    onWindowResize = (): void => {
        this.foundation.handleWindowResize();
    };

    handleZoomChange = (newZoom, e): void => {
        this.foundation.handleZoomChange(newZoom, e);
    };

    // Determine the response method of right click according to the disableDownload parameter in props
    handleRightClickImage = (e) => {
        this.foundation.handleRightClickImage(e);
    };

    handleWheel = (e) => {
        this.foundation.handleWheel(e);
    }

    handleLoad = (e): void => {
        this.foundation.handleLoad(e);
    }

    handleError = (e): void => {
        this.foundation.handleError(e);
    }

    resizeImage = () => {
        this.foundation.handleResizeImage();
    }

    handleMoveImage = (e): void => {
        this.foundation.handleMoveImage(e);
    };
  
    // 为什么通过ref注册wheel而不是使用onWheel事件？
    // 因为对于wheel事件，浏览器将 addEventListener 的 passive 默认值更改为 true。如此，事件监听器便不能取消事件，也不会在用户滚动页面时阻止页面呈现。
    // 这里我们需要保持页面不动，仅放大图片，因此此处需要将 passive 更改设置为 false。
    // Why register wheel via ref instead of using onWheel event?
    // Because for wheel events, the browser changes the passive default of addEventListener to true. This way, the event listener cannot cancel the event, nor prevent the page from rendering when the user scrolls.
    // Here we need to keep the page still and only zoom in on the image, so here we need to set the passive change to false.
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners。
    
    registryImageRef = (ref): void => {
        if (this.imageRef) {
            (this.imageRef as any).removeEventListener("wheel", this.handleWheel);
        }
        if (ref) {
            ref.addEventListener("wheel", this.handleWheel, { passive: false });
        }
        this.imageRef = ref;
    };

    onImageMouseDown = (e: React.MouseEvent<HTMLImageElement>): void => {
        this.foundation.handleImageMouseDown(e);
    };

    onImageMouseUp = (): void => {
        this.foundation.handleImageMouseUp();
    };

    render() {
        const { src, rotation } = this.props;
        const { loading, width, height, top, left } = this.state;
        const imgStyle = {
            position: "absolute",
            visibility: loading ? "hidden" : "visible",
            transform: `rotate(${-rotation}deg)`,
            top,
            left,
            width: loading ? "auto" : `${width}px`,
            height: loading ? "auto" : `${height}px`,
        };
        return (
            <div 
                className={`${preViewImgPrefixCls}`}
                ref={this.containerRef}
            >
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <img
                    ref={this.registryImageRef}
                    src={src}
                    alt="previewImag"
                    className={`${preViewImgPrefixCls}-img`}
                    key={src}
                    onMouseMove={this.handleMoveImage}
                    onMouseDown={this.onImageMouseDown}
                    onMouseUp={this.onImageMouseUp}
                    onContextMenu={this.handleRightClickImage}
                    onDragStart={(e): void => e.preventDefault()}
                    onLoad={this.handleLoad}
                    onError={this.handleError}
                    style={imgStyle as React.CSSProperties}
                />
                {loading && <Spin size={"large"} wrapperClassName={`${preViewImgPrefixCls}-spin`}/>}
            </div>
        );
    }
}