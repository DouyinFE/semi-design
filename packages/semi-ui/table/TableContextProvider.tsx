import React, { useMemo } from 'react';
import Context, { TableContextProps } from './table-context';

const TableContextProvider = ({
    children,
    anyColumnFixed,
    flattenedColumns,
    tableWidth,
    headWidths,
    setHeadWidths,
    getHeadWidths,
    getCellWidths,
    handleRowExpanded,
    renderExpandIcon,
    renderSelection,
    getVirtualizedListRef,
    setBodyHasScrollbar,
}: TableContextProps) => {
    const tableContextValue = useMemo(
        () => ({
            anyColumnFixed,
            flattenedColumns,
            renderExpandIcon,
            renderSelection,
            setHeadWidths,
            getHeadWidths,
            getCellWidths,
            headWidths,
            tableWidth,
            handleRowExpanded,
            getVirtualizedListRef,
            setBodyHasScrollbar,
        }),
        [
            anyColumnFixed,
            flattenedColumns,
            renderExpandIcon,
            renderSelection,
            setHeadWidths,
            getHeadWidths,
            getCellWidths,
            headWidths,
            tableWidth,
            handleRowExpanded,
            getVirtualizedListRef,
            setBodyHasScrollbar,
        ]
    );

    return <Context.Provider value={tableContextValue}>{children}</Context.Provider>;
};

export default TableContextProvider;
