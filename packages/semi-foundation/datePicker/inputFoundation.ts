/* eslint-disable max-len */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { BaseValueType, ValidateStatus, ValueType } from './foundation';
import { formatDateValues } from './_utils/formatter';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';

const KEY_CODE_ENTER = 'Enter';
const KEY_CODE_TAB = 'Tab';


export type Type = 'date' | 'dateRange' | 'year' | 'month' | 'dateTime' | 'dateTimeRange';
export type RangeType = 'rangeStart' | 'rangeEnd';

export interface DateInputEventHandlerProps {
    onClick?: (e: any) => void;
    onChange?: (value: string, e: any) => void;
    onEnterPress?: (e: any) => void;
    onBlur?: (e: any) => void;
    onFocus?: (e: any, rangeType: RangeType) => void;
    onClear?: (e: any) => void;
    onRangeInputClear?: (e: any) => void;
    onRangeEndTabPress?: (e: any) => void;
}

export interface DateInputElementProps {
    insetLabel?: any;
    prefix?: any;
}

export interface DateInputFoundationProps extends DateInputElementProps, DateInputEventHandlerProps {
    [x: string]: any;
    value?: ValueType;
    disabled?: boolean;
    type?: Type;
    multiple?: boolean;
    showClear?: boolean;
    format?: string;
    inputStyle?: React.CSSProperties;
    inputReadOnly?: boolean;
    validateStatus?: ValidateStatus;
    prefixCls?: string;
    rangeSeparator?: string;
}

export interface DateInputAdapter extends DefaultAdapter {
    updateIsFocusing: (isFocusing: boolean) => void;
    notifyClick: DateInputFoundationProps['onClick'];
    notifyChange: DateInputFoundationProps['onChange'];
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

    formatShowText(value: BaseValueType[]) {
        const { type, dateFnsLocale, format, rangeSeparator } = this._adapter.getProps();
        const formatToken = format || getDefaultFormatTokenByType(type);
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
}
