import {
    BASE_CLASS_PREFIX
} from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX }-empty`,
} as const;

const strings = {
    LAYOUT: ['vertical', 'horizontal']
} as const;

export {
    cssClasses,
    strings
};