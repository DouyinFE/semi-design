/* eslint-disable no-param-reassign */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';

const KeyCode = {
    LEFT: 37,
    RIGHT: 39
};

export interface RatingAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    focus: () => void;
    getStarDOM: (index: number) => Element;
    notifyHoverChange: (hoverValue: number, clearedValue: number) => void;
    updateValue: (value: number) => void;
    clearValue: (clearedValue: number) => void;
    notifyFocus: (e: any) => void;
    notifyBlur: (e: any) => void;
    notifyKeyDown: (e: any) => void;
}

export default class RatingFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<RatingAdapter<P, S>, P, S> {

    constructor(adapter: RatingAdapter<P, S>) {
        super({ ...RatingFoundation.defaultAdapter, ...adapter });
    }

    init() {
        const { autoFocus, disabled } = this.getProps();
        if (autoFocus && !disabled) {
            this._adapter.focus();
        }
    }

    _getScroll(w: Window, top?: boolean) {
        let ret = top ? w.pageYOffset : w.pageXOffset;
        const method = top ? 'scrollTop' : 'scrollLeft';
        if (typeof ret !== 'number') {
            const d = w.document;
            // ie6,7,8 standard mode
            ret = d.documentElement[method];
            if (typeof ret !== 'number') {
                // quirks mode
                ret = d.body[method];
            }
        }
        return ret;
    }

    _getClientPosition(elem: Element) {
        let x, y;
        const doc = elem.ownerDocument;
        const { body } = doc;
        const docElem = doc && doc.documentElement;
        const box = elem.getBoundingClientRect();
        x = box.left;
        y = box.top;
        x -= docElem.clientLeft || body.clientLeft || 0;
        y -= docElem.clientTop || body.clientTop || 0;
        return {
            left: x,
            top: y,
        };
    }

    _getOffsetLeft(el: Element) {
        const pos = this._getClientPosition(el);
        const doc = el.ownerDocument;
        const w: Window = doc.defaultView || (doc as any).parentWindow;
        pos.left += this._getScroll(w);
        return pos.left;
    }

    getStarValue(index: number, pos: number) {
        const { allowHalf } = this.getProps();
        const direction = this._adapter.getContext('direction');
        const reverse = direction === 'rtl';
        let value = index + 1;
        if (allowHalf) {
            const starEle = this._adapter.getStarDOM(index);
            const leftDis = this._getOffsetLeft(starEle);
            const width = starEle.clientWidth;
            if (reverse && pos - leftDis > width / 2) {
                value -= 0.5;
            } else if (!reverse && pos - leftDis < width / 2) {
                value -= 0.5;
            }
        }
        return value;
    }

    handleHover(event: any, index: number) {
        const currValue = this.getStarValue(index, event.pageX);
        const { clearedValue, hoverValue } = this.getStates();
        if ((currValue !== hoverValue) && (currValue !== clearedValue)) {
            this._adapter.notifyHoverChange(currValue, null);
        }
    }

    handleMouseLeave() {
        this._adapter.notifyHoverChange(undefined, null);
    }

    handleClick(event: any, index: number) {
        const { allowClear } = this.getProps();
        const { value } = this.getStates();
        const newValue = this.getStarValue(index, event.pageX);
        const isReset = allowClear ? newValue === value : false;
        this._adapter.updateValue(isReset ? 0 : newValue);
        if (isReset) {
            this._adapter.notifyHoverChange(0, newValue);
        } else {
            this._adapter.clearValue(null);
        }
    }

    handleFocus(e: any) {
        this._adapter.notifyFocus(e);
    }

    handleBlur(e: any) {
        this._adapter.notifyBlur(e);
    }

    handleKeyDown(event: any, value: number) {
        const { keyCode } = event;
        const { count, allowHalf } = this.getProps();
        const direction = this._adapter.getContext('direction');
        const reverse = direction === 'rtl';
        if (keyCode === KeyCode.RIGHT && value < count && !reverse) {
            if (allowHalf) {
                value += 0.5;
            } else {
                value += 1;
            }
        } else if (keyCode === KeyCode.LEFT && value > 0 && !reverse) {
            if (allowHalf) {
                value -= 0.5;
            } else {
                value -= 1;
            }
        } else if (keyCode === KeyCode.RIGHT && value > 0 && reverse) {
            if (allowHalf) {
                value -= 0.5;
            } else {
                value -= 1;
            }
        } else if (keyCode === KeyCode.LEFT && value < count && reverse) {
            if (allowHalf) {
                value += 0.5;
            } else {
                value += 1;
            }
        }
        this._adapter.updateValue(value);
        event.preventDefault();
        this._adapter.notifyKeyDown(event);
    }
}