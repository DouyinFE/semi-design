import React, { CSSProperties, ReactNode } from 'react';
import { ContainerProps } from '@douyinfe/semi-foundation/sidebar/containerFoundation';
import { ImageUploadNodeOptions } from './widget/imageSlot';
import { CodeItemProps } from './widget/code';
import { FileItemProps } from './widget/file';

export interface SideBarCollapseProps {
    style?: React.CSSProperties;
    className?: string;
    activeKey?: string | string[];
    onChange?: (activeKey: string | string[]) => void
}

export interface ContainerReactProps extends ContainerProps {
    title?: ReactNode;
    renderHeader?: () => ReactNode;
    style?: CSSProperties;
    containerRef?: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode
}

export interface Option {
    icon: ReactNode;
    name: ReactNode;
    key: string
}

export interface OptionProps {
    activeKey?: string;
    options?: Option[];
    renderOptionItem?: (option: Option, onChange: (e: React.MouseEvent, activeKey: string) => void ) => ReactNode;
    onChange?: (e: React.MouseEvent, activeKey: string) => void
}

type DetailContent = CodeItemProps | FileItemProps | any;

export interface SideBarProps extends ContainerReactProps, OptionProps {
    mode?: string; // can be main，code，file，or other string
    detailContent?: DetailContent;
    onActiveOptionChange?: (e: React.MouseEvent, activeKey: string) => void;
    renderMainContent?: (activeKey: string) => ReactNode;
    renderDetailHeader?: (mode: string, detailContent: DetailContent) => ReactNode;
    renderDetailContent?: (mode: string) => ReactNode;
    fileEditable?: boolean;
    onFileContentChange?: (content: string) => void;
    onBackWard?: (e: React.MouseEvent, mode: string) => void | Promise<any>;
    onDetailContentCopy?: (e: React.MouseEvent, content: string, res: boolean) => void;
    imgUploadProps?: ImageUploadNodeOptions
}
