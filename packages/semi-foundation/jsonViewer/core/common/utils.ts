export function isObject(val: any): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function isNumber(val: any): boolean {
    return typeof val === 'number';
}