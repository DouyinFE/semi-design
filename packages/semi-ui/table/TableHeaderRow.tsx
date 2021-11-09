/* eslint-disable eqeqeq */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { get, noop, map, set, omit, findIndex } from 'lodash';

import { cssClasses } from '@douyinfe/semi-foundation/table/constants';
import {
    arrayAdd,
    isFirstFixedRight,
    isLastLeftFixed,
    isFixedLeft,
    isFixedRight,
    sliceColumnsByLevel
} from '@douyinfe/semi-foundation/table/utils';
import BaseComponent from '../_base/baseComponent';
import TableContext from './table-context';
import { TableComponents, OnHeaderRow, Fixed } from './interface';

export interface TableHeaderRowProps {
    components?: TableComponents;
    row?: any[];
    prefixCls?: string;
    onHeaderRow?: OnHeaderRow<any>;
    index?: number;
    style?: React.CSSProperties;
    columns?: any[];
    fixed?: Fixed;
    selectedRowKeysSet: Set<any>;
}

export default class TableHeaderRow extends BaseComponent<TableHeaderRowProps, Record<string, any>> {
    static contextType = TableContext;

    static propTypes = {
        components: PropTypes.object,
        row: PropTypes.array,
        prefixCls: PropTypes.string,
        onHeaderRow: PropTypes.func,
        index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.object,
        columns: PropTypes.array,
        fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        selectedRowKeysSet: PropTypes.instanceOf(Set).isRequired,
    };

    static defaultProps = {
        onHeaderRow: noop,
        prefixCls: cssClasses.PREFIX,
        columns: [] as [],
        components: {
            header: {
                wrapper: 'thead',
                row: 'tr',
                cell: 'th',
            },
        },
    };

    get adapter() {
        return {
            ...super.adapter,
        };
    }

    headerNode: HTMLElement;
    constructor(props: TableHeaderRowProps) {
        super(props);
        this.headerNode = null;
    }

    cacheRef = (node: HTMLElement) => {
        this.headerNode = node;
        if (node && this.context.setHeadWidths) {
            const { prefixCls, row, index } = this.props;
            const cellSelector = `.${prefixCls}-row-head`;
            const heads = node && node.querySelectorAll && node.querySelectorAll(cellSelector);

            this.context.setHeadWidths(
                map(heads, (head, headIndex) => {
                    let configWidth = get(row, [headIndex, 'column', 'width']);
                    const key = get(row, [headIndex, 'column', 'key']);
                    if (typeof configWidth !== 'number') {
                        configWidth = (head && head.getBoundingClientRect().width) || 0;
                    }
                    return { width: configWidth, key };
                }),
                index
            );
        }
    };

    componentDidUpdate(prevProps: TableHeaderRowProps) {
        if (prevProps.columns !== this.props.columns && this.headerNode) {
            this.cacheRef(this.headerNode);
        }
    }

    render() {
        const { components, row, prefixCls, onHeaderRow, index, style, columns } = this.props;
        const { getCellWidths } = this.context;
        const slicedColumns = sliceColumnsByLevel(columns, index);
        const headWidths = getCellWidths(slicedColumns);

        const HeaderRow = get(components, 'header.row', 'tr');
        const HeaderCell = get(components, 'header.cell', 'th');

        const rowProps = onHeaderRow(columns, index) || {};
        set(rowProps, 'className', classnames(get(rowProps, 'className'), `${prefixCls}-row`));

        const cells = map(row, (cell, cellIndex) => {
            const { column, ...cellProps } = cell;
            const customProps =
                typeof column.onHeaderCell === 'function' ? column.onHeaderCell(column, cellIndex, index) : {};
            let cellStyle = { ...customProps.style };
            if (column.align) {
                cellStyle = { ...cellStyle, textAlign: column.align };
                customProps.className = classnames(customProps.className, column.className, {
                    [`${prefixCls}-align-${column.align}`]: Boolean(column.align),
                });
            }

            customProps.className = classnames(
                `${prefixCls}-row-head`,
                column.className,
                customProps.className,
                // `${prefixCls}-fixed-columns`,
                {
                    [`${prefixCls}-cell-fixed-left`]: isFixedLeft(column),
                    [`${prefixCls}-cell-fixed-left-last`]: isLastLeftFixed(slicedColumns, column),
                    [`${prefixCls}-cell-fixed-right`]: isFixedRight(column),
                    [`${prefixCls}-cell-fixed-right-first`]: isFirstFixedRight(slicedColumns, column),
                }
            );

            if (headWidths.length && slicedColumns.length) {
                const indexOfSlicedColumns = findIndex(
                    slicedColumns,
                    item => item && item.key != null && item.key === column.key
                );
                if (indexOfSlicedColumns > -1) {
                    if (isFixedLeft(column)) {
                        cellStyle = {
                            ...cellStyle,
                            position: 'sticky',
                            left: arrayAdd(headWidths, 0, indexOfSlicedColumns),
                        };
                    } else if (isFixedRight(column)) {
                        cellStyle = {
                            ...cellStyle,
                            position: 'sticky',
                            right: arrayAdd(headWidths, indexOfSlicedColumns + 1),
                        };
                    }
                }
            }

            const props = omit({ ...cellProps, ...customProps }, [
                'colStart',
                'colEnd',
                'hasSubColumns',
                'parents',
                'level',
            ]);

            const { rowSpan, colSpan } = props;
            if (rowSpan === 0 || colSpan === 0) {
                return null;
            }

            return <HeaderCell {...props} style={cellStyle} key={column.key || column.dataIndex || cellIndex} />;
        });

        return (
            <HeaderRow {...rowProps} style={style} ref={this.cacheRef}>
                {cells}
            </HeaderRow>
        );
    }
}
