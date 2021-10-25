/**
 * @file
 * Various date-related analysis methods
 */
import { isValid, parseISO, parse } from 'date-fns';

/**
 * Parsing value to Date object
 */
export function compatiableParse(
    value: string,
    formatToken?: string,
    baseDate?: Date,
    locale?: any
): Date | null {
    let result = null;
    if (value) {
        if (formatToken) {
            baseDate = baseDate || new Date();
            result = parse(value, formatToken, baseDate, { locale });
        }
        if (!isValid(result)) {
            result = parseISO(value);
        }
        if (!isValid(result)) {
            result = new Date(Date.parse(value));
        }
        if (!isValid(result)) {
            result = null;
        }
    }
    return result;
}
