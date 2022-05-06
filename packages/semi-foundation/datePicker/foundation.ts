/* eslint-disable no-nested-ternary */
/* eslint-disable max-len, max-depth,  */
import { format, isValid, isSameSecond, isEqual as isDateEqual, isDate } from 'date-fns';
import { get, isObject, isString, isEqual } from 'lodash';

import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { isValidDate, isTimestamp } from './_utils/index';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { utcToZonedTime, zonedTimeToUtc } from '../utils/date-fns-extra';
import { compatibleParse } from './_utils/parser';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';
import { strings } from './constants';
import { strings as inputStrings } from '../input/constants';

import { Type, DateInputFoundationProps, InsetInputValue } from './inputFoundation';
import { MonthsGridFoundationProps } from './monthsGridFoundation';
import { WeekStartNumber } from './_utils/getMonthTable';
import { ArrayElement, Motion } from '../utils/type';
import getInsetInputFormatToken from './_utils/getInsetInputFormatToken';
import getInsetInputValueFromInsetInputStr from './_utils/getInsetInputValueFromInsetInputStr';

export type ValidateStatus = ArrayElement<typeof strings.STATUS>;
export type InputSize = ArrayElement<typeof strings.SIZE_SET>;
export type Position = ArrayElement<typeof strings.POSITION_SET>;

export type BaseValueType = string | number | Date;
export type DayStatusType = {
    isToday?: boolean; // Current day
    isSelected?: boolean; // Selected
    isDisabled?: boolean; // Disabled
    isSelectedStart?: boolean; // Select Start
    isSelectedEnd?: boolean; // End of selection
    isInRange?: boolean; // Range within the selected date
    isHover?: boolean; // Date between selection and hover date
    isOffsetRangeStart?: boolean; // Week selection start
    isOffsetRangeEnd?: boolean; // End of week selection
    isHoverInOffsetRange?: boolean; // Hover in the week selection
};
export type DisabledDateOptions = {
    rangeStart?: string;
    rangeEnd?: string;
};
export type PresetType = {
    start?: string | Date | number;
    end?: string | Date | number;
    text?: string;
};

export type TriggerRenderProps = {
    [x: string]: any;
    value?: ValueType;
    inputValue?: string;
    placeholder?: string | string[];
    autoFocus?: boolean;
    size?: InputSize;
    disabled?: boolean;
    inputReadOnly?: boolean;
    componentProps?: DatePickerFoundationProps;
};

export type DateOffsetType = (selectedDate?: Date) => Date;
export type DensityType = 'default' | 'compact';
export type DisabledDateType = (date?: Date, options?: DisabledDateOptions) => boolean;
export type DisabledTimeType = (date?: Date | Date[], panelType?: string) => ({
    disabledHours?: () => number[];
    disabledMinutes?: (hour: number) => number[];
    disabledSeconds?: (hour: number, minute: number) => number[];
});
export type OnCancelType = (date: Date | Date[], dateStr: string | string[]) => void;
export type OnPanelChangeType = (date: Date | Date[], dateStr: string | string[]) => void;
export type OnChangeType = (date?: Date | Date[] | string | string[], dateStr?: string | string[] | Date | Date[]) => void;
export type OnConfirmType = (date: Date | Date[], dateStr: string | string[]) => void;
// type OnPresetClickType = (item: PresetType, e: React.MouseEvent<HTMLDivElement>) => void;
export type OnPresetClickType = (item: PresetType, e: any) => void;
export type PresetsType = Array<PresetType | (() => PresetType)>;
// type RenderDateType = (dayNumber?: number, fullDate?: string) => React.ReactNode;
export type RenderDateType = (dayNumber?: number, fullDate?: string) => any;
// type RenderFullDateType = (dayNumber?: number, fullDate?: string, dayStatus?: DayStatusType) => React.ReactNode;
export type RenderFullDateType = (dayNumber?: number, fullDate?: string, dayStatus?: DayStatusType) => any;
// type TriggerRenderType = (props: TriggerRenderProps) => React.ReactNode;
export type TriggerRenderType = (props: TriggerRenderProps) => any;
export type ValueType = BaseValueType | BaseValueType[];

export interface ElementProps {
    bottomSlot?: any;
    insetLabel?: any;
    prefix?: any;
    topSlot?: any;
}

export interface RenderProps {
    renderDate?: RenderDateType;
    renderFullDate?: RenderFullDateType;
    triggerRender?: TriggerRenderType;
}

export type RangeType = 'rangeStart' | 'rangeEnd' | false;

export interface EventHandlerProps {
    onCancel?: OnCancelType;
    onChange?: OnChangeType;
    onOpenChange?: (status: boolean) => void;
    onPanelChange?: OnPanelChangeType;
    onConfirm?: OnConfirmType;
    // properties below need overwrite
    // onBlur?: React.MouseEventHandler<HTMLInputElement>;
    onBlur?: (e: any) => void;
    // onClear?: React.MouseEventHandler<HTMLDivElement>;
    onClear?: (e: any) => void;
    // onFocus?: React.MouseEventHandler<HTMLInputElement>;
    onFocus?: (e: any, rangType: RangeType) => void;
    onPresetClick?: OnPresetClickType;
}

export interface DatePickerFoundationProps extends ElementProps, RenderProps, EventHandlerProps {
    autoAdjustOverflow?: boolean;
    autoFocus?: boolean;
    autoSwitchDate?: boolean;
    className?: string;
    defaultOpen?: boolean;
    defaultPickerValue?: ValueType;
    defaultValue?: ValueType;
    density?: DensityType;
    disabled?: boolean;
    disabledDate?: DisabledDateType;
    disabledTime?: DisabledTimeType;
    dropdownClassName?: string;
    dropdownStyle?: React.CSSProperties;
    endDateOffset?: DateOffsetType;
    format?: string;
    getPopupContainer?: () => HTMLElement;
    inputReadOnly?: boolean;
    inputStyle?: React.CSSProperties;
    max?: number;
    motion?: Motion;
    multiple?: boolean;
    needConfirm?: boolean;
    onChangeWithDateFirst?: boolean;
    open?: boolean;
    placeholder?: string | string[];
    position?: Position;
    prefixCls?: string;
    presets?: PresetsType;
    showClear?: boolean;
    size?: InputSize;
    spacing?: number;
    startDateOffset?: DateOffsetType;
    stopPropagation?: boolean | string;
    style?: React.CSSProperties;
    timePickerOpts?: any; // TODO import timePicker props
    timeZone?: string | number;
    type?: Type;
    validateStatus?: ValidateStatus;
    value?: ValueType;
    weekStartsOn?: WeekStartNumber;
    zIndex?: number;
    syncSwitchMonth?: boolean;
    hideDisabledOptions?: MonthsGridFoundationProps['hideDisabledOptions'];
    disabledTimePicker?: MonthsGridFoundationProps['disabledTimePicker'];
    locale?: any;
    dateFnsLocale?: any;
    localeCode?: string;
    rangeSeparator?: string;
    insetInput?: boolean;
}

export interface DatePickerFoundationState {
    panelShow: boolean;
    isRange: boolean;
    inputValue: string;
    value: Date[];
    cachedSelectedValue: Date[];
    prevTimeZone: string | number;
    motionEnd: boolean;
    rangeInputFocus: RangeType;
    autofocus: boolean;
    insetInputValue: InsetInputValue;
    triggerDisabled: boolean;
}

export { Type, DateInputFoundationProps };

export interface DatePickerAdapter extends DefaultAdapter<DatePickerFoundationProps, DatePickerFoundationState> {
    togglePanel: (panelShow: boolean) => void;
    registerClickOutSide: () => void;
    unregisterClickOutSide: () => void;
    notifyBlur: DatePickerFoundationProps['onBlur'];
    notifyFocus: DatePickerFoundationProps['onFocus'];
    notifyClear: DatePickerFoundationProps['onClear'];
    notifyChange: DatePickerFoundationProps['onChange'];
    notifyCancel: DatePickerFoundationProps['onCancel'];
    notifyConfirm: DatePickerFoundationProps['onConfirm'];
    notifyOpenChange: DatePickerFoundationProps['onOpenChange'];
    notifyPresetsClick: DatePickerFoundationProps['onPresetClick'];
    updateValue: (value: Date[]) => void;
    updatePrevTimezone: (prevTimeZone: string | number) => void;
    updateCachedSelectedValue: (cachedSelectedValue: Date[]) => void;
    updateInputValue: (inputValue: string) => void;
    needConfirm: () => boolean;
    typeIsYearOrMonth: () => boolean;
    setMotionEnd: (motionEnd: boolean) => void;
    setRangeInputFocus: (rangeInputFocus: DatePickerFoundationState['rangeInputFocus']) => void;
    couldPanelClosed: () => boolean;
    isEventTarget: (e: any) => boolean;
    updateInsetInputValue: (insetInputValue: InsetInputValue) => void;
    setInsetInputFocus: () => void;
    setTriggerDisabled: (disabled: boolean) => void;
}


/**
 * The datePicker foundation.js is responsible for maintaining the date value and the input box value, as well as the callback of both
 *  task 1. Accept the selected date change, update the date value, and update the input box value according to the date = > Notify the change
 *  task 2. When the input box changes, update the date value = > Notify the change
 */
export default class DatePickerFoundation extends BaseFoundation<DatePickerAdapter> {

    constructor(adapter: DatePickerAdapter) {
        super({ ...adapter });
    }

    init() {
        const timeZone = this.getProp('timeZone');
        if (this._isControlledComponent()) {
            this.initFromProps({ timeZone, value: this.getProp('value') });
        } else if (this._isInProps('defaultValue')) {
            this.initFromProps({ timeZone, value: this.getProp('defaultValue') });
        }

        this.initPanelOpenStatus(this.getProp('defaultOpen'));
    }

    isValidTimeZone(timeZone?: string | number) {
        const propTimeZone = this.getProp('timeZone');
        const _timeZone = isNullOrUndefined(timeZone) ? propTimeZone : timeZone;

        return ['string', 'number'].includes(typeof _timeZone) && _timeZone !== '';
    }

    initFromProps({ value, timeZone, prevTimeZone }: Pick<DatePickerFoundationProps, 'value' | 'timeZone'> & { prevTimeZone?: string | number }) {
        const _value = (Array.isArray(value) ? [...value] : (value || value === 0) && [value]) || [];

        const result = this.parseWithTimezone(_value, timeZone, prevTimeZone);
        this._adapter.updatePrevTimezone(prevTimeZone);
        this._adapter.updateInputValue(null);
        this._adapter.updateValue(result);

        if (this._adapter.needConfirm()) {
            this._adapter.updateCachedSelectedValue(result);
        }
    }

    parseWithTimezone(value: ValueType, timeZone: string | number, prevTimeZone: string | number) {
        const result: Date[] = [];
        if (Array.isArray(value) && value.length) {
            for (const v of value) {
                let parsedV = (v || v === 0) && this._parseValue(v);
                if (parsedV) {
                    if (this.isValidTimeZone(prevTimeZone)) {
                        parsedV = zonedTimeToUtc(parsedV, prevTimeZone as string);
                    }

                    result.push(this.isValidTimeZone(timeZone) ? utcToZonedTime(parsedV, timeZone as string) : parsedV);
                }
            }
        }

        return result;
    }

    _isMultiple() {
        return Boolean(this.getProp('multiple'));
    }

    /**
     *
     *  Verify and parse the following three format inputs
     *
        1. Date object
        2. ISO 9601-compliant string
        3. ts timestamp

        Unified here to format the incoming value and output it as a Date object
     *
     */
    _parseValue(value: BaseValueType): Date {
        const dateFnsLocale = this._adapter.getProp('dateFnsLocale');
        let dateObj: Date;
        if (!value && value !== 0) {
            return new Date();
        }
        if (isValidDate(value)) {
            dateObj = value as Date;
        } else if (isString(value)) {
            dateObj = compatibleParse(value as string, this.getProp('format'), undefined, dateFnsLocale);
        } else if (isTimestamp(value)) {
            dateObj = new Date(value);
        } else {
            throw new TypeError('defaultValue should be valid Date object/timestamp or string');
        }
        return dateObj;
    }

    destroy() {
        // Ensure that event listeners will be uninstalled and users may not trigger closePanel
        // this._adapter.togglePanel(false);
        this._adapter.unregisterClickOutSide();
    }

    initPanelOpenStatus(defaultOpen?: boolean) {
        if ((this.getProp('open') || defaultOpen) && !this.getProp('disabled')) {
            this._adapter.togglePanel(true);
            this._adapter.registerClickOutSide();
        } else {
            this._adapter.togglePanel(false);
            this._adapter.unregisterClickOutSide();
        }
    }

    openPanel() {
        if (!this.getProp('disabled')) {
            if (!this._isControlledComponent('open')) {
                this._adapter.togglePanel(true);
                this._adapter.registerClickOutSide();
            }
            this._adapter.notifyOpenChange(true);
        }
    }

    /**
     * do these side effects when type is dateRange or dateTimeRange
     *   1. trigger input blur, if input value is invalid, set input value and state value to previous status
     *   2. set cachedSelectedValue using given dates(in needConfirm mode)
     *      - directly closePanel without click confirm will set cachedSelectedValue to state value
     *      - select one date(which means that the selection value is incomplete) and click confirm also set cachedSelectedValue to state value
     */
    rangeTypeSideEffectsWhenClosePanel(inputValue: string, willUpdateDates: Date[]) {
        if (this._isRangeType()) {
            this._adapter.setRangeInputFocus(false);
            /**
             * inputValue is string when it is not disabled or can't parsed
             * when inputValue is null, picker value will back to last selected value
             */
            this.handleInputBlur(inputValue);
            this.resetCachedSelectedValue(willUpdateDates);
        }
    }

    /**
     * clear input value when selected date is not confirmed
     */
    needConfirmSideEffectsWhenClosePanel(willUpdateDates: Date[] | null | undefined) {
        if (this._adapter.needConfirm() && !this._isRangeType()) {
            /**
             * if `null` input element will show `cachedSelectedValue` formatted value（format in DateInput render）
             * if `` input element will show `` directly
             */
            this._adapter.updateInputValue(null);
            this.resetCachedSelectedValue(willUpdateDates);
        }
    }

    /**
     * clear inset input value when close panel
     */
    clearInsetInputValue() {
        const { insetInput } = this._adapter.getProps();
        if (insetInput) {
            this._adapter.updateInsetInputValue(null);
        }
    }

    resetCachedSelectedValue(willUpdateDates?: Date[]) {
        const { value, cachedSelectedValue } = this._adapter.getStates();
        const newCachedSelectedValue = Array.isArray(willUpdateDates) ? willUpdateDates : value;
        if (!isEqual(newCachedSelectedValue, cachedSelectedValue)) {
            this._adapter.updateCachedSelectedValue(newCachedSelectedValue);
        }
    }

    /**
     * timing to call closePanel
     *  1. click confirm button
     *  2. click cancel button
     *  3. select date, time, year, month
     *    - date type and not multiple, close panel after select date
     *    - dateRange type, close panel after select rangeStart and rangeEnd
     *  4. click outside
     * @param {Event} e
     * @param {String} inputValue
     * @param {Date[]} dates
     */
    closePanel(e?: any, inputValue: string = null, dates?: Date[]) {
        const { value, cachedSelectedValue } = this._adapter.getStates();
        const willUpdateDates = isNullOrUndefined(dates) ? this._adapter.needConfirm() ? value : cachedSelectedValue : dates;
        if (!this._isControlledComponent('open')) {
            this._adapter.togglePanel(false);
            this._adapter.unregisterClickOutSide();
        }
        // range type picker, closing panel requires the following side effects
        this.rangeTypeSideEffectsWhenClosePanel(inputValue, willUpdateDates as Date[]);
        this.needConfirmSideEffectsWhenClosePanel(willUpdateDates as Date[]);
        this.clearInsetInputValue();
        this._adapter.notifyOpenChange(false);
        this._adapter.notifyBlur(e);
    }

    /**
     * clear range input focus when open is controlled
     * fixed github 1375
     */
    clearRangeInputFocus = () => {
        const { type } = this._adapter.getProps();
        const { rangeInputFocus } = this._adapter.getStates();
        if (type === 'dateTimeRange' && rangeInputFocus) {
            this._adapter.setRangeInputFocus(false);
        }
    }

    /**
     * Callback when the content of the input box changes
     * Update the date panel if the changed value is a legal date, otherwise only update the input box
     * @param {String} input The value of the input box after the change
     * @param {Event} e
     */
    handleInputChange(input: string, e: any) {
        const result = this._isMultiple() ? this.parseMultipleInput(input) : this.parseInput(input);
        const { value: stateValue } = this.getStates();
        // Enter a valid date or empty
        if ((result && result.length) || input === '') {
            // If you click the clear button
            if (get(e, inputStrings.CLEARBTN_CLICKED_EVENT_FLAG) && this._isControlledComponent('value')) {
                this._notifyChange(result);
                return;
            }
            this._updateValueAndInput(result, input === '', input);
            // Updates the selected value when entering a valid date
            const changedDates = this._getChangedDates(result);
            if (!this._someDateDisabled(changedDates)) {
                if (this._adapter.needConfirm()) {
                    this._adapter.updateCachedSelectedValue(result);
                }
                if (!isEqual(result, stateValue)) {
                    this._notifyChange(result);
                }
            }
        } else {
            this._adapter.updateInputValue(input);
        }
    }

    /**
     * inset input 变化时需要更新以下 state 状态
     *  - insetInputValue（总是）
     *  - inputValue（可以解析为合法日期时）
     *  - value（可以解析为合法日期时）
     */
    handleInsetInputChange(options: { insetInputStr: string, format: string, insetInputValue: InsetInputValue }) {
        const { insetInputStr, format, insetInputValue } = options;
        const _isMultiple = this._isMultiple();
        const result = _isMultiple ? this.parseMultipleInput(insetInputStr, format) : this.parseInput(insetInputStr, format);
        const { value: stateValue } = this.getStates();

        if ((result && result.length)) {
            const changedDates = this._getChangedDates(result);
            if (!this._someDateDisabled(changedDates)) {
                if (this._adapter.needConfirm()) {
                    this._adapter.updateCachedSelectedValue(result);
                }
                if (!isEqual(result, stateValue)) {
                    if (!this._isControlledComponent()) {
                        this._adapter.updateValue(result);
                    }
                    this._notifyChange(result);
                }
                const triggerInput = _isMultiple ? this.formatMultipleDates(result) : this.formatDates(result);
                this._adapter.updateInputValue(triggerInput);
            }
        }
        this._adapter.updateInsetInputValue(insetInputValue);
    }

    /**
     * Input box blur
     * @param {String} input
     * @param {Event} e
     */
    handleInputBlur(input = '', e?: any) {
        const parsedResult = input ?
            this._isMultiple() ?
                this.parseMultipleInput(input, ',', true) :
                this.parseInput(input) :
            [];

        const stateValue = this.getState('value');

        // console.log(input, parsedResult);

        if (parsedResult && parsedResult.length) {
            this._updateValueAndInput(parsedResult, input === '');
        } else if (input === '') {
            // if clear input, set input to `''`
            this._updateValueAndInput('' as any, true, '');
        } else {
            this._updateValueAndInput(stateValue);
        }
    }

    /**
     * called when range type rangeEnd input tab press
     * @param {Event} e
     */
    handleRangeEndTabPress(e: any) {
        this._adapter.setRangeInputFocus(false);
    }

    /**
     * called when the input box is focused
     * @param {Event} e input focus event
     * @param {String} range 'rangeStart' or 'rangeEnd', use when type is range
     */
    handleInputFocus(e: any, range: 'rangeStart' | 'rangeEnd') {
        const rangeInputFocus = this._adapter.getState('rangeInputFocus');
        range && this._adapter.setRangeInputFocus(range);
        /**
         * rangeType: only notify when range is false
         * not rangeType: notify when focus
         */
        if (!range || !['rangeStart', 'rangeEnd'].includes(rangeInputFocus)) {
            this._adapter.notifyFocus(e, range);
        }
    }

    handleSetRangeFocus(rangeInputFocus: RangeType) {
        this._adapter.setRangeInputFocus(rangeInputFocus);
    }

    handleInputClear(e: any) {
        this._adapter.notifyClear(e);
    }

    /**
     * 范围选择清除按钮回调
     * 因为清除按钮没有集成在Input内，因此需要手动清除 value、inputValue、cachedValue
     *
     * callback of range input clear button
     * Since the clear button is not integrated in Input, you need to manually clear value, inputValue, cachedValue
     */
    handleRangeInputClear(e: any) {
        const value: Date[] = [];
        const inputValue = '';
        if (!this._isControlledComponent('value')) {
            this._updateValueAndInput(value, true, inputValue);
            if (this._adapter.needConfirm()) {
                this._adapter.updateCachedSelectedValue(value);
            }
        }
        this._notifyChange(value);
        this._adapter.notifyClear(e);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleRangeInputBlur(value: any, e: any) {
    }

    // Parses input only after user returns
    handleInputComplete(input: any = '') {
        // console.log(input);
        let parsedResult = input ?
            this._isMultiple() ?
                this.parseMultipleInput(input, ',', true) :
                this.parseInput(input) :
            [];

        parsedResult = parsedResult && parsedResult.length ? parsedResult : this.getState('value');

        // Use the current date as the value when the current input is empty and the last input is also empty
        if (!parsedResult || !parsedResult.length) {
            const nowDate = new Date();
            if (this._isRangeType()) {
                parsedResult = [nowDate, nowDate];
            } else {
                parsedResult = [nowDate];
            }
        }

        this._updateValueAndInput(parsedResult);
        const { value: stateValue } = this.getStates();
        const changedDates = this._getChangedDates(parsedResult);
        if (!this._someDateDisabled(changedDates) && !isEqual(parsedResult, stateValue)) {
            this._notifyChange(parsedResult);
        }
    }

    /**
     * Parse the input, return the time object if it is valid,
     *  otherwise return "
     *
     * @param {string} input
     * @returns  {Date [] | '}
     */
    parseInput(input = '', format?: string) {
        let result: Date[] = [];
        // console.log(input);
        const { dateFnsLocale, rangeSeparator } = this.getProps();

        if (input && input.length) {
            const type = this.getProp('type');
            const formatToken = format || this.getProp('format') || getDefaultFormatTokenByType(type);
            let parsedResult,
                formatedInput;
            const nowDate = new Date();
            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    parsedResult = input ? compatibleParse(input, formatToken, nowDate, dateFnsLocale) : '';
                    formatedInput = parsedResult && isValid(parsedResult) && this.localeFormat(parsedResult as Date, formatToken);
                    if (parsedResult && formatedInput === input) {
                        result = [parsedResult as Date];
                    }
                    break;
                case 'dateRange':
                case 'dateTimeRange':
                    const separator = rangeSeparator;
                    const values = input.split(separator);
                    parsedResult =
                        values &&
                        values.reduce((arr, cur) => {
                            const parsedVal = cur && compatibleParse(cur, formatToken, nowDate, dateFnsLocale);
                            parsedVal && arr.push(parsedVal);
                            return arr;
                        }, []);
                    formatedInput =
                        parsedResult &&
                        parsedResult.map(v => v && isValid(v) && this.localeFormat(v, formatToken)).join(separator);
                    if (parsedResult && formatedInput === input) {
                        parsedResult.sort((d1, d2) => d1.getTime() - d2.getTime());
                        result = parsedResult;
                    }
                    break;
                default:
                    break;
            }
        }

        return result;
    }

    /**
     * Parses the input when multiple is true, if valid,
     *  returns a list of time objects, otherwise returns an array
     *
     * @param {string} [input='']
     * @param {string} [separator=',']
     * @param {boolean} [needDedupe=false]
     * @returns {Date[]}
     */
    parseMultipleInput(input = '', separator: string = strings.DEFAULT_SEPARATOR_MULTIPLE, needDedupe = false) {
        const max = this.getProp('max');
        const inputArr = input.split(separator);
        const result: Date[] = [];

        for (const curInput of inputArr) {
            let tmpParsed = curInput && this.parseInput(curInput);
            tmpParsed = Array.isArray(tmpParsed) ? tmpParsed : tmpParsed && [tmpParsed];
            if (tmpParsed && tmpParsed.length) {
                if (needDedupe) {
                    // 20190519 TODO: needs to determine the case where multiple is true and range
                    !result.filter(r => Boolean(tmpParsed.find(tp => isSameSecond(r, tp)))) && result.push(...tmpParsed);
                } else {
                    result.push(...tmpParsed);
                }
            } else {
                return [];
            }

            if (max && max > 0 && result.length > max) {
                return [];
            }
        }

        return result;
    }

    /**
     * dates[] => string
     *
     * @param {Date[]} dates
     * @returns {string}
     */
    formatDates(dates: Date[] = [], customFormat?: string) {
        let str = '';
        const rangeSeparator = this.getProp('rangeSeparator');

        if (Array.isArray(dates) && dates.length) {
            const type = this.getProp('type');
            const formatToken = customFormat || this.getProp('format') || getDefaultFormatTokenByType(type);

            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    str = this.localeFormat(dates[0], formatToken);
                    break;

                case 'dateRange':
                case 'dateTimeRange':
                    const startIsTruthy = !isNullOrUndefined(dates[0]);
                    const endIsTruthy = !isNullOrUndefined(dates[1]);
                    if (startIsTruthy && endIsTruthy) {
                        str = `${this.localeFormat(dates[0], formatToken)}${rangeSeparator}${this.localeFormat(dates[1], formatToken)}`;
                    } else {
                        if (startIsTruthy) {
                            str = `${this.localeFormat(dates[0], formatToken)}${rangeSeparator}`;
                        } else if (endIsTruthy) {
                            str = `${rangeSeparator}${this.localeFormat(dates[1], formatToken)}`;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        return str;
    }

    /**
     * dates[] => string
     *
     * @param {Date[]} dates
     * @returns {string}
     */
    formatMultipleDates(dates: Date[] = [], separator: string = strings.DEFAULT_SEPARATOR_MULTIPLE, customFormat?: string) {
        const strs = [];
        if (Array.isArray(dates) && dates.length) {
            const type = this.getProp('type');

            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    dates.forEach(date => strs.push(this.formatDates([date], customFormat)));
                    break;
                case 'dateRange':
                case 'dateTimeRange':
                    for (let i = 0; i < dates.length; i += 2) {
                        strs.push(this.formatDates(dates.slice(i, i + 2), customFormat));
                    }
                    break;
                default:
                    break;
            }
        }
        return strs.join(separator);
    }

    /**
     * Update date value and the value of the input box
     * 1. Select Update
     * 2. Input Update
     * @param {Date|''} value
     * @param {Boolean} forceUpdateValue
     * @param {String} input
     */
    _updateValueAndInput(value: Date | Array<Date>, forceUpdateValue?: boolean, input?: string) {
        let _value: Array<Date>;
        if (forceUpdateValue || value) {
            if (!Array.isArray(value)) {
                _value = value ? [value] : [];
            } else {
                _value = value;
            }

            const changedDates = this._getChangedDates(_value);
            // You cannot update the value directly when needConfirm, you can only change the value through handleConfirm
            if (!this._isControlledComponent() && !this._someDateDisabled(changedDates) && !this._adapter.needConfirm()) {
                this._adapter.updateValue(_value);
            }
        }
        this._adapter.updateInputValue(input);
    }

    /**
     * when changing the selected value through the date panel
     * @param {*} value
     * @param {*} options
     */
    handleSelectedChange(value: Date[], options?: { fromPreset?: boolean; needCheckFocusRecord?: boolean }) {
        const { type, format, rangeSeparator, insetInput } = this._adapter.getProps();
        const { value: stateValue } = this.getStates();
        const controlled = this._isControlledComponent();
        const fromPreset = isObject(options) ? options.fromPreset : options;
        const closePanel = get(options, 'closePanel', true);
        /**
         * It is used to determine whether the panel can be stowed. In a Range type component, it is necessary to select both starting Time and endTime before stowing.
         * To determine whether both starting Time and endTime have been selected, it is used to judge whether the two inputs have been Focused.
         * This variable is used to indicate whether such a judgment is required. In the scene with shortcut operations, it is not required.
         */
        const needCheckFocusRecord = get(options, 'needCheckFocusRecord', true);

        if (this._adapter.needConfirm()) {
            this._adapter.updateCachedSelectedValue(value);
        }

        const dates = Array.isArray(value) ? [...value] : value ? [value] : [];
        const changedDates = this._getChangedDates(dates);

        let inputValue, insetInputValue;
        if (!this._someDateDisabled(changedDates)) {
            inputValue = this._isMultiple() ? this.formatMultipleDates(dates) : this.formatDates(dates);
            if (insetInput) {
                const insetInputFormatToken = getInsetInputFormatToken({ format, type });
                const insetInputStr = this._isMultiple() ? this.formatMultipleDates(dates, undefined, insetInputFormatToken) : this.formatDates(dates, insetInputFormatToken);
                insetInputValue = getInsetInputValueFromInsetInputStr({ inputValue: insetInputStr, type, rangeSeparator  });
            }
            const isRangeTypeAndInputIncomplete = this._isRangeType() && !this._isRangeValueComplete(dates);
            /**
             * If the input is incomplete when under control, the notifyChange is not triggered because
             * You need to update the value of the input box, otherwise there will be a problem that a date is selected but the input box does not show the date #1357
             *
             * 受控时如果输入不完整，由于没有触发 notifyChange
             * 需要组件内更新一下输入框的值，否则会出现选了一个日期但是输入框没有回显日期的问题 #1357
             */
            if (!this._adapter.needConfirm() || fromPreset) {
                if (isRangeTypeAndInputIncomplete) {
                    // do not change value when selected value is incomplete
                    this._adapter.updateInputValue(inputValue);
                    this._adapter.updateInsetInputValue(insetInputValue);
                    return;
                } else {
                    if (!controlled || fromPreset) {
                        this._updateValueAndInput(dates, true, inputValue);
                        this._adapter.updateInsetInputValue(insetInputValue);
                    }
                }
            }
            if (!controlled && this._adapter.needConfirm()) {
                // select date only change inputValue when needConfirm is true
                this._adapter.updateInputValue(inputValue);
                this._adapter.updateInsetInputValue(insetInputValue);
                // if inputValue is not complete, don't notifyChange
                if (isRangeTypeAndInputIncomplete) {
                    return;
                }
            }
            if (!isEqual(value, stateValue)) {
                this._notifyChange(value);
            }
        }

        const focusRecordChecked = !needCheckFocusRecord || (needCheckFocusRecord && this._adapter.couldPanelClosed());
        if ((type === 'date' && !this._isMultiple() && closePanel) || (type === 'dateRange' && this._isRangeValueComplete(dates) && closePanel && focusRecordChecked)) {
            this.closePanel(undefined, inputValue, dates);
        }
    }

    /**
     * when changing the year and month through the panel when the type is year or month
     * @param {*} item
     */
    handleYMSelectedChange(item: { currentMonth?: number; currentYear?: number } = {}) {
        // console.log(item);
        const { currentMonth, currentYear } = item;

        if (typeof currentMonth === 'number' && typeof currentYear === 'number') {
            // Strings with only dates (e.g. "1970-01-01") will be treated as UTC instead of local time #1460
            const date = new Date(currentYear, currentMonth - 1);

            this.handleSelectedChange([date]);
        }
    }

    handleConfirm() {
        const { cachedSelectedValue, value } = this._adapter.getStates();
        const isRangeValueComplete = this._isRangeValueComplete(cachedSelectedValue);
        const newValue = isRangeValueComplete ? cachedSelectedValue : value;
        if (this._adapter.needConfirm() && !this._isControlledComponent()) {
            this._adapter.updateValue(newValue);
        }
        // If the input is incomplete, the legal date of the last input is used
        this.closePanel(undefined, undefined, newValue);

        if (isRangeValueComplete) {
            const { notifyValue, notifyDate } = this.disposeCallbackArgs(cachedSelectedValue);
            this._adapter.notifyConfirm(notifyDate, notifyValue);
        }
    }

    handleCancel() {
        this.closePanel();
        const value = this.getState('value');
        const { notifyValue, notifyDate } = this.disposeCallbackArgs(value);
        this._adapter.notifyCancel(notifyDate, notifyValue);
    }

    handlePresetClick(item: PresetType, e: any) {
        const { type, timeZone } = this.getProps();
        const prevTimeZone = this.getState('prevTimezone');

        let value;
        switch (type) {
            case 'month':
            case 'dateTime':
            case 'date':
                value = this.parseWithTimezone([item.start], timeZone, prevTimeZone);
                this.handleSelectedChange(value);
                break;
            case 'dateTimeRange':
            case 'dateRange':
                value = this.parseWithTimezone([item.start, item.end], timeZone, prevTimeZone);
                this.handleSelectedChange(value, { needCheckFocusRecord: false });
                break;
            default:
                break;
        }
        this._adapter.notifyPresetsClick(item, e);
    }

    /**
     * 根据 type 处理 onChange 返回的参数
     *
     *  - 返回的日期需要把用户时间转换为设置的时区时间
     *      - 用户时间：用户计算机系统时间
     *      - 时区时间：通过 ConfigProvider 设置的 timeZone
     *  - 例子：用户设置时区为+9，计算机所在时区为+8区，然后用户选择了22:00
     *      - DatePicker 内部保存日期 state 为 +8 的 22:00 => a = new Date("2021-05-25 22:00:00")
     *      - 传出去时，需要把 +8 的 22:00 => +9 的 22:00 => b = zonedTimeToUtc(a, "+09:00");
     *
     * According to the type processing onChange returned parameters
     *
     *   - the returned date needs to convert the user time to the set time zone time
     *       - user time: user computer system time
     *       - time zone time: timeZone set by ConfigProvider
     *   - example: the user sets the time zone to + 9, the computer's time zone is + 8 zone, and then the user selects 22:00
     *       - DatePicker internal save date state is + 8 22:00 = > a = new Date ("2021-05-25 22:00:00")
     *       - when passed out, you need to + 8 22:00 = > + 9 22:00 = > b = zonedTimeToUtc (a, "+ 09:00");
     *
     *  e.g.
     *  let a = new Date ("2021-05-25 22:00:00");
     *       = > Tue May 25 2021 22:00:00 GMT + 0800 (China Standard Time)
     *  let b = zonedTimeToUtc (a, "+ 09:00");
     *       = > Tue May 25 2021 21:00:00 GMT + 0800 (China Standard Time)
     *
     * @param {Date|Date[]} value
     * @return {{ notifyDate: Date|Date[], notifyValue: string|string[]}}
     */
    disposeCallbackArgs(value: Date | Date[]) {
        let _value = Array.isArray(value) ? value : (value && [value]) || [];

        if (this.isValidTimeZone()) {
            const timeZone = this.getProp('timeZone');
            _value = _value.map(date => zonedTimeToUtc(date, timeZone));
        }
        const type = this.getProp('type');
        const formatToken = this.getProp('format') || getDefaultFormatTokenByType(type);

        let notifyValue,
            notifyDate;
        switch (type) {
            case 'date':
            case 'dateTime':
            case 'month':
                if (!this._isMultiple()) {
                    notifyValue = _value[0] && this.localeFormat(_value[0], formatToken);
                    [notifyDate] = _value;
                } else {
                    notifyValue = _value.map(v => v && this.localeFormat(v, formatToken));
                    notifyDate = [..._value];
                }
                break;
            case 'dateRange':
            case 'dateTimeRange':
                notifyValue = _value.map(v => v && this.localeFormat(v, formatToken));
                notifyDate = [..._value];
                break;
            default:
                break;
        }

        return {
            notifyValue,
            notifyDate,
        };
    }

    /**
     * Notice: Check whether the date is the same as the state value before calling
     * @param {Date[]} value
     */
    _notifyChange(value: Date[]) {
        if (this._isRangeType() && !this._isRangeValueComplete(value)) {
            return;
        }
        const { onChangeWithDateFirst } = this.getProps();
        const { notifyValue, notifyDate } = this.disposeCallbackArgs(value);
        if (onChangeWithDateFirst) {
            this._adapter.notifyChange(notifyDate, notifyValue);
        } else {
            this._adapter.notifyChange(notifyValue, notifyDate);
        }
    }

    /**
     * Get the date changed through the date panel or enter
     * @param {Date[]} dates
     * @returns {Date[]}
     */
    _getChangedDates(dates: Date[]) {
        const type = this._adapter.getProp('type');
        const stateValue: Date[] = this._adapter.getState('value');

        const changedDates = [];

        switch (type) {
            case 'dateRange':
            case 'dateTimeRange':
                const [stateStart, stateEnd] = stateValue;
                const [start, end] = dates;
                if (!isDateEqual(start, stateStart)) {
                    changedDates.push(start);
                }
                if (!isDateEqual(end, stateEnd)) {
                    changedDates.push(end);
                }
                break;
            default:
                const stateValueSet = new Set<number>();
                stateValue.forEach(value => stateValueSet.add(isDate(value) && value.valueOf()));
                for (const date of dates) {
                    if (!stateValueSet.has(isDate(date) && date.valueOf())) {
                        changedDates.push(date);
                    }
                }
        }
        return changedDates;
    }

    /**
     * Whether a date is disabled
     * @param {Array} value
     */
    _someDateDisabled(value: Date[]) {
        const stateValue = this.getState('value');
        const disabledOptions = { rangeStart: '', rangeEnd: '' };

        // DisabledDate needs to pass the second parameter
        if (this._isRangeType() && Array.isArray(stateValue)) {
            if (isValid(stateValue[0])) {
                const rangeStart = format(stateValue[0], 'yyyy-MM-dd');
                disabledOptions.rangeStart = rangeStart;
            }

            if (isValid(stateValue[1])) {
                const rangeEnd = format(stateValue[1], 'yyyy-MM-dd');
                disabledOptions.rangeEnd = rangeEnd;
            }
        }

        let isSomeDateDisabled = false;
        for (const date of value) {
            // skip check if date is null
            if (!isNullOrUndefined(date) && this.disabledDisposeDate(date, disabledOptions)) {
                isSomeDateDisabled = true;
                break;
            }
        }
        return isSomeDateDisabled;
    }

    getMergedMotion = (motion: any) => {
        const mergedMotion = typeof motion === 'undefined' || motion ? {
            ...motion,
            didEnter: () => {
                this._adapter.setMotionEnd(true);
            },
            didLeave: () => {
                this._adapter.setMotionEnd(false);
            }
        } : false;
        return mergedMotion;
    };

    /**
     * Format locale date
     * locale get from LocaleProvider
     * @param {Date} date
     * @param {String} token
     */
    localeFormat(date: Date, token: string) {
        const dateFnsLocale = this._adapter.getProp('dateFnsLocale');
        return format(date, token, { locale: dateFnsLocale });
    }

    _isRangeType = () => {
        const type = this._adapter.getProp('type');
        return /range/i.test(type);
    };

    _isRangeValueComplete = (value: Date[] | Date) => {
        let result = false;
        if (Array.isArray(value)) {
            result = !value.some(date => isNullOrUndefined(date));
        }
        return result;
    };

    /**
     * Convert computer date to UTC date
     * Before passing the date to the user, you need to convert the date to UTC time
     * dispose date from computer date to utc date
     * When given timeZone prop, you should convert computer date to utc date before passing to user
     * @param {(date: Date) => Boolean} fn
     * @param {Date|Date[]} date
     * @returns {Boolean}
     */
    disposeDateFn(fn: (date: Date, ...rest: any) => boolean, date: Date | Date[], ...rest: any[]) {
        const { notifyDate } = this.disposeCallbackArgs(date);

        const dateIsArray = Array.isArray(date);
        const notifyDateIsArray = Array.isArray(notifyDate);

        let disposeDate;
        if (dateIsArray === notifyDateIsArray) {
            disposeDate = notifyDate;
        } else {
            disposeDate = dateIsArray ? [notifyDate] : notifyDate[0];
        }

        return fn(disposeDate, ...rest);
    }

    /**
     * Determine whether the date is disabled
     * Whether the date is disabled
     * @param {Date} date
     * @returns {Boolean}
     */
    disabledDisposeDate(date: Date, ...rest: any[]) {
        const { disabledDate } = this.getProps();
        return this.disposeDateFn(disabledDate, date, ...rest);
    }

    /**
     * Determine whether the date is disabled
     * Whether the date time is disabled
     * @param {Date|Date[]} date
     * @returns {Object}
     */
    disabledDisposeTime(date: Date | Date[], ...rest: any[]) {
        const { disabledTime } = this.getProps();
        return this.disposeDateFn(disabledTime, date, ...rest);
    }

    /**
     * Trigger wrapper needs to do two things:
     *  1. Open Panel when clicking trigger;
     *  2. When clicking on a child but the child does not listen to the focus event, manually trigger focus
     *
     * @param {Event} e
     * @returns
     */
    handleTriggerWrapperClick(e: any) {
        const { disabled } = this._adapter.getProps();
        const { rangeInputFocus } = this._adapter.getStates();
        if (disabled) {
            return;
        }
        /**
         * - 非范围选择时，trigger 为原生输入框，已在组件内处理了 focus 逻辑
         * - isEventTarget 函数用于判断触发事件的是否为 input wrapper。如果是冒泡上来的不用处理，因为在子级已经处理了 focus 逻辑。
         *
         * - When type is not range type, Input component will automatically focus in the same case
         * - isEventTarget is used to judge whether the event is a bubbling event
         */
        if (this._isRangeType() && !rangeInputFocus && this._adapter.isEventTarget(e)) {
            setTimeout(() => {
                // using setTimeout get correct state value 'rangeInputFocus'
                this.handleInputFocus(e, 'rangeStart');
                this.openPanel();
            }, 0);
        } else {
            this.openPanel();
        }
    }

    handlePanelVisibleChange(visible: boolean) {
        if (visible) {
            this._adapter.setInsetInputFocus();
            /**
             * After the panel is closed, the trigger input is disabled
             * 面板关闭后，trigger input 禁用
             */
            setTimeout(() => {
                this._adapter.setTriggerDisabled(true);
            }, 0);
        } else {
            this._adapter.setTriggerDisabled(false);
        }
    }
}
