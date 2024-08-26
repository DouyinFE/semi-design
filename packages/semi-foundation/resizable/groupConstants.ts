// group
const rowStyleBase = {
    width: '100%',
    height: '10px',
    top: '0px',
    left: '0px',
    cursor: 'row-resize',
} as const;
const colStyleBase = {
    width: '10px',
    height: '100%',
    top: '0px',
    left: '0px',
    cursor: 'col-resize',
} as const;
const edgeStyleBase = {
    width: '20px',
    height: '20px',
    position: 'absolute',
} as const;

export const directionStyles = {
    top: {
        ...rowStyleBase,
        top: '-5px',
    },
    right: {
        ...colStyleBase,
        left: undefined,
        right: '-5px',
    },
    bottom: {
        ...rowStyleBase,
        top: undefined,
        bottom: '-5px',
    },
    left: {
        ...colStyleBase,
        left: '-5px',
    },
    topRight: {
        ...edgeStyleBase,
        right: '-10px',
        top: '-10px',
        cursor: 'ne-resize',
    },
    bottomRight: {
        ...edgeStyleBase,
        right: '-10px',
        bottom: '-10px',
        cursor: 'se-resize',
    },
    bottomLeft: {
        ...edgeStyleBase,
        left: '-10px',
        bottom: '-10px',
        cursor: 'sw-resize',
    },
    topLeft: {
        ...edgeStyleBase,
        left: '-10px',
        top: '-10px',
        cursor: 'nw-resize',
    },
} as const;