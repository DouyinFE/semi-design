import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { getDirection } from './constants';

export interface ResizableAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getComponent: () => HTMLElement
    // setDirection: (direction: string) => void;
}

export default class ResizableFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ResizableAdapter<P, S>, P, S> {
    constructor(adapter: ResizableAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        const component = this._adapter.getComponent();
        component.addEventListener('mousedown', this.handleMouseDown);
        // component.addEventListener('mousemove', this.handleCursor)
    }

    direction: string;

    handleCursor = (e: MouseEvent) => {
        const component = this._adapter.getComponent();
        const direction = getDirection(component, e);
        if (direction) {
            component.style.cursor = direction + '-resize';
        } else {
            component.style.cursor = 'deafault';
        }
    }

    handleMouseDown = (e: MouseEvent): void => {
        
        const component = this._adapter.getComponent();

        const direction = getDirection(component, e);
        if (direction) {
            this.direction = direction;
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
        }
    }

    onMouseMove = (e: MouseEvent) => {
        console.log(e);
        const component = this._adapter.getComponent();
        const rect = component.getBoundingClientRect();
        const direction = this.direction;
        component.style.position = 'relative';
        if (direction === 'se') {
            component.style.width = `${e.clientX - rect.left}px`;
            component.style.height = `${e.clientY - rect.top}px`;
        } else if (direction === 'e') {
            component.style.width = `${e.clientX - rect.left}px`;
        } else if (direction === 's') {
            component.style.height = `${e.clientY - rect.top}px`;
        } else if (direction === 'sw') {
            // component.style.width = `${rect.right - e.clientX}px`;
            // component.style.height = `${e.clientY - rect.top}px`;
            component.style.left = `${e.clientX}px`;
        } else if (direction === 'w') {
            component.style.left = `${e.clientX}px`;
            // component.style.width = `${component.getBoundingClientRect().right - e.clientX}px`;
        } else if (direction === 'nw') {
            component.style.width = `${rect.right - e.clientX}px`;
            component.style.height = `${rect.bottom - e.clientY}px`;
            component.style.left = `${e.clientX}px`;
            component.style.top = `${e.clientY}px`;
        } else if (direction === 'n') {
            component.style.top = `${e.clientY}px`;
            // component.style.height = `${rect.bottom - e.clientY}px`;
            
        } else if (direction === 'ne') {
            component.style.width = `${e.clientX - rect.left}px`;
            component.style.height = `${rect.bottom - e.clientY}px`;
            component.style.top = `${e.clientY}px`;
        }
    }

    onMouseUp = () => {
        this.direction = null;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }
    

    destroy(): void {
        const component = this._adapter.getComponent();
        component.removeEventListener('mousedown', this.handleMouseDown);
        // component.removeEventListener('mousemove', this.handleCursor)
    }
}
