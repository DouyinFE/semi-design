/**
 * Whether null or undenfined
 * @param {*} value
 * @returns  {boolean}
 */
export default function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
}