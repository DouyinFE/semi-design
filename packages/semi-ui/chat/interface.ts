import React, { ReactNode } from 'react';
import { MDXProps } from 'mdx/types';
import { FileItem } from '../upload';
import { Message } from '@douyinfe/semi-foundation/chat/foundation';

export { Message };
export interface CommonChatsProps {
    align?: 'leftRight' | 'leftAlign';
    chats?: Message[];
    roleConfig?: RoleConfig;
    onMessageDelete?: (message?: Message) => void;
    onChatsChange?: (chats?: Message[]) => void;
    onMessageBadFeedback?: (message?: Message) => void;
    onMessageGoodFeedback?: (message?: Message) => void;
    onMessageReset?: (message?: Message) => void;
    onMessageCopy?: (message?: Message) => void;
    chatBoxRenderConfig?: ChatBoxRenderConfig;
    customMarkDownComponents?: MDXProps['components']
}

export interface ChatProps extends CommonChatsProps {
    style?: React.CSSProperties;
    className?: string;
    hints?: string[];
    renderHintBox?: (props: {content: string; index: number;onHintClick: () => void}) => React.ReactNode;
    onHintClick?: (hint: string) => void;
    onChatsChange?: (chats?: Message[]) => void;
    onStopGenerator?: (e) => void;
    customMarkDownComponents?: MDXProps['components'];
    onClear?: () => void;
    onInputChange?: (props: { value?: string; attachment?: FileItem[] }) => void;
    onMessageSend?: (content: string, attachment: FileItem[]) => void;
    inputBoxStyle?: React.CSSProperties;
    inputBoxCls?: string;
    renderInputArea?: (props?: RenderInputAreaProps) => ReactNode;
    placeholder?: string;
    topSlot?: ReactNode | ReactNode[];
    children?: ReactNode | undefined | any;
    showStopGenerate?: boolean
}

export interface RenderInputAreaProps {
    defaultNode?: ReactNode;
    onSend?: (content?: string, attachment?: FileItem[]) => void;
    onClear?: (e?: any) => void
}

export interface ChatBoxRenderConfig {
    renderChatBoxTitle?: (props: {role?: Metadata; defaultTitle?: ReactNode}) => ReactNode;
    renderChatBoxAvatar?: (props: { role?: Metadata; defaultAvatar?: ReactNode}) => ReactNode;
    renderChatBoxContent?: (props: {message?: Message; role?: Metadata; defaultContent?: ReactNode | ReactNode[]; className?: string}) => ReactNode;
    renderChatBoxAction?: (props: {message?: Message; defaultActions?: ReactNode | ReactNode[]; className: string}) => ReactNode;
    renderFullChatBox?: (props: {message?: Message; role?: Metadata; defaultNodes?: FullChatBoxNodes; className: string}) => ReactNode
}

export interface FullChatBoxNodes {
    avatar?: ReactNode;
    title?: ReactNode; 
    content?: ReactNode; 
    action?: ReactNode
}

export interface RoleConfig {
    user?: Metadata;
    assistant?: Metadata;
    system?: Metadata;
    [x: string]: Metadata
}

export interface Metadata {
    name?: string;
    avatar?: string;
    color?: string;
    [x: string]: any
}

export interface ChatState {
    chats?: Message[];
    isLoading?: boolean;
    backBottomVisible?: boolean;
    scrollVisible?: boolean;
    wheelScroll?: boolean;
    cacheHints?: string[]
}

export interface ChatBoxProps extends Omit<CommonChatsProps, "chats"> {
    toast?: any;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode | undefined | any;
    message?: Message;
    lastChat?: boolean;
    customMarkDownComponents?: MDXProps['components']
}

export interface ChatBoxState {
    visible: boolean
}