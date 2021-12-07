import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { noop } from 'lodash-es';
import { IconCaretup, IconCaretdown } from '@douyinfe/semi-icons';

import { cssClasses, strings } from '@douyinfe/semi-foundation/table/constants';

import { SortOrder } from './interface';
import isEnterPress from '@douyinfe/semi-foundation/utils/isEnterPress';

export interface ColumnSorterProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    prefixCls?: string;
    sortOrder?: SortOrder;
}

export default class ColumnSorter extends PureComponent<ColumnSorterProps> {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        prefixCls: PropTypes.string,
        sortOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
        prefixCls: cssClasses.PREFIX,
        onClick: noop,
        sortOrder: false,
    };

    render() {
        const { prefixCls, onClick, sortOrder, style } = this.props;

        const iconBtnSize = 'small';

        const upCls = cls(`${prefixCls}-column-sorter-up`, {
            on: sortOrder === strings.SORT_DIRECTIONS[0],
        });

        const downCls = cls(`${prefixCls}-column-sorter-down`, {
            on: sortOrder === strings.SORT_DIRECTIONS[1],
        });
        const ariaProps = {
            /**
             * Set 'aria-sort' to aria-columnheader is difficult, so set 'aria-label' about sort info to sorter
             * reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaSort
             */
            'aria-label': `Current sort order is ${sortOrder ? `${sortOrder}ing` : 'none'}`,
            'aria-roledescription': 'Sort data with this column',
        };

        return (
            <div
                role='button'
                {...ariaProps}
                tabIndex={-1}
                style={style}
                className={`${prefixCls}-column-sorter`}
                onClick={onClick}
                onKeyPress={e => isEnterPress(e) && onClick(e as any)}
            >
                <span className={`${upCls}`}>
                    <IconCaretup size={iconBtnSize} />
                </span>
                <span className={`${downCls}`}>
                    <IconCaretdown size={iconBtnSize} />
                </span>
            </div>
        );
    }
}
