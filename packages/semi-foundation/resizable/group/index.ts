import { getItemDirection } from '../groupConstants';
import BaseFoundation, { DefaultAdapter } from '../../base/foundation';
import { ResizeStartCallback, ResizeCallback } from "../singleConstants";
import { getPixelSize, judgeConstraint } from '../groupConstants';
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

    onResizeStart = (handlerIndex: number, e: MouseEvent) => { // handler ref
        let { clientX, clientY } = e;
        let lastItem = this._adapter.getItem(handlerIndex), nextItem = this._adapter.getItem(handlerIndex + 1);
        let handler = this._adapter.getHandler(handlerIndex);
        let lastOffset: number, nextOffset: number;
        if (this.direction === 'horizontal') {
            this.itemMinSize = handler.offsetWidth;
            lastOffset = clientX - handler.offsetLeft;
            nextOffset = handler.offsetLeft + handler.offsetWidth - clientX;
        } else if (this.direction === 'vertical') {
            this.itemMinSize = handler.offsetHeight;
        }
        this.setState({
            isResizing: true,
            originalPosition: {
                x: clientX,
                y: clientY,
                lastItemSize: this.direction === 'horizontal' ? lastItem.offsetWidth : lastItem.offsetHeight,
                nextItemSize: this.direction === 'horizontal' ? nextItem.offsetWidth : nextItem.offsetHeight,
                lastOffset,
                nextOffset,
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
        let { x: initX, y: initY, lastItemSize, nextItemSize, lastOffset, nextOffset } = originalPosition;
        console.log(lastItemSize, nextItemSize, lastOffset, nextOffset)
        let { clientX, clientY } = e;

        const props = this.getProps();
        const { direction } = props;
        let lastItem = this._adapter.getItem(curHandler), nextItem = this._adapter.getItem(curHandler + 1);

        if (direction === 'horizontal') {
            let delta = clientX - initX;
            let parentWidth = this._adapter.getGroupRef().getBoundingClientRect().width;
            let lastNewSize = lastItemSize + delta, nextNewSize = nextItemSize - delta;
            let lastFlag = judgeConstraint(lastNewSize, lastItem.style.minWidth, lastItem.style.maxWidth, parentWidth),
                nextFlag = judgeConstraint(nextNewSize, nextItem.style.minWidth, nextItem.style.maxWidth, parentWidth);
            console.log(lastNewSize, lastItem.style.minWidth, lastItem.style.maxWidth, lastFlag, 
                nextNewSize ,nextItem.style.minWidth, nextItem.style.maxWidth, nextFlag);
            if (lastFlag && nextFlag) {
                lastItem.style.width = (lastItemSize + delta) / parentWidth * 100 + '%';
                nextItem.style.width = (nextItemSize - delta) / parentWidth * 100 + '%';
            }
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
