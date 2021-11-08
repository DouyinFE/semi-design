/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import keyCode from '../utils/keyCode';
import { numbers } from './constants';
import { toNumber, toString, isUndefined } from 'lodash-es';
import { minus as numberMinus } from '../utils/number';

export interface InputNumberAdapter extends DefaultAdapter {
    setValue: (value: number | string, cb?: (...args: any[]) => void) => void;
    setNumber: (number: number | null, cb?: (...args: any[]) => void) => void;
    setFocusing: (focusing: boolean, cb?: (...args: any[]) => void) => void;
    setHovering: (hovering: boolean) => void;
    notifyChange: (value: string | number, e?: any) => void;
    notifyNumberChange: (value: number, e?: any) => void;
    notifyBlur: (e: any) => void;
    notifyFocus: (e: any) => void;
    notifyUpClick: (value: string, e: any) => void;
    notifyDownClick: (value: string, e: any) => void;
    notifyKeyDown: (e: any) => void;
    registerGlobalEvent: (eventName: string, handler: (...args: any[]) => void) => void;
    unregisterGlobalEvent: (eventName: string) => void;
    recordCursorPosition: () => void;
    restoreByAfter: (str?: string) => boolean;
    restoreCursor: (str?: string) => boolean;
    fixCaret: (start: number, end: number) => void;
    setClickUpOrDown: (clicked: boolean) => void;
}

class InputNumberFoundation extends BaseFoundation<InputNumberAdapter> {
    _intervalHasRegistered: boolean;
    _interval: any;
    _timerHasRegistered: boolean;
    _timer: any;

    init() {
        this._setInitValue();
    }

    destroy() {
        this._unregisterInterval();
        this._unregisterTimer();
        this._adapter.unregisterGlobalEvent('mouseup');
    }

    isControlled() {
        return this._isControlledComponent('value');
    }

    _doInput(v = '', event: any = null, updateCb: any = null) {
        let notifyVal: string | number = v;
        let number: string | number = v;
        let isValidNumber = true;
        const isControlled = this.isControlled();
        // console.log(v);

        if (typeof v !== 'number') {
            number = this.doParse(v, false);
            isValidNumber = !isNaN(number as unknown as number);
        }

        if (isValidNumber) {
            notifyVal = number;

            if (!isControlled) {
                this._adapter.setNumber(number as unknown as number);
            }
        }

        if (!isControlled) {
            this._adapter.setValue(v, updateCb);
        }

        if (this.getProp('keepFocus')) {
            this._adapter.setFocusing(true, () => {
                this._adapter.setClickUpOrDown(true);
            });
        }

        this.notifyChange(notifyVal, event);
    }

    _registerInterval(cb?: (...args: any) => void) {
        const pressInterval = this.getProp('pressInterval') || numbers.DEFAULT_PRESS_INTERVAL;
        this._intervalHasRegistered = true;
        this._interval = setInterval(() => {
            if (typeof cb === 'function' && this._intervalHasRegistered) {
                cb();
            }
        }, pressInterval);
    }

    _unregisterInterval() {
        if (this._interval) {
            this._intervalHasRegistered = false;
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    _registerTimer(cb: (...args: any[]) => void) {
        const pressTimeout = this.getProp('pressTimeout') || numbers.DEFAULT_PRESS_TIMEOUT;
        this._timerHasRegistered = true;
        this._timer = setTimeout(() => {
            if (this._timerHasRegistered && typeof cb === 'function') {
                cb();
            }
        }, pressTimeout);
    }

    _unregisterTimer() {
        if (this._timer) {
            this._timerHasRegistered = false;
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    handleInputFocus(e: any) {
        const value = this.getState('value');

        if (value !== '') {
            // let parsedStr = this.doParse(this.getState('value'));
            // this._adapter.setValue(Number(parsedStr));
        }
        this._adapter.recordCursorPosition();
        this._adapter.setFocusing(true, null);
        this._adapter.notifyFocus(e);
    }

    /**
     * Input box content update processing
     *  if value is valid, set state value, number and notifyChange
     *  else only set state value and don't notifyChange
     */
    handleInputChange(value: string, event: any) {
        // Check accuracy, adjust accuracy, adjust maximum and minimum values, call parser to parse the number
        const parsedNum = this.doParse(value, true, true, true);
        // Parser parsed number, type Number (normal number or NaN)
        const toNum = this.doParse(value, false, false, false);
        // String converted from parser parsed numbers or directly converted without parser
        const valueAfterParser = this.afterParser(value);
        this._adapter.recordCursorPosition();

        let notifyVal;
        let num = toNum;
        // The formatted input value
        let formattedNum = value;
        if (value === '') {
            if (!this.isControlled()) {
                num = null;
            }
        } else if (this.isValidNumber(toNum) && this.isValidNumber(parsedNum)) {
            notifyVal = toNum;
            formattedNum = this.doFormat(toNum, false);
        } else {
            /**
             * This logic is used to solve the problem that parsedNum is not a valid number
             */
            if (typeof toNum === 'number' && !isNaN(toNum)) {
                formattedNum = this.doFormat(toNum, false);
                // console.log(`parsedStr: `, parsedStr, `toNum: `, toNum);
                const dotIndex = valueAfterParser.lastIndexOf('.');
                const lengthAfterDot = valueAfterParser.length - 1 - dotIndex;
                const precLength = this._getPrecLen(toNum);
                if (!precLength) {
                    const dotBeginStr = dotIndex > -1 ? valueAfterParser.slice(dotIndex) : '';
                    formattedNum += dotBeginStr;
                } else if (precLength < lengthAfterDot) {
                    // eslint-disable-next-line max-depth
                    for (let i = 0; i < lengthAfterDot - precLength; i++) {
                        formattedNum += '0';
                    }
                }
                // NOUSE:
                num = toNum;
            } else {
                /**
                 * When the user enters an illegal character, it needs to go through parser and format before displaying
                 * Ensure that all input is processed by parser and format
                 *
                 * 用户输入非法字符时，需要经过 parser 和 format 一下再显示
                 * 保证所有的输入都经过 parser 和 format 处理
                 */
                formattedNum = this.doFormat(valueAfterParser as unknown as number, false);
            }

            notifyVal = valueAfterParser;
        }

        const _controlled = this.isControlled();

        if (!_controlled && (num === null || this.isValidNumber(num))) {
            this._adapter.setNumber(num);
        }

        this._adapter.setValue(_controlled ? formattedNum : this.doFormat(valueAfterParser as unknown as number, false), () => {
            this._adapter.restoreCursor();
        });

        if (this.isValidString(notifyVal) || this.isValidNumber(notifyVal) || isUndefined(notifyVal)) {
            this.notifyChange(notifyVal, event);
        }
    }

    handleInputKeyDown(event: any) {
        const code = event.keyCode;

        if (code === keyCode.UP || code === keyCode.DOWN) {
            this._adapter.setClickUpOrDown(true);
            this._adapter.recordCursorPosition();
            const formatedVal = code === keyCode.UP ? this.add() : this.minus();

            this._doInput(formatedVal, event, () => {
                this._adapter.restoreCursor();
            });

            event.preventDefault();
        }

        this._adapter.notifyKeyDown(event);
    }

    /**
     * if input value is invalid we should do these thing
     *  1. get a valid number(from state number or parsed from input value)
     *  2. notifyChange this valid number
     * always notifyBlur
     */
    handleInputBlur(e: any) {
        const currentValue = toString(this.getState('value'));
        let currentNumber = this.getState('number');

        if (currentNumber != null || (currentValue != null && currentValue !== '')) {
            // parse a valid number
            const parsedNum = this.doParse(currentValue, false, true, true);

            let numHasChanged = false;
            let strHasChanged = false;
            let willSetNum, willSetVal;

            /**
             * if input value can be parse to valid number and is not equal with state number,
             * use the parsed number as a input valid value
             */
            if (this.isValidNumber(parsedNum) && currentNumber !== parsedNum) {
                willSetNum = parsedNum;
                currentNumber = willSetNum;
                numHasChanged = true;
            }

            /**
             * format currentNumber, then show it in input box
             * currentNumber may come from two place
             *  1. parsed from input value, and it is valid number
             *  2. state number
             */
            const currentFormattedNum = this.doFormat(currentNumber, true);
            /**
             * if currentFormattedNum is not equal currentValue, show it later
             * else input value no need to change
             */
            if (currentFormattedNum !== currentValue) {
                willSetVal = currentFormattedNum;
                strHasChanged = true;
            }

            if (strHasChanged || numHasChanged) {
                if (willSetVal != null) {
                    this._adapter.setValue(willSetVal);
                }

                if (willSetNum != null) {
                    // eslint-disable-next-line max-depth
                    if (!this._isControlledComponent('value')) {
                        this._adapter.setNumber(willSetNum);
                    }
                }

                if (numHasChanged) {
                    this.notifyChange(willSetNum, e);
                }
            }
        }
        this._adapter.setFocusing(false);
        this._adapter.notifyBlur(e);
    }

    handleInputMouseEnter(event?: any) {
        this._adapter.setHovering(true);
    }

    handleInputMouseLeave(event?: any) {
        this._adapter.setHovering(false);
    }

    handleInputMouseMove(event?: any) {
        this._adapter.setHovering(true);
    }

    handleMouseUp(e?: any) {
        this._unregisterInterval();
        this._unregisterTimer();
        this._adapter.unregisterGlobalEvent('mouseup');
    }

    handleUpClick(event: any) {
        this._adapter.setClickUpOrDown(true);
        if (event) {
            event.persist();
            event.stopPropagation();
            // Prevent native blurring events
            this._preventDefault(event);
        }
        this.upClick(event);
        // Cannot access event objects asynchronously https://reactjs.org/docs/events.html#event-pooling
        this._registerTimer(() => {
            this._registerInterval(() => {
                this.upClick(event);
            });
        });
    }

    handleDownClick(event: any) {
        this._adapter.setClickUpOrDown(true);
        if (event) {
            event.persist();
            event.stopPropagation();
            this._preventDefault(event);
        }
        this.downClick(event);
        this._registerTimer(() => {
            this._registerInterval(() => {
                this.downClick(event);
            });
        });
    }

    _preventDefault(event: any) {
        const keepFocus = this._adapter.getProp('keepFocus');
        if (keepFocus) {
            event.preventDefault();
        }
    }

    handleMouseLeave(event: any) {
        this._adapter.registerGlobalEvent('mouseup', () => {
            this.handleMouseUp(event);
        });
    }

    upClick(event: any) {
        const value = this.add(null, event);
        this._doInput(value, event);
        this._adapter.notifyUpClick(value, event);
    }

    downClick(event: any) {
        const value = this.minus(null, event);
        this._doInput(value, event);
        this._adapter.notifyDownClick(value, event);
    }

    _setInitValue() {
        const { defaultValue, value } = this.getProps();

        const propsValue = this._isControlledComponent('value') ? value : defaultValue;
        const tmpNumer = this.doParse(toString(propsValue), false, true, true);

        let number = null;
        if (typeof tmpNumer === 'number' && !isNaN(tmpNumer)) {
            number = tmpNumer;
        }

        const formatedValue = typeof number === 'number' ? this.doFormat(number, true) : '';

        this._adapter.setNumber(number);
        this._adapter.setValue(formatedValue);
    }

    add(step?: number, event?: any): string {
        const pressShift = event && event.shiftKey;
        const propStep = pressShift ? this.getProp('shiftStep') : this.getProp('step');
        step = step == null ? propStep : Number(step);
        const stepAbs = Math.abs(toNumber(step));
        const curVal = this.getState('number');
        let curNum = this.toNumber(curVal) || 0;
        const min = this.getProp('min');
        const max = this.getProp('max');
        const minPrecLen = this._getPrecLen(min);
        const maxPrecLen = this._getPrecLen(max);
        const curPrecLen = this._getPrecLen(curNum);
        const stepPrecLen = this._getPrecLen(step);
        const scale = Math.pow(10, Math.max(minPrecLen, maxPrecLen, curPrecLen, stepPrecLen));

        if (step < 0) {
            // Js accuracy problem
            if (Math.abs(numberMinus(min, curNum)) >= stepAbs) {
                curNum = (curNum * scale + step * scale) / scale;
            }
        } else if (step > 0) {
            if (Math.abs(numberMinus(max, curNum)) >= stepAbs) {
                curNum = (curNum * scale + step * scale) / scale;
            }
        }
        if (typeof min === 'number' && min > curNum) {
            curNum = min;
        }
        if (typeof max === 'number' && max < curNum) {
            curNum = max;
        }

        // console.log('scale: ', scale, 'curNum: ', curNum);

        return this.doFormat(curNum, true);
    }

    minus(step?: number, event?: any): string {
        const pressShift = event && event.shiftKey;
        const propStep = pressShift ? this.getProp('shiftStep') : this.getProp('step');
        step = step == null ? propStep : Number(step);
        return this.add(-step, event);
    }

    /**
     * get decimal length
     * @param {number} num
     * @returns {number}
     */
    _getPrecLen(num: string | number) {
        if (typeof num !== 'string') {
            num = String(Math.abs(Number(num || '')));
        }
        const idx = num.indexOf('.') + 1;
        return idx ? num.length - idx : 0;
    }

    _adjustPrec(num: string | number) {
        const precision = this.getProp('precision');
        if (typeof precision === 'number') {
            num = Number(num).toFixed(precision);
        }
        return toString(num);
    }

    /**
     * format number to string
     */
    doFormat(value: number | string = 0, needAdjustPrec = true): string {
        let str;
        const formatter = this.getProp('formatter');
        if (needAdjustPrec) {
            str = this._adjustPrec(value);
        } else {
            str = toString(value);
        }
        if (typeof formatter === 'function') {
            str = formatter(str);
        }
        return str;
    }

    /**
     *
     * @param {number} current
     * @returns {number}
     */
    fetchMinOrMax(current: number) {
        const { min, max } = this.getProps();

        if (current < min) {
            return min;
        } else if (current > max) {
            return max;
        }
        return current;
    }

    /**
     * parse to number
     */
    doParse(value: string | number, needCheckPrec = true, needAdjustPrec = false, needAdjustMaxMin = false): number {
        if (typeof value === 'number') {
            if (needAdjustMaxMin) {
                value = this.fetchMinOrMax(value);
            }
            if (needAdjustPrec) {
                value = this._adjustPrec(value);
            }
            return toNumber(value);
        }

        const parser = this.getProp('parser');

        if (typeof parser === 'function') {
            value = parser(value);
        }

        if (needCheckPrec && typeof value === 'string') {
            const zeroIsValid =
                value.indexOf('.') === -1 ||
                (value.indexOf('.') > -1 && (value === '0' || value.lastIndexOf('0') < value.length - 1));
            const dotIsValid =
                value.lastIndexOf('.') < value.length - 1 && value.split('').filter((v: string) => v === '.').length < 2;

            if (
                !zeroIsValid ||
                !dotIsValid
                // (this.getProp('precision') > 0 && this._getPrecLen(value) > this.getProp('precision'))
            ) {
                return NaN;
            }
        }

        if (needAdjustPrec) {
            value = this._adjustPrec(value);
        }

        if (typeof value === 'string' && value.length) {
            return needAdjustMaxMin ? this.fetchMinOrMax(toNumber(value)) : toNumber(value);
        }

        return NaN;
    }

    /**
     * Parsing the input value
     */
    afterParser(value: string | number) {
        const parser = this.getProp('parser');
        if (typeof value === 'string' && typeof parser === 'function') {
            return toString(parser(value));
        }
        return toString(value);
    }

    toNumber(value: number | string, needAdjustPrec = true) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            const parser = this.getProp('parser');

            if (typeof parser === 'function') {
                value = parser(value);
            }
            if (needAdjustPrec) {
                value = this._adjustPrec(value);
            }
        }
        return toNumber(value);
    }

    /**
     * Returning true requires both:
     * 1.type is number and not equal to NaN
     * 2.min < = value < = max
     * 3.length after decimal point requires < = precision | | No precision
     */
    isValidNumber(num: number, needCheckPrec = true) {
        if (typeof num === 'number' && !isNaN(num)) {
            const { min, max, precision } = this.getProps();
            const numPrec = this._getPrecLen(num);
            const precIsValid = needCheckPrec ?
                (typeof precision === 'number' && numPrec <= precision) || typeof precision !== 'number' :
                true;

            if (num >= min && num <= max && precIsValid) {
                return true;
            }
        }
        return false;
    }

    isValidString(str: string) {
        if (typeof str === 'string' && str.length) {
            const parsedNum = this.doParse(str);

            return this.isValidNumber(parsedNum);
        }

        return false;
    }

    /**
     * notify change when
     *  1. input change
     *  2. input blur
     *  3. click up/down button
     *  4. touch up/down keyboard
     */
    notifyChange(value: string | number, e: any) {
        if (value == null || value === '') {
            this._adapter.notifyChange('', e);
        } else {
            const parsedNum = this.toNumber(value, true);

            if (typeof parsedNum === 'number' && !isNaN(parsedNum)) {
                this._adapter.notifyChange(parsedNum, e);
                this.notifyNumberChange(parsedNum, e);
            } else {
                this._adapter.notifyChange(this.afterParser(value), e);
            }
        }
    }

    notifyNumberChange(value: number, e: any) {
        const { number } = this.getStates();
        // Does not trigger numberChange if value is not a significant number
        if (this.isValidNumber(value) && value !== number) {
            this._adapter.notifyNumberChange(value, e);
        }
    }
}

export default InputNumberFoundation;
