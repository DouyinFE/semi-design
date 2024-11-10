export function isObject(val: any): val is Record<string, any> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function isNumber(val: any): val is number {
    return typeof val === 'number';
}