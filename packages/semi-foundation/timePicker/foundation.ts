import { strings } from './constants';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import {
    hourIsDisabled,
    minuteIsDisabled,
    secondIsDisabled,
    transformToArray,
    isTimeFormatLike,
} from './utils';
import { split, isUndefined } from 'lodash';
import { isValid, getHours, Locale } from 'date-fns';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { TZDate } from '@date-fns/tz';
import { Position } from '../tooltip/foundation';
import { TZDateUtil } from '../utils/date-fns-extra';
import { isValidDate } from '../utils/date';

export type BaseValueType = string | number | Date | undefined;
export type Type = 'time' | 'timeRange';

export interface TimePickerFoundationProps {
    open?: boolean;
    timeZone?: string | number;
    dateFnsLocale?: Locale;
    rangeSeparator?: string;
    autoAdjustOverflow?: boolean;
    autoFocus?: boolean; // TODO: autoFocus did not take effect
    borderless?: boolean;
    className?: string;
    clearText?: string;
    clearIcon?: any;
    defaultOpen?: boolean;
    defaultValue?: BaseValueType | BaseValueType[];
    disabled?: boolean;
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    focusOnOpen?: boolean;
    format?: string;
    getPopupContainer?: () => HTMLElement;
    hideDisabledOptions?: boolean;
    hourStep?: number;
    id?: string;
    inputReadOnly?: boolean;
    inputStyle?: Record<string, any>;
    insetLabelId?: string;
    localeCode?: string;
    minuteStep?: number;
    motion?: boolean;
    placeholder?: string;
    popupClassName?: string;
    position?: Position;
    prefixCls?: string;
    preventScroll?: boolean;
    secondStep?: number;
    showClear?: boolean;
    stopPropagation?: boolean;
    triggerRender?: (props?: any) => any;
    type?: Type;
    use12Hours?: boolean;
    value?: BaseValueType | BaseValueType[];
    zIndex?: number | string;
    onBlur?: (e: any) => void;
    onChange?: TimePickerAdapter['notifyChange'];
    onChangeWithDateFirst?: boolean;
    onFocus?: (e: any) => void;
    onOpenChange?: (open: boolean) => void
}

export interface TimePickerFoundationState {
    open: boolean;
    value: TZDate[];
    inputValue: string;
    currentSelectPanel: string | number;
    isAM: [boolean, boolean];
    showHour: boolean;
    showMinute: boolean;
    showSecond: boolean;
    invalid: boolean
}

export interface TimePickerAdapter extends DefaultAdapter<TimePickerFoundationProps, TimePickerFoundationState> {
    togglePanel: (show: boolean) => void;
    registerClickOutSide: () => void;
    setInputValue: (inputValue: string, cb?: () => void) => void;
    unregisterClickOutSide: () => void;
    notifyOpenChange: (open: boolean) => void;
    notifyChange(value: Date | Date[], input: string | string[]): void;
    notifyChange(input: string | string[], value: Date | Date[]): void;
    notifyFocus: (e: any) => void;
    notifyBlur: (e: any) => void;
    isRangePicker: () => boolean
}

// TODO: split, timePicker different components cannot share a foundation

class TimePickerFoundation extends BaseFoundation<TimePickerAdapter> {
    constructor(adapter: TimePickerAdapter) {
        super({ ...adapter });
    }

    init() {
        this.initDataFromDefaultValue();

        const open = this._isControlledComponent('open') ? this.getProp('open') : this.getProp('defaultOpen');

        if (open && !this._isControlledComponent('open')) {
            this._adapter.registerClickOutSide();
        }
    }

    getPosition(): Position {
        const position = this.getProp('position');
        const type = this.getProp('type') || strings.DEFAULT_TYPE;
        // rtl change default position
        const direction = this.getContext('direction');
        const rtlDirection = direction === 'rtl' ? 'bottomRight' : '';
        return position || rtlDirection || strings.DEFAULT_POSITION[type];
    }

    isDisabledHMS({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
        const { disabledHours, disabledMinutes, disabledSeconds } = this.getProps();
        const hDis = !isNullOrUndefined(hours) && hourIsDisabled(disabledHours, hours);
        const mDis =
            !isNullOrUndefined(hours) &&
            !isNullOrUndefined(minutes) &&
            minuteIsDisabled(disabledMinutes, hours, minutes);
        const sDis =
            !isNullOrUndefined(hours) &&
            !isNullOrUndefined(minutes) &&
            !isNullOrUndefined(seconds) &&
            secondIsDisabled(disabledSeconds, hours, minutes, seconds);

        return hDis || mDis || sDis;
    }

    isValidTimeZone(timeZone: string | number) {
        return ['string', 'number'].includes(typeof timeZone) && timeZone !== '';
    }

    getDefaultFormatIfNeed(): string {
        if (this._isInProps('format')) {
            return this.getProp('format');
        } else if (this.getProp('use12Hours')) {
            return strings.DEFAULT_FORMAT_A;
        } else {
            return strings.DEFAULT_FORMAT;
        }
    }

    /**
     * User input value => save timestamp
     */
    initDataFromDefaultValue() {
        const { value: propValue, defaultValue, timeZone, rangeSeparator, dateFnsLocale } = this._adapter.getProps();
        let value: BaseValueType | BaseValueType[] = propValue || defaultValue;

        if (!Array.isArray(value)) {
            value = value ? [value] : [];
        }

        let invalid = false;
        const formatToken = this.getValidFormat();
        const parsedValues: TZDate[] = value
            .map(v => this._parseSingle({ date: v, formatToken, locale: dateFnsLocale, timeZone }))
            .filter(Boolean);

        const isAM = [true, false];
        parsedValues.forEach((item, idx) => {
            isAM[idx] = getHours(item) < 12;
        });

        let stateValue: TZDate[] = [];
        if (parsedValues.length === value.length) {
            stateValue = parsedValues;
        } else {
            stateValue = [];
            if (stateValue.length) {
                invalid = true;
            }
        }

        let inputValue = '';

        if (!invalid) {
            inputValue = stateValue
                .map(v => this._formatSingle({ date: v, formatToken, locale: dateFnsLocale }))
                .join(rangeSeparator);
        }

        this.setState({
            isAM,
            value: stateValue,
            inputValue,
            invalid,
        });
    }

    _parseSingle(options: {
        date: BaseValueType | TZDate;
        timeZone: string | number | undefined;
        locale?: Locale;
        formatToken?: string
    }): TZDate | null {
        const { dateFnsLocale, format } = this._adapter.getProps();
        const { date, timeZone } = options;
        const currentLocale = options.locale ?? dateFnsLocale;
        const currentFormatToken = options.formatToken ?? format;
        return TZDateUtil.parse({ date, timeZone, locale: currentLocale, formatToken: currentFormatToken });
    }

    _formatSingle(options: { date: TZDate; formatToken?: string; locale?: Locale }) {
        const { date } = options;
        const { dateFnsLocale, format } = this._adapter.getProps();
        const currentToken = options.formatToken ?? format;
        const currentLocale = options.locale ?? dateFnsLocale;
        return TZDateUtil.format({ date, formatToken: currentToken, locale: currentLocale });
    }

    _expose(date: TZDate) {
        return TZDateUtil.expose(date);
    }

    getValidFormat(validFormat?: string) {
        let _format = validFormat;
        if (isNullOrUndefined(_format)) {
            _format = this.getDefaultFormatIfNeed();
        }
        if (typeof _format !== 'string') {
            _format = strings.DEFAULT_FORMAT;
        }
        return _format;
    }

    handlePanelChange(result: { isAM: boolean; value: string; timeStampValue: number }, index = 0) {
        const { dateFnsLocale, timeZone } = this._adapter.getProps();
        const formatToken = this.getValidFormat();
        const { value: oldValue } = this._adapter.getStates();
        let isAM = this.getState('isAM');

        const value: TZDate[] = transformToArray(oldValue);
        isAM = transformToArray(isAM);

        if (result) {
            const panelIsAM = Boolean(result.isAM);
            const date = this._parseSingle({
                date: result.timeStampValue,
                timeZone,
                formatToken,
                locale: dateFnsLocale,
            });
            value[index] = date;
            isAM[index] = panelIsAM;
            const inputValue = this.formatValue(value);

            if (this.getState('isAM')[index] !== result.isAM) {
                this.setState({ isAM } as any);
            }
            if (!this._isControlledComponent('value')) {
                const invalid = this.validateDates(value);
                this.setState({
                    isAM,
                    value,
                    inputValue,
                    invalid,
                } as any);
            }

            if (this._hasChanged(value, oldValue)) {
                this._notifyChange(value, inputValue);
            }
        }
    }

    refreshProps(props: any = {}) {
        const { value, timeZone } = props;

        let dates = this.parseValue({ value, timeZone });

        let invalid = dates.some(d => !isValidDate(d));
        if (!invalid) {
            invalid = dates.some(d =>
                this.isDisabledHMS({ hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds() })
            );
        }
        const inputValue = this.formatValue(dates);

        this.setState({
            value: dates,
            invalid,
            inputValue,
        } as any);
    }

    handleFocus(e: any) {
        if (!this.getState('open')) {
            this.handlePanelOpen();
        }
        this._adapter.notifyFocus(e);
    }

    setPanel(open: boolean) {
        this._adapter.togglePanel(open);
    }

    destroy() {
        this._adapter.unregisterClickOutSide();
    }

    handlePanelOpen() {
        if (!this._isControlledComponent('open')) {
            this._adapter.registerClickOutSide();
            this.setPanel(true);
        }
        this._adapter.notifyOpenChange(true);
    }

    handlePanelClose(clickedOutside: boolean, e: any) {
        if (!this._isControlledComponent('open')) {
            this._adapter.unregisterClickOutSide();
            this.setPanel(false);
        }
        this._adapter.notifyOpenChange(false);
        this._adapter.notifyBlur(e);
    }

    /* istanbul ignore next */
    handleVisibleChange(visible: boolean) {
        if (!this._isControlledComponent('open')) {
            this._adapter.togglePanel(visible);
        }
        this._adapter.notifyOpenChange(visible);
    }

    handleInputChange(input: string) {
        this._adapter.setInputValue(input);

        const rangeSeparator = this.getProp('rangeSeparator');
        const inputValues = split(input, rangeSeparator);
        const formatToken = this.getValidFormat();
        /**
         * 如果输入的字符串不是formatLike则不进行下一步操作，以免输入过程被打断
         * 特殊case
         *  - 清空时，input 为 ''，此时需要跳过isTimeFormatLike判断
         *
         * If the input string is not formatLike, do not proceed to the next operation to avoid interruption of the input process
         *  special case
         *  -when emptying, the input is "', at this time you need to skip isTimeFormatLike judgment
         */
        if (input !== '' && inputValues.some(time => !isTimeFormatLike(time, formatToken))) {
            return;
        }

        const dates = this.parseInput(input);
        const invalid = this.validateDates(dates);
        const states: { invalid: boolean; value?: TZDate[] } = { invalid };
        const oldValue = this.getState('value');
        let value = transformToArray(oldValue);

        if (!invalid) {
            states.value = dates;
            value = [...dates];
        }

        if (!this._isControlledComponent('value')) {
            this.setState(states as any);
        }

        if (this._hasChanged(value, oldValue)) {
            this._notifyChange(value, input);
        }
    }

    /* istanbul ignore next */
    doValidate(args: string | Array<TZDate>) {
        if (typeof args === 'string') {
            return this.validateStr(args);
        } else if (Array.isArray(args)) {
            return this.validateDates(args);
        }
        return undefined;
    }

    validateStr(inputValue = '') {
        const dates = this.parseInput(inputValue);

        return this.validateDates(dates);
    }

    validateDates(dates: Array<TZDate> = []) {
        let invalid = dates.some(d => isNaN(Number(d)));

        if (!invalid) {
            invalid = dates.some(d =>
                this.isDisabledHMS({ hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds() })
            );
        }

        return invalid;
    }

    handleInputBlur(e: any) {
        const invalid = this.getState('invalid');
        const inputValue = this.getState('inputValue');
        const value = this.getState('value');

        if (inputValue) {
            if (invalid) {
                this.setState({
                    inputValue: this.formatValue(value),
                    invalid: false,
                } as any);
            } else {
                this.setState({
                    inputValue: this.formatValue(value),
                } as any);
            }
        } else {
            this.setState({
                inputValue: '',
                value: [],
                invalid: false,
            } as any);
        }
    }

    formatValue(dates: TZDate[]): string {
        const validFormat = this.getValidFormat();
        const rangeSeparator = this.getProp('rangeSeparator');
        const dateFnsLocale = this.getProp('dateFnsLocale');

        let _dates = dates;
        if (_dates && !Array.isArray(_dates)) {
            _dates = _dates[_dates];
        }

        if (_dates && Array.isArray(_dates)) {
            const result = _dates.map(date => {
                let str;
                if (isUndefined(date)) {
                    str = '';
                } else {
                    str = this._formatSingle({ date, formatToken: validFormat, locale: dateFnsLocale });
                }
                return str;
            });
            return result.join(rangeSeparator);
        }
        return undefined;
    }

    parseInput(str: string) {
        const { rangeSeparator, dateFnsLocale, timeZone } = this._adapter.getProps();
        const validFormat = this.getValidFormat();

        if (str && typeof str === 'string') {
            return split(str, rangeSeparator).map(v =>
                this._parseSingle({ date: v, formatToken: validFormat, locale: dateFnsLocale, timeZone })
            );
        }

        return [];
    }

    parseValue(options: { value: BaseValueType | BaseValueType[]; timeZone: string | number }): TZDate[] {
        const { value, timeZone } = options;
        const formatToken = this.getValidFormat();
        const { dateFnsLocale } = this._adapter.getProps();

        let parsedValue: TZDate[] = [];
        let _value = value;
        if (!Array.isArray(_value)) {
            _value = _value ? [_value] : [];
        }

        if (Array.isArray(_value)) {
            parsedValue = _value.map(v => this._parseSingle({ date: v, formatToken, locale: dateFnsLocale, timeZone }));
        }

        return parsedValue;
    }

    _notifyChange(value: TZDate[], inputValue: string) {
        const { rangeSeparator } = this._adapter.getProps();
        const formatToken = this.getValidFormat();
        let str: string | string[] = inputValue;
        let _value: TZDate | TZDate[] = value;
        if (this._adapter.isRangePicker()) {
            str = split(inputValue, rangeSeparator);
        } else {
            _value = Array.isArray(_value) ? _value[0] : _value;
        }

        let exposeDate: Date | Date[];
        let exposeStr: string | string[] = str;

        if (_value) {
            if (Array.isArray(_value)) {
                exposeDate = _value.map(v => this._expose(v));
                exposeStr = _value.map(v => this._formatSingle({ date: v, formatToken }));
            } else {
                exposeDate = this._expose(_value);
                exposeStr = this._formatSingle({ date: _value, formatToken });
            }
        }

        const onChangeWithDateFirst = this.getProp('onChangeWithDateFirst');
        if (onChangeWithDateFirst) {
            this._adapter.notifyChange(exposeDate, exposeStr);
        } else {
            this._adapter.notifyChange(exposeStr, exposeDate);
        }
    }

    _hasChanged(dates: TZDate[] = [], oldDates: TZDate[] = []) {
        const formatToken = this.getValidFormat();
        const dateFnsLocale = this.getProp('dateFnsLocale');

        return (
            dates.length !== oldDates.length ||
            dates.some((date, index) => {
                const oldDate = oldDates[index];

                if (
                    isValid(date) &&
                    isValid(oldDate) &&
                    this._formatSingle({ date, formatToken, locale: dateFnsLocale }) ===
                        this._formatSingle({ date: oldDate, formatToken, locale: dateFnsLocale })
                ) {
                    return false;
                }

                return true;
            })
        );
    }
}

export default TimePickerFoundation;
