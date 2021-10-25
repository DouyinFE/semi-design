import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-cascader`,
    PREFIX_OPTION: `${BASE_CLASS_PREFIX}-cascader-option`
};

const strings = {
    SIZE_SET: ['small', 'large', 'default'],
    VALIDATE_STATUS: ['default', 'error', 'warning'] as const,
    IS_KEY: 'isKey',
    IS_VALUE: 'isValue',
    SHOW_NEXT_BY_CLICK: 'click',
    SHOW_NEXT_BY_HOVER: 'hover',
} as const;

const numbers = {};

export {
    cssClasses,
    strings,
    numbers
};