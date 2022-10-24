import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { isNumber, isString, noop } from 'lodash';
import ConfigContext, { ContextValue } from '../configProvider/context';
import { cssClasses, strings } from '@douyinfe/semi-foundation/badge/constants';
import '@douyinfe/semi-foundation/badge/badge.scss';

const prefixCls = cssClasses.PREFIX;

export type BadgeType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning';
export type BadgeTheme = 'solid' | 'light' | 'inverted';
export type BadgePosition = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

export interface BadgeProps {
    count?: React.ReactNode;
    dot?: boolean;
    type?: BadgeType;
    theme?: BadgeTheme;
    position?: BadgePosition;
    overflowCount?: number;
    style?: React.CSSProperties;
    className?: string;
    onMouseEnter?: (e: React.MouseEvent) => any;
    onMouseLeave?: (e: React.MouseEvent) => any;
    onClick?: (e: React.MouseEvent) => any;
    children?: React.ReactNode
}

export default class Badge extends PureComponent<BadgeProps> {
    static contextType = ConfigContext;
    static propTypes = {
        count: PropTypes.node,
        dot: PropTypes.bool,
        type: PropTypes.oneOf(strings.TYPE_SET),
        theme: PropTypes.oneOf(strings.THEME_SET),
        position: PropTypes.oneOf(strings.POS_SET),
        overflowCount: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        dot: false,
        type: 'primary',
        theme: 'solid',
        className: '',
        onClick: () => noop,
        onMouseEnter: () => noop,
        onMouseLeave: () => noop,
    };

    context: ContextValue;

    render() {
        const { direction } = this.context;
        // DefaultPosition here, static can't get this
        const defaultPosition = direction === 'rtl' ? 'leftTop' : 'rightTop';
        // eslint-disable-next-line max-len
        const { count, dot, type, theme, position = defaultPosition, overflowCount, style, children, className, ...rest } = this.props;
        const custom = count && !(isNumber(count) || isString(count));
        const showBadge = count !== null && typeof count !== 'undefined';
        const wrapper = cls(className, {
            [`${prefixCls}-${type}`]: !custom,
            [`${prefixCls}-${theme}`]: !custom,
            [`${prefixCls}-${position}`]: Boolean(position) && Boolean(children),
            [`${prefixCls}-block`]: !children,
            [`${prefixCls}-dot`]: dot,
            [`${prefixCls}-count`]: !dot && !custom && showBadge,
            [`${prefixCls}-custom`]: custom,
        });
        let content;
        if (isNumber(count)) {
            content = overflowCount && overflowCount < count ? `${overflowCount}+` : `${count}`;
        } else {
            content = count;
        }
        return (
            <span className={prefixCls} {...rest}>
                {children}
                <span className={wrapper} style={style} x-semi-prop="count">
                    {dot ? null : content}
                </span>
            </span>
        );
    }
}