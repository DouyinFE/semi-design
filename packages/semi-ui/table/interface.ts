/* eslint-disable max-len */
import React, { ReactNode, MutableRefObject } from 'react';

import { BaseProps } from '../_base/baseComponent';
import { PaginationProps } from '../pagination';
import { CheckboxProps } from '../checkbox';
import { DropdownProps } from '../dropdown';
import { Locale } from '../locale/interface';
import { ArrayElement } from '../_base/base';
import { strings } from '@douyinfe/semi-foundation/table/constants';
import {
    BaseRowKeyType,
    BaseSortOrder,
    BaseGroupBy,
    BaseGroupByFn,
    BaseFixed,
    BaseAlign,
    BaseChangeInfoSorter,
    BaseSorter,
    BaseFilter,
    BaseChangeInfoFilter,
    BaseIncludeGroupRecord
} from '@douyinfe/semi-foundation/table/foundation';
import { ScrollDirection, CSSDirection } from 'react-window';

export interface TableProps<RecordType extends Record<string, any> = any> extends BaseProps {
    bordered?: boolean;
    children?: ReactNode;
    childrenRecordName?: string;
    className?: string;
    clickGroupedRowToExpand?: boolean;
    columns?: ColumnProps<RecordType>[];
    components?: TableComponents;
    dataSource?: RecordType[];
    defaultExpandAllGroupRows?: boolean;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: (string | number)[];
    empty?: ReactNode;
    expandAllGroupRows?: boolean;
    expandAllRows?: boolean;
    expandCellFixed?: Fixed;
    expandIcon?: ExpandIcon;
    expandedRowKeys?: (string | number)[];
    expandedRowRender?: ExpandedRowRender<RecordType>;
    expandRowByClick?: boolean;
    footer?: Footer<RecordType>;
    getVirtualizedListRef?: GetVirtualizedListRef;
    groupBy?: GroupBy<RecordType>;
    hideExpandedColumn?: boolean;
    id?: string;
    indentSize?: number;
    loading?: boolean;
    pagination?: Pagination;
    prefixCls?: string;
    renderGroupSection?: RenderGroupSection;
    renderPagination?: RenderPagination;
    resizable?: Resizable<RecordType>;
    rowExpandable?: RowExpandable<RecordType>;
    rowKey?: RowKey<RecordType>;
    rowSelection?: RowSelection<RecordType>;
    scroll?: Scroll;
    showHeader?: boolean;
    size?: Size;
    style?: React.CSSProperties;
    title?: Title<RecordType>;
    virtualized?: Virtualized;
    onChange?: OnChange<RecordType>;
    onExpand?: OnExpand<RecordType>;
    onExpandedRowsChange?: OnExpandedRowsChange<RecordType>;
    onGroupedRow?: OnGroupedRow<RecordType>;
    onHeaderRow?: OnHeaderRow<RecordType>;
    onRow?: OnRow<RecordType>;
}

export interface ColumnProps<RecordType extends Record<string, any> = any> {
    [x: string]: any;
    align?: Align;
    children?: Array<ColumnProps<RecordType>>;
    className?: string;
    colSpan?: number;
    dataIndex?: string;
    defaultSortOrder?: SortOrder;
    filterChildrenRecord?: boolean;
    filterDropdown?: React.ReactNode;
    filterDropdownProps?: DropdownProps;
    filterDropdownVisible?: boolean;
    filterIcon?: FilterIcon;
    filterMultiple?: boolean;
    filteredValue?: any[];
    filters?: Filter[];
    fixed?: Fixed;
    key?: string | number;
    render?: ColumnRender<RecordType>;
    renderFilterDropdownItem?: RenderFilterDropdownItem;
    sortChildrenRecord?: boolean;
    sortOrder?: SortOrder;
    sorter?: Sorter<RecordType>;
    title?: ColumnTitle;
    useFullRender?: boolean;
    width?: string | number;
    onCell?: OnCell<RecordType>;
    onFilter?: OnFilter<RecordType>;
    onFilterDropdownVisibleChange?: OnFilterDropdownVisibleChange;
    onHeaderCell?: OnHeaderCell<RecordType>;
}

export type Align = BaseAlign;
export type SortOrder = BaseSortOrder;
export type FilterIcon = boolean | React.ReactNode | FilterIconRenderFunction;
export interface Filter extends BaseFilter {
    value?: any;
    text?: React.ReactNode;
    children?: Filter[];
}
export type Fixed = BaseFixed;
export type OnCell<RecordType> = (record?: RecordType, rowIndex?: number) => OnCellReturnObject;
export type OnFilter<RecordType> = (filteredValue?: any, record?: RecordType) => boolean;
export type OnFilterDropdownVisibleChange = (visible?: boolean) => void;
export type OnHeaderCell<RecordType> = (record?: RecordType, columnIndex?: number) => OnHeaderCellReturnObject;
export type ColumnRender<RecordType> = (text: any, record: RecordType, index: number, options?: RenderOptions) => ColumnRenderReturnType;
export type RenderFilterDropdownItem = (itemInfo?: FilterDropdownItem) => ReactNode;
export type Sorter<RecordType> = BaseSorter<RecordType>;
export type ColumnTitle = React.ReactNode | ((ColumnTitleProps?: ColumnTitleProps) => React.ReactNode);
export type FilterIconRenderFunction = (filtered: boolean) => React.ReactNode;
export type ColumnTitleProps = {
    sorter?: React.ReactNode;
    filter?: React.ReactNode;
    selection?: React.ReactNode;
};
export type ColumnRenderReturnType = React.ReactNode | RenderReturnObject;
export interface RenderReturnObject {
    [x: string]: any;
    children: React.ReactNode;
    props: {
        [x: string]: any;
        colSpan?: number;
        rowSpan?: number;
    };
}
export interface FilterDropdownItem {
    [x: string]: any;
    value?: any;
    text?: React.ReactNode;
    onChange?: React.MouseEventHandler<HTMLLIElement>;
    level?: number;
    filterMultiple?: boolean;
    checked?: boolean;
}
export interface RenderOptions {
    expandIcon?: React.ReactNode;
}
export interface OnCellReturnObject extends React.TdHTMLAttributes<HTMLElement> {
    [x: string]: any;
    style?: React.CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}
export interface OnHeaderCellReturnObject extends React.ThHTMLAttributes<HTMLElement> {
    [x: string]: any;
    style?: React.CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

interface OnRowReturnOmit {
    ref?: React.RefObject<any>;
}

export interface OnRowReturnObject extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>, keyof OnRowReturnOmit> {
    [x: string]: any;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
}
export interface OnGroupedRowReturnObject extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'className'> {
    [x: string]: any;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
}
export type OnHeaderRowReturnObject = Omit<React.HTMLAttributes<HTMLTableRowElement>, 'ref' | 'style'>;

export interface Scroll {
    x?: number | string;
    y?: number | string;
    scrollToFirstRowOnChange?: boolean;
}

export interface Data {
    [x: string]: any;
    key?: string | number;
}

export interface TableComponents {
    table?: ReactNode;
    header?: {
        outer?: ReactNode;
        wrapper?: ReactNode;
        row?: ReactNode;
        cell?: ReactNode;
    };
    body?: {
        outer?: ReactNode;
        wrapper?: ReactNode;
        row?: ReactNode;
        cell?: ReactNode;
        colgroup?: {
            wrapper?: ReactNode;
            col?: ReactNode;
        };
    };
    footer?: {
        wrapper?: ReactNode;
        row?: ReactNode;
        cell?: ReactNode;
        outer?: ReactNode;
    };
}

export interface RowSelectionProps<RecordType> {
    className?: string;
    disabled?: boolean;
    fixed?: Fixed;
    getCheckboxProps?: GetCheckboxProps<RecordType>;
    hidden?: boolean;
    selectedRowKeys?: (string | number)[];
    title?: ReactNode;
    width?: string | number;
    onChange?: RowSelectionOnChange<RecordType>;
    onSelect?: RowSelectionOnSelect<RecordType>;
    onSelectAll?: RowSelectionOnSelectAll<RecordType>;
}

export type GetCheckboxProps<RecordType> = (record: RecordType) => CheckboxProps;
export type RowSelectionOnChange<RecordType> = (selectedRowKeys?: (string | number)[], selectedRows?: RecordType[]) => void;
export type RowSelectionOnSelect<RecordType> = (
    record?: RecordType,
    selected?: boolean,
    selectedRows?: RecordType[],
    nativeEvent?: React.MouseEvent
) => void;
export type RowSelectionOnSelectAll<RecordType> = (selected?: boolean, selectedRows?: RecordType[], changedRows?: RecordType[]) => void;
export type ExpandIcon = ((expanded?: boolean) => React.ReactNode) | React.ReactNode | boolean;
export type ExpandedRowRender<RecordType> = (record?: RecordType, index?: number, expanded?: boolean) => React.ReactNode;
export type Footer<RecordType> = ReactNode | ((pageData?: RecordType[]) => React.ReactNode);
export type FormatPageText = ((pageInfo?: { currentStart?: number; currentEnd?: number; total?: number }) => React.ReactNode) | boolean;
export type GetVirtualizedListRef = (ref: MutableRefObject<any>) => void;
export type GroupByFunction<RecordType> = BaseGroupByFn<RecordType>;
export type GroupBy<RecordType> = BaseGroupBy<RecordType>;
export type Size = ArrayElement<typeof strings.SIZES>;
export type Title<RecordType> = React.ReactNode | ((pageData?: RecordType[]) => React.ReactNode);
export type PaginationPosition = ArrayElement<typeof strings.PAGINATION_POSITIONS>;
export type Pagination = TablePaginationProps | boolean;
export interface ChangeInfoFilter<RecordType> extends BaseChangeInfoFilter<RecordType> {
    filters?: Filter[];
    onFilter?: OnFilter<RecordType>;
}
export type ChangeInfoSorter<RecordType> = BaseChangeInfoSorter<RecordType>;
export interface ChangeInfo<RecordType> {
    pagination?: TablePaginationProps;
    filters?: ChangeInfoFilter<RecordType>[];
    sorter?: ChangeInfoSorter<RecordType>;
    extra?: Record<string, any>;
}
export type OnChange<RecordType> = (changeInfo: ChangeInfo<RecordType>) => void;
export type OnRow<RecordType> = (record?: RecordType, index?: number) => OnRowReturnObject;
export type OnGroupedRow<RecordType> = (record?: RecordType, index?: number) => OnGroupedRowReturnObject;
export type OnHeaderRow<RecordType> = (columns?: ColumnProps<RecordType>[], index?: number) => OnHeaderRowReturnObject;
export type OnExpandedRowsChange<RecordType> = (expandedRows?: IncludeGroupRecord<RecordType>[]) => void;
export type OnExpand<RecordType> = (expanded?: boolean, record?: IncludeGroupRecord<RecordType>, mouseEvent?: React.MouseEvent) => void;
export type RenderGroupSection = (groupKey?: string | number, group?: (string | number)[]) => ReactNode | {
    [x: string]: any;
    children: ReactNode;
};
export type RenderPagination = (paginationProps: TablePaginationProps) => ReactNode;
export type RowExpandable<RecordType> = (record?: RecordType) => boolean;
export type RowKey<RecordType> = BaseRowKeyType | ((record?: RecordType) => string);
export type RowSelection<RecordType> = RowSelectionProps<RecordType> | boolean;

export type VirtualizedOnScrollArgs = {
    scrollDirection?: ScrollDirection;
    scrollOffset?: number;
    scrollUpdateWasRequested?: boolean;
};
export type VirtualizedMode = 'list' | 'grid';
export type VirtualizedItemSizeFn = (index?: number) => number;
export type VirtualizedItemSize = number | VirtualizedItemSizeFn;
export type VirtualizedOnScroll = (object: VirtualizedOnScrollArgs) => void;
export interface VirtualizedProps {
    [x: string]: any;
    mode?: VirtualizedMode;
    itemSize?: VirtualizedItemSize;
    onScroll?: VirtualizedOnScroll;
}
export type Virtualized = boolean | VirtualizedProps;

export interface TablePaginationProps extends BaseProps, PaginationProps {
    position?: PaginationPosition;
    formatPageText?: FormatPageText;
}

export type Resizable<RecordType> = ResizableProps<RecordType> | boolean;
export interface ResizableProps<RecordType> {
    onResize?: ResizeFn<RecordType>;
    onResizeStart?: ResizeFn<RecordType>;
    onResizeStop?: ResizeFn<RecordType>;
}
export type ResizeFn<RecordType> = (column: RecordType) => RecordType;

export interface BodyScrollEvent extends React.UIEvent {
    [x: string]: any;
    currentTarget: any;
    target: any;
}

export type BodyScrollPosition = 'both' | 'middle' | 'left' | 'right';

export type TableLocale = Locale['Table'];
export type Direction = CSSDirection;
export type IncludeGroupRecord<RecordType> = BaseIncludeGroupRecord<RecordType>;