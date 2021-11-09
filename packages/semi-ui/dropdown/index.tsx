import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings, numbers } from '@douyinfe/semi-foundation/dropdown/constants';

import BaseComponent from '../_base/baseComponent';
import Tooltip, { Position, TooltipProps, Trigger } from '../tooltip/index';
import { numbers as tooltipNumbers } from '@douyinfe/semi-foundation/tooltip/constants';
import Foundation from '@douyinfe/semi-foundation/dropdown/foundation';

import DropdownMenu from './dropdownMenu';
import DropdownItem, { DropdownItemProps } from './dropdownItem';
import DropdownDivider, { DropdownDividerProps } from './dropdownDivider';
import DropdownTitle, { DropdownTitleProps } from './dropdownTitle';

import DropdownContext from './context';
import '@douyinfe/semi-foundation/dropdown/dropdown.scss';
import { noop, get } from 'lodash';
import { Motion } from '../_base/base';

const positionSet = strings.POSITION_SET;
const triggerSet = strings.TRIGGER_SET;

export { DropdownDividerProps } from './dropdownDivider';
export { DropdownItemProps, Type } from './dropdownItem';
export { DropdownMenuProps } from './dropdownMenu';
export { DropdownTitleProps } from './dropdownTitle';
export interface DropDownMenuItemBasic {
    node: 'title' | 'item' | 'divider';
    name?: string;
}

export type DropDownMenuItem = DropDownMenuItemBasic & DropdownItemProps & DropdownDividerProps & DropdownTitleProps;

export interface DropdownProps extends TooltipProps {
    render?: React.ReactNode;
    children?: React.ReactNode;
    visible?: boolean;
    position?: Position;
    getPopupContainer?: () => HTMLElement;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    menu?: DropDownMenuItem[];
    trigger?: Trigger;
    zIndex?: number;
    motion?: Motion;
    className?: string;
    contentClassName?: string | any[];
    style?: React.CSSProperties;
    onVisibleChange?: (visible: boolean) => void;
    rePosKey?: string | number;
    showTick?: boolean;
}

interface DropdownState {
    popVisible: boolean;
}

class Dropdown extends BaseComponent<DropdownProps, DropdownState> {
    static Menu = DropdownMenu;

    static Item = DropdownItem;

    static Divider = DropdownDivider;

    static Title = DropdownTitle;

    static contextType = DropdownContext;

    static propTypes = {
        render: PropTypes.node,
        children: PropTypes.node,
        visible: PropTypes.bool,
        position: PropTypes.oneOf(positionSet),
        getPopupContainer: PropTypes.func,
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        trigger: PropTypes.oneOf(triggerSet),
        zIndex: PropTypes.number,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        className: PropTypes.string,
        contentClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        style: PropTypes.object,
        onVisibleChange: PropTypes.func,
        rePosKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        showTick: PropTypes.bool,
        prefixCls: PropTypes.string,
        spacing: PropTypes.number,
        menu: PropTypes.array,
    };

    static defaultProps = {
        onVisibleChange: noop,
        prefixCls: cssClasses.PREFIX,
        zIndex: tooltipNumbers.DEFAULT_Z_INDEX,
        motion: true,
        trigger: 'hover',
        position: 'bottom',
        mouseLeaveDelay: strings.DEFAULT_LEAVE_DELAY,
        showTick: false,
    };

    constructor(props: DropdownProps) {
        super(props);

        this.state = {
            popVisible: props.visible,
        };

        this.foundation = new Foundation(this.adapter);
    }

    get adapter() {
        return {
            ...super.adapter,
            setPopVisible: (popVisible: boolean) => this.setState({ popVisible }),
            notifyVisibleChange: (visible: boolean) => this.props.onVisibleChange(visible),
        };
    }

    handleVisibleChange = (visible: boolean) => this.foundation.handleVisibleChange(visible);

    renderContent() {
        const { render, menu, contentClassName, style, showTick, prefixCls } = this.props;
        const className = classnames(prefixCls, contentClassName);
        const { level = 0 } = this.context;
        const contextValue = { showTick, level: level + 1 };
        let content = null;
        if (React.isValidElement(render)) {
            content = render;
        } else if (Array.isArray(menu)) {
            content = this.renderMenu();
        }
        return (
            <DropdownContext.Provider value={contextValue}>
                <div className={className} style={style}>
                    <div className={`${prefixCls}-content`}>{content}</div>
                </div>
            </DropdownContext.Provider>
        );
    }

    renderMenu() {
        const { menu } = this.props;
        const content = menu.map((m, index) => {
            switch (m.node) {
                case 'title': {
                    const { name, node, ...rest } = m;
                    return (
                        <Dropdown.Title {...rest} key={node + name + index}>
                            {name}
                        </Dropdown.Title>
                    );
                }

                case 'item': {
                    const { node, name, ...rest } = m;
                    return (
                        <Dropdown.Item {...rest} key={node + name + index}>
                            {name}
                        </Dropdown.Item>
                    );
                }

                case 'divider': {
                    return <Dropdown.Divider key={m.node + index} />;
                }

                default:
                    return null;
            }
        });
        return <Dropdown.Menu>{content}</Dropdown.Menu>;
    }

    renderPopCard() {
        const { render, contentClassName, style, showTick, prefixCls } = this.props;
        const className = classnames(prefixCls, contentClassName);
        const { level = 0 } = this.context;
        const contextValue = { showTick, level: level + 1 };
        return (
            <DropdownContext.Provider value={contextValue}>
                <div className={className} style={style}>
                    <div className={`${prefixCls}-content`}>{render}</div>
                </div>
            </DropdownContext.Provider>
        );
    }

    render() {
        const {
            children,
            position,
            trigger,
            onVisibleChange,
            zIndex,
            className,
            motion,
            style,
            prefixCls,
            ...attr
        } = this.props;
        let { spacing } = this.props;
        const { level } = this.context;
        const { popVisible } = this.state;
        const pop = this.renderContent();

        if (level > 0) {
            spacing = typeof spacing === 'number' ? spacing : numbers.NESTED_SPACING;
        } else if (spacing === null || typeof spacing === 'undefined') {
            spacing = numbers.SPACING;
        }

        return (
            <Tooltip
                zIndex={zIndex}
                motion={motion}
                content={pop}
                className={className}
                prefixCls={prefixCls}
                spacing={spacing}
                position={position}
                trigger={trigger}
                onVisibleChange={this.handleVisibleChange}
                showArrow={false}
                {...attr}
            >
                {React.isValidElement(children) ?
                    React.cloneElement(children, {
                        className: classnames(get(children, 'props.className'), {
                            [`${prefixCls}-showing`]: popVisible,
                        }),
                    }) :
                    children}
            </Tooltip>
        );
    }
}
export default Dropdown;
