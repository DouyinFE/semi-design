import { cssClasses, DEFAULT_SIZE, Size, NumberSize, getStringSize, normalizeToPair, hasDirection, Direction, calculateNewMax, NewSize, findClosestSnap, snap, clamp } from '../constants';
import BaseFoundation, { DefaultAdapter } from '../../base/foundation';

// Resizer 为分别控制八个方向的元素， 通过enable来设置有无这个元素
export interface ResizerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getResizer: () => HTMLElement
}

export class ResizerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizerAdapter<P, S>, P, S> {
    constructor(adapter: ResizerAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.getResizer().addEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown = (e: MouseEvent) => {
        this.getProp('onResizeStart')(e, this.getProp('direction'));
    };

    destroy(): void {
        this._adapter.getResizer().removeEventListener('mousedown', this.onMouseDown);
    }
}

export interface ResizableAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {

}

const prefixCls = cssClasses.PREFIX;

export class ResizableFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizableAdapter<P, S>, P, S> {
    constructor(adapter: ResizableAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        if (!this.resizable || !this.window) {
            return;
        }
        const computedStyle = this.window.getComputedStyle(this.resizable);
        this.setState({
            width: this.getStates().width || this.size.width,
            height: this.getStates().height || this.size.height,
            flexBasis: computedStyle.flexBasis !== 'auto' ? computedStyle.flexBasis : undefined,
        } as any);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    flexDir?: 'row' | 'column';

    ratio = 1;
    resizable: HTMLElement | null = null;
    // For parent boundary
    parentLeft = 0;
    parentTop = 0;
    // For boundary
    resizableLeft = 0;
    resizableRight = 0;
    resizableTop = 0;
    resizableBottom = 0;
    // For target boundary
    targetLeft = 0;
    targetTop = 0;

    get parentNode(): HTMLElement | null {
        if (!this.resizable) {
            return null;
        }
        return this.resizable.parentNode as HTMLElement;
    }

    get window(): Window | null {
        if (!this.resizable) {
            return null;
        }
        if (!this.resizable.ownerDocument) {
            return null;
        }
        return this.resizable.ownerDocument.defaultView as Window;
    }

    get propsSize(): Size {
        return this.getProps().size || this.getProps().defaultSize || DEFAULT_SIZE;
    }

    get size(): NumberSize {
        let width = 0;
        let height = 0;
        if (this.resizable && this.window) {
            const orgWidth = this.resizable.offsetWidth;
            const orgHeight = this.resizable.offsetHeight;
            const orgPosition = this.resizable.style.position;
            if (orgPosition !== 'relative') {
                this.resizable.style.position = 'relative';
            }
            width = this.resizable.style.width !== 'auto' ? this.resizable.offsetWidth : orgWidth;
            height = this.resizable.style.height !== 'auto' ? this.resizable.offsetHeight : orgHeight;
            this.resizable.style.position = orgPosition;
        }
        return { width, height };
    }

    get sizeStyle(): { width: string; height: string } {
        const { size } = this.getProps();
        const getSize = (key: 'width' | 'height'): string => {
            if (typeof this.getStates()[key] === 'undefined' || this.getStates()[key] === 'auto') {
                return 'auto';
            }
            if (this.propsSize && this.propsSize[key] && this.propsSize[key]?.toString().endsWith('%')) {
                if (this.getStates()[key].toString().endsWith('%')) {
                    return this.getStates()[key].toString();
                }
                const parentSize = this.getParentSize();
                const value = Number(this.getStates()[key].toString().replace('px', ''));
                const percent = (value / parentSize[key]) * 100;
                return `${percent}%`;
            }
            return getStringSize(this.getStates()[key]);
        };
        const width =
            size && typeof size.width !== 'undefined' && !this.getStates().isResizing
                ? getStringSize(size.width)
                : getSize('width');
        const height =
            size && typeof size.height !== 'undefined' && !this.getStates().isResizing
                ? getStringSize(size.height)
                : getSize('height');
        return { width, height };
    }

    getParentSize(): { width: number; height: number } {
        if (!this.parentNode) {
            if (!this.window) {
                return { width: 0, height: 0 };
            }
            return { width: this.window.innerWidth, height: this.window.innerHeight };
        }
        const base = this.appendBase();
        if (!base) {
            return { width: 0, height: 0 };
        }
        let wrapChanged = false;
        const wrap = this.parentNode.style.flexWrap;
        if (wrap !== 'wrap') {
            wrapChanged = true;
            this.parentNode.style.flexWrap = 'wrap';
        }
        base.style.position = 'relative';
        base.style.minWidth = '100%';
        base.style.minHeight = '100%';
        const size = {
            width: base.offsetWidth,
            height: base.offsetHeight,
        };
        if (wrapChanged) {
            this.parentNode.style.flexWrap = wrap;
        }
        this.removeBase(base);
        return size;
    }

    appendBase = () => {
        if (!this.resizable || !this.window) {
            return null;
        }
        const parent = this.parentNode;
        if (!parent) {
            return null;
        }
        const element = this.window.document.createElement('div');
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.position = 'absolute';
        element.style.transform = 'scale(0, 0)';
        element.style.left = '0';
        element.style.flex = '0 0 100%';
        if (element.classList) {
            element.classList.add(prefixCls);
        } else {
            element.className += prefixCls;
        }
        parent.appendChild(element);
        return element;
    };

    removeBase = (base: HTMLElement) => {
        const parent = this.parentNode;
        if (!parent) {
            return;
        }
        parent.removeChild(base);
    };

    bindEvents() {
        if (this.window) {
            this.window.addEventListener('mouseup', this.onMouseUp);
            this.window.addEventListener('mousemove', this.onMouseMove);
            this.window.addEventListener('mouseleave', this.onMouseUp);
        }
    }

    unbindEvents() {
        if (this.window) {
            this.window.removeEventListener('mouseup', this.onMouseUp);
            this.window.removeEventListener('mousemove', this.onMouseMove);
            this.window.removeEventListener('mouseleave', this.onMouseUp);
        }
    }

    createSizeForCssProperty(newSize: number | string, kind: 'width' | 'height'): number | string {
        const propsSize = this.propsSize && this.propsSize[kind];
        return this.getStates()[kind] === 'auto' &&
            this.getStates().original[kind] === newSize &&
            (typeof propsSize === 'undefined' || propsSize === 'auto')
            ? 'auto'
            : newSize;
    }

    calculateNewMaxFromBoundary(maxWidth?: number, maxHeight?: number) {
        const { boundsByDirection } = this.getProps();
        const { direction } = this.getStates();
        const widthByDirection = boundsByDirection && hasDirection('left', direction);
        const heightByDirection = boundsByDirection && hasDirection('top', direction);
        let boundWidth;
        let boundHeight;
        if (this.getProps().bounds === 'parent') {
            const parent = this.parentNode;
            if (parent) {
                boundWidth = widthByDirection
                    ? this.resizableRight - this.parentLeft
                    : parent.offsetWidth + (this.parentLeft - this.resizableLeft);
                boundHeight = heightByDirection
                    ? this.resizableBottom - this.parentTop
                    : parent.offsetHeight + (this.parentTop - this.resizableTop);
            }
        } else if (this.getProps().bounds === 'window') {
            if (this.window) {
                boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
                boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
            }
        } else if (this.getProps().bounds) {
            boundWidth = widthByDirection
                ? this.resizableRight - this.targetLeft
                : this.getProps().bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
            boundHeight = heightByDirection
                ? this.resizableBottom - this.targetTop
                : this.getProps().bounds.offsetHeight + (this.targetTop - this.resizableTop);
        }
        if (boundWidth && Number.isFinite(boundWidth)) {
            maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
        }
        if (boundHeight && Number.isFinite(boundHeight)) {
            maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
        }
        return { maxWidth, maxHeight };
    }

    calculateNewSizeFromDirection(clientX: number, clientY: number) {
        const scale = this.getProps().scale || 1;
        const [resizeRatioX, resizeRatioY] = normalizeToPair(this.getProps().resizeRatio || 1);
        const { direction, original } = this.getStates();
        const { lockAspectRatio, lockAspectRatioExtraHeight, lockAspectRatioExtraWidth } = this.getProps();
        let newWidth = original.width;
        let newHeight = original.height;
        const extraHeight = lockAspectRatioExtraHeight || 0;
        const extraWidth = lockAspectRatioExtraWidth || 0;
        if (hasDirection('right', direction)) {
            newWidth = original.width + ((clientX - original.x) * resizeRatioX) / scale;
            if (lockAspectRatio) {
                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
            }
        }
        if (hasDirection('left', direction)) {
            newWidth = original.width - ((clientX - original.x) * resizeRatioX) / scale;
            if (lockAspectRatio) {
                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
            }
        }
        if (hasDirection('bottom', direction)) {
            newHeight = original.height + ((clientY - original.y) * resizeRatioY) / scale;
            if (lockAspectRatio) {
                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
            }
        }
        if (hasDirection('top', direction)) {
            newHeight = original.height - ((clientY - original.y) * resizeRatioY) / scale;
            if (lockAspectRatio) {
                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
            }
        }
        return { newWidth, newHeight };
    }

    calculateNewSizeFromAspectRatio(
        newWidth: number,
        newHeight: number,
        max: { width?: number; height?: number },
        min: { width?: number; height?: number },
    ) {
        const { lockAspectRatio, lockAspectRatioExtraHeight, lockAspectRatioExtraWidth } = this.getProps();
        const computedMinWidth = typeof min.width === 'undefined' ? 10 : min.width;
        const computedMaxWidth = typeof max.width === 'undefined' || max.width < 0 ? newWidth : max.width;
        const computedMinHeight = typeof min.height === 'undefined' ? 10 : min.height;
        const computedMaxHeight = typeof max.height === 'undefined' || max.height < 0 ? newHeight : max.height;
        const extraHeight = lockAspectRatioExtraHeight || 0;
        const extraWidth = lockAspectRatioExtraWidth || 0;
        if (lockAspectRatio) {
            const extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
            const extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
            const extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
            const extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
            const lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
            const lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
            const lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
            const lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
            newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
            newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
        } else {
            newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
            newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
        }
        return { newWidth, newHeight };
    }

    setBoundingClientRect() {
        // For parent boundary
        if (this.getProps().bounds === 'parent') {
            const parent = this.parentNode;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                this.parentLeft = parentRect.left;
                this.parentTop = parentRect.top;
            }
        }

        // For target(html element) boundary
        if (this.getProps().bounds && typeof this.getProps().bounds !== 'string') {
            const targetRect = this.getProps().bounds.getBoundingClientRect();
            this.targetLeft = targetRect.left;
            this.targetTop = targetRect.top;
        }

        // For boundary
        if (this.resizable) {
            const { left, top, right, bottom } = this.resizable.getBoundingClientRect();
            this.resizableLeft = left;
            this.resizableRight = right;
            this.resizableTop = top;
            this.resizableBottom = bottom;
        }
    }

    

    onResizeStart(event: MouseEvent, direction: Direction) {
        if (!this.resizable || !this.window) {
            return;
        }
        
        let e = event as unknown as React.MouseEvent<HTMLElement>;
        let clientX = 0;
        let clientY = 0;
        clientX = e.clientX;
        clientY = e.clientY;
        if (this.getProps().onResizeStart) {
            if (this.resizable) {
                const startResize = this.getProps().onResizeStart(event, direction, this.resizable);
                if (startResize === false) {
                    return;
                }
            }
        }

        if (this.getProps().size) {
            if (typeof this.getProps().size.height !== 'undefined' && this.getProps().size.height !== this.getStates().height) {
                this.setState({ height: this.getProps().size.height } as any);
            }
            if (typeof this.getProps().size.width !== 'undefined' && this.getProps().size.width !== this.getStates().width) {
                this.setState({ width: this.getProps().size.width } as any);
            }
        }

        // For lockAspectRatio case
        this.ratio =
            typeof this.getProps().lockAspectRatio === 'number' ? this.getProps().lockAspectRatio : this.size.width / this.size.height;

        let flexBasis: string;
        const computedStyle = this.window.getComputedStyle(this.resizable);
        if (computedStyle.flexBasis !== 'auto') {
            const parent = this.parentNode;
            if (parent) {
                const dir = this.window.getComputedStyle(parent).flexDirection;
                this.flexDir = dir.startsWith('row') ? 'row' : 'column';
                flexBasis = computedStyle.flexBasis;
            }
        }
        // For boundary
        this.setBoundingClientRect();
        this.bindEvents();
        const state = {
            original: {
                x: clientX,
                y: clientY,
                width: this.size.width,
                height: this.size.height,
            },
            isResizing: true,
            backgroundStyle: {
                ...this.getStates().backgroundStyle,
                cursor: this.window.getComputedStyle(event.target as HTMLElement).cursor || 'auto',
            },
            direction,
            flexBasis,
        };

        this.setState(state as any);
    }

    onMouseMove(event: MouseEvent) {
        if (!this.getStates().isResizing || !this.resizable || !this.window) {
            return;
        }
        let { maxWidth, maxHeight, minWidth, minHeight } = this.getProps();
        const clientX = event.clientX;
        const clientY = event.clientY;
        const { direction, original, width, height } = this.getStates();
        const parentSize = this.getParentSize();
        const max = calculateNewMax(
            parentSize,
            this.window.innerWidth,
            this.window.innerHeight,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
        );

        maxWidth = max.maxWidth;
        maxHeight = max.maxHeight;
        minWidth = max.minWidth;
        minHeight = max.minHeight;

        // Calculate new size
        let { newHeight, newWidth }: NewSize = this.calculateNewSizeFromDirection(clientX, clientY);

        // Calculate max size from boundary settings
        const boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);

        newWidth = typeof newWidth === 'string' ? parseInt(newWidth) : newWidth;
        if (this.getProps().snap && this.getProps().snap.x) {
            newWidth = findClosestSnap(newWidth, this.getProps().snap.x, this.getProps().snapGap);
        }
        newHeight = typeof newHeight === 'string' ? parseInt(newHeight) : newHeight;
        if (this.getProps().snap && this.getProps().snap.y) {
            newHeight = findClosestSnap(newHeight, this.getProps().snap.y, this.getProps().snapGap);
        }

        // Calculate new size from aspect ratio
        const newSize = this.calculateNewSizeFromAspectRatio(
            newWidth,
            newHeight,
            { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight },
            { width: minWidth, height: minHeight },
        );
        newWidth = newSize.newWidth;
        newHeight = newSize.newHeight;

        if (this.getProps().grid) {
            const newGridWidth = snap(newWidth, this.getProps().grid[0]);
            const newGridHeight = snap(newHeight, this.getProps().grid[1]);
            const gap = this.getProps().snapGap || 0;
            const w = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
            const h = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
            newWidth = w;
            newHeight = h;
        }

        const delta = {
            width: newWidth - original.width,
            height: newHeight - original.height,
        };

        if (width && typeof width === 'string') {
            if (width.endsWith('%')) {
                const percent = (newWidth / parentSize.width) * 100;
                newWidth = `${percent}%`;
            } else if (width.endsWith('vw')) {
                const vw = (newWidth / this.window.innerWidth) * 100;
                newWidth = `${vw}vw`;
            } else if (width.endsWith('vh')) {
                const vh = (newWidth / this.window.innerHeight) * 100;
                newWidth = `${vh}vh`;
            }
        }

        if (height && typeof height === 'string') {
            if (height.endsWith('%')) {
                const percent = (newHeight / parentSize.height) * 100;
                newHeight = `${percent}%`;
            } else if (height.endsWith('vw')) {
                const vw = (newHeight / this.window.innerWidth) * 100;
                newHeight = `${vw}vw`;
            } else if (height.endsWith('vh')) {
                const vh = (newHeight / this.window.innerHeight) * 100;
                newHeight = `${vh}vh`;
            }
        }

        const newState: { width: string | number; height: string | number; flexBasis?: string | number } = {
            width: this.createSizeForCssProperty(newWidth, 'width'),
            height: this.createSizeForCssProperty(newHeight, 'height'),
        };

        if (this.flexDir === 'row') {
            newState.flexBasis = newState.width;
        } else if (this.flexDir === 'column') {
            newState.flexBasis = newState.height;
        }

        const widthChanged = this.getStates().width !== newState.width;
        const heightChanged = this.getStates().height !== newState.height;
        const flexBaseChanged = this.getStates().flexBasis !== newState.flexBasis;
        const changed = widthChanged || heightChanged || flexBaseChanged;

        if (changed) {
            this.setState(newState as any);
        }

        if (this.getProps().onResize) {
            if (changed) {
                this.getProps().onResize(event, direction, this.resizable, delta);
            }
        }
    }

    onMouseUp(event: MouseEvent) {
        const { isResizing, direction, original } = this.getStates();
        if (!isResizing || !this.resizable) {
            return;
        }
        const delta = {
            width: this.size.width - original.width,
            height: this.size.height - original.height,
        };
        if (this.getProps().onResizeStop) {
            this.getProps().onResizeStop(event, direction, this.resizable, delta);
        }
        if (this.getProps().size) {
            this.setState({ width: this.getProps().size.width ?? 'auto', height: this.getProps().size.height ?? 'auto' } as any);
        }
        this.unbindEvents();
        this.setState({
            isResizing: false,
            backgroundStyle: { ...this.getStates().backgroundStyle, cursor: 'auto' },
        } as any);
    }

    updateSize(size: Size) {
        this.setState({ width: size.width ?? 'auto', height: size.height ?? 'auto' } as any);
    }


    destroy(): void {
        if (this.window) {
            this.unbindEvents();
        }
    }
}
