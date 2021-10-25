/**
 * Composes a variable number of CSS helper functions.
 * Returns a function that accepts all the original arguments
 * of the functions it composed. If the original function
 * accepted multiple arguments, they must be passed as
 * an array.
 * @example
 * const translateXandRotateY = compose(translateX, rotateY);
 * const cssValue = translateXandRotateY('-5px', '30deg');
 */
export const compose = (...funcs: any) => (...styleArgs: any) => {
    const result = funcs.reduce((acc: any, func: any, i: string | number) => {
        const arg = styleArgs[i];
        return `${acc} ${Array.isArray(arg) ? func(...arg) : func(arg)}`;
    }, '');
    return result.trim();
};

export const cubicBezier = (a: any, b: any, c: any, d: any) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;

export const translate3d = (a: any, b: any, c: any) => `translate3d(${a}, ${b}, ${c})`;

export const translateX = (a: any) => `translateX(${a})`;

export const scale3d = (a: any, b: any, c: any) => `scale3d(${a}, ${b}, ${c})`;

export const scale = (a: any) => `scale(${a})`;

export const skewX = (deg: any) => `skewX(${deg}deg)`;

export const skewY = (deg: any) => `skewY(${deg}deg)`;

export const skewXY = (x: any, y: any) => `${skewX(x)} ${skewY(y)}`;

export const rotateY = (a: any) => `rotateY(${a})`;

export const rotate3d = (a: any, b: any, c: any, d: any) => `rotate3d(${a}, ${b}, ${c}, ${d}deg)`;

export const perspective = (a: any) => `perspective(${a})`;
