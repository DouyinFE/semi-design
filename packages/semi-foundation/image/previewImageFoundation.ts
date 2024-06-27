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
                this.changeZoom(_zoom);
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

    getCanDragDirection = (width: number, height: number): DragDirection => {
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
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

    changeZoom = (newZoom: number, e?: WheelEvent): void => {
        const imageDOM = this._adapter.getImage();
        const { currZoom, left, top } = this.getStates();
        const changeScale = newZoom / (currZoom || 1);
        const newWidth = Math.floor(this.originImageWidth * newZoom);
        const newHeight = Math.floor(this.originImageHeight * newZoom);
        let newLeft = Math.floor(left * changeScale);
        let newTop = Math.floor(top * changeScale);


        if (e && imageDOM && e.target === imageDOM) {
            newLeft = e.clientX - Math.floor(e.offsetX * changeScale);
            newTop = e.clientY - Math.floor(e.offsetY * changeScale);
        }

        const position = this.getSafePosition(newWidth, newHeight, newLeft, newTop);

        this.setState({
            ...position,
            width: newWidth,
            height: newHeight,
            currZoom: newZoom,
        } as any);
        if (imageDOM) {
            const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(newWidth, newHeight);
            const canDrag = canDragVertical || canDragHorizontal;

            this._adapter.setImageCursor(canDrag);
        }
    };

    getExtremeBounds = (width: number, height: number, containerWidth: number, containerHeight: number): ExtremeBounds => {
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

    getSafePosition = (width: number, height: number, left: number, top: number) => {
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        const { left: extremeLeft, top: extremeTop } = this.getExtremeBounds(width, height, containerWidth, containerHeight);
        const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(width, height);

        let newLeft = extremeLeft / 2,
            newTop = extremeTop / 2;

        if (canDragHorizontal) {
            newLeft = left > 0 ? 0 : left < extremeLeft ? extremeLeft : left;
        }

        if (canDragVertical) {
            newTop = top > 0 ? 0 : top < extremeTop ? extremeTop : top;
        }

        const _offset = {
            x: newLeft,
            y: newTop,
        };

        const isImageVertical = this._isImageVertical();

        return {
            offset: _offset,
            left: isImageVertical ? _offset.x - (width - height) / 2 : _offset.x,
            top: isImageVertical ? _offset.y + (width - height) / 2 : _offset.y,
        };
    }

    handleImageMove = (e: any): void => {
        const { offset, width, height } = this.getStates();
        const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(width, height);
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        const mouseLeftPress = e.buttons === 1;
        if (mouseLeftPress && (canDragVertical || canDragHorizontal)) {
            const { clientX, clientY } = e;
            const { left: containerLeft, top: containerTop } = this._getContainerBounds();
            let newX = canDragHorizontal ? clientX - containerLeft - this.startMouseOffset.x : offset.x;
            let newY = canDragVertical ? clientY - containerTop - this.startMouseOffset.y : offset.y;
            
            const position = this.getSafePosition(width, height, newX, newY);

            this.setState(position as any);
        }
    };

    handleImageMouseDown = (e: any): void => {
        this.startMouseOffset = this._getOffset(e);
    };

}