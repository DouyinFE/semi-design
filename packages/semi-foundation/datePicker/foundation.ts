import { isValid, isSameSecond, isEqual as isDateEqual, isDate, Locale } from 'date-fns';
import { get, isObject, isEqual, isFunction } from 'lodash';
import { TZDate } from '@date-fns/tz';

import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { TZDateUtil } from '../utils/date-fns-extra';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';
import { strings } from './constants';
import { strings as inputStrings } from '../input/constants';

import getInsetInputFormatToken from './_utils/getInsetInputFormatToken';
import getInsetInputValueFromInsetInputStr from './_utils/getInsetInputValueFromInsetInputStr';

import type { ArrayElement } from '../utils/type';
import type { Type, DateInputFoundationProps, InsetInputValue } from './inputFoundation';
import type { MonthsGridFoundationProps } from './monthsGridFoundation';
import type { WeekStartNumber } from './_utils/getMonthTable';
import warning from '../utils/warning';

export type ValidateStatus = ArrayElement<typeof strings.STATUS>;
export type InputSize = ArrayElement<typeof strings.SIZE_SET>;
export type Position = ArrayElement<typeof strings.POSITION_SET>;
export type PresetPosition = ArrayElement<typeof strings.PRESET_POSITION_SET>;

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
    isHoverInOffsetRange?: boolean // Hover in the week selection
};
export type DisabledDateOptions = {
    rangeStart?: string;
    rangeEnd?: string;
    /**
     * current select of range type
     */
    rangeInputFocus?: 'rangeStart' | 'rangeEnd' | false
};

export type PresetType = {
    start?: BaseValueType | (() => BaseValueType);
    end?: BaseValueType | (() => BaseValueType);
    text?: string
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
    componentProps?: DatePickerFoundationProps
};

// 所有暴露给用户的日期，使用 Date 类型
// 所有内部的日期，使用 TZDate 类型
export type DateOffsetType = (selectedDate?: Date) => Date;
export type DensityType = 'default' | 'compact';
export type DisabledDateType = (date?: Date, options?: DisabledDateOptions) => boolean;
export type DisabledTimeType = (date?: Date | Date[], panelType?: string) => ({
    disabledHours?: () => number[];
    disabledMinutes?: (hour: number) => number[];
    disabledSeconds?: (hour: number, minute: number) => number[]
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
    topSlot?: any
}

export interface RenderProps {
    renderDate?: RenderDateType;
    renderFullDate?: RenderFullDateType;
    triggerRender?: TriggerRenderType
}

export type RangeType = 'rangeStart' | 'rangeEnd' | false;

export interface EventHandlerProps {
    onCancel?: OnCancelType;
    onChange?: OnChangeType;
    onOpenChange?: (status: boolean) => void;
    onPanelChange?: OnPanelChangeType;
    onConfirm?: OnConfirmType;
    // properties below need overwrite
    onBlur?: (e: any) => void;
    onClear?: (e: any) => void;
    onFocus?: (e: any, rangType: RangeType) => void;
    onPresetClick?: OnPresetClickType;
    onClickOutSide?: (e: any) => void
}

export interface DatePickerFoundationProps extends ElementProps, RenderProps, EventHandlerProps, Pick<MonthsGridFoundationProps, 'startYear' | 'endYear'> {
    autoAdjustOverflow?: boolean;
    autoFocus?: boolean;
    autoSwitchDate?: boolean;
    borderless?: boolean;
    className?: string;
    defaultOpen?: boolean;
    defaultPickerValue?: ValueType;
    defaultValue?: ValueType;
    density?: DensityType;
    disabled?: boolean;
    disabledDate?: DisabledDateType;
    disabledTime?: DisabledTimeType;
    dropdownClassName?: string;
    dropdownStyle?: Record<string, any>;
    endDateOffset?: DateOffsetType;
    format?: string;
    getPopupContainer?: () => HTMLElement;
    inputReadOnly?: boolean;
    inputStyle?: Record<string, any>;
    max?: number;
    motion?: boolean;
    multiple?: boolean;
    needConfirm?: boolean;
    onChangeWithDateFirst?: boolean;
    open?: boolean;
    placeholder?: string | string[];
    position?: Position;
    prefixCls?: string;
    presets?: PresetsType;
    presetPosition?: PresetPosition;
    showClear?: boolean;
    size?: InputSize;
    spacing?: number;
    startDateOffset?: DateOffsetType;
    stopPropagation?: boolean | string;
    style?: Record<string, any>;
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
    insetInput?: DateInputFoundationProps['insetInput'];
    preventScroll?: boolean
}

export interface DatePickerFoundationState {
    panelShow: boolean;
    isRange: boolean;
    /** value of trigger input */
    inputValue: string;
    value: TZDate[];
    // Save last selected date, maybe include null
    cachedSelectedValue: (TZDate | null)[];
    prevTimeZone: string | number;
    rangeInputFocus: RangeType;
    autofocus: boolean;
    /** value of inset input */
    insetInputValue: InsetInputValue;
    triggerDisabled: boolean
}

export { Type, DateInputFoundationProps };

export interface DatePickerAdapter extends DefaultAdapter<DatePickerFoundationProps, DatePickerFoundationState> {
    togglePanel: (panelShow: boolean, cb?: () => void) => void;
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
    updateValue: (value: TZDate[]) => void;
    updatePrevTimezone: (prevTimeZone: string | number) => void;
    updateCachedSelectedValue: (cachedSelectedValue: TZDate[]) => void;
    updateInputValue: (inputValue: string) => void;
    needConfirm: () => boolean;
    typeIsYearOrMonth: () => boolean;
    setRangeInputFocus: (rangeInputFocus: DatePickerFoundationState['rangeInputFocus']) => void;
    couldPanelClosed: () => boolean;
    isEventTarget: (e: any) => boolean;
    updateInsetInputValue: (insetInputValue: InsetInputValue) => void;
    setInsetInputFocus: () => void;
    setTriggerDisabled: (disabled: boolean) => void;
    setInputFocus: () => void;
    setInputBlur: () => void;
    setRangeInputBlur: () => void
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

    initFromProps({ value, timeZone, prevTimeZone }: Pick<DatePickerFoundationProps, 'value' | 'timeZone'> & { prevTimeZone?: string | number }) {
        const _value = (Array.isArray(value) ? [...value] : (value || value === 0) && [value]) || [];

        const result = this._parseValue({ value: _value, timeZone });
        this._adapter.updatePrevTimezone(prevTimeZone);
        // reset input value when value update
        this.clearInputValue();
        this._adapter.updateValue(result);
        this.resetCachedSelectedValue(result);
        this.initRangeInputFocus(result);

        if (this._adapter.needConfirm()) {
            this._adapter.updateCachedSelectedValue(result);
        }
    }

    /**
     * 如果用户传了一个空的 value，需要把 range input focus 设置为 rangeStart，这样用户可以清除完之后继续从开始选择
     * 
     * If the user passes an empty value, you need to set the range input focus to rangeStart, so that the user can continue to select from the beginning after clearing
     */
    initRangeInputFocus(result: TZDate[]) {
        const { triggerRender } = this.getProps();
        if (this._isRangeType() && isFunction(triggerRender) && result.length === 0) {
            this._adapter.setRangeInputFocus('rangeStart');
        }
    }

    _parseSingle(options: { date: BaseValueType | TZDate; timeZone: string | number; locale?: Locale; formatToken?: string }): TZDate | null {
        const { dateFnsLocale, format } = this._adapter.getProps();
        const { date, timeZone } = options;
        const currentLocale = options.locale ?? dateFnsLocale;
        const currentFormatToken = options.formatToken ?? format;
        return TZDateUtil.parse({ date, timeZone, locale: currentLocale, formatToken: currentFormatToken });
    }

    _parseValue(options: { value: ValueType | TZDate | TZDate[]; timeZone: string | number }): TZDate[] {
        const { value, timeZone } = options;
        const result: TZDate[] = [];
        if (Array.isArray(value) && value.length) {
            for (const v of value) {
                let parsedV = (v || v === 0) && this._parseSingle({ date: v, timeZone });
                if (parsedV) {
                    result.push(parsedV);
                } else {
                    warning(true, `[Semi DatePicker] value cannot be parsed, value: ${String(v)}`);
                }
            }
        }

        return result;
    }

    _isMultiple() {
        return Boolean(this.getProp('multiple'));
    }

    destroy() {
        // Ensure that event listeners will be uninstalled and users may not trigger closePanel
        this._adapter.togglePanel(false);
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
                this.open();
            }
            this._adapter.notifyOpenChange(true);
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

    /**
     * call it when change state value or input value
     */
    resetCachedSelectedValue(willUpdateDates?: TZDate[]) {
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
     */
    closePanel() {
        if (!this._isControlledComponent('open')) {
            this.close();
        } else {
            this.resetInnerSelectedStates();
        }
        this._adapter.notifyOpenChange(false);
    }

    open() {
        this._adapter.togglePanel(true);
        this._adapter.registerClickOutSide();
    }

    close() {
        this._adapter.togglePanel(false);
        this.resetInnerSelectedStates();
        this._adapter.unregisterClickOutSide();
    }

    focus(focusType?: Exclude<RangeType, false>) {
        if (this._isRangeType()) {
            const rangeInputFocus = focusType ?? 'rangeStart';
            this._adapter.setRangeInputFocus(rangeInputFocus);
        } else {
            this._adapter.setInputFocus();
        }
    }

    blur() {
        if (this._isRangeType()) {
            this._adapter.setRangeInputBlur();
        } else {
            this._adapter.setInputBlur();
        }
    }

    /**
     * reset cachedSelectedValue, inputValue when close panel
     */
    resetInnerSelectedStates() {
        // 通过 setTimeout 保证需要获取到最新的 state 状态
        setTimeout(() => {
            const { value, cachedSelectedValue } = this._adapter.getStates();
            if (!isEqual(value, cachedSelectedValue)) {
                this.resetCachedSelectedValue(value);
            }
        }, 0);
        this.resetFocus();
        this.clearInputValue();
    }

    resetFocus(e?: any) {
        this._adapter.setRangeInputFocus(false);
        this._adapter.notifyBlur(e);
    }

    /**
     * 将输入框内容置空
     */
    clearInputValue() {
        this._adapter.updateInputValue(null);
        this._adapter.updateInsetInputValue(null);
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
        this._updateCachedSelectedValueFromInput(input);
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
            if (!this._someDateDisabled(changedDates, result)) {
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
    handleInsetInputChange(options: { insetInputStr: string; format: string; insetInputValue: InsetInputValue }) {
        const { insetInputStr, format, insetInputValue } = options;
        const _isMultiple = this._isMultiple();
        const result = _isMultiple ? this.parseMultipleInput(insetInputStr, format) : this.parseInput(insetInputStr, format);
        const { value: stateValue } = this.getStates();
        this._updateCachedSelectedValueFromInput(insetInputStr);

        if ((result && result.length)) {
            const changedDates = this._getChangedDates(result);
            if (!this._someDateDisabled(changedDates, result)) {
                if (!isEqual(result, stateValue)) {
                    if (!this._isControlledComponent() && !this._adapter.needConfirm()) {
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
     * when input change we reset cached selected value
     */
    _updateCachedSelectedValueFromInput(input: string) {
        const looseResult = this.getLooseDateFromInput(input);
        const changedLooseResult = this._getChangedDates(looseResult);
        if (!this._someDateDisabled(changedLooseResult, looseResult)) {
            this.resetCachedSelectedValue(looseResult);
        }
    }

    /**
     * Input box blur
     * @param {String} input
     * @param {Event} e
     */
    handleInputBlur(input = '', e?: any) {
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
        const value: TZDate[] = [];
        const inputValue = '';
        if (!this._isControlledComponent('value')) {
            this._updateValueAndInput(value, true, inputValue);
            this._adapter.updateInsetInputValue(null);
            this.resetCachedSelectedValue(value);
        }
        this._notifyChange(value);
        this._adapter.setRangeInputFocus(false);
        this._adapter.notifyClear(e);
    }
    
    handleRangeInputBlur(value: any, e: any) {
    }

    // Parses input only after user returns
    handleInputComplete(input: any = '') {
        const { timeZone } = this._adapter.getProps();
        // console.log(input);
        let parsedResult = input ?
            this._isMultiple() ?
                this.parseMultipleInput(input, ',', true) :
                this.parseInput(input) :
            [];

        parsedResult = parsedResult && parsedResult.length ? parsedResult : this.getState('value');

        // Use the current date as the value when the current input is empty and the last input is also empty
        if (!parsedResult || !parsedResult.length) {
            const nowDate = TZDateUtil.createTZDate(timeZone);
            if (this._isRangeType()) {
                parsedResult = [nowDate, nowDate];
            } else {
                parsedResult = [nowDate];
            }
        }

        this._updateValueAndInput(parsedResult);
        const { value: stateValue } = this.getStates();
        const changedDates = this._getChangedDates(parsedResult);
        if (!this._someDateDisabled(changedDates, parsedResult) && !isEqual(parsedResult, stateValue)) {
            this._notifyChange(parsedResult);
        }
    }

    /**
     * Parse the input, return the time object if it is valid,
     *  otherwise return "
     */
    parseInput(input = '', format?: string): TZDate[] {
        let result: TZDate[] = [];
        // console.log(input);
        const { dateFnsLocale, rangeSeparator, timeZone } = this._adapter.getProps();

        if (input && input.length) {
            const type = this.getProp('type');
            const formatToken = format || this.getProp('format') || getDefaultFormatTokenByType(type);
            let parsedResult: TZDate | null | TZDate[];
            let formattedInput: string;
            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    parsedResult = input ? this._parseSingle({ date: input, timeZone, formatToken, locale: dateFnsLocale }) : null;
                    formattedInput = parsedResult && isValid(parsedResult) && this._formatSingle({ date: parsedResult, formatToken });
                    if (parsedResult && formattedInput === input) {
                        result = [parsedResult as TZDate];
                    }
                    break;
                case 'dateRange':
                case 'dateTimeRange':
                case 'monthRange':
                    const separator = rangeSeparator;
                    const values = input.split(separator);
                    parsedResult =
                        values &&
                        values.reduce((arr, cur) => {
                            const parsedVal = cur && this._parseSingle({ date: cur, timeZone, formatToken, locale: dateFnsLocale });
                            parsedVal && arr.push(parsedVal);
                            return arr;
                        }, []);
                    formattedInput =
                        parsedResult &&
                        parsedResult.map(v => v && isValid(v) && this._formatSingle({ date: v, formatToken })).join(separator);
                    if (parsedResult && formattedInput === input) {
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
     * get date which may include null from input
     */
    getLooseDateFromInput(input: string): Array<TZDate | null> {
        const value = this._isMultiple() ? this.parseMultipleInputLoose(input) : this.parseInputLoose(input);
        return value;
    }

    /**
     * parse input into `Array<TZDate|null>`, loose means return value includes `null`
     * 
     * @example
     * ```javascript
     * parseInputLoose('2022-03-15 ~ '); // [TZDate, null]
     * parseInputLoose(' ~ 2022-03-15 '); // [null, TZDate]
     * parseInputLoose(''); // []
     * parseInputLoose('2022-03- ~ 2022-0'); // [null, null]
     * ```
     */
    parseInputLoose(input = ''): Array<TZDate | null> {
        let result: Array<TZDate | null> = [];
        const { dateFnsLocale, rangeSeparator, type, format, timeZone } = this._adapter.getProps();

        if (input && input.length) {
            const formatToken = format || getDefaultFormatTokenByType(type);
            let parsedResult, formattedInput;
            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    const _parsedResult = this._parseSingle({ date: input, timeZone, formatToken, locale: dateFnsLocale });
                    if (_parsedResult) {
                        formattedInput = this._formatSingle({ date: _parsedResult, formatToken });
                        if (formattedInput === input) {
                            parsedResult = _parsedResult;
                        }
                    } else {
                        parsedResult = null;
                    }
                    result = [parsedResult];
                    break;
                case 'dateRange':
                case 'dateTimeRange':
                    const separator = rangeSeparator;
                    const values = input.split(separator);
                    parsedResult =
                        values &&
                        values.reduce((arr, cur) => {
                            let parsedVal = null;
                            const _parsedResult = this._parseSingle({ date: input, timeZone, formatToken, locale: dateFnsLocale });
                            if (_parsedResult) {
                                formattedInput = this._formatSingle({ date: _parsedResult, formatToken });
                                if (formattedInput === input) {
                                    parsedResult = _parsedResult;
                                }
                            }
                            arr.push(parsedVal);
                            return arr;
                        }, []);
                    if (Array.isArray(parsedResult) && parsedResult.every(item => isValid(item))) {
                        parsedResult.sort((d1, d2) => d1.getTime() - d2.getTime());
                    }
                    result = parsedResult;
                    break;
                default:
                    break;
            }
        }

        return result;
    }

    /**
     * parse multiple into `Array<TZDate|null>`, loose means return value includes `null`
     * 
     * @example
     * ```javascript
     * parseMultipleInputLoose('2021-01-01,2021-10-15'); // [TZDate, TZDate];
     * parseMultipleInputLoose('2021-01-01,2021-10-'); // [TZDate, null];
     * parseMultipleInputLoose(''); // [];
     * ```
     */
    parseMultipleInputLoose(input = '', separator: string = strings.DEFAULT_SEPARATOR_MULTIPLE, needDedupe = false) {
        const max = this.getProp('max');
        const inputArr = input.split(separator);
        const result: TZDate[] = [];

        for (const curInput of inputArr) {
            let tmpParsed = curInput && this.parseInputLoose(curInput);
            tmpParsed = Array.isArray(tmpParsed) ? tmpParsed : tmpParsed && [tmpParsed];
            if (tmpParsed && tmpParsed.length) {
                if (needDedupe) {
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
     * Parses the input when multiple is true, if valid,
     *  returns a list of time objects, otherwise returns an array
     */
    parseMultipleInput(input = '', separator: string = strings.DEFAULT_SEPARATOR_MULTIPLE, needDedupe = false): TZDate[] {
        const max = this.getProp('max');
        const inputArr = input.split(separator);
        const result: TZDate[] = [];

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
     */
    formatDates(dates: TZDate[] = [], customFormat?: string) {
        let str = '';
        const rangeSeparator = this.getProp('rangeSeparator');

        if (Array.isArray(dates) && dates.length) {
            const type = this.getProp('type');
            const formatToken = customFormat || this.getProp('format') || getDefaultFormatTokenByType(type);

            switch (type) {
                case 'date':
                case 'dateTime':
                case 'month':
                    str = this._formatSingle({ date: dates[0], formatToken });
                    break;

                case 'dateRange':
                case 'dateTimeRange':
                case 'monthRange':
                    const startIsTruthy = !isNullOrUndefined(dates[0]);
                    const endIsTruthy = !isNullOrUndefined(dates[1]);
                    const start = startIsTruthy && this._formatSingle({ date: dates[0], formatToken });
                    const end = endIsTruthy && this._formatSingle({ date: dates[1], formatToken });

                    if (startIsTruthy && endIsTruthy) {
                        str = `${start}${rangeSeparator}${end}`;
                    } else {
                        if (startIsTruthy) {
                            str = `${start}${rangeSeparator}`;
                        } else if (endIsTruthy) {
                            str = `${rangeSeparator}${end}`;
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
     */
    formatMultipleDates(dates: TZDate[] = [], separator: string = strings.DEFAULT_SEPARATOR_MULTIPLE, customFormat?: string) {
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
                case 'monthRange':
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
     */
    _updateValueAndInput(value: TZDate | Array<TZDate>, forceUpdateValue?: boolean, input?: string) {
        let _value: Array<TZDate>;
        if (forceUpdateValue || value) {
            if (!Array.isArray(value)) {
                _value = value ? [value] : [];
            } else {
                _value = value;
            }

            const changedDates = this._getChangedDates(_value);
            // You cannot update the value directly when needConfirm, you can only change the value through handleConfirm
            if (!this._isControlledComponent() && !this._someDateDisabled(changedDates, _value) && !this._adapter.needConfirm()) {
                this._adapter.updateValue(_value);
            }
        }
        this._adapter.updateInputValue(input);
    }

    /**
     * when changing the selected value through the date panel
     */
    handleSelectedChange(value: TZDate[], options?: { fromPreset?: boolean; needCheckFocusRecord?: boolean }) {
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

        const dates = Array.isArray(value) ? [...value] : value ? [value] : [];
        const changedDates = this._getChangedDates(dates);

        let inputValue, insetInputValue;
        if (!this._someDateDisabled(changedDates, dates)) {
            this.resetCachedSelectedValue(dates);
            inputValue = this._isMultiple() ? this.formatMultipleDates(dates) : this.formatDates(dates);
            if (insetInput) {
                const insetInputFormatToken = getInsetInputFormatToken({ format, type });
                const insetInputStr = this._isMultiple() ? this.formatMultipleDates(dates, undefined, insetInputFormatToken) : this.formatDates(dates, insetInputFormatToken);
                insetInputValue = getInsetInputValueFromInsetInputStr({ inputValue: insetInputStr, type, rangeSeparator });
            }
            const isRangeTypeAndInputIncomplete = this._isRangeType() && !this._isRangeValueComplete(dates);
            /**
             * If the input is incomplete when under control, the notifyChange is not triggered because
             * You need to update the value of the input box, otherwise there will be a problem that a date is selected but the input box does not show the date #1357
             *
             * 受控时如果输入不完整，由于没有触发 notifyChange
             * 需要组件内更新一下输入框的值，否则会出现选了一个日期但是输入框没有回显日期的问题 #1357
             */
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
            if (!isEqual(value, stateValue)) {
                this._notifyChange(value);
            }
        }

        const focusRecordChecked = !needCheckFocusRecord || (needCheckFocusRecord && this._adapter.couldPanelClosed());
        if ((type === 'date' && !this._isMultiple() && closePanel) || (type === 'dateRange' && this._isRangeValueComplete(dates) && closePanel && focusRecordChecked)) {
            this.closePanel();
        }
    }

    /**
     * when changing the year and month through the panel when the type is year or month or monthRange
     */
    handleYMSelectedChange(item: { currentMonth?: { left: number; right: number }; currentYear?: { left: number; right: number } } = {}) {
        const { currentMonth, currentYear } = item;
        const { type, timeZone } = this._adapter.getProps();
        const normalizedTimeZone = TZDateUtil.normalizeTimeZone(timeZone);

        if (type === 'month') {
            const date = new TZDate(currentYear['left'], currentMonth['left'] - 1, normalizedTimeZone);
            this.handleSelectedChange([date]);
        } else {
            const dateLeft = new TZDate(currentYear['left'], currentMonth['left'] - 1, normalizedTimeZone);
            const dateRight = new TZDate(currentYear['right'], currentMonth['right'] - 1, normalizedTimeZone);

            this.handleSelectedChange([dateLeft, dateRight]);

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
        this.closePanel();

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
        const start = typeof item.start === 'function' ? item.start() : item.start;
        const end = typeof item.end === 'function' ? item.end() : item.end;

        let value;
        switch (type) {
            case 'month':
            case 'dateTime':
            case 'date':
                value = this._parseValue({ value: [start], timeZone });
                this.handleSelectedChange(value);
                break;
            case 'dateTimeRange':
            case 'dateRange':
                value = this._parseValue({ value: [start, end], timeZone });
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
     * 需返回 UTC Date
     */
    disposeCallbackArgs(value: TZDate | TZDate[]) {
        const tzValue = Array.isArray(value) ? value : (value && [value]) || [];
        const exposeValue = tzValue.map(date => TZDateUtil.expose(date));

        const type = this.getProp('type');
        const formatToken = this.getProp('format') || getDefaultFormatTokenByType(type);

        let notifyValue,
            notifyDate;
        switch (type) {
            case 'date':
            case 'dateTime':
            case 'month':
                if (!this._isMultiple()) {
                    notifyValue = tzValue[0] && this._formatSingle({ date: tzValue[0], formatToken });
                    [notifyDate] = exposeValue;
                } else {
                    notifyValue = tzValue.map(v => v && this._formatSingle({ date: tzValue[0], formatToken }));
                    notifyDate = [...exposeValue];
                }
                break;
            case 'dateRange':
            case 'dateTimeRange':
            case 'monthRange':
                notifyValue = tzValue.map(v => v && this._formatSingle({ date: tzValue[0], formatToken }));
                notifyDate = [...exposeValue];
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
     */
    _notifyChange(value: TZDate[]) {
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
     */
    _getChangedDates(dates: TZDate[]) {
        const type = this._adapter.getProp('type');
        const { cachedSelectedValue: lastDate } = this._adapter.getStates();
        const changedDates = [];

        switch (type) {
            case 'dateRange':
            case 'dateTimeRange':
                const [lastStart, lastEnd] = lastDate;
                const [start, end] = dates;
                if (!isDateEqual(start, lastStart)) {
                    changedDates.push(start);
                }
                if (!isDateEqual(end, lastEnd)) {
                    changedDates.push(end);
                }
                break;
            default:
                const lastValueSet = new Set<number>();
                lastDate.forEach(value => lastValueSet.add(isDate(value) && value.valueOf()));
                for (const date of dates) {
                    if (!lastValueSet.has(isDate(date) && date.valueOf())) {
                        changedDates.push(date);
                    }
                }
        }
        return changedDates;
    }

    /**
     * Whether a date is disabled
     * @param value The date that needs to be judged whether to disable
     * @param selectedValue Selected date, when selecting a range, pass this date to the second parameter of `disabledDate`
     */
    _someDateDisabled(value: TZDate[], selectedValue: TZDate[]) {
        const { rangeInputFocus } = this.getStates();
        const disabledOptions = { rangeStart: '', rangeEnd: '', rangeInputFocus };

        // DisabledDate needs to pass the second parameter
        if (this._isRangeType() && Array.isArray(selectedValue)) {
            if (isValid(selectedValue[0])) {
                const rangeStart = this._formatSingle({ date: selectedValue[0], formatToken: 'yyyy-MM-dd' });
                disabledOptions.rangeStart = rangeStart;
            }

            if (isValid(selectedValue[1])) {
                const rangeEnd = this._formatSingle({ date: selectedValue[1], formatToken: 'yyyy-MM-dd' });
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

    /**
     * Format locale date
     * locale get from LocaleProvider
     */
    _formatSingle(options: { date: TZDate; formatToken?: string; locale?: Locale }) {
        const { date } = options;
        const { dateFnsLocale, format } = this._adapter.getProps();
        const currentToken = options.formatToken ?? format;
        const currentLocale = options.locale ?? dateFnsLocale;
        return TZDateUtil.format({ date, formatToken: currentToken, locale: currentLocale });
    }

    _isRangeType = () => {
        const type = this._adapter.getProp('type');
        return /range/i.test(type);
    };

    _isRangeValueComplete = (value: TZDate[] | TZDate) => {
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
     */
    disposeDateFn(fn: (date: Date, ...rest: any) => boolean, date: TZDate | TZDate[], ...rest: any[]) {
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
     */
    disabledDisposeDate(date: TZDate, ...rest: any[]) {
        const { disabledDate } = this._adapter.getProps();
        return this.disposeDateFn(disabledDate, date, ...rest);
    }

    /**
     * Determine whether the date is disabled
     * Whether the date time is disabled
     */
    disabledDisposeTime(date: TZDate | TZDate[], ...rest: any[]) {
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
        const { disabled, triggerRender } = this._adapter.getProps();
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
        if (this._isRangeType() && !rangeInputFocus) {
            if (this._adapter.isEventTarget(e)) {
                setTimeout(() => {
                    // using setTimeout get correct state value 'rangeInputFocus'
                    this.handleInputFocus(e, 'rangeStart');
                }, 0);
            } else if (isFunction(triggerRender)) {
                // 如果是 triggerRender 场景，因为没有 input，因此打开面板时默认 focus 在 rangeStart
                // If it is a triggerRender scene, because there is no input, the default focus is rangeStart when the panel is opened
                this._adapter.setRangeInputFocus('rangeStart');
            }
            this.openPanel();
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
