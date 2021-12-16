/* eslint-disable max-lines-per-function */
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { noop, get, isEqual } from 'lodash';

import NavigationFoundation, { NavigationAdapter } from '@douyinfe/semi-foundation/navigation/foundation';
import { strings, cssClasses, numbers } from '@douyinfe/semi-foundation/navigation/constants';

import SubNav, { SubNavProps } from './SubNav';
import Item, { NavItemProps } from './Item';
import Footer, { NavFooterProps } from './Footer';
import Header, { NavHeaderProps } from './Header';
import NavContext from './nav-context';
import LocaleConsumer from '../locale/localeConsumer';
import '@douyinfe/semi-foundation/navigation/navigation.scss';
import { Motion } from '../_base/base';

export { CollapseButtonProps } from './CollapseButton';
export { NavFooterProps } from './Footer';
export { NavHeaderProps } from './Header';
export { NavItemProps } from './Item';
export { OpenIconTransitionProps } from './OpenIconTransition';
export { ToggleIcon, SubNavProps } from './SubNav';
export { SubNavTransitionProps } from './SubNavTransition';
export type Mode = 'vertical' | 'horizontal';

export interface OnSelectedData {
    itemKey: React.ReactText;
    selectedKeys: React.ReactText[];
    selectedItems: (NavItemProps | SubNavProps)[];
    domEvent: React.MouseEvent;
    isOpen: boolean;
}

export interface SubNavPropsWithItems extends SubNavProps {
    items?: (SubNavPropsWithItems | string)[];
}

export interface NavItemPropsWithItems extends NavItemProps {
    items?: (NavItemPropsWithItems | string)[];
}

export type NavItems = (string | SubNavPropsWithItems | NavItemPropsWithItems)[];

export interface NavProps extends BaseProps {
    bodyStyle?: React.CSSProperties;
    children?: React.ReactNode;
    defaultIsCollapsed?: boolean;
    defaultOpenKeys?: React.ReactText[];
    defaultSelectedKeys?: React.ReactText[];
    footer?: React.ReactNode | NavFooterProps;
    header?: React.ReactNode | NavHeaderProps;
    isCollapsed?: boolean;
    items?: NavItems;
    limitIndent?: boolean;
    mode?: Mode;
    multiple?: boolean;
    openKeys?: React.ReactText[];
    prefixCls?: string;
    selectedKeys?: React.ReactText[];
    subNavCloseDelay?: number;
    subNavMotion?: Motion;
    subNavOpenDelay?: number;
    toggleIconPosition?: string;
    tooltipHideDelay?: number;
    tooltipShowDelay?: number;
    onClick?: (data: { itemKey: React.ReactText; domEvent: MouseEvent; isOpen: boolean }) => void;
    onCollapseChange?: (isCollapse: boolean) => void;
    onDeselect?: (data?: any) => void;
    onOpenChange?: (data: { itemKey: (string | number); openKeys: (string | number)[]; domEvent: MouseEvent; isOpen: boolean }) => void;
    onSelect?: (data: OnSelectedData) => void;
}

export interface NavState {
    isCollapsed: boolean;
    // calc state
    openKeys: (string | number)[];
    items: any[];
    itemKeysMap: { [itemKey: string]: (string | number)[] };
    selectedKeys: (string | number)[];
}

function createAddKeysFn(context: Nav, keyName: string | number) {
    return function addKeys(...keys: (string | number)[]) {
        const handleKeys = new Set(context.state[keyName]);

        keys.forEach(key => key && handleKeys.add(key));

        context.setState({ [keyName]: Array.from(handleKeys) } as any);
    };
}

function createRemoveKeysFn(context: Nav, keyName: string) {
    return function removeKeys(...keys: string[]) {
        const handleKeys = new Set(context.state[keyName]);

        keys.forEach(key => key && handleKeys.delete(key));

        context.setState({ [keyName]: Array.from(handleKeys) } as any);
    };
}

const { hasOwnProperty } = Object.prototype;

class Nav extends BaseComponent<NavProps, NavState> {
    static Sub = SubNav;

    static Item = Item;

    static Header = Header;

    static Footer = Footer;

    static propTypes = {
        // Initial expanded SubNav navigation key array
        defaultOpenKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        openKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        // Initial selected navigation key array
        defaultSelectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        // Navigation type, now supports vertical, horizontal
        mode: PropTypes.oneOf([...strings.MODE]),
        // Triggered when selecting a navigation item
        onSelect: PropTypes.func,
        // Triggered when clicking a navigation item
        onClick: PropTypes.func,
        // SubNav expand/close callback
        onOpenChange: PropTypes.func,
        // Array of options (nested options can continue)
        items: PropTypes.array,
        // Is it in the state of being stowed to the sidebar
        isCollapsed: PropTypes.bool,
        defaultIsCollapsed: PropTypes.bool,
        onCollapseChange: PropTypes.func,
        multiple: PropTypes.bool,
        onDeselect: PropTypes.func,
        subNavMotion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        subNavCloseDelay: PropTypes.number,
        subNavOpenDelay: PropTypes.number,
        tooltipShowDelay: PropTypes.number,
        tooltipHideDelay: PropTypes.number,
        children: PropTypes.node,
        style: PropTypes.object,
        bodyStyle: PropTypes.object,
        className: PropTypes.string,
        toggleIconPosition: PropTypes.string,
        prefixCls: PropTypes.string,
        header: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
        footer: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
        limitIndent: PropTypes.bool
    };

    static defaultProps = {
        subNavCloseDelay: numbers.DEFAULT_SUBNAV_CLOSE_DELAY,
        subNavOpenDelay: numbers.DEFAULT_SUBNAV_OPEN_DELAY,
        tooltipHideDelay: numbers.DEFAULT_TOOLTIP_HIDE_DELAY,
        tooltipShowDelay: numbers.DEFAULT_TOOLTIP_SHOW_DELAY,
        onCollapseChange: noop,
        onSelect: noop,
        onClick: noop,
        onOpenChange: noop,
        toggleIconPosition: 'right',
        limitIndent: true,
        prefixCls: cssClasses.PREFIX,
        subNavMotion: true,
        // isOpen: false,
        mode: strings.MODE_VERTICAL,
        // defaultOpenKeys: [],
        // defaultSelectedKeys: [],
        // items: [],
    };

    itemsChanged: boolean;
    constructor(props: NavProps) {
        super(props);
        this.foundation = new NavigationFoundation(this.adapter);
        this.itemsChanged = true;

        const { isCollapsed, defaultIsCollapsed, items, children } = props;
        const initState = {
            isCollapsed: Boolean(this.isControlled('isCollapsed') ? isCollapsed : defaultIsCollapsed),
            // calc state
            openKeys: [],
            items: [],
            itemKeysMap: {}, // itemKey to parentKeys
            selectedKeys: [],
        };
        this.state = { ...initState };
        if (items && items.length || children) {
            const calcState = this.foundation.init('constructor');
            this.state = {
                ...initState,
                ...calcState,
            };
        }
    }

    static getDerivedStateFromProps(props: NavProps, state: NavState) {
        const willUpdateState: Partial<NavState> = {};

        if (hasOwnProperty.call(props, 'isCollapsed') && props.isCollapsed !== state.isCollapsed) {
            willUpdateState.isCollapsed = props.isCollapsed;
        }

        return willUpdateState;
    }

    componentDidMount() {
        // override BaseComponent
    }

    componentDidUpdate(prevProps: NavProps, prevState: NavState) {
        if (prevProps.items !== this.props.items || prevProps.children !== this.props.children) {
            this.foundation.init();
        } else {
            this.foundation.handleItemsChange(false);
            const { selectedKeys } = this.state;

            if (this.props.selectedKeys && !isEqual(prevProps.selectedKeys, this.props.selectedKeys)) {
                this.adapter.updateSelectedKeys(this.props.selectedKeys);
            }

            if (this.props.openKeys && !isEqual(prevProps.openKeys, this.props.openKeys)) {
                this.adapter.updateOpenKeys(this.props.openKeys);
            }

            if (!isEqual(selectedKeys, prevState.selectedKeys)) {
                const parentSelectKeys = this.foundation.selectLevelZeroParentKeys(null, ...selectedKeys);
                this.adapter.addSelectedKeys(...parentSelectKeys);
            }
        }
    }

    get adapter(): NavigationAdapter<NavProps, NavState> {
        return {
            ...super.adapter,
            notifySelect: (...args) => this.props.onSelect(...args),
            notifyOpenChange: (...args) => this.props.onOpenChange(...args),
            setIsCollapsed: isCollapsed => this.setState({ isCollapsed }),
            notifyCollapseChange: (...args) => this.props.onCollapseChange(...args),
            updateItems: items => this.setState({ items: [...items] }),
            setItemKeysMap: itemKeysMap => this.setState({ itemKeysMap: { ...itemKeysMap } }),
            addSelectedKeys: createAddKeysFn(this, 'selectedKeys'),
            removeSelectedKeys: createRemoveKeysFn(this, 'selectedKeys'),
            updateSelectedKeys: selectedKeys => this.setState({ selectedKeys: [...selectedKeys] }),
            updateOpenKeys: openKeys => this.setState({ openKeys: [...openKeys] }),
            addOpenKeys: createAddKeysFn(this, 'openKeys'),
            removeOpenKeys: createRemoveKeysFn(this, 'openKeys'),
            setItemsChanged: isChanged => {
                this.itemsChanged = isChanged;
            },
        };
    }

    /**
     * Render navigation items recursively
     *
     * @param {NavItem[]} items
     * @returns {JSX.Element}
     */
    renderItems(items: (SubNavPropsWithItems | NavItemPropsWithItems)[] = [], level = 0) {
        const finalDom = (
            <>
                {items.map((item, idx) => {
                    if (Array.isArray(item.items) && item.items.length) {
                        return (
                            <SubNav key={item.itemKey || String(level) + idx} {...item as SubNavPropsWithItems} level={level}>
                                {this.renderItems(item.items as (SubNavPropsWithItems | NavItemPropsWithItems)[], level + 1)}
                            </SubNav>
                        );
                    } else {
                        return <Item key={item.itemKey || String(level) + idx} {...item as NavItemPropsWithItems} level={level} />;
                    }
                })}
            </>
        );
        return finalDom;
    }

    onCollapseChange = () => {
        this.foundation.handleCollapseChange();
    };

    render() {
        const {
            children: originChildren,
            mode,
            onOpenChange,
            onSelect,
            onClick,
            style,
            className,
            subNavCloseDelay,
            subNavOpenDelay,
            subNavMotion,
            tooltipShowDelay,
            tooltipHideDelay,
            prefixCls,
            bodyStyle,
            footer,
            header,
            toggleIconPosition,
            limitIndent
        } = this.props;

        const { selectedKeys, openKeys, items, isCollapsed } = this.state;

        const {
            updateOpenKeys,
            addOpenKeys,
            removeOpenKeys,
            updateSelectedKeys,
            addSelectedKeys,
            removeSelectedKeys,
        } = this.adapter;

        const finalStyle = { ...style };

        let children: React.ReactNode[] = Children.toArray(originChildren);

        const footers: React.ReactNode[] = [];
        const headers: React.ReactNode[] = [];

        if (React.isValidElement(footer)) {
            footers.push(<Footer key={0}>{footer}</Footer>);
        } else if (footer && typeof footer === 'object') {
            footers.push(<Footer key={0} {...footer} />);
        }

        if (React.isValidElement(header)) {
            headers.push(<Header key={0}>{header}</Header>);
        } else if (header && typeof header === 'object') {
            headers.push(<Header key={0} {...header} />);
        }

        if (Array.isArray(children) && children.length) {
            children = [...children];
            let childrenLength = children.length;
            for (let i = 0; i < childrenLength; i++) {
                const child = children[i];

                if ((child as any).type === Footer || get(child, 'type.name') === 'NavFooter') {
                    footers.push(child);
                    children.splice(i, 1);
                    i--;
                    childrenLength--;
                } else if ((child as any).type === Header || get(child, 'type.name') === 'NavHeader') {
                    headers.push(child);
                    children.splice(i, 1);
                    i--;
                    childrenLength--;
                }
            }
        }

        const finalCls = cls(prefixCls, className, {
            [`${prefixCls}-collapsed`]: isCollapsed,
            [`${prefixCls}-horizontal`]: mode === 'horizontal',
            [`${prefixCls}-vertical`]: mode === 'vertical',
        });

        const headerListOuterCls = cls(`${prefixCls}-header-list-outer`, {
            [`${prefixCls}-header-list-outer-collapsed`]: isCollapsed,
        });

        if (this.itemsChanged) {
            this.adapter.setCache('itemElems', this.renderItems(items));
        }

        return (
            <LocaleConsumer componentName="Navigation">
                {locale => (
                    <NavContext.Provider
                        value={{
                            subNavCloseDelay,
                            subNavOpenDelay,
                            subNavMotion,
                            tooltipShowDelay,
                            tooltipHideDelay,
                            openKeys,
                            openKeysIsControlled: this.isControlled('openKeys') && mode === 'vertical' && !isCollapsed,
                            // canUpdateOpenKeys: mode === 'vertical' && !isCollapsed,
                            canUpdateOpenKeys: true,
                            selectedKeys,
                            selectedKeysIsControlled: this.isControlled('selectedKeys'),
                            isCollapsed,
                            onCollapseChange: this.onCollapseChange,
                            mode,
                            onSelect,
                            onOpenChange,
                            updateOpenKeys,
                            addOpenKeys,
                            removeOpenKeys,
                            updateSelectedKeys,
                            addSelectedKeys,
                            removeSelectedKeys,
                            onClick,
                            locale,
                            prefixCls,
                            toggleIconPosition,
                            limitIndent
                        } as any}
                    >
                        <div className={finalCls} style={finalStyle}>
                            <div className={`${prefixCls}-inner`}>
                                <div className={headerListOuterCls}>
                                    {headers}
                                    <div style={bodyStyle} className={`${prefixCls}-list-wrapper`}>
                                        <ul className={`${prefixCls}-list`}>
                                            {this.adapter.getCache('itemElems')}
                                            {children}
                                        </ul>
                                    </div>
                                </div>
                                {footers}
                            </div>
                        </div>
                    </NavContext.Provider>
                )}
            </LocaleConsumer>
        );
    }
}

export default Nav;
