/* eslint-disable max-len */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/input/constants';
import BaseComponent from '../_base/baseComponent';
import Label from '../form/label';

import { noop } from '@douyinfe/semi-foundation/utils/function';
import { isFunction } from 'lodash';

const prefixCls = cssClasses.PREFIX;
const sizeSet = strings.SIZE;

export type InputSize = 'small' | 'large' | 'default';

export interface InputGroupProps {
    className?: string;
    children?: React.ReactNode;
    size?: InputSize;
    style?: Record<string, any>;
    onBlur?: (e: React.FocusEvent<HTMLSpanElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLSpanElement>) => void;
    label?: Record<string, any>;
    labelPosition?: string;
    disabled?: boolean;
}

// eslint-disable-next-line
export interface InputGroupState {} 

export default class inputGroup extends BaseComponent<InputGroupProps, InputGroupState> {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        size: PropTypes.oneOf(sizeSet),
        style: PropTypes.object,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        label: PropTypes.object,
        labelPosition: PropTypes.string,
    };

    static defaultProps = {
        size: 'default',
        className: '',
        onBlur: noop,
        onFocus: noop,
    };

    renderGroupWithLabel(inner: React.ReactNode) {
        // eslint-disable-next-line no-unused-vars
        const { size, className, label, labelPosition, ...rest } = this.props;
        const groupWrapperCls = cls({
            [`${prefixCls}-group-wrapper`]: true,
            [`${prefixCls}-group-wrapper-with-top-label`]: labelPosition === 'top',
            [`${prefixCls}-group-wrapper-with-left-label`]: labelPosition === 'left',
        });
        const groupCls = cls(
            `${prefixCls}-group`,
            className,
            {
                [`${prefixCls}-${size}`]: size !== 'default',
            }
        );
        // const labelCls = cls(label.className, '');
        return (
            <div className={groupWrapperCls}>
                {label && label.text ? <Label {...label} /> : null}
                <span
                    className={groupCls}
                    style={this.props.style}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                >
                    {inner}
                </span>
            </div>
        );
    }

    render() {
        const { size, style, className, children, label, onBlur: groupOnBlur, onFocus: groupOnFocus, ...rest } = this.props;
        const groupCls = cls(
            `${prefixCls}-group`,
            {
                [`${prefixCls}-${size}`]: size !== 'default',
            },
            className
        );
        let inner;
        if (children) {
            inner = (Array.isArray(children) ? children : [children]).map((item, index) => {
                if (item) {
                    const { onBlur: itemOnBlur, onFocus: itemOnFocus } = (item as any).props;
                    const onBlur = isFunction(itemOnBlur) ? itemOnBlur : groupOnBlur;
                    const onFocus = isFunction(itemOnFocus) ? itemOnFocus : groupOnFocus;
                    return React.cloneElement(item as any, { key: index, size, onBlur, onFocus, ...rest });
                }
                return null;
            });
        }

        if (label && label.text) {
            return this.renderGroupWithLabel(inner);
        }

        return (
            <span
                className={groupCls}
                style={style}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
            >
                {inner}
            </span>
        );
    }
}