import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses as css, strings } from '@douyinfe/semi-foundation/dropdown/constants';
import DropdownContext, { DropdownContextType } from './context';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import { IconTick } from '@douyinfe/semi-icons';
import { noop } from 'lodash';

export type Type = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';

export interface DropdownItemProps extends BaseProps {
    disabled?: boolean;
    selected?: boolean;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLLIElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLLIElement>;
    onContextMenu?: React.MouseEventHandler<HTMLLIElement>;
    forwardRef?: (ele: HTMLLIElement) => void;
    type?: Type;
    active?: boolean;
    icon?: React.ReactNode;
}

const prefixCls = css.PREFIX;

class DropdownItem extends BaseComponent<DropdownItemProps> {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        name: PropTypes.string,
        disabled: PropTypes.bool,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onContextMenu: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        forwardRef: PropTypes.func,
        type: PropTypes.oneOf(strings.ITEM_TYPE),
        active: PropTypes.bool,
        icon: PropTypes.node
    };

    static contextType = DropdownContext;
    context: DropdownContextType;

    static defaultProps = {
        disabled: false,
        divided: false,
        selected: false,
        onMouseEnter: noop,
        onMouseLeave: noop,
        forwardRef: noop,
    };


    render() {
        const { children, disabled, className, forwardRef, style, type, active, icon } = this.props;
        const { showTick } = this.context;
        const itemclass = cls(className, {
            [`${prefixCls}-item`]: true,
            [`${prefixCls}-item-disabled`]: disabled,
            [`${prefixCls}-item-withTick`]: showTick,
            [`${prefixCls}-item-${type}`]: type,
            [`${prefixCls}-item-active`]: active,
        });

        const events = {};
        if (!disabled) {
            ['onClick', 'onMouseEnter', 'onMouseLeave', 'onContextMenu'].forEach(eventName => {
                events[eventName] = this.props[eventName];
            });
        }
        let tick = null;
        switch (true) {
            case showTick && active:
                tick = <IconTick />;
                break;
            case showTick && !active:
                tick = <IconTick style={{ color: 'transparent' }} />;
                break;
            default:
                tick = null;
                break;
        }
        let iconContent = null;
        if (icon) {
            iconContent = (
                <div className={`${prefixCls}-item-icon`}>
                    {icon}
                </div>
            );
        }
        return (
            <li role="menuitem" {...events} ref={ref => forwardRef(ref)} className={itemclass} style={style}>
                {tick}
                {iconContent}
                {children}
            </li>
        );
    }
}

export default DropdownItem;
