import { BASE_CLASS_PREFIX } from '../base/constants';

const cssClasses = {
    SIDEBAR: `${BASE_CLASS_PREFIX}-sidebar`,
    COLLAPSE: `${BASE_CLASS_PREFIX}-sidebar-collapse`,
    SIDEBAR_CONTENT: `${BASE_CLASS_PREFIX}-sidebar-content`,
    MCP_CONFIGURE_CONTENT: `${BASE_CLASS_PREFIX}-sidebar-mcp-configure-content`,
    ANNOTATION_CONTENT: `${BASE_CLASS_PREFIX}-sidebar-annotation_content`,
    ANNOTATION_ITEM: `${BASE_CLASS_PREFIX}-sidebar-annotation-item`,
    ANNOTATION: `${BASE_CLASS_PREFIX}-sidebar-annotation`,
    OPTIONS: `${BASE_CLASS_PREFIX}-sidebar-options`,
    FILE: `${BASE_CLASS_PREFIX}-sidebar-file`,
};

const strings = {
    MODE: {
        MAIN: 'main',
        CODE: 'code',
        FILE: 'file'
    },
    MCP_MODE: {
        INNER: 'inner' as const,
        CUSTOM: 'custom' as const
    },
    DIRECTION: {
        left: true, right: false,
        top: false, bottom: false, 
        topLeft: false, topRight: false, 
        bottomLeft: false, bottomRight: false,
    },
    JSON_VIEWER_OPTIONS: {
        readOnly: true,
        autoWrap: true,
    }
   
};

export {
    cssClasses,
    strings
};