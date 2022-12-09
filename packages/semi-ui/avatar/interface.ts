import React from 'react';
import { BaseProps } from '../_base/baseComponent';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'extra-extra-small' | 'extra-small' | 'small' | 'default' | 'medium' | 'large' | 'extra-large';
export type AvatarColor =
    | 'amber'
    | 'blue'
    | 'cyan'
    | 'green'
    | 'grey'
    | 'indigo'
    | 'light-blue'
    | 'light-green'
    | 'lime'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'red'
    | 'teal'
    | 'violet'
    | 'yellow';

export interface AvatarProps extends BaseProps {
    children?: React.ReactNode;
    color?: AvatarColor;
    shape?: AvatarShape;
    size?: AvatarSize;
    hoverMask?: React.ReactNode;
    src?: string;
    srcSet?: string;
    alt?: string;
    onError?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    imgAttr?: React.ImgHTMLAttributes<HTMLImageElement>
}

export type AvatarGroupShape = 'circle' | 'square';
export type AvatarGroupSize = 'extra-extra-small' | 'extra-small' | 'small' | 'default' | 'medium' | 'large' | 'extra-large';
export type AvatarGroupOverlapFrom = 'start' | 'end';

export interface AvatarGroupProps {
    children?: React.ReactNode;
    shape?: AvatarGroupShape;
    size?: AvatarGroupSize;
    overlapFrom?: AvatarGroupOverlapFrom;
    maxCount?: number;
    renderMore?: (restNumber?: number, restAvatars?: React.ReactNode[]) => React.ReactNode
}