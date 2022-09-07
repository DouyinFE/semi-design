import { createContext, ReactNode } from "react";
import { PreviewImageProps, PreviewInnerProps } from "./interface";

export interface PreviewUrl {
    url: string;
    preview: boolean;
}

export type PreviewUrlMap = Map<number, PreviewUrl>;

export type UnRegisterPreviewUrl = (id: number) => void;
export type UnRegisterPreviewInnerProps = (id: number) => void;

export type RegisterPreviewUrl = (
    id: number,
    url: string,
    preview: boolean
) => UnRegisterPreviewUrl;

export type RegisterPreviewInnerProps = (
    id: number,
    PreviewInnerProps?: Partial<PreviewImageProps>
) => UnRegisterPreviewInnerProps;

export interface PreviewContextProps {
    isGroup: boolean,
    previewSrc: string[],
    titles: ReactNode[],
    currentIndex: number;
    visible: boolean;
    setCurrentIndex: (current: number) => void;
    handleVisibleChange: (visible: boolean, preVisible?: boolean) => void;
}

export const PreviewContext = createContext<PreviewContextProps>({} as any);




