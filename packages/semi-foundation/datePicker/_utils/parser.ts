/**
 * @file
 * Various date-related analysis methods
 */
import { isValid, parseISO, parse, Locale } from 'date-fns';

/**
 * Parsing value to Date object
 */
export function compatiableParse(
    value: string,
    formatToken?: string,
    baseDate?: Date,
    locale?: Locale
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
        const yearInvalid = isValid(result) && String(result.getFullYear()).length > 4;
        if (!isValid(result) || yearInvalid) {
            result = null;
        }
    }
    return result;
}
