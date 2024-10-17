// group
const rowStyleBase = {
    width: '100%',
    height: '8px',
    flexShrink: 0,
    margin: '0',
    cursor: 'row-resize',
} as const;
const colStyleBase = {
    width: '8px',
    flexShrink: 0,
    height: '100%',
    margin: '0',
    cursor: 'col-resize',
} as const;

export const directionStyles = {
    horizontal: {
        ...colStyleBase,
    },
    vertical: {
        ...rowStyleBase,
    }
} as const;

