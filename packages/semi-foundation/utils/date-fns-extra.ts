/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import {
    toDate,
    format as dateFnsFormat,
    utcToZonedTime as dateFnsUtcToZonedTime,
    zonedTimeToUtc as dateFnsZonedTimeToUtc,
    OptionsWithTZ
} from 'date-fns-tz';
import { parse as dateFnsParse } from 'date-fns';

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
        const found = IANAOffsetMap.find(item => item[0] === tz);
        return found && found[1][0];
    }
};

/**
 *
 * @param {string | number | Date} date
 * @param {string} formatToken
 * @param {object} [options]
 * @param {string} [options.timeZone]
 * @returns {Date}
 */
/* istanbul ignore next */
const parse = (date: string | number | Date, formatToken: string, options?: any) => {
    if (typeof date === 'string') {
        date = dateFnsParse(date, formatToken, new Date(), options);
    }
    if (options && options.timeZone != null && options.timeZone !== '') {
        const timeZone = toIANA(options.timeZone);
        options = { ...options, timeZone };
    }

    return toDate(date, options);
};

/**
 *
 * @param {string | number | Date} date
 * @param {string} formatToken
 * @param {object} [options]
 * @param {string} [options.timeZone]
 */
/* istanbul ignore next */
const format = (date: string | number | Date, formatToken: string, options?: any) => {
    if (options && options.timeZone != null && options.timeZone !== '') {
        const timeZone = toIANA(options.timeZone);
        options = { ...options, timeZone };

        date = dateFnsUtcToZonedTime(date, timeZone, options);
    }

    return dateFnsFormat(date, formatToken, options);
};

/**
 *
 * @param {string | number | Date} date
 * @param {string} timeZone
 * @param {object} options
 * @returns {Date}
 */
const utcToZonedTime = (date: string | number | Date, timeZone: string, options?: OptionsWithTZ) => dateFnsUtcToZonedTime(date, toIANA(timeZone), options);

/**
 *
 * @param {string | number | Date} date
 * @param {string} timeZone
 * @param {object} options
 * @returns {Date}
 */
const zonedTimeToUtc = (date: string | number | Date, timeZone: string, options?: OptionsWithTZ) => dateFnsZonedTimeToUtc(date, toIANA(timeZone), options);

/**
 * return current system hour offset based on utc:
 *
 * ```
 * 8 => "GMT+08:00"
 * -9.5 => "GMT-09:30"
 * -8 => "GMT-08:00"
 * ```
 */
const getCurrentTimeZone = () => new Date().getTimezoneOffset() / 60;

export { format, parse, utcToZonedTime, zonedTimeToUtc, getCurrentTimeZone };
