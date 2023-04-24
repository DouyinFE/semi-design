/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

import '@douyinfe/semi-foundation/navigation/navigation.scss';

import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';
import SubNavFoundation, { SubNavAdapter } from '@douyinfe/semi-foundation/navigation/subNavFoundation';
import { strings, numbers, cssClasses } from '@douyinfe/semi-foundation/navigation/constants';
import { IconChevronDown, IconChevronUp, IconChevronRight } from '@douyinfe/semi-icons';

import NavItem from './Item';
import Dropdown, { DropdownProps } from '../dropdown';
import NavContext, { NavContextType } from './nav-context';

import { times, get } from 'lodash';
import Collapsible from "../collapsible";
import CSSAnimation from "../_cssAnimation";
import { Mode } from 'navigation';
import { isUndefined } from 'lodash';

export interface ToggleIcon {
    open?: string;
    closed?: string
}

export interface SubNavProps extends BaseProps {
    disabled?: boolean;
    dropdownStyle?: React.CSSProperties;
    icon?: React.ReactNode;
    indent?: boolean | number;
    isCollapsed?: boolean;
    isOpen?: boolean;
    itemKey?: string | number;
    level?: number;
    maxHeight?: number;
    onMouseEnter?: React.MouseEventHandler<HTMLLIElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLLIElement>;
    text?: React.ReactNode;
    toggleIcon?: ToggleIcon;
    // internal param, used for c2d NavSub variant generation
    active?: boolean;
    mode?: string
}

export interface SubNavState {
    isHovered: boolean
}

export default class SubNav extends BaseComponent<SubNavProps, SubNavState> {
    static elementType: string;
    static contextType = NavContext;

    static propTypes = {
        /**
         * Unique identification
         */
        itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * Copywriting
         */
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        /**
         * Whether child navigation is expanded
         */
        isOpen: PropTypes.bool,
        /**
         * Whether it is in the state of being stowed to the sidebar
         */
        isCollapsed: PropTypes.bool,
        /**
         * Whether to keep the left Icon placeholder
         */
        indent: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        /**
         * Nested child elements
         */
        children: PropTypes.node,
        /**
         * The icon name of the right control switch (on and off status)
         */
        toggleIcon: PropTypes.oneOfType([
            PropTypes.any,
            PropTypes.shape({
                open: PropTypes.string,
                closed: PropTypes.string,
            }),
        ]),
        style: PropTypes.object,
        /**
         * Icon name on the left
         */
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        /**
         * Maximum height (for animation)
         */
        maxHeight: PropTypes.number,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        // Is it disabled
        disabled: PropTypes.bool,
        level: PropTypes.number,
        active: PropTypes.bool
    };

    static defaultProps = {
        level: 0,
        indent: false,
        isCollapsed: false,
        isOpen: false,
        maxHeight: numbers.DEFAULT_SUBNAV_MAX_HEIGHT,
        toggleIcon: {
            open: <IconChevronUp aria-hidden={true} />,
            closed: <IconChevronDown aria-hidden={true} />,
        },
        disabled: false,
        active: false,
    };

    titleRef: React.RefObject<HTMLDivElement>;
    itemRef: React.RefObject<HTMLLIElement>;
    foundation: SubNavFoundation;
    context: NavContextType;
    constructor(props: SubNavProps) {
        super(props);
        this.state = {
            isHovered: false,
        };
        this.adapter.setCache('firstMounted', true);
        this.titleRef = React.createRef();
        this.itemRef = React.createRef();
        this.foundation = new SubNavFoundation(this.adapter);
    }

    setItemRef = (ref: HTMLLIElement | React.RefObject<HTMLLIElement>) => {
        if (ref && (ref as React.RefObject<HTMLLIElement>).current) {
            this.itemRef = ref as React.RefObject<HTMLLIElement>;
        } else {
            this.itemRef = { current: ref as HTMLLIElement };
        }
    };

    setTitleRef = (ref: HTMLDivElement | React.RefObject<HTMLDivElement>) => {
        if (ref && (ref as React.RefObject<HTMLDivElement>).current) {
            this.titleRef = ref as React.RefObject<HTMLDivElement>;
        } else {
            this.titleRef = { current: ref as HTMLDivElement };
        }
    };

    _invokeContextFunc(funcName: string, ...args: any[]) {
        if (funcName && this.context && typeof this.context[funcName] === 'function') {
            return this.context[funcName](...args);
        }
        return null;
    }

    get adapter(): SubNavAdapter<SubNavProps, SubNavState> {
        return {
            ...super.adapter,
            updateIsHovered: isHovered => this.setState({ isHovered }),
            getOpenKeys: () => this.context && this.context.openKeys,
            getOpenKeysIsControlled: () => this.context && this.context.openKeysIsControlled,
            getCanUpdateOpenKeys: () => this.context && this.context.canUpdateOpenKeys,
            updateOpen: isOpen =>
                this._invokeContextFunc(isOpen ? 'addOpenKeys' : 'removeOpenKeys', this.props.itemKey),
            notifyGlobalOpenChange: (...args) => this._invokeContextFunc('onOpenChange', ...args),
            notifyGlobalOnSelect: (...args) => this._invokeContextFunc('onSelect', ...args),
            notifyGlobalOnClick: (...args) => this._invokeContextFunc('onClick', ...args),
            getIsSelected: itemKey => this.props.active || Boolean(!isNullOrUndefined(itemKey) && get(this.context, 'selectedKeys', []).includes(String(itemKey))),
            getIsOpen: () =>
                this.props.isOpen || Boolean(this.context && this.context.openKeys && this.context.openKeys.includes(String(this.props.itemKey))),
            getIsCollapsed: () => this.props.isCollapsed || Boolean(this.context?.isCollapsed),
            getMode: () => this.props.mode ?? this.context?.mode
        };
    }

    handleClick = (e: React.MouseEvent) => {
        this.foundation.handleClick(e && e.nativeEvent, this.titleRef && this.titleRef.current);
    };

    handleKeyPress = (e: React.KeyboardEvent) => {
        this.foundation.handleKeyPress(e && e.nativeEvent, this.titleRef && this.titleRef.current);
    }

    handleDropdownVisible = (visible: boolean) => this.foundation.handleDropdownVisibleChange(visible);

    renderIcon(icon: React.ReactNode, pos: string, withTransition?: boolean, isToggleIcon = false, key: number | string = 0) {
        const { prefixCls = cssClasses.PREFIX } = this.context;

        let iconSize = 'large';
        if (pos === strings.ICON_POS_RIGHT) {
            iconSize = 'default';
        }

        const isOpen = this.adapter.getIsOpen();

        const className = cls(`${prefixCls}-item-icon`, {
            [`${prefixCls}-item-icon-toggle-${this.context.toggleIconPosition ?? 'right'}`]: isToggleIcon,
            [`${prefixCls}-item-icon-info`]: !isToggleIcon,
            [`${prefixCls}-icon-rotate-${isOpen?"180":"0"}-no-transition`]: !withTransition && isToggleIcon,
        });

        const iconElem = React.isValidElement(icon) ? (withTransition ? (
            <CSSAnimation animationState={isOpen?"enter":"leave"} startClassName={`${prefixCls}-icon-rotate-${isOpen?"180":"0"}`}>
                {({ animationClassName })=>{
                    // @ts-ignore
                    return React.cloneElement(icon, { size: iconSize, className: animationClassName });
                }}
            </CSSAnimation>
            // @ts-ignore
        ) : React.cloneElement(icon, { size: iconSize })) : null;

        return <i key={key} className={className}>{iconElem}</i>;
    }

    renderTitleDiv() {
        const { text, icon, itemKey, indent, disabled, level } = this.props;

        const { isInSubNav, prefixCls = cssClasses.PREFIX, subNavMotion, limitIndent } = this.context;
        const isFirstLayer = isUndefined(this.context.mode);
        const mode = this.adapter.getMode();
        const isOpen = this.adapter.getIsOpen();
        const isCollapsed = this.adapter.getIsCollapsed();

        const titleCls = cls(`${prefixCls}-sub-title`, {
            [`${prefixCls}-sub-title-selected`]: this.adapter.getIsSelected(itemKey),
            [`${prefixCls}-sub-title-disabled`]: disabled,
            [`${prefixCls}-first-layer`]: isFirstLayer,
            [`${prefixCls}-sub-title-horizontal`]: mode === strings.MODE_HORIZONTAL,
        });

        let withTransition = false;
        let toggleIconType: React.ReactNode = '';

        if (isCollapsed) {
            if (isInSubNav) {
                toggleIconType = <IconChevronRight />;
            } else {
                toggleIconType = null;
            }
        } else if (mode === strings.MODE_HORIZONTAL) {
            if (isInSubNav) {
                toggleIconType = <IconChevronRight aria-hidden={true} />;
            } else {
                toggleIconType = <IconChevronDown aria-hidden={true} />;
                // Horizontal mode does not require animation fix#1198
                // withTransition = true;
            }
        } else {
            if (subNavMotion) {
                withTransition = true;
            }
            toggleIconType = <IconChevronDown aria-hidden={true} />;
        }

        let placeholderIcons = null;
        if (mode === strings.MODE_VERTICAL && !limitIndent && !isCollapsed) {
            /* Different icons' amount means different indents.*/
            const iconAmount = (icon && !indent) ? level : level - 1;
            placeholderIcons = times(iconAmount, index => this.renderIcon(null, strings.ICON_POS_RIGHT, false, false, index));
        }

        const isIconChevronRightShow = (!isCollapsed && isInSubNav && mode === strings.MODE_HORIZONTAL) || (isCollapsed && isInSubNav);
        const toggleIconPositionLeft = this.context.toggleIconPosition === strings.TOGGLE_ICON_LEFT;

        const titleDiv = (
            <div
                role="menuitem"
                // to avoid nested horizontal navigation be focused
                tabIndex={isIconChevronRightShow ? -1 : 0}
                ref={this.setTitleRef as any}
                className={titleCls}
                onClick={this.handleClick}
                onKeyPress={this.handleKeyPress}
                aria-expanded={isOpen ? 'true' : 'false'}
            >
                <div className={`${prefixCls}-item-inner`}>
                    {placeholderIcons}
                    {toggleIconPositionLeft && this.renderIcon(toggleIconType, strings.ICON_POS_RIGHT, withTransition, true, 'key-toggle-position-left')}
                    {icon || indent || (isInSubNav && mode !== strings.MODE_HORIZONTAL)
                        ? this.renderIcon(icon, strings.ICON_POS_LEFT, false, false, 'key-inSubNav-position-left')
                        : null}
                    <span className={`${prefixCls}-item-text`}>{text}</span>
                    {!toggleIconPositionLeft && this.renderIcon(toggleIconType, strings.ICON_POS_RIGHT, withTransition, true, 'key-toggle-position-right')}
                </div>
            </div>
        );

        return titleDiv;
    }

    renderSubUl() {
        const { children, maxHeight } = this.props;

        const { subNavMotion, prefixCls = cssClasses.PREFIX } = this.context;

        const isCollapsed = this.adapter.getIsCollapsed();
        const isOpen = this.adapter.getIsOpen();
        const mode = this.adapter.getMode();

        const isHorizontal = mode === strings.MODE_HORIZONTAL;

        const subNavCls = cls(`${prefixCls}-sub`, {
            [`${prefixCls}-sub-open`]: isOpen,
            [`${prefixCls}-sub-popover`]: isCollapsed || isHorizontal,
        });

        const ulWithMotion = <Collapsible motion={subNavMotion} isOpen={isOpen} keepDOM={false} fade={true}>
            {
                !isCollapsed ? <ul
                    className={subNavCls}
                >
                    {children}
                </ul>: null
            }
        </Collapsible>;


        const finalDom = isHorizontal ? null : subNavMotion ? (
            ulWithMotion
        ) : isOpen && !isCollapsed ? (
            <ul className={subNavCls}>{children}</ul>
        ) : null;

        return finalDom;
    }

    wrapDropdown(elem: React.ReactNode = '') {
        let _elem: React.ReactNode = elem;
        const { children, dropdownStyle, disabled } = this.props;

        const { isInSubNav, subNavCloseDelay, subNavOpenDelay, prefixCls = cssClasses.PREFIX, getPopupContainer } = this.context;

        const isCollapsed = this.adapter.getIsCollapsed();
        const mode = this.adapter.getMode();
        const isOpen = this.adapter.getIsOpen();
        const openKeysIsControlled = this.adapter.getOpenKeysIsControlled();

        const subNavCls = cls({
            [`${prefixCls}-popover`]: isCollapsed,
        });

        const dropdownProps: DropdownProps = {
            trigger: 'hover',
            style: dropdownStyle,
        };

        if (openKeysIsControlled) {
            dropdownProps.trigger = 'custom';
            dropdownProps.visible = isOpen;
        }

        if (getPopupContainer) {
            dropdownProps.getPopupContainer = getPopupContainer;
        }

        if (isCollapsed || mode === strings.MODE_HORIZONTAL) {
            // Do not show dropdown when disabled
            _elem = !disabled ? (
                <Dropdown
                    className={subNavCls}
                    render={(
                        <Dropdown.Menu>
                            {/* <li className={`${prefixCls}-popover-crumb`} /> */}
                            {children}
                        </Dropdown.Menu>
                    )}
                    position={mode === strings.MODE_HORIZONTAL && !isInSubNav ? 'bottomLeft' : 'rightTop'}
                    mouseEnterDelay={subNavOpenDelay}
                    mouseLeaveDelay={subNavCloseDelay}
                    onVisibleChange={this.handleDropdownVisible}
                    {...dropdownProps}
                >
                    {_elem}
                </Dropdown>
            ) : _elem;
        }
        return _elem;
    }

    render() {
        const { itemKey, style, onMouseEnter, onMouseLeave, disabled, text } = this.props;

        const { prefixCls = cssClasses.PREFIX } = this.context;

        const mode = this.adapter.getMode();
        const isCollapsed = this.adapter.getIsCollapsed();

        let titleDiv: React.ReactNode = this.renderTitleDiv();
        const subUl = this.renderSubUl();

        // When mode=horizontal, it is displayed in Dropdown
        if (isCollapsed || mode === strings.MODE_HORIZONTAL) {
            titleDiv = this.wrapDropdown(titleDiv);
        }

        return (
            <NavItem
                style={style}
                isSubNav={true}
                itemKey={itemKey}
                forwardRef={this.setItemRef}
                isCollapsed={isCollapsed}
                className={`${prefixCls}-sub-wrap`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                disabled={disabled}
                text={text}
                mode={mode}
            >
                <NavContext.Provider value={{ ...this.context, mode: mode as Mode, isInSubNav: true }}>
                    {titleDiv}
                    {subUl}
                </NavContext.Provider>
            </NavItem>
        );
    }
}

SubNav.elementType = 'Nav.Sub';
