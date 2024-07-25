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

export interface ExtremeTranslate {
    x: number;
    y: number
}

export interface Offset {
    x: number;
    y: number
}

export interface Client {
    x: number;
    y: number
}

export interface Translate {
    x: number;
    y: number
}

export interface BoundingRectSize {
    width: number;
    height: number
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

    startMouseClientPosition = { x: 0, y: 0 };
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

    _getTranslate = (e: any): Translate => {
        const { left, top, width, height } = this._getImageBounds();
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();

        return {
            x: left + width / 2 - containerWidth / 2,
            y: top + height / 2 - containerHeight / 2,
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
        const { currZoom } = this.getStates();
        const { onZoom, rotation } = this.getProps();
        let { width, height } = this.calcBoundingRectSize(this.originImageWidth, this.originImageHeight, rotation);
        
        const containerDOM = this._adapter.getContainer();
        if (containerDOM) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const reservedWidth = containerWidth - 80;
            const reservedHeight = containerHeight - 80;
            let _zoom = 1;
            if (width > reservedWidth || height > reservedHeight) {
                _zoom = Number(
                    Math.min(reservedWidth / width, reservedHeight / height).toFixed(2)
                );
            }
            if (currZoom === _zoom) {
                this.changeZoom(_zoom);
            } else {
                onZoom(_zoom, notify);
            }
        }
    }

    // TODO
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

    calcBoundingRectSize(width = 0, height = 0, rotation = 0) {
        const angleInRadians = rotation * Math.PI / 180;
        const sinTheta = Math.abs(Math.sin(angleInRadians));
        const cosTheta = Math.abs(Math.cos(angleInRadians));
        const boundingWidth = width * cosTheta + height * sinTheta;
        const boundingHeight = width * sinTheta + height * cosTheta;

        return {
            width: boundingWidth,
            height: boundingHeight
        };
    }

    getCanDragDirection = (width: number, height: number): DragDirection => {
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
        let canDragHorizontal = width > containerWidth;
        let canDragVertical = height > containerHeight;

        return {
            canDragVertical,
            canDragHorizontal,
        };
    };

    changeZoom = (newZoom: number, e?: WheelEvent): void => {
        const imageDOM = this._adapter.getImage();
        const { currZoom, translate } = this.getStates();
        const changeScale = newZoom / (currZoom || 1);
        const newWidth = Math.floor(this.originImageWidth * newZoom);
        const newHeight = Math.floor(this.originImageHeight * newZoom);
        let newTranslateX = Math.floor(translate.x * changeScale);
        let newTranslateY = Math.floor(translate.y * changeScale);

        const imageBound = this._getImageBounds();
        const newImageBound = {
            width: imageBound.width * changeScale,
            height: imageBound.height * changeScale
        };

        if (e && imageDOM && e.target === imageDOM) {
            const { width: containerWidth, height: containerHeight } = this._getContainerBounds();
            const imageNewCenterX = e.clientX + (imageBound.width / 2 - e.offsetX) * changeScale;
            const imageNewCenterY = e.clientY + (imageBound.height / 2 - e.offsetY) * changeScale;
            const containerCenterX = containerWidth / 2;
            const containerCenterY = containerHeight / 2;

            newTranslateX = imageNewCenterX - containerCenterX;
            newTranslateY = imageNewCenterY - containerCenterY;
        }

        const newTranslate = this.tryTranslateToCenter(newImageBound.width, newImageBound.height, newTranslateX, newTranslateY);

        this.setState({
            translate: newTranslate,
            width: newWidth,
            height: newHeight,
            currZoom: newZoom,
        } as any);
        if (imageDOM) {
            const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(newImageBound.width, newImageBound.height);
            const canDrag = canDragVertical || canDragHorizontal;

            this._adapter.setImageCursor(canDrag);
        }
    };

    getExtremeTranslate = (width: number, height: number): ExtremeTranslate => {
        const { width: containerWidth, height: containerHeight } = this._getContainerBounds();

        return {
            x: (width - containerWidth) / 2,
            y: (height - containerHeight) / 2,
        };
    };

    tryTranslateToCenter = (width: number, height: number, translateX: number, translateY: number) => {
        const { x: extremeX, y: extremeY } = this.getExtremeTranslate(width, height);
        const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(width, height);

        let newTranslateX = 0,
            newTranslateY = 0;

        if (canDragHorizontal) {
            newTranslateX = translateX > 0 ? Math.min(translateX, extremeX) : Math.max(translateX, -extremeX);
        }

        if (canDragVertical) {
            newTranslateY = translateY > 0 ? Math.min(translateY, extremeY) : Math.max(translateY, -extremeY);
        }

        return {
            x: newTranslateX,
            y: newTranslateY
        };
    }

    handleImageMove = (e: any): void => {
        const { translate } = this.getStates();
        const imageBound = this._getImageBounds();
        const { canDragVertical, canDragHorizontal } = this.getCanDragDirection(imageBound.width, imageBound.height);
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        const mouseLeftPress = e.buttons === 1;
        if (mouseLeftPress && (canDragVertical || canDragHorizontal)) {
            const { clientX, clientY } = e;

            let newTranslateX = canDragHorizontal ? translate.x + clientX - this.startMouseClientPosition.x : translate.x;
            let newTranslateY = canDragVertical ? translate.y + clientY - this.startMouseClientPosition.y : translate.y;
            
            const newTranslate = this.tryTranslateToCenter(imageBound.width, imageBound.height, newTranslateX, newTranslateY);

            this.setState({
                translate: newTranslate,
            } as any);

            this.startMouseClientPosition = {
                x: clientX,
                y: clientY
            };
        }
    };

    handleImageMouseDown = (e: any): void => {
        this.startMouseClientPosition = {
            x: e.clientX,
            y: e.clientY
        };
    };
}