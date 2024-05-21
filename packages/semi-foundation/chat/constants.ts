import {
    BASE_CLASS_PREFIX
} from '../base/constants';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-chat`,
    PREFIX_DIVIDER: `${BASE_CLASS_PREFIX}-chat-divider`,
    PREFIX_CHAT_BOX: `${BASE_CLASS_PREFIX}-chat-chatBox`,
    PREFIX_CHAT_BOX_ACTION: `${BASE_CLASS_PREFIX}-chat-chatBox-action`,
    PREFIX_INPUT_BOX: `${BASE_CLASS_PREFIX}-chat-inputBox`,
    PREFIX_ATTACHMENT: `${BASE_CLASS_PREFIX}-chat-attachment`,
    PREFIX_HINT: `${BASE_CLASS_PREFIX}-chat-hint`,
};

const ROLE = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    DIVIDER: 'divider',
};

const CHAT_ALIGN = {
    LEFT_RIGHT: 'leftRight',
    LEFT_ALIGN: 'leftAlign',
};

const MESSAGE_STATUS = {
    LOADING: 'loading',
    INCOMPLETE: 'incomplete',
    COMPLETE: 'complete',
    ERROR: 'error'
};

const PIC_SUFFIX_ARRAY = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

const PIC_PREFIX = 'image/';

const SCROLL_ANIMATION_TIME = 300;
const SHOW_SCROLL_GAP = 100;


export {
    cssClasses,
    ROLE,
    CHAT_ALIGN,
    MESSAGE_STATUS,
    PIC_SUFFIX_ARRAY,
    PIC_PREFIX,
    SCROLL_ANIMATION_TIME,
    SHOW_SCROLL_GAP
};