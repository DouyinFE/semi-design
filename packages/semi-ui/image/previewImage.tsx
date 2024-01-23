import React from "react";
import BaseComponent from "../_base/baseComponent";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import { PreviewImageProps, PreviewImageStates } from "./interface";
import PropTypes from "prop-types";
import Spin from "../spin";
import PreviewImageFoundation, { PreviewImageAdapter } from "@douyinfe/semi-foundation/image/previewImageFoundation";

const prefixCls = cssClasses.PREFIX;
const preViewImgPrefixCls = `${prefixCls}-preview-image`;

export default class PreviewImage extends BaseComponent<PreviewImageProps, PreviewImageStates> {
    static propTypes = {
        src: PropTypes.string,
        rotation: PropTypes.number,
        style: PropTypes.object,
        // maxZoom: PropTypes.number,
        // minZoom: PropTypes.number,
        // zoomStep: PropTypes.number,
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
        // maxZoom: 5,
        // minZoom: 0.1,
        // zoomStep: 0.1,
        zoom: undefined,
    };

    get adapter(): PreviewImageAdapter<PreviewImageProps, PreviewImageStates> {
        return {
            ...super.adapter,
            getContainer: () => {
                return this.containerRef.current;
            },
            getImage: () => {
                return this.imageRef.current;
            },
            setLoading: (loading: boolean) => { 
                this.setState({
                    loading,
                });
            },
            setImageCursor: (canDrag: boolean) => {
                this.imageRef.current.style.cursor = canDrag ? "grab" : "default";
            }
        };
    }

    containerRef: React.RefObject<HTMLDivElement>;
    imageRef: React.RefObject<HTMLImageElement>;
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
        this.imageRef = React.createRef<HTMLImageElement>();
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
        const zoomChange = "zoom" in this.props && this.props.zoom !== this.state.currZoom;
        const srcChange = this.props.src && this.props.src !== prevProps.src;
        if (srcChange) {
            this.foundation.setLoading(true);
        }
        // If the incoming zoom changes, other content changes are determined based on the new zoom value
        if (zoomChange) {
            this.foundation.calculatePreviewImage(this.props.zoom, null);
        }
        if (!zoomChange && !srcChange && prevProps) {
            if ("ratio" in this.props && this.props.ratio !== prevProps.ratio) {
                this.foundation.handleRatioChange();
            }
            if ("rotation" in this.props && this.props.rotation !== prevProps.rotation) {
                this.onWindowResize();
            }
        }   
    }

    onWindowResize = (): void => {
        this.foundation.handleWindowResize();
    };

    // Determine the response method of right click according to the disableDownload parameter in props
    handleRightClickImage = (e) => {
        this.foundation.handleRightClickImage(e);
    };

    handleLoad = (e): void => {
        this.foundation.handleLoad(e);
    }

    handleError = (e): void => {
        this.foundation.handleError(e);
    }

    handleMoveImage = (e): void => {
        this.foundation.handleMoveImage(e);
    };

    onImageMouseDown = (e: React.MouseEvent<HTMLImageElement>): void => {
        this.foundation.handleImageMouseDown(e);
    };

    render() {
        const { src, rotation, crossOrigin } = this.props;
        const { loading, width, height, top, left } = this.state;
        const imgStyle = {
            position: "absolute",
            visibility: loading ? "hidden" : "visible",
            transform: `rotate(${-rotation}deg)`,
            top,
            left,
            width,
            height,
        };
        return (
            <div 
                className={`${preViewImgPrefixCls}`}
                ref={this.containerRef}
            >
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <img
                    ref={this.imageRef}
                    src={src}
                    alt="previewImag"
                    className={`${preViewImgPrefixCls}-img`}
                    key={src}
                    onMouseMove={this.handleMoveImage}
                    onMouseDown={this.onImageMouseDown}
                    onContextMenu={this.handleRightClickImage}
                    onDragStart={(e): void => e.preventDefault()}
                    onLoad={this.handleLoad}
                    onError={this.handleError}
                    style={imgStyle as React.CSSProperties}
                    crossOrigin={crossOrigin}
                />
                {loading && <Spin size={"large"} wrapperClassName={`${preViewImgPrefixCls}-spin`}/>}
            </div>
        );
    }
}