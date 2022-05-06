/* eslint-disable max-len */
import { cloneDeep, isObject, set } from 'lodash';

import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { BaseValueType, ValidateStatus } from './foundation';
import { formatDateValues } from './_utils/formatter';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';
import getInsetInputFormatToken from './_utils/getInsetInputFormatToken';
import getInsetInputValueFromInsetInputStr from './_utils/getInsetInputValueFromInsetInputStr';
import { strings } from './constants';

const KEY_CODE_ENTER = 'Enter';
const KEY_CODE_TAB = 'Tab';


export type Type = 'date' | 'dateRange' | 'year' | 'month' | 'dateTime' | 'dateTimeRange';
export type RangeType = 'rangeStart' | 'rangeEnd';
export type PanelType = 'left' | 'right';

export interface DateInputEventHandlerProps {
    onClick?: (e: any) => void;
    onChange?: (value: string, e: any) => void;
    onEnterPress?: (e: any) => void;
    onBlur?: (e: any) => void;
    onFocus?: (e: any, rangeType: RangeType) => void;
    onClear?: (e: any) => void;
    onRangeInputClear?: (e: any) => void;
    onRangeEndTabPress?: (e: any) => void;
    onInsetInputChange?: (options: InsetInputChangeProps) => void;
}

export interface DateInputElementProps {
    insetLabel?: any;
    prefix?: any;
}

export interface DateInputFoundationProps extends DateInputElementProps, DateInputEventHandlerProps {
    [x: string]: any;
    value?: BaseValueType[];
    disabled?: boolean;
    type?: Type;
    showClear?: boolean;
    format?: string;
    inputStyle?: React.CSSProperties;
    inputReadOnly?: boolean;
    validateStatus?: ValidateStatus;
    prefixCls?: string;
    rangeSeparator?: string;
    panelType?: PanelType;
    insetInput?: boolean;
    insetInputValue?: InsetInputValue;
    density?: typeof strings.DENSITY_SET[number];
}

export interface InsetInputValue {
    monthLeft: {
        dateInput: string;
        timeInput: string;
    },
    monthRight: {
        dateInput: string;
        timeInput: string;
    }
}

export interface InsetInputChangeFoundationProps {
    value: string;
    insetInputValue: InsetInputValue;
    event: any;
    valuePath: string;
}

export interface InsetInputChangeProps { 
    insetInputStr: string;
    format: string;
    insetInputValue: InsetInputValue;
}

export interface DateInputAdapter extends DefaultAdapter {
    updateIsFocusing: (isFocusing: boolean) => void;
    notifyClick: DateInputFoundationProps['onClick'];
    notifyChange: DateInputFoundationProps['onChange'];
    notifyInsetInputChange: DateInputFoundationProps['onInsetInputChange'];
    notifyEnter: DateInputFoundationProps['onEnterPress'];
    notifyBlur: DateInputFoundationProps['onBlur'];
    notifyClear: DateInputFoundationProps['onClear'];
    notifyFocus: DateInputFoundationProps['onFocus'];
    notifyRangeInputClear: DateInputFoundationProps['onRangeInputClear'];
    notifyRangeInputFocus: DateInputFoundationProps['onFocus'];
    notifyTabPress: DateInputFoundationProps['onRangeEndTabPress'];
}

export default class InputFoundation extends BaseFoundation<DateInputAdapter> {
    constructor(adapter: DateInputAdapter) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}

    handleClick(e: any) {
        this._adapter.notifyClick(e);
    }

    handleChange(value: string, e: any) {
        this._adapter.notifyChange(value, e);
    }

    handleInputComplete(e: any) {
        /**
         * onKeyPress, e.key Code gets a value of 0 instead of 13
         * Here key is used to judge the button
         */
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(e.target.value);
        }
    }

    handleInputClear(e: any) {
        this._adapter.notifyClear(e);
    }

    handleRangeInputClear(e: any) {
        // prevent trigger click outside
        this.stopPropagation(e);
        this._adapter.notifyRangeInputClear(e);
    }

    handleRangeInputEnterPress(e: any, rangeInputValue: string) {
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(rangeInputValue);
        }
    }

    handleRangeInputEndKeyPress(e: any) {
        if (e.key === KEY_CODE_TAB) {
            this._adapter.notifyTabPress(e);
        }
    }

    handleRangeInputFocus(e: any, rangeType: RangeType) {
        this._adapter.notifyRangeInputFocus(e, rangeType);
    }

    formatShowText(value: BaseValueType[], customFormat?: string) {
        const { type, dateFnsLocale, format, rangeSeparator } = this._adapter.getProps();
        const formatToken = customFormat || format || getDefaultFormatTokenByType(type);
        let text = '';
        switch (type) {
            case 'date':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'dateTime':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateTimeRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'month':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            default:
                break;
        }
        return text;
    }

    handleInsetInputChange(options: InsetInputChangeFoundationProps) {
        const { value, valuePath, insetInputValue } = options;
        const { format, type } = this._adapter.getProps();
        const insetFormatToken = getInsetInputFormatToken({ type, format });
        const newInsetInputValue = set(cloneDeep(insetInputValue), valuePath, value);
        const newInputValue = this.concatInsetInputValue({ insetInputValue: newInsetInputValue });
        this._adapter.notifyInsetInputChange({ insetInputValue: newInsetInputValue, format: insetFormatToken, insetInputStr: newInputValue });
    }

    /**
     * 只有传入的 format 符合 formatReg 时，才会使用用户传入的 format
     * 否则会使用默认的 format 作为 placeholder
     * 
     * The format passed in by the user will be used only if the incoming format conforms to formatReg
     * Otherwise the default format will be used as placeholder
     */
    getInsetInputPlaceholder() {
        const { type, format } = this._adapter.getProps();
        const insetInputFormat = getInsetInputFormatToken({ type, format });
        let datePlaceholder, timePlaceholder;

        switch (type) {
            case 'date':
            case 'month':
            case 'dateRange':
                datePlaceholder = insetInputFormat;
                break;
            case 'dateTime':
            case 'dateTimeRange':
                [datePlaceholder, timePlaceholder] = insetInputFormat.split(' ');
                break;
        }

        return ({
            datePlaceholder,
            timePlaceholder,
        });
    }

    /**
     * 从当前日期值或 inputValue 中解析出 insetInputValue
     * 
     * Parse out insetInputValue from current date value or inputValue
     */
    getInsetInputValue({ value, insetInputValue } : { value: BaseValueType[]; insetInputValue: InsetInputValue }) {
        const { type, rangeSeparator, format } = this._adapter.getProps();

        let inputValueStr = '';
        if (isObject(insetInputValue)) {
            inputValueStr = this.concatInsetInputValue({ insetInputValue });
        } else {
            const insetInputFormat = getInsetInputFormatToken({ format, type });
            inputValueStr = this.formatShowText(value, insetInputFormat);
        }

        const newInsetInputValue = getInsetInputValueFromInsetInputStr({ inputValue: inputValueStr, type, rangeSeparator });
        return newInsetInputValue;
    }

    concatInsetDateAndTime({ date, time }) {
        return `${date} ${time}`;
    }

    concatInsetDateRange({ rangeStart, rangeEnd }) {
        const { rangeSeparator } = this._adapter.getProps();
        return `${rangeStart}${rangeSeparator}${rangeEnd}`;
    }

    concatInsetInputValue({ insetInputValue }: { insetInputValue: InsetInputValue }) {
        const { type } = this._adapter.getProps();
        let inputValue = '';

        switch (type) {
            case 'date':
            case 'month':
                inputValue = insetInputValue.monthLeft.dateInput;
                break;
            case 'dateRange':
                inputValue = this.concatInsetDateRange({ rangeStart: insetInputValue.monthLeft.dateInput, rangeEnd: insetInputValue.monthRight.dateInput });
                break;
            case 'dateTime':
                inputValue = this.concatInsetDateAndTime({ date: insetInputValue.monthLeft.dateInput, time: insetInputValue.monthLeft.timeInput });
                break;
            case 'dateTimeRange':
                const rangeStart = this.concatInsetDateAndTime({ date: insetInputValue.monthLeft.dateInput, time: insetInputValue.monthLeft.timeInput });
                const rangeEnd = this.concatInsetDateAndTime({ date: insetInputValue.monthRight.dateInput, time: insetInputValue.monthRight.timeInput });
                inputValue = this.concatInsetDateRange({ rangeStart, rangeEnd });
                break;
        }

        return inputValue;
    }
}
