import { cssClasses, DEFAULT_SIZE, Size, NumberSize, getStringSize, getNumberSize, hasDirection, Direction, calculateNewMax, NewSize, findNextSnap, snap, clamp } from '../constants';
import BaseFoundation, { DefaultAdapter } from '../../base/foundation';

export interface ResizeHandlerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getResizeHandler: () => HTMLElement
}

export class ResizeHandlerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeHandlerAdapter<P, S>, P, S> {
    constructor(adapter: ResizeHandlerAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.getResizeHandler().addEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown = (e: MouseEvent) => {
        this.getProp('onResizeStart')(e, this.getProp('direction'));
    };

    destroy(): void {
        this._adapter.getResizeHandler().removeEventListener('mousedown', this.onMouseDown);
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

    lockAspectRatio = 1;
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

    get parent(): HTMLElement | null {
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

    get propSize(): Size {
        const porps = this.getProps();
        return porps.size || porps.defaultSize || DEFAULT_SIZE;
    }

    get size(): NumberSize {
        let width = 0;
        let height = 0;
        if (this.resizable && this.window) {
            const initialWidth = this.resizable.offsetWidth;
            const initialHeight = this.resizable.offsetHeight;
            const originalPosition = this.resizable.style.position;

            if (originalPosition !== 'relative') {
                this.resizable.style.position = 'relative';
            }

            width = this.resizable.style.width !== 'auto' ? this.resizable.offsetWidth : initialWidth;
            height = this.resizable.style.height !== 'auto' ? this.resizable.offsetHeight : initialHeight;

            this.resizable.style.position = originalPosition;
        }
        return { width, height };
    }

    get sizeStyle(): { width: string; height: string } {
        const size = this.getProp('size');
        const getSize = (property: 'width' | 'height'): string => {
            const value = this.getStates()[property];
            if (typeof value === 'undefined' || value === 'auto') {
                return 'auto';
            }
            const propSizeValue = this.propSize?.[property];

            if (propSizeValue?.toString().endsWith('%')) {
                if (value.toString().endsWith('%')) {
                    return value.toString();
                }

                const parentSize = this.getParentSize();
                const numberValue = Number(value.toString().replace('px', ''));
                const percentValue = (numberValue / parentSize[property]) * 100;

                return `${percentValue}%`;
            }

            return getStringSize(value);
        };

        const isResizing = this.getStates().isResizing;

        const width = size && typeof size.width !== 'undefined' && !isResizing
            ? getStringSize(size.width)
            : getSize('width');

        const height = size && typeof size.height !== 'undefined' && !isResizing
            ? getStringSize(size.height)
            : getSize('height');

        return { width, height };
    }

    getParentSize(): { width: number; height: number } {
        const appendPseudo = () => {
            if (!this.resizable || !this.window) {
                return null;
            }
            const parent = this.parent;
            if (!parent) {
                return null;
            }
            const pseudoEle = this.window.document.createElement('div');
            pseudoEle.style.width = '100%';
            pseudoEle.style.height = '100%';
            pseudoEle.style.position = 'absolute';
            pseudoEle.style.transform = 'scale(0, 0)';
            pseudoEle.style.left = '0';
            pseudoEle.style.flex = '0 0 100%';
            if (pseudoEle.classList) {
                pseudoEle.classList.add(prefixCls);
            } else {
                pseudoEle.className += prefixCls;
            }
            parent.appendChild(pseudoEle);
            return pseudoEle;
        };

        const removePseudo = (pseudo: HTMLElement) => {
            const parent = this.parent;
            if (!parent) {
                return;
            }
            parent.removeChild(pseudo);
        };
        if (!this.parent) {
            if (!this.window) {
                return { width: 0, height: 0 };
            }
            return { width: this.window.innerWidth, height: this.window.innerHeight };
        }
        const pseudoElement = appendPseudo();

        if (!pseudoElement) {
            return { width: 0, height: 0 };
        }

        let flexWrapChanged = false;
        const originalFlexWrap = this.parent.style.flexWrap;

        if (originalFlexWrap !== 'wrap') {
            flexWrapChanged = true;
            this.parent.style.flexWrap = 'wrap';
        }

        pseudoElement.style.position = 'relative';
        pseudoElement.style.minWidth = '100%';
        pseudoElement.style.minHeight = '100%';

        const size = {
            width: pseudoElement.offsetWidth,
            height: pseudoElement.offsetHeight,
        };

        if (flexWrapChanged) {
            this.parent.style.flexWrap = originalFlexWrap;
        }

        removePseudo(pseudoElement);
        return size;
    }

    registerEvents() {
        if (this.window) {
            this.window.addEventListener('mouseup', this.onMouseUp);
            this.window.addEventListener('mousemove', this.onMouseMove);
            this.window.addEventListener('mouseleave', this.onMouseUp);
        }
    }

    unregisterEvents() {
        if (this.window) {
            this.window.removeEventListener('mouseup', this.onMouseUp);
            this.window.removeEventListener('mousemove', this.onMouseMove);
            this.window.removeEventListener('mouseleave', this.onMouseUp);
        }
    }

    createSizeForCssProperty(newSize: number | string, property: 'width' | 'height'): number | string {
        const propSizeValue = this.propSize?.[property];
        const state = this.getStates();

        const isAutoSize =
            state[property] === 'auto' &&
            state.original[property] === newSize &&
            (typeof propSizeValue === 'undefined' || propSizeValue === 'auto');

        return isAutoSize ? 'auto' : newSize;
    }


    calculateBoundaryMax(maxWidth?: number, maxHeight?: number) {
        const { boundsByDirection } = this.getProps();
        const { direction } = this.getStates();

        const isWidthConstrained = boundsByDirection && hasDirection('left', direction);
        const isHeightConstrained = boundsByDirection && hasDirection('top', direction);

        let maxWidthConstraint: number;
        let maxHeightConstraint: number;

        const props = this.getProps();

        if (props.bounds === 'parent') {
            const parentElement = this.parent;
            if (parentElement) {
                maxWidthConstraint = isWidthConstrained
                    ? this.resizableRight - this.parentLeft
                    : parentElement.offsetWidth + (this.parentLeft - this.resizableLeft);

                maxHeightConstraint = isHeightConstrained
                    ? this.resizableBottom - this.parentTop
                    : parentElement.offsetHeight + (this.parentTop - this.resizableTop);
            }
        } else if (props.bounds === 'window' && this.window) {
            maxWidthConstraint = isWidthConstrained
                ? this.resizableRight
                : this.window.innerWidth - this.resizableLeft;
            maxHeightConstraint = isHeightConstrained
                ? this.resizableBottom
                : this.window.innerHeight - this.resizableTop;
        } else if (props.bounds) {
            const boundsElement = props.bounds;

            maxWidthConstraint = isWidthConstrained
                ? this.resizableRight - this.targetLeft
                : boundsElement.offsetWidth + (this.targetLeft - this.resizableLeft);
            maxHeightConstraint = isHeightConstrained
                ? this.resizableBottom - this.targetTop
                : boundsElement.offsetHeight + (this.targetTop - this.resizableTop);
        }

        if (maxWidthConstraint && Number.isFinite(maxWidthConstraint)) {
            maxWidth = maxWidth && maxWidth < maxWidthConstraint ? maxWidth : maxWidthConstraint;
        }
        if (maxHeightConstraint && Number.isFinite(maxHeightConstraint)) {
            maxHeight = maxHeight && maxHeight < maxHeightConstraint ? maxHeight : maxHeightConstraint;
        }

        return { maxWidth, maxHeight };
    }

    calculateDirectionSize(clientX: number, clientY: number) {
        const scale = this.getProps().scale || 1;
        let aspectRatio = this.getProps().ratio;
        const [resizeRatioX, resizeRatioY] = Array.isArray(aspectRatio) ? aspectRatio : [aspectRatio, aspectRatio];

        const { direction, original } = this.getStates();
        const { lockAspectRatio, lockAspectRatioExtraHeight = 0, lockAspectRatioExtraWidth = 0 } = this.getProps();

        let newWidth = original.width;
        let newHeight = original.height;

        const calculateNewWidth = (deltaX: number) => original.width + (deltaX * resizeRatioX) / scale;
        const calculateNewHeight = (deltaY: number) => original.height + (deltaY * resizeRatioY) / scale;

        if (hasDirection('top', direction)) {
            newHeight = calculateNewHeight(original.y - clientY);
            if (lockAspectRatio) {
                newWidth = (newHeight - lockAspectRatioExtraHeight) * this.lockAspectRatio + lockAspectRatioExtraWidth;
            }
        }
        if (hasDirection('bottom', direction)) {
            newHeight = calculateNewHeight(clientY - original.y);
            if (lockAspectRatio) {
                newWidth = (newHeight - lockAspectRatioExtraHeight) * this.lockAspectRatio + lockAspectRatioExtraWidth;
            }
        }
        if (hasDirection('right', direction)) {
            newWidth = calculateNewWidth(clientX - original.x);
            if (lockAspectRatio) {
                newHeight = (newWidth - lockAspectRatioExtraWidth) / this.lockAspectRatio + lockAspectRatioExtraHeight;
            }
        }
        if (hasDirection('left', direction)) {
            newWidth = calculateNewWidth(original.x - clientX);
            if (lockAspectRatio) {
                newHeight = (newWidth - lockAspectRatioExtraWidth) / this.lockAspectRatio + lockAspectRatioExtraHeight;
            }
        }

        return { newWidth, newHeight };
    }

    calculateAspectRatioSize(
        newWidth: number,
        newHeight: number,
        max: { width?: number; height?: number },
        min: { width?: number; height?: number },
    ) {
        const { lockAspectRatio, lockAspectRatioExtraHeight = 0, lockAspectRatioExtraWidth = 0 } = this.getProps();

        const minWidth = typeof min.width === 'undefined' ? 10 : min.width;
        const maxWidth = typeof max.width === 'undefined' || max.width < 0 ? newWidth : max.width;
        const minHeight = typeof min.height === 'undefined' ? 10 : min.height;
        const maxHeight = typeof max.height === 'undefined' || max.height < 0 ? newHeight : max.height;
        
        if (lockAspectRatio) {
            const adjustedMinWidth = (minHeight - lockAspectRatioExtraHeight) * this.lockAspectRatio + lockAspectRatioExtraWidth;
            const adjustedMaxWidth = (maxHeight - lockAspectRatioExtraHeight) * this.lockAspectRatio + lockAspectRatioExtraWidth;
            const adjustedMinHeight = (minWidth - lockAspectRatioExtraWidth) / this.lockAspectRatio + lockAspectRatioExtraHeight;
            const adjustedMaxHeight = (maxWidth - lockAspectRatioExtraWidth) / this.lockAspectRatio + lockAspectRatioExtraHeight;

            const lockedMinWidth = Math.max(minWidth, adjustedMinWidth);
            const lockedMaxWidth = Math.min(maxWidth, adjustedMaxWidth);
            const lockedMinHeight = Math.max(minHeight, adjustedMinHeight);
            const lockedMaxHeight = Math.min(maxHeight, adjustedMaxHeight);

            newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
            newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
        } else {
            newWidth = clamp(newWidth, minWidth, maxWidth);
            newHeight = clamp(newHeight, minHeight, maxHeight);
        }
        return { newWidth, newHeight };

    }

    setBoundingRect() {
        const props = this.getProps();
        
        // Set parent boundary
        if (props.bounds === 'parent') {
            const parentElement = this.parent;
            if (parentElement) {
                const parentRect = parentElement.getBoundingClientRect();
                this.parentLeft = parentRect.left;
                this.parentTop = parentRect.top;
            }
        }
    
        // Set target (HTML element) boundary
        if (props.bounds && typeof props.bounds !== 'string') {
            const targetRect = props.bounds.getBoundingClientRect();
            this.targetLeft = targetRect.left;
            this.targetTop = targetRect.top;
        }
    
        // Set resizable boundary
        if (this.resizable) {
            const { left, top, right, bottom } = this.resizable.getBoundingClientRect();
            this.resizableLeft = left;
            this.resizableRight = right;
            this.resizableTop = top;
            this.resizableBottom = bottom;
        }
    }
    

    onResizeStart(e: MouseEvent, direction: Direction) {
        if (!this.resizable || !this.window) {
            return;
        }
    
        const { clientX, clientY } = e;
        const props = this.getProps();
        const states = this.getStates();
    
        // Call onResizeStart callback if defined
        if (props.onResizeStart) {
            const shouldContinue = props.onResizeStart(e, direction, this.resizable);
            if (shouldContinue === false) {
                return;
            }
        }
    
        // Update state with new size if defined
        const { size } = props;
        if (size) {
            const { height, width } = size;
            const { height: currentHeight, width: currentWidth } = states;
    
            if (height !== undefined && height !== currentHeight) {
                this.setState({ height } as any);
            }
    
            if (width !== undefined && width !== currentWidth) {
                this.setState({ width } as any);
            }
        }
    
        // Handle aspect ratio locking
        this.lockAspectRatio = typeof props.lockAspectRatio === 'number'
            ? props.lockAspectRatio
            : this.size.width / this.size.height;
    
        // Determine flexBasis if applicable
        let flexBasis: string | undefined;
        const computedStyle = this.window.getComputedStyle(this.resizable);
        if (computedStyle.flexBasis !== 'auto') {
            const parent = this.parent;
            if (parent) {
                const parentStyle = this.window.getComputedStyle(parent);
                this.flexDir = parentStyle.flexDirection.startsWith('row') ? 'row' : 'column';
                flexBasis = computedStyle.flexBasis;
            }
        }
    
        // Set bounding rectangle and register events
        this.setBoundingRect();
        this.registerEvents();
    
        // Update state with initial resize values
        const state = {
            original: {
                x: clientX,
                y: clientY,
                width: this.size.width,
                height: this.size.height,
            },
            isResizing: true,
            backgroundStyle: {
                ...states.backgroundStyle,
                cursor: this.window.getComputedStyle(e.target as HTMLElement).cursor || 'auto',
            },
            direction,
            flexBasis,
        };
    
        this.setState(state as any);
    }
    

    onMouseMove(event: MouseEvent) {
        const states = this.getStates();
        const props = this.getProps();
    
        if (!states.isResizing || !this.resizable || !this.window) {
            return;
        }
    
        const { clientX, clientY } = event;
        const { direction, original, width, height } = states;
        const parentSize = this.getParentSize();
        let { maxWidth, maxHeight, minWidth, minHeight } = props;

        // Calculate max and min dimensions
        const maxBounds = calculateNewMax(
            parentSize,
            this.window.innerWidth,
            this.window.innerHeight,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight
        );

        maxWidth = maxBounds.maxWidth;
        maxHeight = maxBounds.maxHeight;
        minWidth = maxBounds.minWidth;
        minHeight = maxBounds.minHeight;
    
        // Calculate new size based on direction
        let { newWidth, newHeight }: NewSize = this.calculateDirectionSize(clientX, clientY);
        
        // Apply boundary constraints
        const boundaryMax = this.calculateBoundaryMax(maxWidth, maxHeight);
        newWidth = getNumberSize(newWidth, parentSize.width, this.window.innerWidth, this.window.innerHeight);
        newHeight = getNumberSize(newHeight, parentSize.height, this.window.innerWidth, this.window.innerHeight);
        
        // Apply snapping
        if (props.snap) {
            if (props.snap.x) {
                newWidth = findNextSnap(newWidth, props.snap.x, props.snapGap);
            }
            if (props.snap.y) {
                newHeight = findNextSnap(newHeight, props.snap.y, props.snapGap);
            }
        }
        
        // Adjust size based on aspect ratio
        const sizeFromAspectRatio = this.calculateAspectRatioSize(
            newWidth,
            newHeight,
            { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight },
            { width: minWidth, height: minHeight }
        );
        newWidth = sizeFromAspectRatio.newWidth;
        newHeight = sizeFromAspectRatio.newHeight;
        
        // Apply grid snapping if defined
        if (props.grid) {
            const [gridW, gridH] = props.grid;
            const gap = props.snapGap || 0;
            const newGridWidth = snap(newWidth, gridW);
            const newGridHeight = snap(newHeight, gridH);
            newWidth = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth; 
            newHeight = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
        }
    
        // Calculate delta
        const delta = {
            width: newWidth - original.width,
            height: newHeight - original.height
        };
    
        // Convert width and height to CSS units if needed
        const convertToCssUnit = (size: number, originalSize: number, unit: string): string | number => {

            if (unit.endsWith('%')) {
                return `${(size / originalSize) * 100}%`;
            } else if (unit.endsWith('vw')) {
                return `${(size / this.window.innerWidth) * 100}vw`;
            } else if (unit.endsWith('vh')) {
                return `${(size / this.window.innerHeight) * 100}vh`;
            }
            return size;
        };

        if (typeof width === 'string') {
            newWidth = convertToCssUnit(newWidth, parentSize.width, width || '');
        }

        if (typeof height === 'string') {
            newHeight = convertToCssUnit(newHeight, parentSize.height, height || '');
        }
        
        // Create new state
        const newState: { width: string | number; height: string | number; flexBasis?: string | number } = {
            width: this.createSizeForCssProperty(newWidth, 'width'),
            height: this.createSizeForCssProperty(newHeight, 'height')
        };
    
        if (this.flexDir === 'row') {
            newState.flexBasis = newState.width;
        } else if (this.flexDir === 'column') {
            newState.flexBasis = newState.height;
        }
    
        // Check for changes
        const widthChanged = states.width !== newState.width;
        const heightChanged = states.height !== newState.height;
        const flexBaseChanged = states.flexBasis !== newState.flexBasis;
        const hasChanges = widthChanged || heightChanged || flexBaseChanged;
    
        if (hasChanges) {
            this.setState(newState as any);
    
            // Call onResize callback if defined
            if (props.onResize) {
                props.onResize(event, direction, this.resizable, delta);
            }
        }
    }
    

    onMouseUp(event: MouseEvent) {
        const { isResizing, direction, original } = this.getStates();
    
        if (!isResizing || !this.resizable) {
            return;
        }
    
        const { width: currentWidth, height: currentHeight } = this.size;
        const delta = {
            width: currentWidth - original.width,
            height: currentHeight - original.height,
        };
    
        const { onResizeStop, size } = this.getProps();
    
        // Call onResizeStop callback if defined
        if (onResizeStop) {
            onResizeStop(event, direction, this.resizable, delta);
        }
    
        // Update state with new size if provided
        if (size) {
            this.setState({
                width: size.width ?? 'auto',
                height: size.height ?? 'auto'
            } as any);
        }
    
        // Unregister events and update state
        this.unregisterEvents();
        this.setState({
            isResizing: false,
            backgroundStyle: {
                ...this.getStates().backgroundStyle,
                cursor: 'auto'
            }
        } as any);
    }
    

    updateSize(size: Size) {
        this.setState({ width: size.width ?? 'auto', height: size.height ?? 'auto' } as any);
    }


    destroy(): void {
        if (this.window) {
            this.unregisterEvents();
        }
    }
}