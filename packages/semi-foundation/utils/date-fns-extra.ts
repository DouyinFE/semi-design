import { parse as dateFnsParse, Locale, format as dateFnsFormat, isValid, parseISO } from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';
import { isNumber } from 'lodash';

/**
 * Need to be IANA logo without daylight saving time
 */
export const IANAOffsetMap = [
    [-11, ['Pacific/Midway']],
    [-10, ['Pacific/Honolulu']],
    [-9.5, ['Pacific/Marquesas']],
    [-9, ['Pacific/Gambier']],
    [-8, ['Pacific/Pitcairn']],
    [-7, ['America/Phoenix']],
    [-6, ['America/Tegucigalpa']],
    [-5, ['America/Bogota']],
    [-4, ['America/Puerto_Rico']],
    [-3.5, ['America/St_Johns']], // No alternative daylight saving time zone
    [-3, ['America/Montevideo']],
    [-2, ['Atlantic/South_Georgia']],
    [-1, ['Atlantic/Cape_Verde']],
    [0, ['Africa/Accra']],
    [1, ['Africa/Bangui']],
    [2, ['Africa/Cairo']],
    [3, ['Asia/Bahrain', 'Indian/Antananarivo']],
    [3.5, ['Asia/Tehran']], // No alternative daylight saving time zone
    [4, ['Asia/Dubai', 'Asia/Muscat']],
    [4.5, ['Asia/Kabul']],
    [5, ['Asia/Samarkand', 'Asia/Karachi']],
    [5.5, ['Asia/Kolkata']],
    [5.75, ['Asia/Kathmandu']],
    [6, ['Asia/Dhaka']],
    [6.5, ['Asia/Rangoon', 'Asia/Rangoon']],
    [7, ['Asia/Jakarta', 'Asia/Phnom_Penh', 'Asia/Bangkok']],
    [8, ['Asia/Shanghai', 'Asia/Singapore']],
    [8.75, ['Australia/Eucla']],
    [9, ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Pyongyang']],
    [9.5, ['Australia/Darwin']],
    [10, ['Pacific/Guam']],
    [10.5, ['Australia/Adelaide']], // No alternative daylight saving time zone
    [11, ['Pacific/Guadalcanal']],
    [12, ['Pacific/Funafuti']],
    [13, ['Pacific/Enderbury']],
    [13.75, ['Pacific/Chatham']], // No alternative daylight saving time zone
    [14, ['Pacific/Kiritimati']],
];

/**
 * Etc/GMT* no DST
 * @see https://data.iana.org/time-zones/tzdb/etcetera
 */
const IANAEtcGMTOffsetMap = {
    '0': 'Etc/GMT',
    '1': 'Etc/GMT-1',
    '2': 'Etc/GMT-2',
    '3': 'Etc/GMT-3',
    '4': 'Etc/GMT-4',
    '5': 'Etc/GMT-5',
    '6': 'Etc/GMT-6',
    '7': 'Etc/GMT-7',
    '8': 'Etc/GMT-8',
    '9': 'Etc/GMT-9',
    '10': 'Etc/GMT-10',
    '11': 'Etc/GMT-11',
    '12': 'Etc/GMT-12',
    '13': 'Etc/GMT-13',
    '14': 'Etc/GMT-14',
    '-1': 'Etc/GMT+1',
    '-2': 'Etc/GMT+2',
    '-3': 'Etc/GMT+3',
    '-4': 'Etc/GMT+4',
    '-5': 'Etc/GMT+5',
    '-6': 'Etc/GMT+6',
    '-7': 'Etc/GMT+7',
    '-8': 'Etc/GMT+8',
    '-9': 'Etc/GMT+9',
    '-10': 'Etc/GMT+10',
    '-11': 'Etc/GMT+11',
    '-12': 'Etc/GMT+12',
};

const GMTStringReg = /([\-\+]{1})(\d{2})\:(\d{2})/;

/**
 *
 * @param {string|number} tz
 * @returns {number|undefined}
 */
export const toIANA = (tz: string | number) => {
    let matches = null;
    if (typeof tz === 'string') {
        matches = tz.match(GMTStringReg);
        if (!matches) {
            return tz;
        }

        const symbol = parseInt(matches[1] + 1, 10); // => -1 or 1
        const hourOffset = parseInt(matches[2], 10);
        const minuteOffset = parseInt(matches[3], 10);
        tz = symbol * (hourOffset + minuteOffset / 60);
    }

    if (typeof tz === 'number') {
        // if tz can be transformed to a Etc/GMT* and browser supports it
        if (tz in IANAEtcGMTOffsetMap) {
            const etcGMTtimeZone = IANAEtcGMTOffsetMap[tz];
            if (isValidTimezoneIANAString(etcGMTtimeZone)) {
                return etcGMTtimeZone;
            }
        }
        const found = IANAOffsetMap.find(item => item[0] === tz);
        return found && found[1][0];
    }
};

const validIANATimezoneCache = {};
/**
 * @see https://github.com/marnusw/date-fns-tz/blob/a92e0ad017d101a0c50e39a63ef5d322b4d849f6/src/_lib/tzParseTimezone/index.js#L137
 */
export function isValidTimezoneIANAString(timeZoneString: string) {
    if (validIANATimezoneCache[timeZoneString]) return true;
    try {
        new Intl.DateTimeFormat(undefined, { timeZone: timeZoneString });
        validIANATimezoneCache[timeZoneString] = true;
        return true;
    } catch (error) {
        return false;
    }
}

export class TZDateUtil {
    /**
     * 在指定时区，以 Date.now() 创建一个 TZDate
     */
    static createTZDate(timeZone: string | number) {
        const normalizedTimeZone = TZDateUtil.normalizeTimeZone(timeZone);
        return new TZDate(Date.now(), normalizedTimeZone);
    }
    /**
     * 将日期字符串转为 Date 对象
     */
    private static compatibleParse(options: {
        date: string;
        timeZone: string;
        formatToken?: string;
        baseDate?: Date;
        locale?: Locale
    }): Date | null {
        let { date, formatToken, baseDate, locale, timeZone } = options;
        let result = null;
        if (date) {
            if (formatToken) {
                baseDate = baseDate || new Date();
                result = dateFnsParse(date, formatToken, baseDate, { locale, in: tz(timeZone) });
            }
            if (!isValid(result)) {
                result = parseISO(date);
            }
            if (!isValid(result)) {
                result = new Date(Date.parse(date));
            }
            const yearInvalid = isValid(result) && String(result.getFullYear()).length > 4;
            if (!isValid(result) || yearInvalid) {
                result = null;
            }
        }
        return result;
    }
    /**
     * 将日期转为 TZDate
     * 
     * - timeZone：不设置默认为本地时区
     */
    static parse(options: { date: string | number | Date | TZDate; formatToken?: string; timeZone?: string | number; locale?: Locale }): TZDate | null {
        const { date, timeZone } = options;
        const normalizedTimeZone = TZDateUtil.normalizeTimeZone(timeZone);

        let utcDate: Date | null = null;
        if (TZDateUtil.isValidDate(date)) {
            utcDate = date as Date;
        } else if (date instanceof TZDate) {
            utcDate = new Date(date);
        } else if (TZDateUtil.isTimestamp(date)) {
            utcDate = new Date(date as number);
        } else if (typeof date === 'string') {
            utcDate = TZDateUtil.compatibleParse({ ...options, timeZone: normalizedTimeZone, date });
        }
        if (!utcDate) {
            return null;
        }
        return new TZDate(utcDate, normalizedTimeZone);
    }
    /**
     * 将 TZDate 按照 format 格式化
     */
    static format(options: { date: TZDate; formatToken: string; locale?: Locale }) {
        const { date, formatToken, locale } = options;
        return dateFnsFormat(date, formatToken, { locale });
    }
    /**
     * 将 TZDate 转为 UTC Date
     */
    static expose(date: TZDate): Date {
        return new Date(date);
    }

    /**
     * 将 ConfigProvider 的 timeZone 转为 IANA 时区
     */
    static normalizeTimeZone(timeZone?: string | number): string {
        if (typeof timeZone !== undefined) {
            return toIANA(timeZone);
        } else {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
    }

    static isValidDate(date: any) {
        return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date as any);
    }

    static isTimestamp(ts: any) {
        return isNumber(ts) && TZDateUtil.isValidDate(new Date(ts));
    }
}
