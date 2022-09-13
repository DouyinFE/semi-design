import { ReactNode } from "react";
import { BaseProps } from "_base/baseComponent";
import React from "react";

export interface ImageStates {
    src: string;
    loadStatus: "loading" | "success" | "error";
    previewVisible: boolean;
}

export interface ImageProps extends BaseProps{
    src?: string;
    width?: string | number;
    height?: string | number;
    alt?: string;
    placeholder?: ReactNode;
    fallback?: string | ReactNode;
    preview?: boolean | PreviewProps;
    onError?: (event: Event) => void;
    onLoad?: (event: Event) => void;
    crossOrigin?: "anonymous"| "use-credentials";
    children?: ReactNode,
    imageID?: number;
}

export interface PreviewProps extends BaseProps {
    visible?: boolean;
    src?: string | string[];
    previewTitle?: ReactNode;
    currentIndex?: number;
    defaultIndex?: number;
    defaultVisible?: boolean;
    maskClosable?: boolean;
    closable?: boolean;
    zoomStep?: number;
    infinite?: boolean;
    showTooltip?: boolean;
    closeOnEsc?: boolean;
    prevTip?: string;
    nextTip?: string;
    zoomInTip?: string;
    zoomOutTip?: string;
    rotateTip?: string;
    downloadTip?: string;
    adaptiveTip?: string;
    originTip?: string;
    lazyLoad?: boolean;
    preLoad?: boolean;
    preLoadGap?: number;
    viewerVisibleDelay?: number;
    disableDownload?: boolean;
    zIndex?: number;
    children?: ReactNode,
    renderHeader?: (info: any) => ReactNode;
    renderPreviewMenu?: (props: MenuProps) => ReactNode;
    getPopupContainer?: () => HTMLElement;
    onVisibleChange?: (visible: boolean) => void;
    onChange?: (index: number) => void
    onClose?: () => void;
    onZoomIn?: (zoom: number) => void;
    onZoomOut?: (zoom: number) => void;
    onPrev?: (index: number) => void;
    onNext?: (index: number) => void;
    onRatioChange?: (type: RatioType) => void;
    onRotateChange?: (angle: number) => void;
    onDownload?: (src: string, index: number) => void;
}

export interface MenuProps {
    min?: number;
    max?: number;
    step?: number;
    curPage?: number;
    totalNum?: number; 
    zoom?: number;
    ratio?: RatioType,
    disabledPrev?: boolean,
    disabledNext?: boolean,
    disableDownload?: boolean,
    onDownload?: () => void,
    onNext?: () => void,
    onPrev?: () => void,
    onZoomIn?: () => void,
    onZoomOut?: () => void,
    onRatioClick?: () => void,
    onRotateLeft?: () => void,
    onRotateRight?: () => void,
}

export type RatioType = "adaptation" | "realSize";

export interface PreviewInnerStates {
    imgSrc?: string[];
    imgLoadStatus?: Map<string, boolean>;
    zoom?: number;
    rotation?: number;
    ratio?: RatioType;
    currentIndex?: number;
    viewerVisible?: boolean;
    visible?: boolean;
    preloadAfterVisibleChange?: boolean;
    direction?: string;
}

export interface SliderProps {
    max?: number;
    min?: number;
    step?: number;
}

export interface HeaderProps {
    renderHeader?: (info: any) => ReactNode,
    title?: string;
    titleStyle?: React.CSSProperties;
    className?: string;
    onClose?: () => void;
}

export interface FooterProps extends SliderProps {
    curPage?: number;
    totalNum?: number;
    disabledPrev?: boolean;
    disabledNext?: boolean;
    disableDownload?: boolean;
    className?: string;
    zoom?: number;
    ratio?: RatioType;
    prevTip?: string;
    nextTip?: string;
    zoomInTip?: string;
    zoomOutTip?: string;
    rotateTip?: string;
    downloadTip?: string;
    adaptiveTip?: string;
    originTip?: string;
    showTooltip?: boolean;
    onZoomIn?: (zoom: number) => void;
    onZoomOut?: (zoom: number) => void;
    onPrev?: () => void;
    onNext?: () => void;
    onAdjustRatio?: (type: RatioType) => void;
    onRotate?: (direction: string) => void;
    onDownload?: () => void;
    renderPreviewMenu?: (props: MenuProps) => ReactNode;
}

export interface PreviewImageProps {
    src?: string;
    rotation?: number;
    style?: React.CSSProperties;
    maxZoom?: number;
    minZoom?: number;
    zoomStep?: number;
    zoom?: number;
    ratio?: RatioType;
    disableDownload?: boolean;
    clickZoom?: number;
    setRatio?: (type: RatioType) => void;
    onZoom?: (zoom: number) => void;
    onLoad?: (src: string) => void;
    onError?: (src: string) => void;
}

export interface ImageOffset {
    x: number;
    y: number;
}

export interface PreviewImageStates {
    loading: boolean;
    width: number;
    height: number;
    offset: ImageOffset;
    currZoom: number;
    top: number;
    left: number;
}

export interface DragDirection {
    canDragVertical: boolean;
    canDragHorizontal: boolean;
}

export interface ExtremeBounds {
    left: number;
    top: number;
}

export interface PreviewState {
    currentIndex: number;
    visible: boolean;
}

export function RealSizeSvg() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M1 5C1 3.89543 1.89543 3 3 3H21C22.1046 3 23 3.89543 23 5V19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V5ZM21 5L3 5V19H21V5Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M5 9C5 8.44772 5.44772 8 6 8H7C7.55228 8 8 8.44772 8 9V15C8 15.5523 7.55228 16 7 16C6.44772 16 6 15.5523 6 15V10C5.44772 10 5 9.55228 5 9Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15 9C15 8.44772 15.4477 8 16 8H17C17.5523 8 18 8.44772 18 9V15C18 15.5523 17.5523 16 17 16C16.4477 16 16 15.5523 16 15V10C15.4477 10 15 9.55228 15 9Z" fill="white"/>
        <path d="M13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10Z" fill="white"/>
        <path d="M13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14Z" fill="white"/>
    </svg>;
}

export function AdaptionSvg() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 9C7 7.89543 7.89543 7 9 7H15C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9ZM15 9H9V15H15V9Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15 3C15 2.44772 15.4477 2 16 2H21C21.5523 2 22 2.44772 22 3V8C22 8.55228 21.5523 9 21 9C20.4477 9 20 8.55228 20 8V4H16C15.4477 4 15 3.55228 15 3Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9 21C9 21.5523 8.55228 22 8 22L3 22C2.44772 22 2 21.5523 2 21L2 16C2 15.4477 2.44771 15 3 15C3.55228 15 4 15.4477 4 16L4 20L8 20C8.55228 20 9 20.4477 9 21Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3 9C2.44772 9 2 8.55228 2 8L2 3C2 2.44772 2.44771 2 3 2L8 2C8.55228 2 9 2.44771 9 3C9 3.55228 8.55228 4 8 4L4 4L4 8C4 8.55228 3.55228 9 3 9Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M21 15C21.5523 15 22 15.4477 22 16L22 21C22 21.5523 21.5523 22 21 22L16 22C15.4477 22 15 21.5523 15 21C15 20.4477 15.4477 20 16 20L20 20L20 16C20 15.4477 20.4477 15 21 15Z" fill="white"/>
    </svg>;
}


