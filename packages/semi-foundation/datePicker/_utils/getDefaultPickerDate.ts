import { addMonths, Locale as dateFnsLocale } from 'date-fns';
import { TZDate } from '@date-fns/tz';

import { TZDateUtil } from 'utils/date-fns-extra';

type BaseValueType = string | number | Date;

interface GetDefaultPickerValueDateOptions {
    defaultPickerValue?: BaseValueType | BaseValueType[];
    format: string;
    dateFnsLocale: dateFnsLocale;
    timeZone?: string
}

/**
 * get left panel picker date and right panel picker date
 */
export default function getDefaultPickerDate(options: GetDefaultPickerValueDateOptions) {
    const { defaultPickerValue, format, dateFnsLocale, timeZone } = options;
    let nowDate = Array.isArray(defaultPickerValue) ? defaultPickerValue[0] : defaultPickerValue;
    let nextDate = Array.isArray(defaultPickerValue) ? defaultPickerValue[1] : undefined;

    let nowTZDate = TZDateUtil.createTZDate(timeZone);
    if (nowDate) {
        nowTZDate = TZDateUtil.parse({ date: nowDate, formatToken: format, locale: dateFnsLocale, timeZone });
    }

    let nextTZDate = addMonths(nowTZDate, 1);
    if (nextDate) {
        nextTZDate = TZDateUtil.parse({ date: nextDate, formatToken: format, locale: dateFnsLocale, timeZone });
    }

    return {
        nowDate: nowTZDate,
        nextDate: nextTZDate,
    };
}