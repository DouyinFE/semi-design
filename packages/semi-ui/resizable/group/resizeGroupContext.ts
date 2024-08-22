import { ItemConstraints, ItemData } from "@douyinfe/semi-foundation/resizable/groupConstants";
import { CSSProperties, createContext } from "react";

export type ResizeEvent = MouseEvent;
export type ResizeHandler = (event: ResizeEvent) => void;

export type DragState = {
    dragHandleId: string;
    dragHandleRect: DOMRect;
    initialCursorPosition: number;
    initialLayout: number[]
};

export type TResizeGroupContext = {
    collapseItem: (panelData: ItemData) => void;
    direction: "horizontal" | "vertical";
    dragState: DragState | null;
    expandItem: (panelData: ItemData, minSizeOverride?: number) => void;
    getItemSize: (panelData: ItemData) => number;
    getItemStyle: (
        panelData: ItemData,
        defaultSize: number | undefined
    ) => CSSProperties;
    groupId: string;
    isItemCollapsed: (panelData: ItemData) => boolean;
    isItemExpanded: (panelData: ItemData) => boolean;
    reevaluateItemConstraints: (
        panelData: ItemData,
        prevConstraints: ItemConstraints
    ) => void;
    registerItem: (panelData: ItemData) => void;
    registerResizeHandle: (dragHandleId: string) => ResizeHandler;
    resizeItem: (panelData: ItemData, size: number) => void;
    startDragging: (dragHandleId: string, event: ResizeEvent) => void;
    stopDragging: () => void;
    unregisterItem: (panelData: ItemData) => void;
    panelGroupElement: ParentNode | null
};
export const ResizeGroupContext = createContext<TResizeGroupContext | null>(null);

ResizeGroupContext.displayName = "ResizeGroupContext";
