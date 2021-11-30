import BaseFoundation, { DefaultAdapter, noopFunction } from '../base/foundation';
import { strings } from './constants';
import { noop, set, isNumber, isString, isFunction } from 'lodash';

const ENTER_KEY_CODE = 'Enter';

export interface InputDefaultAdapter {
    notifyChange: noopFunction;
    setValue: noopFunction;
}

export interface InputAdapter extends Partial<DefaultAdapter>, Partial<InputDefaultAdapter> {
    setMinLength(minLength: number): void;
    notifyClear(e: any): void;
    notifyBlur(value: any, e: any): void;
    setEyeClosed(eyeClosed: boolean): void;
    toggleFocusing(focused: boolean): void;
    notifyFocus(value: any, e: any): void;
    notifyInput(e: any): void;
    notifyKeyDown(e: any): void;
    notifyKeyUp(e: any): void;
    notifyKeyPress(e: any): void;
    notifyEnterPress(e: any): void;
    setPaddingLeft(paddingLeft: string): void;
    isEventTarget(e: any): boolean;
}

class InputFoundation extends BaseFoundation<InputAdapter> {
    static get inputDefaultAdapter() {
        return {
            notifyChange: noop,
            setValue: noop,
            // toggleAllowClear: noop,
        };
    }

    _timer: number | null;

    constructor(adapter: InputAdapter) {
        super({ ...InputFoundation.inputDefaultAdapter, ...adapter });
    }

    init() {
        this._setInitValue();
    }

    destroy() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    // eslint-disable-next-line
    setDisable() {}

    _setInitValue() {
        const { defaultValue, value } = this.getProps();
        let v = defaultValue;
        if (this._isControlledComponent()) {
            v = value;
        }
        this._adapter.setValue(v);
    // this.checkAllowClear(v);
    }

    setValue(value: any) {
        this._adapter.setValue(value);
    }

    handleChange(value: any, e: any) {
        const { maxLength, minLength, getValueLength } = this._adapter.getProps();
        let nextValue = value;
        if (maxLength && isFunction(getValueLength)) {
            nextValue = this.handleVisibleMaxLength(value);
        }
        if (minLength && isFunction(getValueLength)) {
            this.handleVisibleMinLength(nextValue);
        }
        if (this._isControlledComponent()) {
            /**
             * If it is a controlled component, directly notify the caller of the modified value.
             * Truncate the input value from the input box if the input value exceeds the maximum length limit.
             *  Even in controlled components, characters that exceed the length limit cannot be entered through the input box.
             */
            this._adapter.notifyChange(nextValue, e);
        } else {
            this._adapter.setValue(nextValue);
            this._adapter.notifyChange(nextValue, e);
            // this.checkAllowClear(value);
        }
    }

    /**
     * Modify minLength to trigger browser check for minimum length
     * Controlled mode is not checked
     * @param {String} value
     */
    handleVisibleMinLength(value: any) {
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
    handleVisibleMaxLength(value: any) {
        const { maxLength, getValueLength } = this._adapter.getProps();
        if (isNumber(maxLength) && maxLength >= 0 && isFunction(getValueLength) && isString(value)) {
            const valueLength = getValueLength(value);
            if (valueLength > maxLength) {
                // eslint-disable-next-line max-len
                console.warn('[Semi Input] The input character is truncated because the input length exceeds the maximum length limit');
                const truncatedValue = this.handleTruncateValue(value, maxLength);
                return truncatedValue;
            } else {
                return value;
            }
        }
    }

    /**
     * Truncate input values based on maximum length
     * @param {String} value
     * @param {Number} maxLength
     * @returns {String}
     */
    handleTruncateValue(value: any, maxLength: number) {
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

    handleClear(e: any) {
        let eventObj = e;
        const value = '';
        // let input = this._adapter.getInput();
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

        if (!eventObj || typeof eventObj !== 'object') {
            eventObj = {};
        }

        set(eventObj, strings.CLEARBTN_CLICKED_EVENT_FLAG, true); // this is useful for DateInput

        this._adapter.notifyChange(value, eventObj);
        this._adapter.notifyClear(eventObj);

        if (eventObj) {
            // When input is in popover and popover needs to judge clickOutSide, such as TreeSelect
            // If the click event bubbles up, it will mistakenly trigger clickOutSide's judgment.
            // At the same time, because the clear icon is not in the dom tree after clicking, and clickOutSide uses dom.contain (e.target), it will be considered as clicking on the outside, which will cause the floating layer to fold
            // So we need to stop the incident from bubbling up
            this.stopPropagation(eventObj);
        }
    }

    /**
     * trigger when click input wrapper
     * @param {Event} e
     */
    handleClick(e: any) {
        const { disabled } = this._adapter.getProps();
        const { isFocus } = this._adapter.getStates();
        if (disabled || isFocus) {
            return;
        }
        // do not handle bubbling up events
        if (this._adapter.isEventTarget(e)) {
            this._adapter.toggleFocusing(true);
        }
    }

    handleModeChange(mode: string) {
        if (mode === 'password') {
            this._adapter.setEyeClosed(true);
        } else {
            this._adapter.setEyeClosed(false);
        }
    }

    handleClickEye(e: any) {
        const eyeClosed = this._adapter.getState('eyeClosed');
        this._adapter.toggleFocusing(true);
        this._adapter.setEyeClosed(!eyeClosed);
    }

    handleInputType(type: string) {
        const mode = this._adapter.getProp('mode');
        const eyeClosed = this._adapter.getState('eyeClosed');
        if (mode === 'password') {
            return eyeClosed ? 'password' : 'text';
        }
        return type;
    }

    handleMouseDown(e: any) {
        e.preventDefault();
    }

    handleMouseUp(e: any) {
        e.preventDefault();
    }

    handleBlur(e: any) {
        const { value } = this.getStates();
        this._adapter.toggleFocusing(false);
        this._adapter.notifyBlur(value, e);
    }

    handleFocus(e: any) {
        const { value } = this.getStates();
        this._adapter.toggleFocusing(true);
        // this.checkAllowClear(this.getState('value'), true);
        this._adapter.notifyFocus(value, e);
    }

    handleInput(e: any) {
        this._adapter.notifyInput(e);
    }

    handleKeyDown(e: any) {
        this._adapter.notifyKeyDown(e);
    }

    handleKeyUp(e: any) {
        this._adapter.notifyKeyUp(e);
    }

    handleKeyPress(e: any) {
        this._adapter.notifyKeyPress(e);
        if (e.key === ENTER_KEY_CODE) {
            this._adapter.notifyEnterPress(e);
        }
    }

    setPaddingLeft(paddingLeft: string) {
        this._adapter.setPaddingLeft(paddingLeft);
    }

    isAllowClear() {
        const { value, isFocus, isHovering } = this._adapter.getStates();
        const { showClear, disabled } = this._adapter.getProps();
        const allowClear = value && showClear && !disabled && (isFocus || isHovering);
        return allowClear;
    }

    handleClickPrefixOrSuffix(e: any) {
        const { disabled } = this._adapter.getProps();
        const { isFocus } = this._adapter.getStates();
        if (!disabled && !isFocus) {
            this._adapter.toggleFocusing(true);
        }
    }

    /**
     * Blocking mousedown events prevents input from losing focus
     * @param {Event} e
     */
    handlePreventMouseDown(e: any) {
        if (e && isFunction(e.preventDefault)) {
            e.preventDefault();
        }
    }
}
export default InputFoundation;
