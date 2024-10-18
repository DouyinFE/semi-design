import { getItemDirection, getPixelSize } from "../utils";
import BaseFoundation, { DefaultAdapter } from '../../base/foundation';
import { ResizeStartCallback, ResizeCallback } from "../singleConstants";
import { adjustNewSize, judgeConstraint, getOffset } from "../utils";
export interface ResizeHandlerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    registerEvents: () => void;
    unregisterEvents: () => void
}

export class ResizeHandlerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeHandlerAdapter<P, S>, P, S> {
    constructor(adapter: ResizeHandlerAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.registerEvents();
    }

    destroy(): void {
        this._adapter.unregisterEvents();
    }
}

export interface ResizeItemAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
}

export class ResizeItemFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeItemAdapter<P, S>, P, S> {
    constructor(adapter: ResizeItemAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
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
    getItemDefaultSize: (index: number) => string | number;
    registerEvents: () => void;
    unregisterEvents: () => void
}

export class ResizeGroupFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizeGroupAdapter<P, S>, P, S> {
    constructor(adapter: ResizeGroupAdapter<P, S>) {
        super({ ...adapter });
    }

    get groupRef(): HTMLDivElement | null {
        return this._adapter.getGroupRef();
    }

    direction: 'horizontal' | 'vertical'
    itemMinusMap: Map<number, number>;
    totalMinus: number;
    avaliableSize: number;


    init(): void {
        this.direction = this.getProp('direction');
        this.itemMinusMap = new Map();
        this.calculateSpace();
    }
    get window(): Window | null {
        return this.groupRef.ownerDocument.defaultView as Window ?? null;
    }

    
    registerEvents = () => {
        this._adapter.registerEvents();
    }

    unregisterEvents = () => {
        this._adapter.unregisterEvents();
    }

    onResizeStart = (handlerIndex: number, e: MouseEvent) => { // handler ref
        let { clientX, clientY } = e;
        let lastItem = this._adapter.getItem(handlerIndex), nextItem = this._adapter.getItem(handlerIndex + 1);
        let lastOffset: number, nextOffset: number;
        // offset caused by padding and border
        const lastStyle = this.window.getComputedStyle(lastItem);
        const nextStyle = this.window.getComputedStyle(nextItem);

        lastOffset = getOffset(lastStyle, this.direction);
        nextOffset = getOffset(nextStyle, this.direction);
        const states = this.getStates();
        this.setState({
            isResizing: true,
            originalPosition: {
                x: clientX,
                y: clientY,
                lastItemSize: (this.direction === 'horizontal' ? lastItem.offsetWidth : lastItem.offsetHeight),
                nextItemSize: (this.direction === 'horizontal' ? nextItem.offsetWidth : nextItem.offsetHeight),
                lastOffset,
                nextOffset,
            },
            backgroundStyle: {
                ...states.backgroundStyle,
                cursor: this.window.getComputedStyle(e.target as HTMLElement).cursor || 'auto',
            },
            curHandler: handlerIndex
        } as any);
        this.registerEvents();

        let lastStart = this._adapter.getItemStart(handlerIndex), 
            nextStart = this._adapter.getItemStart(handlerIndex + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction);
        if (lastStart) {
            lastStart(e, lastDir as any);
        }
        if (nextStart) {
            nextStart(e, nextDir as any);
        }
    }


    onResizing = (e: MouseEvent) => {
        const state = this.getStates();
        if (!state.isResizing) {
            return;
        }
        const { curHandler, originalPosition } = state;
        let { x: initX, y: initY, lastItemSize, nextItemSize, lastOffset, nextOffset } = originalPosition;
        let { clientX, clientY } = e;

        const props = this.getProps();
        const { direction } = props;
        let lastItem = this._adapter.getItem(curHandler), nextItem = this._adapter.getItem(curHandler + 1);
        let parentSize = this.direction === 'horizontal' ? this.groupRef.offsetWidth : this.groupRef.offsetHeight;
        let availableSize = parentSize - this.totalMinus;

        let delta = direction === 'horizontal' ? (clientX - initX) : (clientY - initY);
        let lastNewSize = lastItemSize + delta;
        let nextNewSize = nextItemSize - delta;

        // 判断是否超出限制
        let lastFlag = judgeConstraint(lastNewSize, this._adapter.getItemMin(curHandler), this._adapter.getItemMax(curHandler), availableSize, lastOffset),
            nextFlag = judgeConstraint(nextNewSize, this._adapter.getItemMin(curHandler + 1), this._adapter.getItemMax(curHandler + 1), availableSize, nextOffset);

        if (lastFlag) {
            lastNewSize = adjustNewSize(lastNewSize, this._adapter.getItemMin(curHandler), this._adapter.getItemMax(curHandler), availableSize, lastOffset);
            nextNewSize = lastItemSize + nextItemSize - lastNewSize;
        }

        if (nextFlag) {
            nextNewSize = adjustNewSize(nextNewSize, this._adapter.getItemMin(curHandler + 1), this._adapter.getItemMax(curHandler + 1), availableSize, nextOffset);
            lastNewSize = lastItemSize + nextItemSize - nextNewSize;
        }

        if (direction === 'horizontal') {     
            lastItem.style.width = (lastNewSize) / parentSize * 100 + '%';
            nextItem.style.width = (nextNewSize) / parentSize * 100 + '%';
        } else if (direction === 'vertical') {
            lastItem.style.height = (lastNewSize) / parentSize * 100 + '%';
            nextItem.style.height = (nextNewSize) / parentSize * 100 + '%';
        }

        let lastFunc = this._adapter.getItemChange(curHandler),
            nextFunc = this._adapter.getItemChange(curHandler + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction);
        if (lastFunc) {
            lastFunc( { width: lastItem.offsetWidth, height: lastItem.offsetHeight }, e, lastDir as any);
        }
        if (nextFunc) {
            nextFunc( { width: nextItem.offsetWidth, height: nextItem.offsetHeight }, e, nextDir as any);
        }
    }

    onResizeEnd = (e: MouseEvent) => {
        const { curHandler } = this.getStates();
        let lastItem = this._adapter.getItem(curHandler), nextItem = this._adapter.getItem(curHandler + 1);
        let lastFunc = this._adapter.getItemEnd(curHandler),
            nextFunc = this._adapter.getItemEnd(curHandler + 1);
        let [lastDir, nextDir] = getItemDirection(this.direction);
        if (lastFunc) {
            lastFunc( { width: lastItem.offsetWidth, height: lastItem.offsetHeight }, e, lastDir as any);
        }
        if (nextFunc) {
            nextFunc( { width: nextItem.offsetWidth, height: nextItem.offsetHeight }, e, nextDir as any);
        }
        this.setState({
            isResizing: false,
            curHandler: null
        } as any);
        this.unregisterEvents();
    }

    calculateSpace = () => {
        const props = this.getProps();
        const { direction } = props;

        // calculate accurate space for group item
        let handlerSizes = new Array(this._adapter.getHandlerCount()).fill(0);
        let groupSize = direction === 'horizontal' ? this.groupRef.offsetWidth : this.groupRef.offsetHeight;
        this.totalMinus = 0;
        for (let i = 0; i < this._adapter.getHandlerCount(); i++) {
            let handlerSize = direction === 'horizontal' ? this._adapter.getHandler(i).offsetWidth : this._adapter.getHandler(i).offsetHeight;
            handlerSizes[i] = handlerSize;
            this.totalMinus += handlerSize;
        }
        
        // allocate size for items which don't have default size
        let totalSizePercent = 0;
        let undefineLoc: Map<number, number> = new Map(), undefinedTotal = 0; // proportion

        for (let i = 0; i < this._adapter.getItemCount(); i++) {
            if (i === 0) {
                this.itemMinusMap.set(i, handlerSizes[i] / 2);
            } else if (i === this._adapter.getItemCount() - 1) {
                this.itemMinusMap.set(i, handlerSizes[i - 1] / 2);
            } else {
                this.itemMinusMap.set(i, handlerSizes[i - 1] / 2 + handlerSizes[i] / 2);
            }
            const child = this._adapter.getItem(i);
            let minSize = this._adapter.getItemMin(i), maxSize = this._adapter.getItemMax(i);
            let minSizePercent = minSize ? getPixelSize(minSize, groupSize) / groupSize * 100 : 0,
                maxSizePercent = maxSize ? getPixelSize(maxSize, groupSize) / groupSize * 100 : 100;
            if (minSizePercent > maxSizePercent) {
                console.warn('[Semi ResizableItem]: min size bigger than max size');
            }    

            let defaultSize = this._adapter.getItemDefaultSize(i);
            if (defaultSize) {
                let itemSizePercent: number;
                if (typeof defaultSize === 'string') {
                    if (defaultSize.endsWith('%')) {
                        itemSizePercent = parseFloat(defaultSize.slice(0, -1));
                    } else if (defaultSize.endsWith('px')) {
                        itemSizePercent = parseFloat(defaultSize.slice(0, -2)) / groupSize * 100;
                    } else if (/^-?\d+(\.\d+)?$/.test(defaultSize)) {
                        // 仅由数字组成，表示按比例分配剩下空间
                        undefineLoc.set(i, parseFloat(defaultSize));
                        undefinedTotal += parseFloat(defaultSize);
                        continue;
                    }
                } else {
                    undefineLoc.set(i, defaultSize);
                    undefinedTotal += defaultSize;
                    continue;
                }
                

                totalSizePercent += itemSizePercent;
                
                if (direction === 'horizontal') {
                    child.style.width = `calc(${itemSizePercent}% - ${this.itemMinusMap.get(i)}px)`;
                } else {
                    child.style.height = `calc(${itemSizePercent}% - ${this.itemMinusMap.get(i)}px)`;
                }
                
                if (itemSizePercent < minSizePercent) {
                    console.warn('[Semi ResizableGroup]: item size smaller than min size');
                } 
                if (itemSizePercent > maxSizePercent) {
                    console.warn('[Semi ResizableGroup]: item size bigger than max size');
                }
            } else {
                undefineLoc.set(i, 1);
                undefinedTotal += 1;
            }
        }
        let undefineSizePercent = 100 - totalSizePercent;
        if (totalSizePercent > 100) {
            console.warn('[Semi ResizableGroup]: total Size bigger than 100%');
            undefineSizePercent = 10; // 如果总和超过100%，则保留10%的空间均分给未定义的item
        }
    
        undefineLoc.forEach((value, key) => {
            const child = this._adapter.getItem(key);
            if (direction === 'horizontal') {
                child.style.width = `calc(${undefineSizePercent / undefinedTotal * value}% - ${this.itemMinusMap.get(key)}px)`;
            } else {
                child.style.height = `calc(${undefineSizePercent / undefinedTotal * value}% - ${this.itemMinusMap.get(key)}px)`;
            }
        });
    }

    destroy(): void {
        
    }
}
