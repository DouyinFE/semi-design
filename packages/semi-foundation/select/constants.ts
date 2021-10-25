import { VALIDATE_STATUS, BASE_CLASS_PREFIX } from '../base/constants';
import { strings as tooltipStrings } from '../tooltip/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-select`,
    PREFIX_OPTION: `${BASE_CLASS_PREFIX}-select-option`,
    PREFIX_GROUP: `${BASE_CLASS_PREFIX}-select-group`,
};

const strings = {
    SIZE_SET: ['small', 'large', 'default'],
    POSITION_SET: tooltipStrings.POSITION_SET,
    MODE_SELECT: 'select',
    MODE_AUTOCOMPLETE: 'autoComplete',
    // MODE_TAGS: 'tags',
    STATUS: VALIDATE_STATUS,
} as const;

const numbers = { LIST_HEIGHT: 300 };

export { cssClasses, strings, numbers };
