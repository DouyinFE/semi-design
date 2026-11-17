import isNullOrUndefined from './isNullOrUndefined';

/**
 * Whether a value should be treated as renderable content.
 *
 * Returns false only for null, undefined, false and ''. Every other value -
 * including 0 and true - is treated as renderable, so numeric content such as
 * a counter or an amount of 0 is not dropped by a `children && ...` check.
 *
 * This is a presence check rather than a complete React node validator:
 * an empty array is still treated as renderable.
 *
 * @param {*} value
 * @returns {boolean}
 */
export default function isReactRenderable<T>(
    value: T
): value is Exclude<NonNullable<T>, false | ''> {
    return !isNullOrUndefined(value) && value !== false && value !== '';
}
