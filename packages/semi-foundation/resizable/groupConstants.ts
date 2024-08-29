// group
const rowStyleBase = {
    width: '100%',
    height: '6px',
    flexShrink: 0,
    margin: '0',
    cursor: 'row-resize',
} as const;
const colStyleBase = {
    width: '6px',
    flexShrink: 0,
    height: '100%',
    margin: '0',
    cursor: 'col-resize',
} as const;

export const directionStyles = {
    top: {
        ...rowStyleBase,
    },
    right: {
        ...colStyleBase,
    },
    bottom: {
        ...rowStyleBase,
    },
    left: {
        ...colStyleBase,
    },
} as const;

export const getItemDirection = (dir: 'vertical'| 'horizontal') => {
    if (dir === 'vertical') {
        return ['bottom', 'top'];
    } else {
        return ['right', 'left'];
    }
};

export const getHandlerDirection = (dir: 'vertical'| 'horizontal') => {
    if (dir === 'vertical') {
        return 'bottom';
    } else {
        return 'right';
    }
};