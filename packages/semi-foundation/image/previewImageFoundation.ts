import BaseFoundation, { DefaultAdapter } from "../base/foundation";
import { handlePrevent } from "../utils/a11y";
import { throttle, isUndefined } from "lodash";

export interface PreviewImageAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getOriginImageSize: () => { originImageWidth: number; originImageHeight: number }; 
    setOriginImageSize: (size: { originImageWidth: number; originImageHeight: number }) => void;
    getContainer: () => HTMLDivElement;
    getImage: () => HTMLImageElement;
    getMouseMove: () => boolean;
    setStartMouseMove: (move: boolean) => void;
    getMouseOffset: () => { x: number; y: number };
    setStartMouseOffset: (offset: { x: number; y: number }) => void;
    setLoading: (loading: boolean) => void;
    setImageCursor: (canDrag: boolean) => void
}

export interface DragDirection {
    canDragVertical: boolean;
    canDragHorizontal: boolean
}

export interface ExtremeBounds {
    left: number;
    top: number
}

export interface ImageOffset {
    x: number;
    y: number
}

const DefaultDOMRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({})
};
export default class PreviewImageFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PreviewImageAdapter<P, S>, P, S> {
    constructor(adapter: PreviewImageAdapter<P, S>) {
        super({ ...adapter });
    }

    _isImageVertical = (): boolean => this.getProp("rotation") % 180 !== 0;

    _getImageBounds = (): DOMRect => {
        const imageDOM = this._adapter.getImage();
        if (imageDOM) {
            return imageDOM.getBoundingClientRect();
        }
        return DefaultDOMRect;
    };

    _getContainerBounds = (): DOMRect => {
        const containerDOM = this._adapter.getContainer();
        if (containerDOM) {
            return containerDOM.getBoundingClientRect();
        }
        return DefaultDOMRect;
    }

    _getOffset = (e: any): ImageOffset => {
        const { left, top } = this._getImageBounds();
        return {
            x: e.clientX - left,
            y: e.clientY - top,
        };
    }

    setLoading = (loading: boolean) => {
        this._adapter.setLoading(loading);
    }

    handleWindowResize = (): void => {
        const { setRatio } = this.getProps();
        const { ratio } = this.getProps();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        if (originImageWidth && originImageHeight) {
            if (ratio !== "adaptation") {
                setRatio("adaptation");
            } else {
                this.handleResizeImage();
            } 
        }
    };

    handleLoad = (e: any): void => {
        if (e.target) {
            const { width: w, height: h } = e.target as any;
            this._adapter.setOriginImageSize({ originImageWidth: w, originImageHeight: h });
            this.setState({
                loading: false,
            } as any);
            this.handleResizeImage();
        }
        const { src, onLoad } = this.getProps();
        onLoad && onLoad(src);
    }

    handleError = (e: any): void => {
        const { onError, src } = this.getProps();
        this.setState({
            loading: false,
        } as any);
        onError && onError(src);
    }

    handleResizeImage = () => {
        const horizontal = !this._isImageVertical();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        const imgWidth = horizontal ? originImageWidth : originImageHeight;
        const imgHeight = horizontal ? originImageHeight : originImageWidth;
        const { onZoom } = this.getProps();
        const containerDOM = this._adapter.getContainer();
        if (containerDOM) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const reservedWidth = containerWidth - 80;
            const reservedHeight = containerHeight - 80;
            const _zoom = Number(
                Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2)
            );
            onZoom(_zoom);
        }
    }

    handleRightClickImage = (e: any) => {
        const { disableDownload } = this.getProps();
        if (disableDownload) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            return true;
        }
    };

    // e: WheelEvent<HTMLImageElement>
    handleWheel = (e: any) => {
        this.onWheel(e);
        handlePrevent(e);
    }

    // e: WheelEvent<HTMLImageElement>
    onWheel = throttle((e: any): void => {
        const { onZoom, zoomStep, maxZoom, minZoom } = this.getProps();
        const { currZoom } = this.getStates();
        let _zoom:number;
        if (e.deltaY < 0) {
            /* zoom in */
            if (currZoom + zoomStep <= maxZoom) {
                _zoom = Number((currZoom + zoomStep).toFixed(2));
            }
        } else if (e.deltaY > 0) {
            /* zoom out */
            if (currZoom - zoomStep >= minZoom) {
                _zoom = Number((currZoom - zoomStep).toFixed(2));
            }
        }
        if (!isUndefined(_zoom)) {
            onZoom(_zoom);
        }
    }, 50);

    calcCanDragDirection = (): DragDirection => {
        const { width, height } = this.getStates();
        const { rotation } = this.getProps();
        const { width: containerWidth, height: containerHeight } =this._getContainerBounds();
        let canDragHorizontal = width > containerWidth;
        let canDragVertical = height > containerHeight;
        if (this._isImageVertical()) {
            canDragHorizontal = height > containerWidth;
            canDragVertical = width > containerHeight;
        }
        return {
            canDragVertical,
            canDragHorizontal,
        };
    };

    handleZoomChange = (newZoom: number, e: any): void => {
        const imageDOM = this._adapter.getImage();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        const canDrag = canDragVertical || canDragHorizontal;
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        const newWidth = Math.floor(originImageWidth * newZoom);
        const newHeight = Math.floor(originImageHeight * newZoom);

        // debugger;
        let _offset;
        const horizontal = !this._isImageVertical();
        let newTop = 0;
        let newLeft = 0;
        if (horizontal) {
            _offset = {
                x: 0.5 * (containerWidth - newWidth),
                y: 0.5 * (containerHeight - newHeight),
            };
           
            newLeft = _offset.x;
            newTop= _offset.y;
        } else {
            _offset = {
                x: 0.5 * (containerWidth - newHeight),
                y: 0.5 * (containerHeight - newWidth),
            };
            newLeft = _offset.x - (newWidth - newHeight) / 2;
            newTop = _offset.y + (newWidth - newHeight) / 2;
        }
        
        this.setState({
            width: newWidth,
            height: newHeight,
            offset: _offset,
            left: newLeft,
            top: newTop,
            currZoom: newZoom,
        } as any);
        if (imageDOM) {
            this._adapter.setImageCursor(canDrag);
        }
    };

    calcExtremeBounds = (): ExtremeBounds => {
        const { width, height } = this.getStates(); 
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        let extremeLeft = containerWidth - width;
        let extremeTop = containerHeight - height;
        if (this._isImageVertical()) {
            extremeLeft = containerWidth - height;
            extremeTop = containerHeight - width;
        }
        return {
            left: extremeLeft,
            top: extremeTop,
        };
    };

    handleMoveImage = (e: any): void => {
        const { offset, width, height } = this.getStates();
        const startMouseMove = this._adapter.getMouseMove();
        const startMouseOffset = this._adapter.getMouseOffset();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        if (startMouseMove && (canDragVertical || canDragHorizontal)) {
            const { clientX, clientY } = e;
            const { left: containerLeft, top: containerTop } = this._getContainerBounds();
            const { left: extremeLeft, top: extremeTop } = this.calcExtremeBounds();
            let newX = canDragHorizontal ? clientX - containerLeft - startMouseOffset.x : offset.x;
            let newY = canDragVertical ? clientY - containerTop - startMouseOffset.y : offset.y;
            if (canDragHorizontal) {
                newX = newX > 0 ? 0 : newX < extremeLeft ? extremeLeft : newX;
            }
            if (canDragVertical) {
                newY = newY > 0 ? 0 : newY < extremeTop ? extremeTop : newY;

            }
            const _offset = {
                x: newX,
                y: newY,
            };
            this.setState({
                offset: _offset,
                left: this._isImageVertical() ? _offset.x - (width - height) / 2 : _offset.x,
                top: this._isImageVertical() ? _offset.y + (width - height) / 2 : _offset.y,
            } as any);
        }
    };

    handleImageMouseDown = (e: any): void => {
        this._adapter.setStartMouseOffset(this._getOffset(e));
        this._adapter.setStartMouseMove(true);
    };

    handleImageMouseUp = (): void => {
        this._adapter.setStartMouseMove(false);
    };
}