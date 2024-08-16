import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { keyToCode } from './constants';

export interface KeyboardShortCutAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyClick: () => void;
    getListenerTarget: () => HTMLElement;
    getHotKeys: () => string[]
}

export default class KeyboardShortCutFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<KeyboardShortCutAdapter<P, S>, P, S> {
    constructor(adapter: KeyboardShortCutAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        // init Listener
        const target = this._adapter.getListenerTarget();
        target?.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event: KeyboardEvent): void => {
        const disabled = this.getProps().disabled;
        if (disabled) {
            return;
        }
        const hotKeys = this.getProps().hotKeys;
        let allModifier = new Array(4).fill(false); // Meta Shift Alt Ctrl
        let clickedModifier = [event.metaKey, event.shiftKey, event.altKey, event.ctrlKey];
        const keysPressed = hotKeys?.map((key: KeyboardEvent["key"])=> {
            if (key === "Meta") {
                allModifier[0] = true;
                return event.metaKey; 
            } else if (key === "Shift") {
                allModifier[1] = true;
                return event.shiftKey;
            } else if (key === "Alt") {
                allModifier[2] = true;
                return event.altKey;
            } else if (key === "Control") {
                allModifier[3] = true;
                return event.ctrlKey;
            }
            return event.code === keyToCode(key); 
        });

        if (!allModifier.every((value, index) => value === clickedModifier[index])) {
            return;
        }
        if (keysPressed.every(Boolean)) {
            event.preventDefault();
            this.handleClick();
            return;
        }
        
    }

    handleClick(): void {
        this._adapter.notifyClick();
    }

    destroy(): void {
        // remove Listener
        const target = this._adapter.getListenerTarget();
        target?.removeEventListener('keydown', this.handleKeyDown);
    }
}
