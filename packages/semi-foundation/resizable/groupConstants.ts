// group
const rowStyleBase = {
    width: '100%',
    height: '10px',
    margin: '0',
    cursor: 'row-resize',
} as const;
const colStyleBase = {
    width: '10px',
    height: '100%',
    margin: '0',
    cursor: 'col-resize',
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
} as const;