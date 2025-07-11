import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-floatbutton`,
    ICON_BTN: `${BASE_CLASS_PREFIX}-floatbutton-iconBtn`,
    ICON_IMG: `${BASE_CLASS_PREFIX}-floatbutton-iconImg`,
    RECTANGLE: `${BASE_CLASS_PREFIX}-floatbutton-rectangle`,
    BADGE: `${BASE_CLASS_PREFIX}-floatbutton-badge`,
    GROUP: `${BASE_CLASS_PREFIX}-floatbutton-group`,
    GROUP_ITEM: `${BASE_CLASS_PREFIX}-floatbutton-group-item`,
} as const;

const strings = {
    TYPE_SET: ['default', 'group'],
    STATUS_SET: ['normal', 'disabled'],
    SIZE_SET: ['small', 'medium', 'large'],
} as const;

const numbers = {} as const;

export { cssClasses, strings, numbers };
