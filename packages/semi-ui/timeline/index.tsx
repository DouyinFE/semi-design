import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import '@douyinfe/semi-foundation/timeline/timeline.scss';
import { cssClasses, strings } from '@douyinfe/semi-foundation/timeline/constants';
import ConfigContext from '../configProvider/context';
import Item, { TimelineItemProps } from './item';

export { TimelineItemProps } from './item';

export interface Data extends TimelineItemProps {
    content: React.ReactNode;
}

export interface TimelineProps {
    mode?: 'left' | 'right' | 'center' | 'alternate';
    className?: string;
    style?: React.CSSProperties;
    dataSource?: Data[];
}

const prefixCls = cssClasses.PREFIX;

class Timeline extends PureComponent<TimelineProps> {
    static contextType = ConfigContext;
    static Item = Item;
    static propTypes = {
        mode: PropTypes.oneOf(strings.MODE),
        className: PropTypes.string,
        style: PropTypes.object,
        dataSource: PropTypes.array,
    };
    static defaultProps = {
        mode: 'left',
    };

    getPosCls = (ele: React.ReactElement, idx: number) => {
        const { mode } = this.props;
        if (mode === 'alternate') {
            if (ele.props.position) {
                return `${prefixCls}-item-${ele.props.position}`;
            }
            return idx % 2 === 0 ? `${prefixCls}-item-left` : `${prefixCls}-item-right`;
        }
        if (mode === 'center') {
            if (ele.props.position) {
                return `${prefixCls}-item-${ele.props.position}`;
            }
            return `${prefixCls}-item-left`;
        }
        if (mode === 'left' || mode === 'right') {
            return `${prefixCls}-item-${mode}`;
        }
        if (ele.props.position) {
            return `${prefixCls}-item-${ele.props.position}`;
        }
        return '';
    };

    addClassName = (items: React.ReactNode) => React.Children.map(items, (ele, idx) => {
        if (React.isValidElement(ele)) {
            return React.cloneElement(ele, {
                className: cls(
                    ele.props.className,
                    this.getPosCls(ele, idx)
                ),
            });
        }
        return ele;
    });

    render() {
        const { children, className, style, mode, dataSource } = this.props;
        const classString = cls(
            prefixCls,
            className,
            { [`${prefixCls}-${mode}`]: mode }
        );
        let childrenList;
        if (dataSource && dataSource.length) {
            const items = dataSource.map(
                (item, index) => <Item key={`timeline-item-${index}`} {...item}>{item.content}</Item>
            );
            childrenList = this.addClassName(items);
        }
        const items = childrenList || this.addClassName(children);

        return (
            <ul role="listbox" aria-orientation="vertical" style={style} className={classString}>
                {items}
            </ul>
        );
    }
}

export default Timeline;