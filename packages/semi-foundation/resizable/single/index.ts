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

export class ResizableFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizableAdapter<P, S>, P, S> {
    constructor(adapter: ResizableAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
    }

    destroy(): void {
    }
}
