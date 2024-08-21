import { BASE_CLASS_PREFIX } from "../base/constants";

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-resizable`,
} as const;

const strings = {
};

export { cssClasses, strings };


// single
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

export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

export interface HandleStyles {
    top?: CSSStyleDeclaration;
    right?: CSSStyleDeclaration;
    bottom?: CSSStyleDeclaration;
    left?: CSSStyleDeclaration;
    topRight?: CSSStyleDeclaration;
    bottomRight?: CSSStyleDeclaration;
    bottomLeft?: CSSStyleDeclaration;
    topLeft?: CSSStyleDeclaration
}

export interface HandleClassName {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    topRight?: string;
    bottomRight?: string;
    bottomLeft?: string;
    topLeft?: string
}

export interface HandleComponent {
    top?: HTMLElement;
    right?: HTMLElement;
    bottom?: HTMLElement;
    left?: HTMLElement;
    topRight?: HTMLElement;
    bottomRight?: HTMLElement;
    bottomLeft?: HTMLElement;
    topLeft?: HTMLElement
}

export type HandlerCallback = (
    e: MouseEvent,
    direction: Direction,
) => void;

export interface Enable {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topRight?: boolean;
    bottomRight?: boolean;
    bottomLeft?: boolean;
    topLeft?: boolean
}

export interface Size {
    width?: string | number;
    height?: string | number
}

export interface NumberSize {
    width: number;
    height: number
}
export interface NewSize {
    newHeight: number | string;
    newWidth: number | string
}

export const DEFAULT_SIZE = {
    width: 'auto',
    height: 'auto',
};

export type ResizeCallback = (
    event: MouseEvent,
    direction: Direction,
    elementRef: HTMLElement,
    delta: NumberSize,
) => void;

export type ResizeStartCallback = (
    e: MouseEvent,
    dir: Direction,
    elementRef: HTMLElement,
) => void | boolean;

export const clamp = (n: number, min: number, max: number): number => Math.max(Math.min(n, max), min);
export const snap = (n: number, size: number): number => Math.round(n / size) * size;
export const has = (dir: 'top' | 'right' | 'bottom' | 'left', target: string): boolean => new RegExp(dir, 'i').test(target);
export const findNextSnap = (n: number, snapArray: number[], snapGap: number = 0): number => {
    const closestGapIndex = snapArray.reduce(
        (prev, curr, index) => (Math.abs(curr - n) < Math.abs(snapArray[prev] - n) ? index : prev),
        0
    );
    const gap = Math.abs(snapArray[closestGapIndex] - n);

    return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n;
};
export const getStringSize = (n: number | string): string => {
    n = n.toString();
    if (n === 'auto') {
        return n;
    }
    if (n.endsWith('px')) {
        return n;
    }
    if (n.endsWith('%')) {
        return n;
    }
    if (n.endsWith('vh')) {
        return n;
    }
    if (n.endsWith('vw')) {
        return n;
    }
    if (n.endsWith('vmax')) {
        return n;
    }
    if (n.endsWith('vmin')) {
        return n;
    }
    return `${n}px`;
};
export const getNumberSize = (
    size: undefined | string | number,
    parentSize: number,
    innerWidth: number,
    innerHeight: number
) => {
    if (size && typeof size === 'string') {
        if (size.endsWith('px')) {
            return Number(size.replace('px', ''));
        }
        if (size.endsWith('%')) {
            const ratio = Number(size.replace('%', '')) / 100;
            return parentSize * ratio;
        }
        if (size.endsWith('vw')) {
            const ratio = Number(size.replace('vw', '')) / 100;
            return innerWidth * ratio;
        }
        if (size.endsWith('vh')) {
            const ratio = Number(size.replace('vh', '')) / 100;
            return innerHeight * ratio;
        }
    }
    return typeof size === 'undefined' ? size : Number(size);
};
export const calculateNewMax = (
    parentSize: { width: number; height: number },
    innerWidth: number,
    innerHeight: number,
    maxWidth?: string | number,
    maxHeight?: string | number,
    minWidth?: string | number,
    minHeight?: string | number
) => {
    maxWidth = getNumberSize(maxWidth, parentSize.width, innerWidth, innerHeight);
    maxHeight = getNumberSize(maxHeight, parentSize.height, innerWidth, innerHeight);
    minWidth = getNumberSize(minWidth, parentSize.width, innerWidth, innerHeight);
    minHeight = getNumberSize(minHeight, parentSize.height, innerWidth, innerHeight);
    return {
        maxWidth: typeof maxWidth === 'undefined' ? undefined : Number(maxWidth),
        maxHeight: typeof maxHeight === 'undefined' ? undefined : Number(maxHeight),
        minWidth: typeof minWidth === 'undefined' ? undefined : Number(minWidth),
        minHeight: typeof minHeight === 'undefined' ? undefined : Number(minHeight),
    };
};

