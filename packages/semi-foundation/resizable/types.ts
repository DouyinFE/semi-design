// single
export const directions = ['top', 'right', 'bottom', 'left', 'topRight', 'bottomRight', 'bottomLeft', 'topLeft'] as const;

export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

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

export type HandlerCallback = (
    e: MouseEvent,
    direction: Direction
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
    size: Size,
    event: MouseEvent,
    direction: Direction,
) => void;

export type ResizeStartCallback = (
    e: MouseEvent,
    dir: Direction,
) => void | boolean;

