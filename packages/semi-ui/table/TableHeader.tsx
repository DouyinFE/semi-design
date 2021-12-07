/* eslint-disable max-len */
import React, { ReactNode } from 'react';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import PropTypes from 'prop-types';
import { strings, cssClasses } from '@douyinfe/semi-foundation/table/constants';
import { noop, isFunction } from 'lodash';
import TableHeaderRow from './TableHeaderRow';
import { Fixed, TableComponents, OnHeaderRow } from './interface';

function parseHeaderRows(columns: any[]) {
    const rows: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function fillRowCells(columns: any[], colIndex: number, parents: any[] = [], rowIndex = 0, level = 0) {
        // Init rows
        rows[rowIndex] = rows[rowIndex] || [];

        let currentColIndex = colIndex;
        const colSpans = columns.map(column => {
            const cell: TableHeaderCell = {
                key: column.key,
                className: column.className || '',
                children: isFunction(column.title) ? column.title() : column.title,
                column,
                colStart: currentColIndex,
                level,
                parents,
            };

            let colSpan = 1;

            /**
              * Calculate header column merge colSpan
              *  - If the current cell has children, colSpan = the sum of children rowSpan
              *  - If the current cell has no children, colSpan = 1
              */
            const subColumns = column.children;
            if (subColumns && subColumns.length > 0) {
                colSpan = fillRowCells(subColumns, currentColIndex, [...parents, cell], rowIndex + 1, level + 1).reduce(
                    (total, count) => total + count,
                    0
                );
                cell.hasSubColumns = true;
            }

            if ('colSpan' in column) {
                ({ colSpan } = column);
            }

            if ('rowSpan' in column) {
                cell.rowSpan = column.rowSpan;
            }

            if (column.key === strings.DEFAULT_KEY_COLUMN_SCROLLBAR) {
                cell['x-type'] = strings.DEFAULT_KEY_COLUMN_SCROLLBAR;
            }

            cell.colSpan = colSpan;
            cell.colEnd = cell.colStart + colSpan - 1;
            rows[rowIndex].push(cell);

            currentColIndex += colSpan;

            return colSpan;
        });

        return colSpans;
    }

    // Generate `rows` cell data
    fillRowCells(columns, 0);

    /**
     * Calculate header row merge rowSpan
     *  - If the current cell has no children, you need to calculate rowSpan, rowSpan = the total number of rows in the header-which row currently belongs to
     *  - If the current cell has children, there is no need to calculate rowSpan
     *
     * 计算表头行合并 rowSpan
     *  - 如果当前cell没有children，则需要计算rowSpan，rowSpan = 表头总行数 - 当前属于第几行
     *  - 如果当前cell有children，则无需计算rowSpan
     */
    const rowCount = rows.length;
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        rows[rowIndex].forEach((cell: TableHeaderCell) => {
            if (!('rowSpan' in cell) && !cell.hasSubColumns) {
                // eslint-disable-next-line no-param-reassign
                cell.rowSpan = rowCount - rowIndex;
            }
        });
    }

    return rows;
}

export interface TableHeaderProps extends BaseProps {
    columns?: any[];
    components?: TableComponents;
    fixed?: Fixed;
    forwardedRef?: React.MutableRefObject<HTMLDivElement> | ((instance: HTMLDivElement) => void);
    onDidUpdate?: (ref: React.MutableRefObject<any>) => void;
    onHeaderRow?: OnHeaderRow<any>;
    prefixCls?: string;
    selectedRowKeysSet: Set<any>;
}


/**
 * Render the header of the table header, and control the merging of the columns of the header
 */
class TableHeader extends BaseComponent<TableHeaderProps, Record<string, any>> {
    static propTypes = {
        components: PropTypes.any,
        columns: PropTypes.array,
        columnManager: PropTypes.object,
        prefixCls: PropTypes.string,
        onHeaderRow: PropTypes.func,
        onDidUpdate: PropTypes.func,
        fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        selectedRowKeysSet: PropTypes.instanceOf(Set).isRequired,
    };

    static defaultProps = {
        columns: [] as [],
        prefixCls: cssClasses.PREFIX,
        onHeaderRow: noop,
        onDidUpdate: noop,
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

    render() {
        const { components, columns, prefixCls, fixed, onHeaderRow, forwardedRef, selectedRowKeysSet } = this.props;

        const rows = parseHeaderRows(columns);

        const HeaderWrapper: any = components.header.wrapper;

        return (
            <HeaderWrapper className={`${prefixCls}-thead`} ref={forwardedRef}>
                {rows.map((row, idx) => (
                    <TableHeaderRow
                        prefixCls={prefixCls}
                        key={idx}
                        index={idx}
                        fixed={fixed}
                        columns={columns}
                        row={row}
                        components={components}
                        onHeaderRow={onHeaderRow}
                        selectedRowKeysSet={selectedRowKeysSet}
                    />
                ))}
            </HeaderWrapper>
        );
    }
}

export interface TableHeaderCell {
    key: string | number;
    className: string;
    children: ReactNode;
    column: any[];
    colStart: number;
    level: number;
    parents: any[];
    hasSubColumns?: boolean;
    rowSpan?: number;
    colSpan?: number;
    colEnd?: number;
}

export default React.forwardRef<HTMLDivElement, Omit<TableHeaderProps, 'forwardedRef'>>((props, ref) => <TableHeader {...props} forwardedRef={ref} />);
