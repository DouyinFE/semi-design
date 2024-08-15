import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { keyToCode } from './constants'

export interface KeyboardShortCutAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyClick: () => void,
    getListenerTarget: () => HTMLElement,
    getHotKeys: () => string[],
}

export default class KeyboardShortCutFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<KeyboardShortCutAdapter<P, S>, P, S> {
    constructor(adapter: KeyboardShortCutAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        // init Listener
        const target = this._adapter.getListenerTarget()
        target.addEventListener('keydown', this.handleKeyDown)
    }

    handleKeyDown = (event: KeyboardEvent): void => {
        // console.log(event)

        const hotKeys = this.getProps().hotKeys
        const keysPressed = hotKeys.map((key : KeyboardEvent["key"])=> {
            if (key === "Meta") return event.metaKey; 
            if (key === "Shift") return event.shiftKey;
            if (key === "Alt") return event.altKey;
            if (key === "Ctrl") return event.ctrlKey
            return event.code === keyToCode(key); 
        });
        // console.log(keysPressed)
        if (keysPressed.every(Boolean)) {
            event.preventDefault()
            this.handleClick()
            return
        }
        
    }

    handleClick(): void {
        this._adapter.notifyClick()
    }

    destroy(): void {
        // remove Listener
        const target = this._adapter.getListenerTarget()
        target.removeEventListener('keydown', this.handleKeyDown)
    }
}
