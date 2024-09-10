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

export const getItemDirection = (dir: 'vertical'| 'horizontal') => {
    if (dir === 'vertical') {
        return ['bottom', 'top'];
    } else {
        return ['right', 'left'];
    }
};

export const getPixelSize = (size: string, parentSize: number): number => {
    if (size.endsWith('px')) {
        return Number(size.replace('px', ''));
    }
    if (size.endsWith('%')) {
        return Number(size.replace('%', '')) / 100 * parentSize;
    }

    return typeof size === 'undefined' ? size : Number(size);
}

export const judgeConstraint = (newSize: number, min: string, max: string, parentSize: number) => {
    const minSize = getPixelSize(min, parentSize);
    const maxSize = getPixelSize(max, parentSize);
    if (newSize <= minSize) {
        return false;
    }
    if (newSize >= maxSize) {
        return false;
    }
    return true;
}