import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export interface PreviewImageAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getContainer: () => HTMLDivElement;
    getImage: () => HTMLImageElement;
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

    startMouseOffset = { x: 0, y: 0 };
    originImageWidth = null;
    originImageHeight = null;

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
        if (this.originImageWidth && this.originImageHeight) {
            this.handleResizeImage();
        }
    };

    handleLoad = (e: any): void => {
        if (e.target) {
            const { naturalWidth: w, naturalHeight: h } = e.target as any;
            this.originImageHeight = h;
            this.originImageWidth = w;
            this.setState({
                loading: false,
            } as any);
            // 图片初次加载，计算 zoom，zoom 改变不需要通过回调透出
            // When the image is loaded for the first time, zoom is calculated, and zoom changes do not need to be exposed through callbacks.
            this.handleResizeImage(false);
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

    handleResizeImage = (notify: boolean = true) => {
        const horizontal = !this._isImageVertical();
        const { currZoom } = this.getStates();
        const imgWidth = horizontal ? this.originImageWidth : this.originImageHeight;
        const imgHeight = horizontal ? this.originImageHeight : this.originImageWidth;
        const { onZoom, setRatio, ratio } = this.getProps();
        const containerDOM = this._adapter.getContainer();
        if (containerDOM) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const reservedWidth = containerWidth - 80;
            const reservedHeight = containerHeight - 80;
            let _zoom = 1;
            if (imgWidth > reservedWidth || imgHeight > reservedHeight) {
                _zoom = Number(
                    Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2)
                );
            }
            if (currZoom === _zoom) {
                this.calculatePreviewImage(_zoom, null);
            } else {
                onZoom(_zoom, notify);
            }
        }
    }

    handleRatioChange = () => {
        if (this.originImageWidth && this.originImageHeight) {
            const { currZoom } = this.getStates();
            const { ratio, onZoom } = this.getProps();
            let _zoom: number;
            if (ratio === 'adaptation') {
                const horizontal = !this._isImageVertical();
                const imgWidth = horizontal ? this.originImageWidth : this.originImageHeight;
                const imgHeight = horizontal ? this.originImageHeight : this.originImageWidth;
                const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
                const reservedWidth = containerWidth - 80;
                const reservedHeight = containerHeight - 80;
                _zoom = Number(
                    Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2)
                );
            } else {
                _zoom = 1;
            }
            if (currZoom !== _zoom) {
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

    calculatePreviewImage = (newZoom: number, e: any): void => {
        const imageDOM = this._adapter.getImage();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        const canDrag = canDragVertical || canDragHorizontal;
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        const newWidth = Math.floor(this.originImageWidth * newZoom);
        const newHeight = Math.floor(this.originImageHeight * newZoom);

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
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        const mouseLeftPress = e.buttons === 1;
        if (mouseLeftPress && (canDragVertical || canDragHorizontal)) {
            const { clientX, clientY } = e;
            const { left: containerLeft, top: containerTop } = this._getContainerBounds();
            const { left: extremeLeft, top: extremeTop } = this.calcExtremeBounds();
            let newX = canDragHorizontal ? clientX - containerLeft - this.startMouseOffset.x : offset.x;
            let newY = canDragVertical ? clientY - containerTop - this.startMouseOffset.y : offset.y;
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
        this.startMouseOffset = this._getOffset(e);
    };

}