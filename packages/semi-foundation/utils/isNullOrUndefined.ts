/**
 * Whether null or undefined
 * @param {*} value
 * @returns  {boolean}
 */
export default function isNullOrUndefined<T>(value: T): value is T & (null | undefined) {
    return value === null || value === undefined;
}
