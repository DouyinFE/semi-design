import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { strings, cssClasses } from '@douyinfe/semi-foundation/descriptions/constants';
import '@douyinfe/semi-foundation/descriptions/descriptions.scss';
import { isPlainObject } from 'lodash';
import DescriptionsContext, { DescriptionsAlign } from './descriptions-context';
import Item from './item';

export { DescriptionsItemProps } from './item';
export type DescriptionsSize = 'small' | 'medium' | 'large';
export interface Data {
    [x: string]: any;
    key?: string | number;
    value?: (() => React.ReactNode) | React.ReactNode;
    hidden?: boolean;
}
export interface DescriptionsProps {
    align?: DescriptionsAlign;
    row?: boolean;
    size?: DescriptionsSize;
    style?: React.CSSProperties;
    className?: string;
    data?: Data[];
}

const prefixCls = cssClasses.PREFIX;

class Descriptions extends PureComponent<DescriptionsProps > {
    static Item = Item;

    static contextType = DescriptionsContext;

    static propTypes = {
        align: PropTypes.oneOf(strings.ALIGN_SET),
        row: PropTypes.bool,
        size: PropTypes.oneOf(strings.SIZE_SET),
        style: PropTypes.object,
        className: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.node,
            value: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
            hidden: PropTypes.bool,
            className: PropTypes.string,
            style: PropTypes.object
        })),
    };

    static defaultProps = {
        align: 'center',
        row: false,
        size: 'medium',
        data: [] as Array<Data>,
    };

    render() {
        const { align, row, size, className, style, children, data } = this.props;
        const classNames = cls(prefixCls, className, {
            [`${prefixCls}-${align}`]: !row,
            [`${prefixCls}-double`]: row,
            [`${prefixCls}-double-${size}`]: row,
        });
        const childrenList = data && data.length ?
            data.map(item => (
                isPlainObject(item) ? <Item key={item.key} itemKey={item.key} {...item}>{item.value}</Item> : null
            )) :
            children;
        return (
            <div className={classNames} style={style}>
                <table>
                    <tbody>
                        <DescriptionsContext.Provider value={{ align }}>
                            {childrenList}
                        </DescriptionsContext.Provider>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Descriptions;