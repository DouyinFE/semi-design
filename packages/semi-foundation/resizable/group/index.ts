import BaseFoundation, { DefaultAdapter } from '../../base/foundation';
import { DEFAULT_SIZE, Size, NumberSize, getStringSize, getNumberSize, has, Direction, NewSize, findNextSnap, snap } from "../singleConstants";
export interface ResizeHandlerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getHandler: () => HTMLElement;
    getHandlerIndex: () => number;
}

export class ResizeHandlerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeHandlerAdapter<P, S>, P, S> {
    constructor(adapter: ResizeHandlerAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.getHandler().addEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown = (e: MouseEvent) => {
        this.getContext('notifyResizeStart')(this._adapter.getHandlerIndex(), e);
        
        // this.getProp('onResizeStart')(e, this.getProp('direction'));
    };

    destroy(): void {
        this._adapter.getHandler().removeEventListener('mousedown', this.onMouseDown);
    }
}

export interface ResizeItemAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getItemRef: () => HTMLElement | null;    
    getItemIndex: () => number;
}

export class ResizeItemFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeItemAdapter<P, S>, P, S> {
    constructor(adapter: ResizeItemAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        if (!this.resizable || !this.window) {
            return;
        }
        const flexBasis = this.window.getComputedStyle(this.resizable).flexBasis;
        this.getConstraintById = this.getContext('getConstraintById');
        this.direction = this.getContext('direction');
        this.setState({
            width: this.propSize.width,
            height: this.propSize.height,
            flexBasis: flexBasis !== 'auto' ? flexBasis : undefined,
        } as any);

        this.onResizeStart = this.onResizeStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    curHandlerId: number;
    direction: 'horizontal' | 'vertical';
    getConstraintById: (id: number) => [number, number];
    flexDirection?: 'row' | 'column';
    resizable: HTMLElement | null = null;



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
        let defaultSize = this.getProp('defaultSize');
        if (this.direction === 'horizontal') {
            defaultSize.height = 'auto';
        } else {
            defaultSize.width = 'auto';
        }
        return porps.size || defaultSize || DEFAULT_SIZE;
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

    getCssPropertySize(newSize: number | string, property: 'width' | 'height'): number | string {
        const propSizeValue = this.propSize?.[property];
        const state = this.getStates();

        const isAutoSize =
            state[property] === 'auto' &&
            state.original[property] === newSize &&
            (typeof propSizeValue === 'undefined' || propSizeValue === 'auto');

        return isAutoSize ? 'auto' : newSize;
    }


    calDirectionSize(clientX: number, clientY: number) {
        const scale = this.getProps().scale || 1;

        const { direction, original } = this.getStates();

        let newWidth = original.width;
        let newHeight = original.height;

        const calculateNewWidth = (deltaX: number) => original.width + (deltaX) / scale;
        const calculateNewHeight = (deltaY: number) => original.height + (deltaY) / scale;

        if (has('top', direction)) {
            newHeight = calculateNewHeight(original.y - clientY);
        }
        if (has('bottom', direction)) {
            newHeight = calculateNewHeight(clientY - original.y);
        }
        if (has('right', direction)) {
            newWidth = calculateNewWidth(clientX - original.x);
        }
        if (has('left', direction)) {
            newWidth = calculateNewWidth(original.x - clientX);
        }

        return { newWidth, newHeight };
    }



    onResizeStart = (e: MouseEvent, direction: Direction) => {
        this.resizable = this._adapter.getItemRef();
        if (!this.resizable || !this.window) {
            return;
        }

        const { clientX, clientY } = e;
        const props = this.getProps();
        const states = this.getStates();

        // Call onResizeStart callback if defined
        if (props.onResizeStart) {
            const shouldContinue = props.onResizeStart(e, direction);
            if (shouldContinue === false) {
                return;
            }
        }
        
        // Determine flexBasis if applicable
        let flexBasis: string | undefined;
        const computedStyle = this.window.getComputedStyle(this.resizable);
        if (computedStyle.flexBasis !== 'auto') {
            const parent = this.parent;
            if (parent) {
                const parentStyle = this.window.getComputedStyle(parent);
                this.flexDirection = parentStyle.flexDirection.startsWith('row') ? 'row' : 'column';
                flexBasis = computedStyle.flexBasis;
            }
        }

        // Set bounding rectangle and register events
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


    onMouseMove = (event: MouseEvent) => {
        const states = this.getStates();
        const props = this.getProps();

        if (!states.isResizing || !this.resizable || !this.window) {
            return;
        }

        const { clientX, clientY } = event;
        let [last, next] = this.getConstraintById(this.curHandlerId);
        if (this.direction === 'horizontal') {
            if (clientX <= last || clientX >= next) {
                return;
            }
        } else if (this.direction === 'vertical') {
            if (clientY <= last || clientY >= next) {
                return;
            }
        }
        const { direction, original, width, height } = states;
        const parentSize = this.getParentSize();

        // Calculate new size based on direction
        let { newWidth, newHeight }: NewSize = this.calDirectionSize(clientX, clientY);

        // Apply boundary constraints
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

        // Apply grid snapping if defined
        if (props.grid) {
            const [gridW, gridH] = Array.isArray(props.grid) ? props.grid : [props.grid, props.grid];
            const gap = props.snapGap || 0;
            const newGridWidth = snap(newWidth, gridW);
            const newGridHeight = snap(newHeight, gridH);
            newWidth = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
            newHeight = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
        }

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
            width: this.getCssPropertySize(newWidth, 'width'),
            height: this.getCssPropertySize(newHeight, 'height')
        };

        if (this.flexDirection === 'row') {
            newState.flexBasis = newState.width;
        } else if (this.flexDirection === 'column') {
            newState.flexBasis = newState.height;
        }

        // Check for changes
        const widthChanged = states.width !== newState.width;
        const heightChanged = states.height !== newState.height;
        const flexBaseChanged = states.flexBasis !== newState.flexBasis;
        const hasChanges = widthChanged || heightChanged || flexBaseChanged;

        if (hasChanges) {
            this.setState(newState as any);

            // Call onChange callback if defined
            if (props.onChange) {
                props.onChange(event, direction, this.size);
            }
        }
    }


    onMouseUp = (event: MouseEvent) => {
        const { isResizing, direction, original } = this.getStates();

        if (!isResizing || !this.resizable) {
            return;
        }

        const { width: currentWidth, height: currentHeight } = this.size;
        const delta = {
            width: currentWidth - original.width,
            height: currentHeight - original.height,
        };

        const { onResizeEnd, size } = this.getProps();

        // Call onResizeEnd callback if defined
        if (onResizeEnd) {
            onResizeEnd(event, direction);
        }

        // Update state with new size if provided
        if (size) {
            this.setState({
                width: size.width ?? 'auto',
                height: size.height ?? 'auto'
            } as any);
        }

        // Unregister events and update isResizing state
        this.unregisterEvents();
        this.setState({
            isResizing: false,
            backgroundStyle: {
                ...this.getStates().backgroundStyle,
                cursor: 'auto'
            }
        } as any);
    }


    destroy(): void {
        this.unregisterEvents();
    }
}

export interface ResizeGroupAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    
}

export class ResizeGroupFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeGroupAdapter<P, S>, P, S> {
    constructor(adapter: ResizeGroupAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        
    }

    destroy(): void {
        
    }
}
