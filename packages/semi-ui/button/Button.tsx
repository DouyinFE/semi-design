/* eslint-disable react/destructuring-assignment */
import React, { PureComponent, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/button/constants';
import '@douyinfe/semi-foundation/button/button.scss';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import { omit } from 'lodash';

const btnSizes = strings.sizes;
const { htmlTypes, btnTypes } = strings;

export type HtmlType = 'button' | 'reset' | 'submit';
export type Size = 'default' | 'small' | 'large';
export type Theme = 'solid' | 'borderless' | 'light';
export type Type = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>{
    id?: string;
    block?: boolean;
    circle?: boolean;
    children?: ReactNode | undefined;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    htmlType?: HtmlType;
    size?: Size;
    style?: React.CSSProperties;
    theme?: Theme;
    type?: Type;
    prefixCls?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    'aria-label'?: React.AriaAttributes['aria-label']
}

// TODO: icon configuration
export default class Button extends PureComponent<ButtonProps> {
    static defaultProps = {
        disabled: false,
        size: 'default',
        type: 'primary',
        theme: 'light',
        block: false,
        htmlType: 'button',
        onMouseDown: noop,
        onClick: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
        prefixCls: cssClasses.PREFIX,
    };

    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        prefixCls: PropTypes.string,
        style: PropTypes.object,
        size: PropTypes.oneOf(btnSizes),
        type: PropTypes.oneOf(btnTypes),
        block: PropTypes.bool,
        onClick: PropTypes.func,
        onMouseDown: PropTypes.func,
        circle: PropTypes.bool,
        loading: PropTypes.bool,
        htmlType: PropTypes.oneOf(htmlTypes),
        theme: PropTypes.oneOf(strings.themes),
        className: PropTypes.string,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        'aria-label': PropTypes.string,
    };

    render() {
        const {
            children,
            block,
            htmlType,
            loading,
            circle,
            className,
            style,
            disabled,
            size,
            theme,
            type,
            prefixCls,
            iconPosition,
            ...attr
        } = this.props;

        const baseProps = {
            disabled,
            ...omit(attr, ['x-semi-children-alias']),
            className: classNames(
                prefixCls,
                {
                    [`${prefixCls}-${type}`]: !disabled && type,
                    [`${prefixCls}-disabled`]: disabled,
                    [`${prefixCls}-size-large`]: size === 'large',
                    [`${prefixCls}-size-small`]: size === 'small',
                    // [`${prefixCls}-loading`]: loading,
                    [`${prefixCls}-light`]: theme === 'light',
                    [`${prefixCls}-block`]: block,
                    [`${prefixCls}-circle`]: circle,
                    [`${prefixCls}-borderless`]: theme === 'borderless',
                },
                className
            ),
            type: htmlType,
            'aria-disabled': disabled,
        };

        const xSemiProps = {};

        if (!(className && className.includes('-with-icon'))) {
            xSemiProps['x-semi-prop'] = this.props['x-semi-children-alias'] || 'children';
        }

        return (
            // eslint-disable-next-line react/button-has-type
            <button {...baseProps} onClick={this.props.onClick} onMouseDown={this.props.onMouseDown} style={style}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <span className={`${prefixCls}-content`} onClick={e => disabled && e.stopPropagation()} {...xSemiProps}>
                    {children}
                </span>
            </button>
        );
    }
}
