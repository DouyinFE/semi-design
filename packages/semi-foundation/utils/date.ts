import { isNumber } from 'lodash';

/**
 * 是否是 Date 或 TZDate
 */
export function isValidDate(date: any) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date as any);
}

export function isTimestamp(ts: any) {
    return isNumber(ts) && isValidDate(new Date(ts));
}
