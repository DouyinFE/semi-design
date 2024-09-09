import { getItemDirection } from '../groupConstants';
import BaseFoundation, { DefaultAdapter } from '../../base/foundation';
import { ResizeStartCallback, ResizeCallback } from "../singleConstants";
import { getPixelSize } from '../groupConstants';
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
    };

    destroy(): void {
        this._adapter.getHandler().removeEventListener('mousedown', this.onMouseDown);
    }
}

export interface ResizeItemAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getItemRef: () => HTMLElement | null;    
    getItemIndex: () => number;
    getParentSize: () => { width: number; height: number };
}

export class ResizeItemFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeItemAdapter<P, S>, P, S> {
    constructor(adapter: ResizeItemAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this.resizable = this._adapter.getItemRef();
    }

    resizable: HTMLElement | null = null;

    get sizeStyle(): { width: string; height: string } {
        let defaultSize = this.getProp('defaultSize');
        let width: string, height: string;
        let direction = this.getContext('direction');
        if (direction === 'horizontal') {
            width = defaultSize
        } else if (direction === 'vertical'){
            height = defaultSize
        }

        return { width, height };
    }

    destroy(): void {
    }
}

export interface ResizeGroupAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getGroupRef: () => HTMLDivElement | null;
    getItem: (index: number) => HTMLDivElement;
    getItemCount: () => number;
    getHandler: (index: number) => HTMLDivElement;
    getHandlerCount: () => number;
    getItemMin: (index: number) => string;
    getItemMax: (index: number) => string;
    getItemStart: (index: number) => ResizeStartCallback;
    getItemChange: (index: number) => ResizeCallback;
    getItemEnd: (index: number) => ResizeCallback;  
}

export class ResizeGroupFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeGroupAdapter<P, S>, P, S> {
    constructor(adapter: ResizeGroupAdapter<P, S>) {
        super({ ...adapter });
    }

    groupRef: HTMLDivElement
    direction: 'horizontal' | 'vertical'
    itemMinSize: number = 0; // the size of handler define the min size of item to contain border
    constraintsMap: Map<number, [number, number]>;

    init(): void {
        this.groupRef = this._adapter.getGroupRef();
        this.direction = this.getProp('direction')
        this.constraintsMap = new Map();
    }
    get window(): Window | null {
        return this.groupRef.ownerDocument.defaultView as Window ?? null;
    }

    
    registerEvents = () => {
        if (this.window) {
            this.window.addEventListener('mousemove', this.onResizing);
            this.window.addEventListener('mouseup', this.onResizeEnd);
            this.window.addEventListener('mouseleave', this.onResizeEnd);
        }
    }

    unregisterEvents = () => {
        if (this.window) {
            this.window.removeEventListener('mousemove', this.onResizing);
            this.window.removeEventListener('mouseup', this.onResizeEnd);
            this.window.removeEventListener('mouseleave', this.onResizeEnd);
        }
    }

    updateConstraints = () => {
        // this item constaint last / next handler
        let lastConstraints = new Map(), nextConstraints = new Map();
        if (this.direction === 'horizontal') {
            const parentWidth = this.groupRef.getBoundingClientRect().width;
            for (let i = 0; i < this._adapter.getItemCount(); i++) {
                const child = this._adapter.getItem(i);

                let itemMin = this._adapter.getItemMin(i)
                const minWidth = itemMin ? getPixelSize(itemMin, parentWidth) : 0;
                const rect = child.getBoundingClientRect();
                let { borderLeftWidth, borderRightWidth } = this.window.getComputedStyle(child);
                let leftWidth = Number(borderLeftWidth.replace('px', ''));
                let rightWidth = Number(borderRightWidth.replace('px', ''));
                let borderWidth = leftWidth + rightWidth + this.itemMinSize;

                let nextLeftConstraint = rect.left + minWidth + borderWidth, nextRightConstraint = undefined;
                let lastRightConstraint = rect.right - minWidth - borderWidth, lastLeftConstraint = undefined;
                let itemMax = this._adapter.getItemMax(i)
                if (itemMax) {
                    const maxWidth = getPixelSize(itemMax, parentWidth);
                    nextRightConstraint = rect.left + maxWidth - borderWidth;
                    lastLeftConstraint = rect.right - maxWidth + borderWidth;
                }

                lastConstraints.set(i - 1, [lastLeftConstraint, lastRightConstraint]);
                nextConstraints.set(i, [nextLeftConstraint, nextRightConstraint]);
            }
        } else {
            const parentHeight = this.groupRef.getBoundingClientRect().height;
            for (let i = 0; i < this._adapter.getItemCount(); i++) {
                const child = this._adapter.getItem(i);

                let itemMin = this._adapter.getItemMin(i)
                const minHeight = itemMin ? getPixelSize(itemMin, parentHeight) : 0;
                const rect = child.getBoundingClientRect();
                let { borderTopWidth, borderBottomWidth } = this.window.getComputedStyle(child);
                let topWidth = Number(borderTopWidth.replace('px', ''));
                let bottomWidth = Number(borderBottomWidth.replace('px', ''));
                let borderWidth = (topWidth + bottomWidth) + this.itemMinSize;

                let nextTopConstraint = rect.top + minHeight + borderWidth, nextBottomConstraint = undefined;
                let lastBottomConstraint = rect.bottom - minHeight - borderWidth, lastTopConstraint = undefined;
                let itemMax = this._adapter.getItemMax(i)
                if (itemMax) {
                    const maxHeight = getPixelSize(itemMax, parentHeight);
                    nextBottomConstraint = rect.top + maxHeight - borderWidth;
                    lastTopConstraint = rect.bottom - maxHeight + borderWidth;
                }

                lastConstraints.set(i - 1, [lastTopConstraint, lastBottomConstraint]);
                nextConstraints.set(i, [nextTopConstraint, nextBottomConstraint]);

            }
        }

        for (let i = 0; i < this._adapter.getHandlerCount(); i++) {
            // lastBack and nextFront wont be undefined
            let [lastFront, lastBack] = lastConstraints.get(i);
            let [nextFront, nextBack] = nextConstraints.get(i);
            let front = lastFront === undefined ? nextFront : Math.max(lastFront, nextFront);
            let back = nextBack === undefined ? lastBack : Math.min(lastBack, nextBack);
            this.constraintsMap.set(i, [front, back]);
        }
    }

    onResizeStart = (handlerIndex: number, e: MouseEvent) => { // handler ref
        let { clientX, clientY } = e;
        let lastItem = this._adapter.getItem(handlerIndex), nextItem = this._adapter.getItem(handlerIndex + 1);
        if (this.direction === 'horizontal') {
            this.itemMinSize = this._adapter.getHandler(handlerIndex).offsetWidth;
            
        } else if (this.direction === 'vertical') {
            this.itemMinSize = this._adapter.getHandler(handlerIndex).offsetHeight;
        }
        this.updateConstraints();
        this.setState({
            isResizing: true,
            originalPosition: {
                x: clientX,
                y: clientY,
                lastItemSize: this.direction === 'horizontal' ? lastItem.offsetWidth : lastItem.offsetHeight,
                nextItemSize: this.direction === 'horizontal' ? nextItem.offsetWidth : nextItem.offsetHeight,
            },
            curHandler: handlerIndex,
            curConstraint: this.constraintsMap.get(handlerIndex),
        } as any)
        this.registerEvents();

        let lastStart = this._adapter.getItemStart(handlerIndex), 
            nextStart = this._adapter.getItemStart(handlerIndex + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction)
        if (lastStart) {
            lastStart(e, lastDir as any)
        }
        if (nextStart) {
            nextStart(e, nextDir as any)
        }
    }


    onResizing = (e: MouseEvent) => {
        const state = this.getStates()
        if (!state.isResizing) {
            return
        }
        const { curHandler, originalPosition, curConstraint } = state;
        const { x: initX, y: initY, lastItemSize, nextItemSize } = originalPosition;
        const { clientX, clientY } = e;

        if (curConstraint) {
            if (this.direction === 'horizontal') {
                if (clientX <= curConstraint[0] || clientX >= curConstraint[1]) {
                    return
                }
            } else if (this.direction === 'vertical') {
                if (clientY <= curConstraint[0] || clientY >= curConstraint[1]) {
                    return
                }
            }
        }

        const props = this.getProps();
        const { direction } = props;
        let lastItem = this._adapter.getItem(curHandler), nextItem = this._adapter.getItem(curHandler + 1);

        if (direction === 'horizontal') {
            let delta = clientX - initX;
            let parentWidth = this._adapter.getGroupRef().getBoundingClientRect().width;
            lastItem.style.width = (lastItemSize + delta) / parentWidth * 100 + '%';
            nextItem.style.width = (nextItemSize - delta) / parentWidth * 100 + '%';
        } else if (direction === 'vertical') {
            let delta = clientY - initY;
            let parentHeight = this._adapter.getGroupRef().getBoundingClientRect().height;
            lastItem.style.height = (lastItemSize + delta) / parentHeight * 100 + '%';
            nextItem.style.height = (nextItemSize - delta) / parentHeight * 100 + '%';
        }

        let lastFunc = this._adapter.getItemChange(curHandler),
            nextFunc = this._adapter.getItemChange(curHandler + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction)
        if (lastFunc) {
            lastFunc( {width: lastItem.offsetWidth, height: lastItem.offsetHeight}, e, lastDir as any)
        }
        if (nextFunc) {
            nextFunc( {width: nextItem.offsetWidth, height: nextItem.offsetHeight}, e, nextDir as any)
        }
    }

    onResizeEnd = (e: MouseEvent) => {
        const { curHandler } = this.getStates();
        let lastItem = this._adapter.getItem(curHandler), nextItem = this._adapter.getItem(curHandler + 1);
        let lastFunc = this._adapter.getItemEnd(curHandler),
            nextFunc = this._adapter.getItemEnd(curHandler + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction)
        if (lastFunc) {
            lastFunc( {width: lastItem.offsetWidth, height: lastItem.offsetHeight}, e, lastDir as any)
        }
        if (nextFunc) {
            nextFunc( {width: nextItem.offsetWidth, height: nextItem.offsetHeight}, e, nextDir as any)
        }
        this.setState({
            isResizing: false,
            curConstraint: null,
            curHandler: null
        } as any)
        this.unregisterEvents();
    }

    destroy(): void {
        
    }
}
