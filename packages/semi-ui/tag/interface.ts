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
    children?: React.ReactNode;
    size?: TagSize;
    color?: TagColor;
    type?: TagType;
    closable?: boolean;
    visible?: boolean;
    onClose?: (tagChildren: React.ReactNode, event: React.MouseEvent<HTMLElement>) => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    style?: React.CSSProperties;
    className?: string;
    avatarSrc?: string;
    avatarShape?: AvatarShape;
    'aria-label'?: React.AriaAttributes['aria-label'];
    tabIndex?: number;
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