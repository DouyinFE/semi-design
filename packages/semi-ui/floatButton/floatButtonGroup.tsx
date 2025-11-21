import React from 'react';
import { cssClassesGroup, strings } from '@douyinfe/semi-foundation/floatButton/constants';
import '@douyinfe/semi-foundation/floatButton/floatButton.scss';
import BaseComponent from '../_base/baseComponent';
import { ArrayElement } from '../_base/base';
import Badge, { BadgeProps } from '../badge';
import cls from 'classnames';
import { FloatButtonProps } from './interface';

const prefixCls = cssClassesGroup.PREFIX;

export interface FloatButtonGroupItem extends FloatButtonProps {
    value?: string;
    content?: string | React.ReactNode
}

export interface FloatButtonGroupProps {
    disabled?: boolean;
    items: FloatButtonGroupItem[];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (value: string, e: React.MouseEvent) => void
}

interface FloatButtonGroupState {
}

export default class FloatButtonGroup extends BaseComponent<FloatButtonGroupProps, FloatButtonGroupState> {

    static defaultProps = {
        shape: 'round',
        type: 'default',
        size: 'medium',
    };

    constructor(props: FloatButtonGroupProps) {
        super(props);
    }

    handleClick = (e) => {
        const value = e.target.dataset.value;
        this.props.onClick(value, e);
    }

    render(): JSX.Element {
        const { className, style, disabled, items } = this.props;
        return (
            <div 
                className={cls(prefixCls, className, {
                    [`${prefixCls}-disabled`]: disabled,
                })}
                style={style}
                onClick={this.handleClick}
            >
                {items.map((item, index) => {
                    if (item.badge) {
                        return (
                            <Badge key={index} {...item.badge}>
                                <div className={cls(`${prefixCls}-item`)} data-value={item.value}>
                                    {item.icon}
                                    {item.content}
                                </div>
                            </Badge>
                        );
                    }
                    return (
                        <div
                            key={index} 
                            className={cls(`${prefixCls}-item`)}
                            data-value={item.value}
                        >
                            {item.icon}
                            {item.content}
                        </div>
                    );}
                )}
            </div>
        );
    }
}
