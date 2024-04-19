import React, { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';
import { Motion } from '../_base/base';
import TabBar from './TabBar';

export type TabType = 'line' | 'card' | 'button';
export type TabSize = 'small' | 'medium' | 'large';
export type TabPosition = 'top' | 'left';

export interface PlainTab {
    disabled?: boolean;
    icon?: ReactNode;
    itemKey: string;
    tab?: ReactNode;
    closable?: boolean
}


export interface TabsProps {
    activeKey?: string;
    children?: ReactNode | Array<ReactNode>;
    className?: string;
    collapsible?: boolean;
    contentStyle?: CSSProperties;
    defaultActiveKey?: string;
    keepDOM?: boolean;
    lazyRender?: boolean;
    onChange?: (activeKey: string) => void;
    onTabClick?: (activeKey: string, e: MouseEvent<Element>) => void;
    renderTabBar?: (tabBarProps: TabBarProps, defaultTabBar: typeof TabBar) => ReactNode;
    size?: TabSize;
    style?: CSSProperties;
    tabBarClassName?: string;
    tabBarExtraContent?: ReactNode;
    tabBarStyle?: CSSProperties;
    tabList?: PlainTab[];
    tabPaneMotion?: boolean;
    tabPosition?: TabPosition;
    type?: TabType;
    onTabClose?: (tabKey: string) => void;
    preventScroll?: boolean
}

export interface TabBarProps {
    activeKey?: string;
    className?: string;
    collapsible?: boolean;
    list?: Array<PlainTab>;
    onTabClick?: (activeKey: string, event: MouseEvent<Element>) => void;
    size?: TabSize;
    style?: CSSProperties;
    tabBarExtraContent?: ReactNode;
    tabPosition?: TabPosition;
    type?: TabType;
    dropdownClassName?: string;
    dropdownStyle?: CSSProperties;
    closable?: boolean;
    deleteTabItem?: (tabKey: string, event: MouseEvent<Element>) => void;
    handleKeyDown?: (event: React.KeyboardEvent, itemKey: string, closable: boolean) => void
}

export interface TabPaneProps {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    icon?: ReactNode;
    itemKey?: string;
    style?: CSSProperties;
    tab?: ReactNode;
    closable?: boolean;
    tabIndex?: number
}

export interface TabPaneTransitionProps {
    [key: string]: any;

    children?: ((p: { transform?: string; opacity: number }) => ReactNode | undefined) | undefined;
    direction?: boolean;
    mode?: 'vertical' | 'horizontal';
    motion?: Motion
}

export interface TabContextValue {
    activeKey?: string;
    lazyRender?: boolean;
    panes?: Array<PlainTab>;
    tabPaneMotion?: boolean;
    tabPosition?: TabPosition;
    prevActiveKey?: string|null;
    forceDisableMotion?: boolean
}
