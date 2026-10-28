import { VALIDATE_STATUS, BASE_CLASS_PREFIX } from '../base/constants';
const PREFIX = `${BASE_CLASS_PREFIX}-upload`;

const FILE_LIST_PIC = 'picture' as const;
const FILE_LIST_DEFAULT = 'list' as const;
const FILE_LIST_NONE = 'none' as const;
const PROGRESS_COEFFICIENT = 0.95;

const cssClasses = {
    PREFIX,
    // WRAPPER: `${PREFIX}-wrapper`,
    LIST: `${PREFIX}-list`,
};

const TRIGGER_AUTO = 'auto' as const;
const TRIGGER_CUSTOM = 'custom' as const;

const strings = {
    FILE_STATUS_UPLOADING: 'uploading',
    FILE_STATUS_SUCCESS: 'success',
    FILE_STATUS_UPLOAD_FAIL: 'uploadFail',
    FILE_STATUS_VALIDATING: 'validating',
    FILE_STATUS_VALID_FAIL: 'validateFail',
    FILE_STATUS_WAIT_UPLOAD: 'wait',

    FILE_LIST_PIC,
    FILE_LIST_DEFAULT,
    LIST_TYPE: [FILE_LIST_PIC, FILE_LIST_DEFAULT, FILE_LIST_NONE],
    imageTypes: ['image', 'webp', 'png', 'svg', 'gif', 'jpg', 'jpeg', 'bmp', 'dpg'],
    DRAG_AREA_DEFAULT: 'default',
    DRAG_AREA_LEGAL: 'legal',
    DRAG_AREA_ILLEGAL: 'illegal',
    TRIGGER_AUTO,
    TRIGGER_CUSTOM,
    UPLOAD_TRIGGER: [TRIGGER_AUTO, TRIGGER_CUSTOM],
    VALIDATE_STATUS,
    PROMPT_POSITION: ['left', 'right', 'bottom'] as const,
};

// Keydown and the native paste event can land in different tasks (e.g. macOS Chromium, where
// Cmd+V paste is dispatched after an IPC round trip). Keyboard clipboard reads wait this long
// for the paste event; a paste arriving later than this can still duplicate the upload.
const PASTING_FALLBACK_DELAY = 100;

const numbers = {
    PROGRESS_COEFFICIENT,
    PASTING_FALLBACK_DELAY,
};

export { cssClasses, strings, numbers };
