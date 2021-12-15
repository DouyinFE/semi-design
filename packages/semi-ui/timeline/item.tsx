import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/timeline/constants';
import '@douyinfe/semi-foundation/timeline/timeline.scss';

export interface TimelineItemProps {
    color?: string;
    time?: string;
    type?: 'default' | 'ongoing' | 'success' | 'warning' | 'error';
    dot?: React.ReactNode;
    extra?: React.ReactNode;
    position?: 'left' | 'right';
    className?: string;
    style?: React.CSSProperties;
}

const prefixCls = cssClasses.ITEM;

export default class Item extends PureComponent<TimelineItemProps> {
    static propTypes = {
        color: PropTypes.string,
        time: PropTypes.string,
        type: PropTypes.oneOf(strings.ITEM_TYPE),
        dot: PropTypes.node,
        extra: PropTypes.node,
        position: PropTypes.oneOf(strings.ITEM_POS),
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        type: 'default',
        time: '',
    };

    render() {
        const {
            className,
            color,
            children,
            dot,
            type,
            style,
            time,
            extra
        } = this.props;

        const itemCls = cls(prefixCls,
            className
        );

        const dotCls = cls({
            [`${prefixCls}-head`]: true,
            [`${prefixCls}-head-custom`]: dot,
            [`${prefixCls}-head-${type}`]: type,
        });
        const dotStyle = color ? { style: { backgroundColor: color } } : null;
        return (
            <li className={itemCls} style={style}>
                <div className={`${prefixCls}-tail`} />
                <div
                    className={dotCls}
                    {...dotStyle}
                >
                    {dot}
                </div>
                <div className={`${prefixCls}-content`} aria-label="content">
                    {children}
                    {extra ? <div className={`${prefixCls}-content-extra`}>{extra}</div> : null}
                    <div className={`${prefixCls}-content-time`} aria-label="time">{time}</div>
                </div>
            </li>
        );
    }
}
