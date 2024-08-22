// public 
export type Direction = "horizontal" | "vertical";
export type ResizeHandler = (event: MouseEvent) => void;

// item
export type ItemOnCollapse = () => void;
export type ItemOnExpand = () => void;
export type ItemOnResize = (
    size: number,
    prevSize: number | undefined
) => void;

export type ItemCallbacks = {
    onCollapse?: ItemOnCollapse;
    onExpand?: ItemOnExpand;
    onResize?: ItemOnResize
};

export type ItemConstraints = {
    collapsedSize?: number | undefined;
    collapsible?: boolean | undefined;
    defaultSize?: number | undefined;
    maxSize?: number | undefined;
    minSize?: number | undefined
};

export type ItemData = {
    callbacks: ItemCallbacks;
    constraints: ItemConstraints;
    id: string;
    idIsFromProps: boolean;
    order: number | undefined
};

export type ImperativeItemHandle = {
    collapse: () => void;
    expand: (minSize?: number) => void;
    getId(): string;
    getSize(): number;
    isCollapsed: () => boolean;
    isExpanded: () => boolean;
    resize: (size: number) => void
};

// handler
export type ResizeHandlerOnDragging = (isDragging: boolean) => void;
export type ResizeHandlerState = "drag" | "hover" | "inactive";

// group 
export type ImperativeGroupHandle = {
    getId: () => string;
    getLayout: () => number[];
    setLayout: (layout: number[]) => void
};

export type GroupStorage = {
    getItem(name: string): string | null;
    setItem(name: string, value: string): void
};

export type GroupOnLayout = (layout: number[]) => void;