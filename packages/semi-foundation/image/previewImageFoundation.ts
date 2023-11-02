import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export interface PreviewImageAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getOriginImageSize: () => { originImageWidth: number; originImageHeight: number }; 
    setOriginImageSize: (size: { originImageWidth: number; originImageHeight: number }) => void;
    getContainer: () => HTMLDivElement;
    getImage: () => HTMLImageElement;
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
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        if (originImageWidth && originImageHeight) {
            this.handleResizeImage();
        }
    };

    handleLoad = (e: any): void => {
        if (e.target) {
            const { naturalWidth: w, naturalHeight: h } = e.target as any;
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

    /**
     *  handleResizeImage 的规则：
     *   1. 如果 adaptation 为 true，则以适应预览区域进行缩放（宽度和高度不超过预览区域的宽度和高度减去80px)
     *   2. 如果 adaptation 为 false：
     *      2.1 如果图片原始宽高小于或者等于适应预览区域的宽高，则不缩放，zoom = 1
     *      2.2 如果图片原始宽高小于大于适应预览区域的宽高, 则以适应预览区域进行缩放
     *  Rules for handleResizeImage：
     *   1. If adaptation is true, scale to fit the preview area (the width and height do not exceed the width and 
     *      height of the preview area minus 80px)
     *   2. if adaptation is false
     *      2.1 If the original width and height of the image is less than or equal to the width and height that fits the preview area, 
     *          it will not be zoomed, zoom = 1
     *      2.2 If the original width and height of the image are smaller than or greater than the width and height that fit in the preview area, 
     *          the image will be scaled to fit in the preview area.
     */
    handleResizeImage = (adaptation: boolean = false) => {
        const horizontal = !this._isImageVertical();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        const { currZoom } = this.getStates();
        const imgWidth = horizontal ? originImageWidth : originImageHeight;
        const imgHeight = horizontal ? originImageHeight : originImageWidth;
        const { onZoom } = this.getProps();
        const containerDOM = this._adapter.getContainer();
        if (containerDOM) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const reservedWidth = containerWidth - 80;
            const reservedHeight = containerHeight - 80;
            let _zoom = 1;
            if (adaptation || imgWidth > reservedWidth || imgHeight > reservedHeight) {
                _zoom = Number(
                    Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2)
                );
            }
            if (currZoom === _zoom) {
                this.handleZoomChange(_zoom, null);
            } else {
                onZoom(_zoom);
            }
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
        const startMouseOffset = this._adapter.getMouseOffset();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        const mouseLeftPress = e.buttons === 1;
        if (mouseLeftPress && (canDragVertical || canDragHorizontal)) {
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
    };

}