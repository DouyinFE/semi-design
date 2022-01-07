import BaseFoundation, { DefaultAdapter, noopFunction } from '../base/foundation';
import {
    noop,
    isFunction,
    isNumber,
    isString
} from 'lodash';
import calculateNodeHeight from './util/calculateNodeHeight';
import getSizingData from './util/getSizingData';
import isEnterPress from '../utils/isEnterPress';

export interface TextAreaDefaultAdpter {
    notifyChange: noopFunction;
    setValue: noopFunction;
    toggleFocusing: noopFunction;
    notifyFocus: noopFunction;
    notifyBlur: noopFunction;
    notifyKeyDown: noopFunction;
    notifyEnterPress: noopFunction;
    toggleHovering(hoving: boolean): void;
    notifyClear(e: any): void;
}

export interface TextAreaAdpter extends Partial<DefaultAdapter>, Partial<TextAreaDefaultAdpter> {
    setMinLength(length: number): void;
    notifyPressEnter(e: any): void;
    getRef(): any;
    notifyHeightUpdate(e: any): void;
}

export default class TextAreaFoundation extends BaseFoundation<TextAreaAdpter> {
    static get textAreaDefaultAdapter() {
        return {
            notifyChange: noop,
            setValue: noop,
            toggleFocusing: noop,
            toggleHovering: noop,
            notifyFocus: noop,
            notifyBlur: noop,
            notifyKeyDown: noop,
            notifyEnterPress: noop
        };
    }

    constructor(adapter: TextAreaAdpter) {
        super({
            ...TextAreaFoundation.textAreaDefaultAdapter,
            ...adapter
        });
    }

    init() {
        this.setInitValue();
    }

    // eslint-disable-next-line
    destroy() { }

    setInitValue() {
        const {
            defaultValue,
            value
        } = this.getProps();
        let v = defaultValue;
        if (this._isControlledComponent()) {
            v = value;
        }
        this._adapter.setValue(v);
    }

    handleValueChange(v: string) {
        this._adapter.setValue(v);
    }

    handleChange(value: string, e: any) {
        const { maxLength, minLength, getValueLength } = this._adapter.getProps();
        let nextValue = value;
        if (maxLength && isFunction(getValueLength)) {
            nextValue = this.handleVisibleMaxLength(value);
        }
        if (minLength && isFunction(getValueLength)) {
            this.handleVisibleMinLength(nextValue);
        }
        if (this._isControlledComponent()) {
            this._adapter.notifyChange(nextValue, e);
        } else {
            this._adapter.setValue(nextValue);
            this._adapter.notifyChange(nextValue, e);
        }
    }

    /**
     * Modify minLength to trigger browser check for minimum length
     * Controlled mode is not checked
     * @param {String} value
     */
    handleVisibleMinLength(value: string) {
        const { minLength, getValueLength } = this._adapter.getProps();
        const { minLength: stateMinLength } = this._adapter.getStates();
        if (isNumber(minLength) && minLength >= 0 && isFunction(getValueLength) && isString(value)) {
            const valueLength = getValueLength(value);
            if (valueLength < minLength) {
                const newMinLength = value.length + (minLength - valueLength);
                newMinLength !== stateMinLength && this._adapter.setMinLength(newMinLength);
            } else {
                stateMinLength !== minLength && this._adapter.setMinLength(minLength);
            }
        }
    }

    /**
     * Handle input emoji characters beyond maxLength
     * Controlled mode is not checked
     * @param {String} value
     */
    handleVisibleMaxLength(value: string) {
        const { maxLength, getValueLength } = this._adapter.getProps();
        if (isNumber(maxLength) && maxLength >= 0 && isFunction(getValueLength) && isString(value)) {
            const valueLength = getValueLength(value);
            if (valueLength > maxLength) {
                // eslint-disable-next-line max-len
                console.warn('[Semi TextArea] The input character is truncated because the input length exceeds the maximum length limit');
                const truncatedValue = this.handleTruncateValue(value, maxLength);
                return truncatedValue;
            } else {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Truncate textarea values based on maximum length
     * @param {String} value
     * @param {Number} maxLength
     * @returns {String}
     */
    handleTruncateValue(value: string, maxLength: number) {
        const { getValueLength } = this._adapter.getProps();
        if (isFunction(getValueLength)) {
            let truncatedValue = '';
            for (let i = 1, len = value.length; i <= len; i++) {
                const currentValue = value.slice(0, i);
                if (getValueLength(currentValue) > maxLength) {
                    return truncatedValue;
                } else {
                    truncatedValue = currentValue;
                }
            }
            return truncatedValue;
        } else {
            return value.slice(0, maxLength);
        }
    }

    handleFocus(e: any) {
        const { value } = this.getStates();
        this._adapter.toggleFocusing(true);
        this._adapter.notifyFocus(value, e);
    }

    handleBlur(e: any) {
        const { value } = this.getStates();
        this._adapter.toggleFocusing(false);
        this._adapter.notifyBlur(value, e);
    }

    handleKeyDown(e: any) {
        this._adapter.notifyKeyDown(e);
        if (e.keyCode === 13) {
            this._adapter.notifyPressEnter(e);
        }
    }

    resizeTextarea = (cb?: any) => {
        const { height } = this.getStates();
        const { rows } = this.getProps();
        const node = this._adapter.getRef().current;
        const nodeSizingData = getSizingData(node);

        if (!nodeSizingData) {
            cb && cb();
            return;
        }

        const newHeight = calculateNodeHeight(
            nodeSizingData,
            node.value || node.placeholder || 'x',
            rows
            // maxRows,
        );

        if (height !== newHeight) {
            this._adapter.notifyHeightUpdate(newHeight);
            node.style.height = `${newHeight}px`;
            return;
        }

        cb && cb();
    };

    handleMouseEnter(e) {
        this._adapter.toggleHovering(true);
    }

    handleMouseLeave(e) {
        this._adapter.toggleHovering(false);
    }

    isAllowClear() {
        const { value, isFocus, isHover } = this._adapter.getStates();
        const { showClear, disabled, readonly } = this._adapter.getProps();
        const allowClear = value && showClear && !disabled && (isFocus || isHover) && !readonly;
        return allowClear;
    }

    handleClear(e) {
        const { isFocus } = this.getStates();
        if (this._isControlledComponent('value')) {
            this._adapter.setState({
                isFocus: false,
            });
        } else {
            this._adapter.setState({
                value: '',
                isFocus: false,
            });
        }
        if (isFocus) {
            this._adapter.notifyBlur('', e);
        }
        this._adapter.notifyChange('', e);
        this._adapter.notifyClear(e);
        this.stopPropagation(e);
    }

    /**
     * A11y: simulate clear button click
     */
    handleClearEnterPress(e: any) {
        if (isEnterPress(e)) {
            this.handleClear(e);
        }
    }
}