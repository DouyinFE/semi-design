/**
 * Solve the problem of js addition accuracy
 * e.g.
 *  0.1 + 0.2 => 0.30000000000000004
 *  plus(0.1, 0.2) => 0.3
 * @param {Number} num1
 * @param {Number} num2
 */
export function plus(num1: number, num2: number) {
    const digits = Math.max(...[num1, num2].map(num => {
        const [coefficient, exponent = '0'] = num.toString().split('e');
        return Math.max(0, (coefficient.split('.')[1] || '').length - Number(exponent));
    }));
    const baseNum = Math.pow(10, digits);
    const scaledSum = num1 * baseNum + num2 * baseNum;
    if (!Number.isFinite(scaledSum)) {
        return num1 + num2;
    }
    // Shift back in decimal form to avoid introducing division rounding errors.
    const [coefficient, exponent = '0'] = Math.round(scaledSum).toString().split('e');
    return Number(`${coefficient}e${Number(exponent) - digits}`);
}

export function minus(num1: number, num2: number) {
    return plus(num1, -num2);
}
