export type TagColor =
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
    | 'yellow'
    | 'white';
export type TagType = 'ghost' | 'solid' | 'light';
export type TagSize = 'default' | 'small' | 'large';
export type AvatarShape = 'circle' | 'square';

export interface TagProps {
    children?: React.ReactNode | string | number;
    tagKey?: string | number;
    size?: TagSize;
    color?: TagColor;
    type?: TagType;
    closable?: boolean;
    visible?: boolean;
    onClose?: (tagChildren: React.ReactNode, event: React.MouseEvent<HTMLElement>, tagKey: string | number) => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    className?: string;
    avatarSrc?: string;
    avatarShape?: AvatarShape;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    'aria-label'?: React.AriaAttributes['aria-label'];
    tabIndex?: number; // use internal, when tag in taInput, we want to use left arrow and right arrow to control the tag focus, so the tabIndex need to be -1. 
}

export interface TagGroupProps {
    style?: React.CSSProperties;
    className?: string;
    maxTagCount?: number;
    tagList?: (TagProps | React.ReactNode)[];
    size?: 'small' | 'large';
    showPopover?: boolean;
    popoverProps?: any; // TODO: 替换成PopoverProps
    avatarShape?: AvatarShape;
    mode?: string; // TODO: check 文档里没有这个api
}