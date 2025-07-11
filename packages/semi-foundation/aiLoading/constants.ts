import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-loading`,
} as const;

const strings = {
    TYPE_SET: ['small', 'large', 'colored'],
} as const;

const numbers = {} as const;

export { cssClasses, strings, numbers };
