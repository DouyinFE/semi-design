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

export const judgeConstraint = (newSize: number, min: string, max: string, parentSize: number, offset: number = 0) => {
    min = min ?? "0%";
    max = max ?? "100%";
    const minSize = getPixelSize(min, parentSize);
    const maxSize = getPixelSize(max, parentSize);
    if (newSize <= minSize + offset) {
        return true;
    }
    if (newSize >= maxSize - offset) {
        return true;
    }
    return false;
}

export const adjustNewSize = (newSize: number, min: string, max: string, parentSize: number, offset: number) => {
    min = min ?? "0%";
    max = max ?? "100%";
    const minSize = getPixelSize(min, parentSize);
    const maxSize = getPixelSize(max, parentSize);
    if (newSize <= minSize + offset) {
        return minSize + offset;
    }
    if (newSize >= maxSize - offset) {
        return maxSize - offset;
    }
    return newSize;
}

export const getOffset = (style: CSSStyleDeclaration, direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        const borderLeftWidth = parseFloat(style.borderLeftWidth);
        const borderRightWidth = parseFloat(style.borderRightWidth);
        return paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
    } else {
        const paddingTop = parseFloat(style.paddingTop);
        const paddingBottom = parseFloat(style.paddingBottom);
        const borderTopWidth = parseFloat(style.borderTopWidth);
        const borderBottomWidth = parseFloat(style.borderBottomWidth);
        return paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
    }
}