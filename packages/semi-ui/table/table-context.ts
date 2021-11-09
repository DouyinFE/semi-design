/* eslint-disable max-len */
import React from 'react';
import { noop } from 'lodash';
import { ColumnProps, GetVirtualizedListRef } from './interface';

export interface TableContextProps {
    children?: React.ReactNode;
    anyColumnFixed?: boolean;
    flattenedColumns?: ColumnProps[];
    tableWidth?: number[];
    headWidths?: number[];
    setHeadWidths?: (headWidth?: number[], index?: number) => void;
    getHeadWidths?: (index?: number) => number[];
    getCellWidths?: (flattenColumns: ColumnProps[], flattenedWidths?: number[], ignoreScrollBarKey?: boolean) => number[];
    handleRowExpanded?: (expanded: boolean, realKey: string, domEvent: React.MouseEvent<HTMLElement>) => void;
    renderExpandIcon?: (record: Record<string, any>, isNested?: boolean, groupKey?: string | number) => React.ReactNode;
    renderSelection?: (record: Record<string, any>, isHeader?: boolean) => React.ReactNode;
    getVirtualizedListRef?: GetVirtualizedListRef;
    setBodyHasScrollbar?: (bodyHasScrollBar: boolean) => void;
}

const TableContext = React.createContext<TableContextProps>({
    headWidths: [],
    setHeadWidths: noop,
    handleRowExpanded: noop,
});

export default TableContext;
