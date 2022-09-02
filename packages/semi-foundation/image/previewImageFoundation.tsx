import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface PreviewImageAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getOriginImageSize: () => { originImageWidth: number; originImageHeight: number; }; 
    setOriginImageSize: (size: { originImageWidth: number; originImageHeight: number; }) => void;
    getContainerRef: () => any;
    getImageRef: () => any;
    getMouseMove: () => boolean;
    setStartMouseMove: (move: boolean) => void;
    getMouseOffset: () => { x: number; y: number };
    setStartMouseOffset: (offset: { x: number; y: number }) => void;
}

export interface DragDirection {
    canDragVertical: boolean;
    canDragHorizontal: boolean;
}

export interface ExtremeBounds {
    left: number;
    top: number;
}

export interface ImageOffset {
    x: number;
    y: number;
}

export default class PreviewImageFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PreviewImageAdapter<P, S>, P, S> {
    constructor(adapter: PreviewImageAdapter<P, S>) {
        super({ ...adapter });
    }

    _isImageVertical = (): boolean => this.getProp('rotation') % 180 !== 0;

    // _getImageBounds = (): DOMRect => {
    _getImageBounds = (): any => {
        const imageRef = this._adapter.getImageRef();
        return imageRef?.current?.getBoundingClientRect();
    };

    // _getContainerBounds = (): DOMRect => {
    _getContainerBounds = (): any => {
        const containerRef = this._adapter.getContainerRef();
        return containerRef?.current?.getBoundingClientRect();
    }

    _getOffset = (e): ImageOffset => {
        const { left, top } = this._getImageBounds();
        return {
            x: e.clientX - left,
            y: e.clientY - top,
        };
    }

    handleWindowResize = (): void => {
        const { setRatio } = this.getProps();
        const { ratio } = this.getProps();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        if (originImageWidth && originImageHeight) {
            if (ratio !== 'adaptation') {
                setRatio('adaptation');
            } else {
                this.handleResizeImage();
            } 
        }
    };

    handleLoad = (e): void => {
        if (e.target) {
            const { width: w, height: h } = e.target as any;
            this._adapter.setOriginImageSize({ originImageWidth: w, originImageHeight: h });
            this.setState({
                loading: false,
            } as any);
            this.handleResizeImage();
        }
    }

    handleResizeImage = () => {
        const horizon = !this._isImageVertical();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        const imgWidth = horizon ? originImageWidth : originImageHeight;
        const imgHeight = horizon ? originImageHeight : originImageWidth;
        const { onZoom } = this.getProps();
        const containerRef = this._adapter.getContainerRef();
        if (containerRef && containerRef.current) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const reservedWidth = containerWidth - 80;
            const reservedHeight = containerHeight - 80;
            const _zoom = Number(
                Math.min(reservedWidth / imgWidth, reservedHeight / imgHeight).toFixed(2)
            );
            onZoom(_zoom);
        }
    }

    handleRightClickImage = (e) => {
        const { disableDownload } = this.getProps();
        if (disableDownload) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        } else {
            return true;
        }
    };

    handleWheel = (e: React.WheelEvent<HTMLImageElement>): void => {
        const { onZoom, zoomStep, maxZoom, minZoom } = this.getProps();
        const { currZoom } = this.getStates();
        let _zoom = null;
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
        if (_zoom !== null) {
            onZoom(_zoom);
        }
        e.preventDefault();
    }

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

    handleZoomChange = (newZoom, e): void => {
        const imageRef = this._adapter.getImageRef();
        const { originImageWidth, originImageHeight } = this._adapter.getOriginImageSize();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        const canDrag = canDragVertical || canDragHorizontal;
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        const newWidth = Math.floor(originImageWidth * newZoom);
        const newHeight = Math.floor(originImageHeight * newZoom);

        // debugger;
        let _offset;
        const horizon = !this._isImageVertical();
        let newTop = 0;
        let newLeft = 0;
        if (horizon) {
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
        imageRef && (imageRef.current.style.cursor = canDrag ? "grab" : "default");
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

    handleMoveImage = (e): void => {
        const { offset, width, height, left, top } = this.getStates();
        const { rotation } = this.getProps();
        const startMouseMove = this._adapter.getMouseMove();
        const startMouseOffset = this._adapter.getMouseOffset();
        const { canDragVertical, canDragHorizontal } = this.calcCanDragDirection();
        if (startMouseMove && (canDragVertical || canDragHorizontal)) {
            const { pageX, pageY } = e;
            const { left: extremeLeft, top: extremeTop } = this.calcExtremeBounds();
            let newX = canDragHorizontal ? pageX - startMouseOffset.x : offset.x;
            let newY = canDragVertical ? pageY - startMouseOffset.y : offset.y;
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

    handleImageMouseDown = (e: React.MouseEvent<HTMLImageElement>): void => {
        this._adapter.setStartMouseOffset(this._getOffset(e));
        this._adapter.setStartMouseMove(true);
    };

    handleImageMouseUp = (): void => {
        this._adapter.setStartMouseMove(false);
    };
}