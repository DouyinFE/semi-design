import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cssClasses } from '@douyinfe/semi-foundation/descriptions/constants';
import '@douyinfe/semi-foundation/descriptions/descriptions.scss';
import DescriptionsContext, { DescriptionsContextValue } from './descriptions-context';

export interface DescriptionsItemProps {
    hidden?: boolean;
    className?: string;
    children?: React.ReactNode | (() => React.ReactNode);
    style?: React.CSSProperties;
    itemKey?: React.ReactNode;
}

const prefixCls = cssClasses.PREFIX;
const keyCls = `${prefixCls}-key`;
const valCls = `${prefixCls}-value`;

export default class Item extends PureComponent<DescriptionsItemProps> {
    static propTypes = {
        itemKey: PropTypes.node,
        hidden: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object
    };

    static contextType = DescriptionsContext;

    context: DescriptionsContextValue;

    render() {
        const { itemKey, hidden, className, style, children } = this.props;
        const { align } = this.context;
        if (hidden) {
            return null;
        }
        const item = align === 'plain' ?
            (
                <tr className={className} style={style}>
                    <td className={`${prefixCls}-item`}>
                        <span className={keyCls}>
                            {itemKey}:
                        </span>
                        <span className={valCls}>
                            {typeof children === 'function' ? children() : children}
                        </span>
                    </td>
                </tr>
            ) :
            (
                <tr className={className} style={style}>
                    <th className={`${prefixCls}-item ${prefixCls}-item-th`}>
                        <span className={keyCls}>
                            {itemKey}
                        </span>
                    </th>
                    <td className={`${prefixCls}-item ${prefixCls}-item-td`}>
                        <span className={valCls}>
                            {typeof children === 'function' ? children() : children}
                        </span>
                    </td>
                </tr>
            );
        return item;
    }
}
