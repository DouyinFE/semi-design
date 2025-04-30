import { TZDate } from '@date-fns/tz';

import { strings } from './constants';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { isValidDate } from '../datePicker/_utils/index';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { TZDateUtil } from '../utils/date-fns-extra';
import { TimePickerFoundationProps } from './foundation';

const HOUR = 1000 * 60 * 60;
const DAY = 24 * HOUR;
// TODO: move to utils
export const formatOption = (option: number, disabledOptions: number[]) => {
    let value = `${option}`;
    if (option < 10) {
        value = `0${option}`;
    }

    let disabled = false;
    if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
        disabled = true;
    }

    return {
        value,
        disabled,
    };
};

function generateOptions(length: number, disabledOptions: number[], hideDisabledOptions: boolean, step = 1) {
    const arr = [];
    for (let value = 0; value < length; value += step) {
        if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
            arr.push(value);
        }
    }
    return arr;
}

export interface ComboboxFoundationProps extends Pick<
TimePickerFoundationProps,
| 'format'
| 'disabledHours'
| 'disabledMinutes'
| 'disabledSeconds'
| 'hideDisabledOptions'
| 'use12Hours'
| 'timeZone'
| 'hourStep'
| 'minuteStep'
| 'secondStep'
| 'position'
| 'type'
> {
    defaultOpenValue?: TimePickerFoundationProps['value'];
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    onChange?: (value: { isAM: boolean; value: string; timeStampValue: number }) => void;
    onCurrentSelectPanelChange?: (range: string) => void;
    isAM?: boolean;
    timeStampValue?: TZDate
}

export interface ComboboxFoundationState {
    showHour: boolean;
    showMinute: boolean;
    showSecond: boolean;
    hourOptions: number[];
    minuteOptions: number[];
    secondOptions: number[]
}

class ComboboxFoundation extends BaseFoundation<DefaultAdapter<ComboboxFoundationProps, ComboboxFoundationState>> {

    constructor(adapter: DefaultAdapter<ComboboxFoundationProps, ComboboxFoundationState>) {
        super({ ...adapter });
    }

    isAM() {
        return this.getProp('isAM');
    }

    initData() {
        const {
            timeStampValue,
            hourStep,
            disabledMinutes,
            disabledSeconds,
            hideDisabledOptions,
            minuteStep,
            secondStep,
        } = this._adapter.getProps();

        const format = this.getValidFormat();

        const dateTime = this.getDisplayDateFromTimeStamp(timeStampValue);

        const disabledHourOptions = this.disabledHours();
        const disabledMinuteOptions = disabledMinutes(dateTime ? dateTime.getHours() : null);
        const disabledSecondOptions = disabledSeconds(
            dateTime ? dateTime.getHours() : null,
            dateTime ? dateTime.getMinutes() : null
        );
        const hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions, hourStep);
        const minuteOptions = generateOptions(60, disabledMinuteOptions, hideDisabledOptions, minuteStep);
        const secondOptions = generateOptions(60, disabledSecondOptions, hideDisabledOptions, secondStep);

        return {
            showHour: Boolean(format.match(/HH|hh|H|h/g)),
            showMinute: Boolean(format.match(/mm/g)),
            showSecond: Boolean(format.match(/ss/g)),
            hourOptions,
            minuteOptions,
            secondOptions,
        };
    }

    getPosition() {
        const position = this.getProp('position');
        const type = this.getProp('type') || strings.DEFAULT_TYPE;

        return position || strings.DEFAULT_POSITION[type];
    }

    getDefaultFormatIfNeed() {
        if (this._isInProps('format')) {
            return this.getProp('format');
        } else if (this.getProp('use12Hours')) {
            return strings.DEFAULT_FORMAT_A;
        } else {
            return strings.DEFAULT_FORMAT;
        }
    }

    disabledHours(): number[] {
        const { use12Hours, disabledHours } = this.getProps();
        let disabledOptions = disabledHours && disabledHours();

        if (use12Hours && Array.isArray(disabledOptions)) {
            if (this.isAM()) {
                disabledOptions = disabledOptions.filter(h => h < 12).map(h => (h === 0 ? 12 : h));
            } else {
                disabledOptions = disabledOptions.map(h => (h === 12 ? 12 : h - 12));
            }
        }
        return disabledOptions;
    }

    getValidFormat(format?: string): string {
        let _format = isNullOrUndefined(format) ? this.getProp('format') : format;
        _format = this.getDefaultFormatIfNeed();
        _format = typeof _format === 'string' ? _format : strings.DEFAULT_FORMAT;

        // if (use12Hours) {
        //     format = format.replace(/H/g, 'h');

        //     if (!/(\s+)a/i.test(format)) {
        //         format += ' a';
        //     } else {
        //         format = format.replace(/(\s+)A/i, '$1a');
        //     }
        // }
        return _format;
    }

    /**
     * from 13-bit timestamp  -> get display date
     * by combobox use
     */
    getDisplayDateFromTimeStamp(timeStamp: TZDate): TZDate {
        const timeZone = this._getTimeZone();
        let date: TZDate;
        if (timeStamp) {
            date = new TZDate(timeStamp, timeZone);
        }
        if (!timeStamp || !isValidDate(date)) {
            return this.createDateDefault();
        }
        return date;
    }

    _getTimeZone(_timeZone?: string | number) {
        const { timeZone } = this._adapter.getProps();
        const currentTimeZone = _timeZone ?? timeZone;
        const normalizedTimeZone = TZDateUtil.normalizeTimeZone(currentTimeZone);
        return normalizedTimeZone;
    }

    /**
     * create a date at 00:00:00
     */
    createDateDefault() {
        const timeZone = this._getTimeZone();
        const now = TZDateUtil.createTZDate(timeZone);
        return new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), timeZone);
    }
}

export default ComboboxFoundation;
