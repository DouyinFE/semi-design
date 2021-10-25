import React from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import { Table, Tooltip, Tag } from '@douyinfe/semi-ui';

import JSXColumnsSimple from './JSXColumnsSmiple';
import JSXColumnsComplex from './JSXColumnsComplex';
import JSXColumnPropColumn from './JSXColumnPropColumn';

import ResizableColumns from './ResizableColumns';
import DragableTableDemo from './DragableTable';
import DynamicTableDemo from './DynamicTable';
import LinkedScroll from './LinkedScroll';
import ModalTable from './ModalTable';
import TabsTable from './TabsTable';
import EventTable from './EventTable';
import FnTable from './FnTable';
import DynamicFilters from './DynamicFilters';
import ResizableTable from './ResizableTable';
import ExpandDemo from './Expand';
import PaginationDemo from './PagintaionTable';
import SelectedRowsDemo from './SelectedRows';
import ChildrenData from './ChildrenData';
import ChildrenDataSelected from './ChildrenDataSelected';
import WithSideSheet from './WithSideSheet';
import InSideSheet from './InSideSheet';
import GroupedCols from './GroupedCols';
import GroupedColsFixed from './GroupedColsFixed';
import GroupedColsFixedJSX from './GroupedColsFixedJSX';
import GroupedColsFixedVirtualized from './GroupedColsFixedVirtualized';
import GroupedColsFixedVirtualizedGroups from './GroupedColsFixedVirtualizedGroups';
import GroupedRows from './GroupedRows';
import GroupedRowsFixed from './GroupedRowsFixed';
import FixedGroups from './FixedGroups';
import FixedExpandedRows from './FixedExpandedRows';
import FixedTable from './FixedTable';
import JSXFixedTable from './JSXFixedTable';
import JSXTitles from './JSXTitles';
import CustomComponents from './CustomComponents';
import CustomExpandIcons from './CustomExpandIcons';
import CustomFilterDropdownItem from './CustomFilterDropdownItem';

import VirtualizedDemo from './virtualized';
import VirtualizedFixedDemo from './virtualizedFixed';
import VirtualizedNotFixedDemo from './VirtualizedNotFixed';
import VirtualizedGroupedRows from './VirtualizedGroupedRows';
import VirtualizedDataSelected from './VritualizedDataSelected';
import VirtualizedDynamicData from './VirtualizedDynamicData';
import InfiniteScroll from './InfiniteScroll';
import MassiveColumns from './MassiveColumns';
import ControlledPagination from './ControlledPagination';
import FulldRenderDemo from './FullRender';
import VirtualTableOnCell from './VirtualTableOnCell';
import { 
        PerfVirtualized,
        PerfRender,
        PerfContext,
        ControlledSelection,
        PerfComplexRender,
        PerfResizableSelection,
        PerfOnRow
    } from './Perf';
import RenderPagination from './RenderPagination'
import { RTLAlignScrollBar } from './RTL';
import JSXAsyncData from './JSXAsyncData';
import ScrollBar from './ScrollBar';
import TableSpan from './TableSpan';
import ControlledSortOrder from './ControlledSortOrder';
import FilterWithNewDataTable from './FilterWithNewDataTable';
import FixRenderReturnProps from './FixRenderReturnProps';
import ExpandAllRows from './ExpandAllRows';
import ExpandAllGroupRows from './ExpandAllGroupRows';
import ExpandRowByClick from './ExpandRowByClick';

const stories = storiesOf('Table', module);
// // stories.addDecorator(withKnobs);;

// empty table

const emptyColumn = [
    {
        title: 'Name',
        dataIndex: 'name',
        fixed: 'left',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];
const emptyData = [];

stories.add('empty table', () => <Table autoWidth columns={emptyColumn} dataSource={emptyData} />);

// basic table

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
        render: text => <a>{text}</a>,
    },
    {
        title: 'combine',
        width: '20%',
        dataIndex: 'test',
        children: [
            {
                title: 'Age',
                width: '20%',
                children: [
                    {
                        title: 'Age1',
                        width: '20%',
                        dataIndex: 'age1',
                    },
                    {
                        title: 'Age2',
                        width: '20%',
                        dataIndex: 'age2',
                    },
                ],
            },
            {
                title: 'Key',
                width: '20%',
                dataIndex: 'key',
            },
        ],
    },
    {
        title: 'Address',
        width: '50%',
        dataIndex: 'address',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        age1: 23,
        age2: 11,
        address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        age1: 23,
        age2: 11,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        age1: 23,
        age2: 11,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        age1: 23,
        age2: 11,
        address: 'Sidney No. 1 Lake Park',
    },
];

stories.add('basic table', () => <Table columns={columns} dataSource={data} />);

stories.add('simple jsx', () => <JSXColumnsSimple />);

stories.add('complex jsx', () => <JSXColumnsComplex />);

// selection table

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};
stories.add('filter and update dataSource', () => <FilterWithNewDataTable />);
stories.add('selection table', () => <Table rowSelection={rowSelection} columns={columns} dataSource={data} />);

function ControlledSelectionTable() {
    const [selected, setSelected] = React.useState([]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: text => text,
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Michael James',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        },
    ];
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelected(selectedRowKeys);
        },
        getCheckboxProps: record => ({
            disabled:
                selected.length === 2 &&
                selected.findIndex(key => key === record.key) === -1, // Column configuration not to be checked
            name: record.name,
        }),
        selectedRowKeys: selected
    };
    return <Table columns={columns} dataSource={data} rowSelection={rowSelection} pagination={false} />;
}
stories.add('controlled selection table', () => <ControlledSelectionTable />);
// sortable table

const sortColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'Joe',
                value: 'Joe',
            },
            {
                text: 'Jim',
                value: 'Jim',
            },
            {
                text: 'Submenu',
                value: 'Submenu',
                children: [
                    {
                        text: 'Green',
                        value: 'Green',
                    },
                    {
                        text: 'Black',
                        value: 'Black',
                    },
                ],
            },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
        sortOrder: 'descend',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        filters: [
            {
                text: 'London',
                value: 'London',
            },
            {
                text: 'New York',
                value: 'New York',
            },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.address.indexOf(value) === 0,
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ['descend', 'ascend'],
    },
];

const sortData = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

stories.add('sort table', () => <Table columns={sortColumns} dataSource={sortData} />);
stories.add('controlled sortOrder table', () => <ControlledSortOrder />);

stories.add('middle table', () => <Table columns={columns} dataSource={data} size="middle" />);

stories.add('small table', () => <Table columns={columns} dataSource={data} size="small" />);

stories.add('expand table', () => <ExpandDemo />);

stories.add('resizable columns', () => <ResizableColumns />);

stories.add('dragable table', () => <DragableTableDemo />);
stories.add('fixed table', () => <FixedTable />);
stories.add('fixed jsx table', () => <JSXFixedTable />);
stories.add(`fixed expanded rows`, () => <FixedExpandedRows />);

stories.add(`jsx titles`, () => <JSXTitles />);

stories.add('dynamic table', () => (
    <div style={{ padding: 20 }}>
        <DynamicTableDemo />
    </div>
));

stories.add('linked scroll', () => <LinkedScroll />);

stories.add('modal table', () => <ModalTable />);

stories.add('tabs table', () => <TabsTable />);

stories.add('event table', () => <EventTable />);

stories.add('fn table', () => <FnTable />);

stories.add('dynamic filters', () => <DynamicFilters />);

stories.add('resizable table', () => <ResizableTable />);

stories.add('with pagination', () => <PaginationDemo />);
stories.add(`controlled pagination`, () => <ControlledPagination />);

stories.add('selected rows', () => <SelectedRowsDemo />);

stories.add('children data', () => <ChildrenData />);

stories.add('children data selected rows', () => <ChildrenDataSelected />);
stories.add(`with side sheet`, () => <WithSideSheet />);
stories.add(`in side sheet`, () => <InSideSheet />);
stories.add(`grouped rows`, () => <GroupedRows />);
stories.add(`grouped rows fixed`, () => <GroupedRowsFixed />);
stories.add(`grouped cols`, () => <GroupedCols />);
stories.add(`grouped cols fixed`, () => <GroupedColsFixed />);
stories.add(`grouped cols fixed jsx`, () => <GroupedColsFixedJSX />);

stories.add(`grouped cols fixed virtualized`, () => <GroupedColsFixedVirtualized />);
stories.add(`grouped cols fixed virtualized groups`, () => <GroupedColsFixedVirtualizedGroups />);

stories.add(`fixed groups`, () => <FixedGroups />);
stories.add(`custom components`, () => <CustomComponents />);
stories.add(`custom expand icons`, () => <CustomExpandIcons />);
stories.add(`custom filter dropdown item`, () => <CustomFilterDropdownItem />);
stories.add(`virtualized`, () => <VirtualizedDemo />);
stories.add(`virtualized fixed`, () => <VirtualizedFixedDemo />);
stories.add(`virtualized not fixed`, () => <VirtualizedNotFixedDemo />);
stories.add(`virtualized data selected`, () => <VirtualizedDataSelected />);
stories.add(`virtualized grouped rows`, () => <VirtualizedGroupedRows />);
stories.add(`virtualized dynamic data`, () => <VirtualizedDynamicData />);
stories.add(`infinite scroll`, () => <InfiniteScroll />);
stories.add(`massive columns`, () => <MassiveColumns />);
stories.add(`full render`, () => <FulldRenderDemo />);
stories.add(`VirtualTableOnCell`, () => <VirtualTableOnCell />);
stories.add(`Perf Virtualized`, () => <PerfVirtualized />);
stories.add(`Perf Render`, () => <PerfRender />);
stories.add(`Perf Complex Render`, () => <PerfComplexRender />);
stories.add(`Perf Controlled Selection`, () => <ControlledSelection />);
stories.add(`Perf Context`, () => <PerfContext />);
stories.add(`Perf Resizable Selection`, () => <PerfResizableSelection />);
stories.add(`Perf Render Row Times`, () => <PerfOnRow />);
stories.add(`renderPagination`, () => <RenderPagination />);
stories.add(`RTL align scroll bar`, () => <RTLAlignScrollBar />);
stories.add(`JSX aysnc data`, () => <JSXAsyncData />);
stories.add(`JSX column and prop clumns`, () => <JSXColumnPropColumn />);
stories.add(`scroll bar`, () => <ScrollBar />);
stories.add(`fix table rowSpan/colSpan`, () => <TableSpan />);
stories.add(`fix column render return props #1373`, () => <FixRenderReturnProps />);
stories.add('expandAllRows', () => <ExpandAllRows />);
stories.add('expandAllGroupRows', () => <ExpandAllGroupRows />);
stories.add('expandRowByClick', () => <ExpandRowByClick />);
stories.add('rowSelection boolean', () => <Table columns={columns} dataSource={data} rowSelection />);
