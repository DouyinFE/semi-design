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
            height = '100%'
        } else if (direction === 'vertical'){
            width = '100%';
            height = defaultSize
        }

        return { width, height };
    }

    destroy(): void {
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
