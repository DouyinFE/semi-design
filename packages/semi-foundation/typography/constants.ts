import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-typography`,
};

const strings = {
    TYPE: ['primary', 'secondary', 'danger', 'warning', 'success', 'tertiary', 'quaternary'],
    SIZE: ['normal', 'small'],
    SPACING: ['normal', 'extended'],
    HEADING: [1, 2, 3, 4, 5, 6],
    RULE: ['text', 'numbers', 'bytes-decimal', 'bytes-binary', 'percentages', 'currency', 'exponential'],
    TRUNCATE: ['ceil', 'floor', 'round'],
} as const;

export { cssClasses, strings };
