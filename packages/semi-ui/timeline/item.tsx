import React, { PureComponent } from 'react';
import cls from 'classnames';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/timeline/constants';
import '@douyinfe/semi-foundation/timeline/timeline.scss';
import Context, { ModeType, TimelineContextValue } from './context';

export interface TimelineItemProps {
    color?: string;
    children?: React.ReactNode;
    time?: React.ReactNode;
    type?: 'default' | 'ongoing' | 'success' | 'warning' | 'error';
    dot?: React.ReactNode;
    extra?: React.ReactNode;
    position?: 'left' | 'right';
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    // 以下参数用于 C2D， 用户请勿使用
    mode?: ModeType;
    odd?: boolean;
    usedInC2D?: boolean
}

const prefixCls = cssClasses.ITEM;

export default class Item extends PureComponent<TimelineItemProps> {
    static contextType = Context;
    static elementType: string;
    static propTypes = {
        color: PropTypes.string,
        time: PropTypes.node,
        type: PropTypes.oneOf(strings.ITEM_TYPE),
        dot: PropTypes.node,
        extra: PropTypes.node,
        position: PropTypes.oneOf(strings.ITEM_POS),
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        mode: PropTypes.string,
        lastChild: PropTypes.bool,
    };

    context: TimelineContextValue;

    static defaultProps = {
        type: 'default',
        time: '',
        onClick: noop,
    };

    // getC2DCls is used in C2D, it does not work in non-C2D scenes
    getC2DCls = () => {
        let c2dCls = '';
        const { mode, odd, usedInC2D } = this.props;
        if (usedInC2D) {
            switch (mode) {
                case 'center':
                    c2dCls = `${prefixCls}-center  ${prefixCls}-left`;
                    break;
                case 'alternate':
                    c2dCls = `${prefixCls}-alternate  ${prefixCls}-${odd ? 'left' : 'right'}`;
                    break;
                default:
                    c2dCls = `${prefixCls}-${mode} ${mode === 'right' ? `${prefixCls}-mode-right` : ''}`;
                    break;
            }
            c2dCls += ` ${prefixCls}-not-last-child`;
        }
        return c2dCls;
    }

    render() {
        const {
            className,
            color,
            children,
            dot,
            type,
            style,
            time,
            extra,
            onClick,
        } = this.props;

        const itemCls = cls(prefixCls,
            className,
            this.getC2DCls()
        );

        const dotCls = cls({
            [`${prefixCls}-head`]: true,
            [`${prefixCls}-head-custom`]: dot,
            [`${prefixCls}-head-${type}`]: type,
        });
        const dotStyle = color ? { style: { backgroundColor: color } } : null;
        return (
            <li className={itemCls} style={style} onClick={onClick}>
                <div className={`${prefixCls}-tail`} aria-hidden />
                <div
                    className={dotCls}
                    aria-hidden
                    {...dotStyle}
                >
                    {dot}
                </div>
                <div className={`${prefixCls}-content`}>
                    {children}
                    {extra && <div className={`${prefixCls}-content-extra`}>{extra}</div>}
                    {time && <div className={`${prefixCls}-content-time`}>{time}</div>}
                </div>
            </li>
        );
    }
}

Item.elementType = 'Timeline.Item';