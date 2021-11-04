import isNullOrUndefined from "./isNullOrUndefined";

export default class Event {
    _eventMap = new Map<string, Array<(...arg: any) => void>>();

    on(event: string, callback: (...arg: any) => void) {
        if (event && typeof callback === 'function') {
            this._eventMap.has(event) || this._eventMap.set(event, []);

            this._eventMap.get(event).push(callback);
        }
        return this;
    }

    once(event: string, callback: (...arg: any) => void) {
        if (event && typeof callback === 'function') {
            const fn = (...args: any) => {
                callback(...args);
                this.off(event, fn);
            };

            this.on(event, fn);
        }
    }

    off(event: string, callback: null | (() => void)) {
        if (event) {
            if (typeof callback === 'function') {
                const callbacks = this._eventMap.get(event);
                if (Array.isArray(callbacks) && callbacks.length) {
                    let index = -1;
                    // eslint-disable-next-line max-depth
                    while ((index = callbacks.findIndex(cb => cb === callback)) > -1) {
                        callbacks.splice(index, 1);
                    }
                }
            } else if (isNullOrUndefined(callback)) {
                this._eventMap.delete(event);
            }
        }
        return this;
    }

    emit(event: string, ...args: any[]) {
        if (!this._eventMap.has(event)) {
            return false;
        }
        this._eventMap.get(event).forEach(callback => callback(...args));
        return true;
    }
}
