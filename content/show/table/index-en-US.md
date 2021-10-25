---
localeCode: en-US
order: 56
category: Show
title: Table
subTitle: Table
icon: doc-table
dir: column
brief: Show row data.
---

## When to Use

-   When there is a large amount of structured data to be presented;
-   When complex behaviors such as sorting, searching, paging and customizing data need to be performed.

## How to Use

Into the header. `columns` And data. `DataSource` To render.

> Please provide a "key" for each data item in the dataSource that is different from the value of the other data items, or use the row Key parameter to specify an attribute name as the primary key, alternative row operation functions such as row selection and expansion of the table.

```jsx noInline=true import
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                Data Index: 'name',
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

        this.data = [
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
    }

    render() {
        <Table columns={this.columns} dataSource={this.data} />;
    }
}
```

## Demos

### Basic Table

For tables, the two most basic parameters are `dataSource` and `columns`, the former is the data item, the latter is the configuration of each column, both are array types.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                render: (text, record, index) => {
                    console.log(text, record, index);
                    return <a>{text}</a>;
                },
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
        this.data = [
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
    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} Pagination={false} />;
    }
}

render(App);
```

### JSX Writing

You can also use JSX syntax definitions `columns`, note that Table only supports `columns` JSX syntax definition. You cannot use any component package `Table.Column`.

> Note: JSX-written tables are not supported the parameter `Resizable`.

<Notice type="primary" title="Notice">
    <div>When columns are written in JSX, please do not use it at the same time as the configuration method; if used at the same time, only the configuration method will take effect, and no aggregation operation will be performed.</div>
</Notice>

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

const { Column } = Table;

class App extends React.Component {
    constructor() {
        this.data = [
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
    }

    render() {
        return (
            <Table dataSource={this.data} Pagination={false}>
                <Column title="Name" dataIndex="name" key="name" render={(text, record, index) => <a>{text}</a>} />
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
            </Table>
        );
    }
}

render(App);
```

### Line Selection Operation

This feature can be turned on by passing in `rowSelection`.

> Note: Be sure to provide a "key" for each row of data that is different from other row values, or use the rowKey parameter to specify a property name as the primary key.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
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
        this.data = [
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
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };
    }

    render() {
        return (
            <Table columns={this.columns} dataSource={this.data} rowSelection={this.rowSelection} pagination={false} />
        );
    }
}

render(App);
```

### Custom Rendering

Users can use Column.render to customize the rendering of a column of cells, which is suitable for rendering more complex cell content.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Button } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';

class TableApp extends React.Component {
    constructor(props) {
        super(props);

        this.raw = [
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

        this.state = {
            dataSource: [...this.raw],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    width: 200,
                    render: text => <a>{text}</a>,
                },
                {
                    width: 90,
                    title: 'Age',
                    dataIndex: 'age',
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                },
                {
                    title: 'Operation',
                    width: 150,
                    render: (text, record) => (
                        <Button icon={<IconDelete />}theme="borderless" onClick={() => this.removeRecord(record.key)} />
                    ),
                },
            ],
        };
    }

    removeRecord(key) {
        let dataSource = [...this.state.dataSource];
        if (key != null) {
            let idx = dataSource.findIndex(data => data.key === key);

            // console.log(key, dataSource, idx);

            if (idx > -1) {
                dataSource.splice(idx, 1);
                this.setState({ dataSource });
            }
        }
    }

    resetData() {
        let dataSource = [...this.raw];
        this.setState({ dataSource });
    }

    render() {
        let { columns, dataSource } = this.state;

        return (
            <>
                <Button onClick={() => this.resetData()} style={{ marginBottom: 10 }}>
                    Reset
                </Button>
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </>
        );
    }
}

render(TableApp);
```

### Table With Pagination

Table paging currently supports two modes: controlled and uncontrolled.

-   In controlled mode, the paging state is passed entirely externally, depending on whether the pagination .currentPage field is passed. In general, the controlled mode is suitable for remotely pulling data and rendering.
-   In uncontrolled mode, Table passes the incoming dataSource length as total to the Pagination component by default, and of course you can also pass a total field to overwrite the value of the Table component, but we do not recommend users to pass this field in uncontrolled paging mode.

> Note: The custom `pagination.total` field passed in uncontrolled conditions is supported only after version 0.25.0.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class TableApp extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                filters: [
                    {
                        text: 'King 3',
                        value: 'King 3',
                    },
                    {
                        text: 'King 4',
                        value: 'King 4',
                    },
                ],
                onFilter: (value, record) => record.name.includes(value),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                dataIndex: 'address',
            },
        ];

        this.data = [];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        for (let i = 0; i < 46; i++) {
            this.data.push({
                key: '' + i,
                name: `Edward King ${i}`,
                age: 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3),
                address: `London, Park Lane no. ${i}`,
            });
        }

        this.scroll = { y: 300 };
    }

    render() {
        return (
            <Table
                columns={this.columns}
                dataSource={this.data}
                rowSelection={this.rowSelection}
                scroll={this.scroll}
            />
        );
    }
}

render(TableApp);
```

<Notice type="primary" title="Notice">
    <div>When pagination is an object type, literal is not recommended because it causes the table to render to its original state (it looks like the pager is not working). Please try to define reference type parameters outside the render method. If hooks are used, please use useMemo or useState for storage.</div>
</Notice>

### Pull Remote Data

Under normal circumstances, the data is often not obtained at one time. We will retrieve the data from the interface when clicking on the page number, filter or sort button. In this case, please use **Controlled mode** To handle pagination. The user needs to pass in the `pagination.currentPage` field, where the rendering of the pagination component depends entirely on the incoming pagination object.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
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

        const data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                key: '' + i,
                name: `Edward King ${i}`,
                age: 32,
                address: `London, Park Lane no. ${i}`,
            });
        }
        this.data = data;

        this.fetchData = (currentPage = 1) => {
            // console.log(`FetchData currentPage: `, currentPage);
            this.setState({ loading: true });
            let pagination = { ...this.state.pagination, currentPage };
            return new Promise((res, rej) => {
                setTimeout(() => {
                    let dataSource = this.data.slice(
                        (currentPage - 1) * pagination.pageSize,
                        currentPage * pagination.pageSize
                    );
                    res(dataSource);
                }, 1500);
            }).then(dataSource => {
                // console.log('Request data: ', dataSource);
                this.setState({
                    loading: false,
                    pagination,
                    dataSource,
                });
            });
        };

        this.state = {
            loading: false,
            columns,
            pagination: {
                currentPage: 1,
                pageSize: 5,
                total: data.length,
                onPageChange: page => this.fetchData(page),
            },
            dataSource: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        let { columns, dataSource, pagination, loading } = this.state;

        return <Table columns={columns} dataSource={dataSource} pagination={pagination} loading={loading} />;
    }
}

render(App);
```

### Fixed Column or Head

You can fix the column by setting the Fixed attribute of the column and scoll.x, and fix the header by setting scoll.y.

> -   Make sure that all elements inside the table do not affect the height of the cells after rendering (e.g. containing unloaded pictures, etc.). In this case, give the stator element a definite height to ensure that the left and right Fixed columns of cells are not deranged.
> -   If the column header is not aligned with the content or there is a column duplication, specify the width width of the fixed column. If the specified width is not effective, try to recommend leaving a column with no width to accommodate the elastic layout, or check for ultra-long continuous fields to destroy the layout.
> -   It is recommended to specify scroll.x as a **fixed value** or percentage greater than the width of the table. It is recommended to set a fixed value of `>= the sum of all fixed column widths + the sum of all table column widths`.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tooltip, Tag } from '@douyinfe/semi-ui';

class TableApp extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                fixed: true,
                filters: [
                    {
                        text: 'King 3',
                        value: 'King 3',
                    },
                    {
                        text: 'King 4',
                        value: 'King 4',
                    },
                ],
                onFilter: (value, record) => record.name.includes(value),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                width: 200,
                dataIndex: 'address',
            },
            {
                title: 'Description',
                // width: 400,
                dataIndex: 'description',
            },
            {
                fixed: 'right',
                width: 250,
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.data = [];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }

        this.scroll = { y: 300, x: 1500 };
    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} scroll={this.scroll} />;
    }
}

render(TableApp);
```

### Table Header With Sorting and Filtering Function

Filters and sorting controls are integrated inside the table, and users can pass in the sorter display of the sorter open header by passing filters in Column and the filter control display of the onFilter open header.

> Note: Be sure to provide a "key" for each row of data that is different from other row values, or use the rowKey parameter to specify a property name as the primary key.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.state = {
            sortColumns: [
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
                    ],
                    onFilter: (value, record) => record.name.indexOf(value) === 0,
                    sorter: (a, b) => a.name.length - b.name.length,
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
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
                },
            ],
            sortData: [
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
            ],
        };

        this.onChange = (...args) => {
            console.log('Table changed to:', ...args);
        };
    }

    render() {
        return <Table columns={this.state.sortColumns} dataSource={this.state.sortData} onChange={this.onChange} />;
    }
}

render(App);
```

### Custom Filter Item Rendering

Since the **1.1.0** version, it is supported to pass in `renderFilterDropdownItem` to customize the rendering method of each filter item.

This method accepts an `Object` input parameter, and the meaning of each attribute is as follows:

-   `onChange: e => void` current filter item selection/reverse selection event;
-   `text: ReactNode` copy of the current screening item;
-   `value: any` the value of the current filter item;
-   `checked: boolean` whether the current filter item has been selected;
-   `filteredValue: any[]` all currently filtered values;
-   `level: number` is the level of the current filter item, if it is a nested filter item, the value will be >= 1;
-   `filterMultiple: boolean` whether the current filter item is multi-select.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tag, Tooltip, Dropdown } from '@douyinfe/semi-ui';

class CustomDropdownItem extends React.Component {
    constructor(props = {}) {
        super(props);

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                fixed: true,
                filterMultiple: false,
                filters: [
                    {
                        text: 'Code 45',
                        value: '45',
                    },
                    {
                        text: 'King 4',
                        value: 'King 4',
                    },
                ],
                onFilter: (value, record) => record.name.includes(value),
                renderFilterDropdownItem: ({ text, checked, onChange }) => (
                    <Dropdown.Item onClick={onChange} active={checked}>
                        {text}
                    </Dropdown.Item>
                ),
                filterDropdownProps: {
                    showTick: true,
                },
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                width: 200,
                dataIndex: 'address',
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
            {
                fixed: 'right',
                width: 250,
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.data = [];

        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }

        this.scroll = { y: 400, x: '150%' };
    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} scroll={this.scroll} />;
    }
}

render(CustomDropdownItem);
```

### A Table That Can Be Expanded

> Notice:
>
> -   Since version `0.27.0`, the unfold button will be rendered in the same cell as the first column, and you can open a separate column of rendering by passing in `hideExpandedColumn = {false}`.
> -   Be sure to provide a "key" for each row of data that is different from the other row values, or use the rowKey parameter to specify an attribute name as the primary key.

#### A Common Table That Can Be Expanded

If you need to render a table that can be expanded, in addition to the need to pass `expandedRowRender` In addition to this method, you must specify `rowKey`(by default `key`), Table will be based on `rowKey` Gets a row unique identifier.

-   If `rowKey` is a Function, the result of `rowKey(record)` is taken as the row unique ID
-   If `rowKey` is a string type, you take `record[rowKey]` as the row unique ID

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.expandColumns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Age', dataIndex: 'age', key: 'age' },
            { title: 'Address', dataIndex: 'address', key: 'address' },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: () => <a>Delete</a>,
            },
        ];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        this.expandData = [
            {
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
            },
            {
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
            },
        ];

        this.expandRowRender = (record, index) =>
            index < 2 ? (
                <Table columns={this.expandColumns} dataSource={this.expandData} />
            ) : (
                <p>{record.description}</p>
            );
    }
    render() {
        return (
            <Table
                rowKey={'name'}
                columns={this.expandColumns}
                rowSelection={this.rowSelection}
                expandedRowRender={this.expandRowRender}
                dataSource={this.expandData}
            />
        );
    }
}

render(App);
```

#### The Unfold Button Is Rendered In a Separated Column

**Version: >= 0.27.0**

By default, the expansion button will be rendered in the same cell as the first copy, and you can enter `hideExpandedColumn={false}` to render as a separate column:

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.expandColumns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Age', dataIndex: 'age', key: 'age' },
            { title: 'Address', dataIndex: 'address', key: 'address' },
            {
                expandIcon: true,
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: () => <a>Delete</a>,
            },
        ];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        this.expandData = [
            {
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
            },
            {
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
            },
        ];

        this.expandRowRender = record => <p>{record.description}</p>;
    }
    render() {
        return (
            <Table
                hideExpandedColumn={false}
                rowKey={'name'}
                columns={this.expandColumns}
                rowSelection={this.rowSelection}
                expandedRowRender={this.expandRowRender}
                dataSource={this.expandData}
            />
        );
    }
}

render(App);
```

#### Turn Off Rendering of Expandable Button of a Row

**Version: > = 0.27.0**

You can pass the row Expandable method, enter the reference as record, and determine whether the return value is false to close the rendering of the expandable button on a row.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.expandColumns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Age', dataIndex: 'age', key: 'age' },
            { title: 'Address', dataIndex: 'address', key: 'address' },
            {
                expandIcon: true,
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: () => <a>Delete</a>,
            },
        ];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        this.expandData = [
            {
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
            },
            {
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
            },
        ];

        this.expandRowRender = record => <p>{record.description}</p>;
    }
    render() {
        return (
            <Table
                hideExpandedColumn={false}
                rowKey={'name'}
                columns={this.expandColumns}
                rowExpandable={record => record.name !== 'Jim Green'}
                rowSelection={this.rowSelection}
                expandedRowRender={this.expandRowRender}
                dataSource={this.expandData}
            />
        );
    }
}

render(App);
```

### Tree Data Display

**Version: > = 0.27.0**

The table supports the display of tree data and is automatically displayed as a tree table when there are children fields in the data. If you do not need or use other fields, you can configure it with the childrenRecordName. In addition, you can control the indent width of each layer by setting indent Size.

> Note: Be sure to provide a "key" for each row of data that is different from the other row values, or use the `rowKey` parameter to specify a property name as the primary key.

#### Simple example of tree data

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

const Demo = () => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 150,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 400,
        },
    ];

    const data = [
        {
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
                {
                    key: 11,
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                },
                {
                    key: 12,
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [
                        {
                            key: 121,
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                    ],
                },
                {
                    key: 13,
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [
                        {
                            key: 131,
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                                {
                                    key: 1311,
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park',
                                },
                                {
                                    key: 1312,
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            key: 2,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ];

    return <Table columns={columns} defaultExpandAllRows dataSource={data} />;
};

render(Demo);
```

#### Rows of Interchangeable Tree Data

**Version: > = 0.27.0**

You can do row switching by changing the order of the dataSource elements.

```jsx live=true noInline=true dir="column"
import React, { useState } from 'react';
import { Table, Button } from '@douyinfe/semi-ui';
import { IconArrowUp, IconArrowDown } from '@douyinfe/semi-icons';

const Demo = () => {
    const childrenRecordName = 'children';
    const rowKey = 'key';
    const [expandedRowKeys, setExpandedRowKeys] = useState([1, 2]);
    const [data, setData] = useState([
        {
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
                {
                    key: 11,
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park',
                },
                {
                    key: 12,
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [
                        {
                            key: 121,
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                    ],
                },
                {
                    key: 13,
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [
                        {
                            key: 131,
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                                {
                                    key: 1311,
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park',
                                },
                                {
                                    key: 1312,
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            key: 2,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]);

    const switchRecord = (key1, key2) => {
        const newData = [...data];

        if (key1 != null && key2 != null) {
            const item1 = findRecordByKey(key1, newData);
            const item2 = findRecordByKey(key2, newData);

            // you have to copy item1 and item2 first
            const copiedItem1 = { ...item1 };
            const copiedItem2 = { ...item2 };

            coverRecord(item1, copiedItem2);
            coverRecord(item2, copiedItem1);

            setData(newData);
        }
    };

    const findRecordByKey = (key, data) => {
        if (Array.isArray(data) && data.length && key != null) {
            for (let item of data) {
                if (item[rowKey] === key) {
                    return item;
                }

                const children = item[childrenRecordName];
                if (Array.isArray(children) && children.length) {
                    const item = findRecordByKey(key, children);

                    if (item != null) {
                        return item;
                    }
                }
            }
        }
    };

    const coverRecord = (obj, srcObj) => {
        if (obj && typeof obj === 'object' && srcObj && typeof srcObj === 'object') {
            const srcKeys = Object.keys(srcObj);
            const copied = { ...srcObj };

            Object.assign(obj, copied);

            Object.keys(obj).forEach(key => {
                if (!srcKeys.includes(key)) {
                    delete obj[key];
                }
            });
        }

        return obj;
    };

    const getSameLevelRecords = (key, data = []) => {
        if (key != null && Array.isArray(data) && data.length) {
            if (data.find(item => item[rowKey] === key)) {
                return data;
            }
            for (let item of data) {
                const records = getSameLevelRecords(key, item[childrenRecordName]);

                if (records.length) {
                    return records;
                }
            }
        }
        return [];
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 150,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            key: 'operation',
            render: record => {
                const records = getSameLevelRecords(record[rowKey], data);
                const index = records.findIndex(item => item[rowKey] === record[rowKey]);
                const upProps = {};
                const downProps = {};

                if (index > 0) {
                    const upRow = records[index - 1];
                    upProps.onClick = () => switchRecord(record[rowKey], upRow[rowKey]);
                } else {
                    upProps.disabled = true;
                }

                if (index < records.length - 1) {
                    const downRow = records[index + 1];
                    downProps.onClick = () => switchRecord(record[rowKey], downRow[rowKey]);
                } else {
                    downProps.disabled = true;
                }

                return (
                    <>
                        <Button icon={<IconArrowUp />} {...upProps} />
                        <Button icon={<IconArrowDown />} {...downProps} />
                    </>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            rowKey={rowKey}
            childrenRecordName={childrenRecordName}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={rows => setExpandedRowKeys(rows.map(item => item[rowKey]))}
            dataSource={data}
        />
    );
};

render(Demo);
```

#### Tree Selection

**Version: >=0.27.0**

By default, the row selection of the table is independent. You can simulate a tree selection by defining selectedRowKeys.

```jsx live=true noInline=true dir="column"
import { Table } from '@douyinfe/semi-ui';
import React, { useMemo, useState, useCallback } from 'react';
import { get, filter, some, map } from 'lodash-es';

const getKey = (record, rowKey) => (typeof rowKey === 'function' ? rowKey(rowKey) : get(record, rowKey));

const storeKeys = (parent = null, dataSource = [], map = {}, rowKey = 'key', childrenRecordName = 'children') => {
    if (Array.isArray(dataSource) && dataSource.length) {
        dataSource.forEach(record => {
            const key = getKey(record, rowKey);
            const children = get(record, childrenRecordName);

            if (Array.isArray(children) && children.length) {
                storeKeys(record, children, map, rowKey, childrenRecordName);
            }

            if (parent) {
                if (Array.isArray(map[key])) {
                    map[key].push(parent);
                } else {
                    map[key] = [parent];
                }
            }
        });
    }

    return map;
};

const ChildrenDataSelectedDemo = (props = {}) => {
    const childrenRecordName = 'children';
    const rowKey = 'key';
    const [expandedRowKeys, setExpandedRowKeys] = useState([1, 2]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const getRecordKey = useCallback(record => getKey(record, rowKey), [rowKey]);
    const disabledRecord = useCallback(
        record => {
            const children = get(record, childrenRecordName);
            return !(Array.isArray(children) && children.length);
        },
        [childrenRecordName]
    );

    const data = useMemo(
        () => [
            {
                key: 1,
                name: 'John Brown sr.',
                age: 60,
                address: 'New York No. 1 Lake Park',
                children: [
                    {
                        key: 11,
                        name: 'John Brown',
                        age: 42,
                        address: 'New York No. 2 Lake Park',
                    },
                    {
                        key: 12,
                        name: 'John Brown jr.',
                        age: 30,
                        address: 'New York No. 3 Lake Park',
                        children: [
                            {
                                key: 121,
                                name: 'Jimmy Brown',
                                age: 16,
                                address: 'New York No. 3 Lake Park',
                            },
                        ],
                    },
                    {
                        key: 13,
                        name: 'Jim Green sr.',
                        age: 72,
                        address: 'London No. 1 Lake Park',
                        children: [
                            {
                                key: 131,
                                name: 'Jim Green',
                                age: 42,
                                address: 'London No. 2 Lake Park',
                                children: [
                                    {
                                        key: 1311,
                                        name: 'Jim Green jr.',
                                        age: 25,
                                        address: 'London No. 3 Lake Park',
                                    },
                                    {
                                        key: 1312,
                                        name: 'Jimmy Green sr.',
                                        age: 18,
                                        address: 'London No. 4 Lake Park',
                                    },
                                ],
                            },
                            {
                                key: 132,
                                name: 'Jack Green',
                                age: 48,
                                address: 'London No. 3 Lake Park',
                                children: [
                                    {
                                        key: 1321,
                                        name: 'Jack Green jr.',
                                        age: 35,
                                        address: 'London No. 31 Lake Park',
                                    },
                                    {
                                        key: 1322,
                                        name: 'Jack Green sr.',
                                        age: 28,
                                        address: 'London No. 41 Lake Park',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                key: 2,
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            },
        ],
        []
    );
    const keysMap = useMemo(() => storeKeys(null, data, {}, rowKey, childrenRecordName), [
        data,
        rowKey,
        childrenRecordName,
    ]);

    const getCheckboxProps = useCallback(
        record => {
            const children = get(record, childrenRecordName);
            const allChildrenKeys = filter(children, child => !disabledRecord(child)).map(getRecordKey);
            const checkboxProps = {};

            if (Array.isArray(children) && children.length) {
                const hasChildSelected = record => {
                    if (selectedRowKeys.includes(getRecordKey(record))) {
                        return true;
                    }

                    const children = get(record, childrenRecordName);
                    const validChildren = filter(children, child => !disabledRecord(child));

                    if (!validChildren.length) {
                        return false;
                    }

                    if (some(validChildren, child => hasChildSelected(child))) {
                        return true;
                    }
                    return false;
                };

                const someSelected = some(children, hasChildSelected);
                const allSelected =
                    allChildrenKeys.length && allChildrenKeys.every(key => selectedRowKeys.includes(key));

                if (!allSelected && someSelected) {
                    checkboxProps.indeterminate = true;
                    checkboxProps.checked = false;
                }
            } else {
                checkboxProps.disabled = true;
            }

            return checkboxProps;
        },
        [selectedRowKeys, disabledRecord, getRecordKey]
    );

    const doSelect = useCallback(
        (record, selected) => {
            const key = getRecordKey(record, rowKey);

            const children = get(record, childrenRecordName, []);
            const parents = get(keysMap, key);
            const set = new Set([...selectedRowKeys]);

            if (selected) {
                set.add(key);
            } else {
                set.delete(key);
            }

            const selectChildren = (selected = false, children = []) => {
                if (typeof disabledRecord === 'function') {
                    children = filter(children, child => !disabledRecord(child));
                }
                if (Array.isArray(children) && children.length) {
                    each(children, child => {
                        const key = getKey(child, rowKey);
                        const curChildren = get(child, childrenRecordName);

                        if (selected) {
                            set.add(key);
                        } else {
                            set.delete(key);
                        }
                        selectChildren(selected, curChildren);
                    });
                }
            };

            selectChildren(selected, children);

            each(parents, parent => {
                const childrenKeys = get(parent, childrenRecordName, [])
                    .filter(parentChild => !disabledRecord(parentChild))
                    .map(getRecordKey);

                const allSelected = childrenKeys.length && childrenKeys.every(key => set.has(key));
                const parentKey = getRecordKey(parent);

                if (allSelected) {
                    set.add(parentKey);
                } else {
                    set.delete(parentKey);
                }
                return false;
            });

            setSelectedRowKeys(Array.from(set));
        },
        [selectedRowKeys, keysMap, disabledRecord, rowKey, childrenRecordName]
    );

    const doSelectAll = useCallback((selected, selectedRows) => {
        const keys = selected ? map(selectedRows, row => getRecordKey(row, rowKey)) : [];
        setSelectedRowKeys(keys);
    }, []);

    const rowSelection = useMemo(
        () => ({
            getCheckboxProps,
            selectedRowKeys,
            onSelect: doSelect,
            onSelectAll: doSelectAll,
        }),
        [selectedRowKeys, getCheckboxProps, doSelect, doSelectAll]
    );

    const columns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 300,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: 150,
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
        ],
        []
    );
    return (
        <Table
            columns={columns}
            rowKey={rowKey}
            childrenRecordName={childrenRecordName}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={rows => setExpandedRowKeys(rows.map(item => item[rowKey]))}
            rowSelection={rowSelection}
            dataSource={data}
        />
    );
}

render(ChildrenDataSelectedDemo);
```

### Custom Row or Cell Events and Properties

-   The incoming `onRow` / `onHeaderRow` can define the native event or property of a table or table header line.
-   The incoming `Column.onCell` / `Column.onHeaderCell` can define a table or header cell native event or property.

In principle, the properties or events supported on tr / td / th can be defined. For example:

-   The tr at the head of the watch defines onMouseEnter / onMouseLeave
-   The tr of the table defines className
-   The third line of the table defines onClick.

```jsx live=true noInline=true dir="column"
import React, { useMemo } from 'react';
import { Table, Tooltip, Tag } from '@douyinfe/semi-ui/';

function EventTable(props = {}) {
    const dataTotalSize = 46;

    const columns = useMemo(
        () => [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            },
            {
                title: 'Address',
                dataIndex: 'address',
            },
            {
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
                width: 150,
            },
        ],
        []
    );

    const data = useMemo(() => {
        const _data = [];
        for (let i = 0; i < dataTotalSize; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            _data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i} Lake Park`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }
        return _data;
    }, []);

    const onRow = useMemo(
        () => (record, index) => {
            const props = {
                className: 'my-tr-class',
            };

            if (index === 2) {
                return {
                    ...props,
                    onClick: e => console.log('mouse click: ', record, index),
                };
            } else {
                return {
                    ...props,
                };
            }
        },
        []
    );
    const onHeaderRow = useMemo(
        () => (columns, index) => {
            return {
                onMouseEnter: e => console.log('mouse enter: ', columns, index),
                onMouseLeave: e => console.log('mouse leave: ', columns, index),
            };
        },
        []
    );

    return <Table columns={columns} dataSource={data} onRow={onRow} onHeaderRow={onHeaderRow} />;
}

render(EventTable);
```

### Resizable Column

Version > = 0.15.0

#### Basic Resizable Column

For some columns with more content, you can choose to turn on the telescopic column function and pull and pull at the head to realize the real-time change of column width.

But you need to pay attention to some parameters:

-   `resizable` is set to `true` or an `object`
-   Any column in `columns` that requires a telescopic function should specify the `width`field (if not passed, the column does not have a telescopic function and its column width will be automatically adjusted by the browser)

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tooltip, Tag } from '@douyinfe/semi-ui';

class ResizableDemo extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                width: 200,
                dataIndex: 'address',
            },
            {
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.data = [];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }
    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} resizable bordered />;
    }
}

render(ResizableDemo);
```

#### Advanced Telescopic Columns

`resizable` can also be an `object`, including three event methods:

-   onResize
-   onResizeStart
-   onResizeStop

These three callback will be triggered on `changing column width`、`start changing column width` and `stop changing column width` respectively. Developers can choose to modify the column at this time, such as adding a vertical line effect when dragging, as shown below.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tooltip, Tag } from '@douyinfe/semi-ui';
import { addClass, removeClass } from '@douyinfe/semi-foundation/utils';

class ResizableDemo extends React.Component {
    constructor() {
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            },
            {
                title: 'Address',
                width: 200,
                dataIndex: 'address',
            },
            {
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.data = [];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        };

        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }

        this.resizable = {
            onResizeStart: curColumn => {
                const className = addClass(curColumn.className, 'my-resizing');

                return { className };
            },
            onResizeStop: curColumn => {
                const className = removeClass(curColumn.className, 'my-resizing');

                return { className };
            },
        };

        this.pagination = {
            pageSize: 5,
        };
    }

    render() {
        return (
            <div id="components-table-demo-resizable-column">
                <Table
                    columns={this.columns}
                    dataSource={this.data}
                    resizable={this.resizable}
                    pagination={this.pagination}
                    bordered
                />
            </div>
        );
    }
}

render(ResizableDemo);
```

The CSS style definition used in this example:

```css
#components-table-demo-resizable-column .my-resizing {
    border-right: 2px solid red;
}

#components-table-demo-resizable-column .react-resizable-handle:hover {
    background-color: red;
}

#components-table-demo-resizable-column .my-resizing:hover .react-resizable-handle {
    background-color: inherit;
}
```

### Drag Sorting

With custom elements, we can integrate `react-dnd` To implement drag and drop sorting.

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Table, Tooltip, Tag } from '@douyinfe/semi-ui';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

let dragingIndex = -1;

class BodyRow extends React.Component {
    render() {
        const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let { className } = restProps;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += ' drop-over-downward';
            }
            if (restProps.index < dragingIndex) {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
    }
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        props.moveRow(dragIndex, hoverIndex);

        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource('row', rowSource, connect => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow)
);

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 150,
        filters: [
            {
                text: 'King 3',
                value: 'King 3',
            },
            {
                text: 'King 4',
                value: 'King 4',
            },
        ],
        onFilter: (value, record) => record.name.includes(value),
    },
    {
        title: 'Age',
        dataIndex: 'age',
        width: 150,
        sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
    },
    {
        title: 'Address',
        width: 200,
        dataIndex: 'address',
    },
    {
        render: (text, record) => (
            <Tooltip content={record.description}>
                <Tag color="green">Show Info</Tag>
            </Tooltip>
        ),
    },
];

class DragSortingTableDemo extends React.Component {
    constructor() {
        this.data = [];
        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }

        this.state = {
            data: [...this.data],
        };

        this.components = {
            body: {
                row: DragableBodyRow,
            },
        };

        this.pagination = {
            pageSize: 5,
        };

        this.moveRow = (dragIndex, hoverIndex) => {
            const { data } = this.state;
            const dragRow = data[dragIndex];

            const newData = [...data];
            newData.splice(dragIndex, 1);
            newData.splice(hoverIndex, 0, dragRow);
            this.setState({ data: newData });
        };
    }

    render() {
        return (
            <div id="components-table-demo-drag-sorting">
                <DndProvider backend={HTML5Backend}>
                    <Table
                        pagination={this.pagination}
                        columns={columns}
                        dataSource={this.state.data}
                        components={this.components}
                        onRow={(record, index) => ({
                            index,
                            moveRow: this.moveRow,
                        })}
                    />
                </DndProvider>
            </div>
        );
    }
}

render(DragSortingTableDemo);
```

The CSS styles used in this example are:

```css
#components-table-demo-drag-sorting tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
}

#components-table-demo-drag-sorting tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
}
```

### Table Grouping

For some tables whose data needs to be displayed in groups, you can pass in `groupBy` to define the grouping rules, and use `renderGroupSection` to define the rendering of the grouping table header.

> Note: Be sure to provide a "key" for each row of data that is different from other row values, or use the rowKey parameter to specify a property name as the primary key.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

function Demo() {
    const rowKey = record => `${record.city && record.city.toLowerCase()}-${record.job && record.job.toLowerCase()}`;
    /**
     * FE => frontend engineer
     * BE => backend engineer
     * Andoird => android engineer
     * IOS => ios engineer
     * SE => software engineer
     */
    const data = [
        { city: 'Beijing', job: 'FE', department: 'IES' },
        { city: 'Beijing', job: 'BE', department: 'IES' },
        { city: 'Shanghai', job: 'Android', department: 'IES' },
        { city: 'Tokyo', job: 'Android', department: 'IES' },
        { city: 'Shanghai', job: 'IOS', department: 'EE' },
        { city: 'LA', job: 'SE', department: 'EE' },
        { city: 'Beijing', job: 'Android', department: 'EE' },
        { city: 'Tokyo', job: 'IOS', department: 'EE' },
        { city: 'Tokyo', job: 'SE', department: 'DATA' },
        { city: 'Shanghai', job: 'BE', department: 'DATA' },
        { city: 'LA', job: 'Android', department: 'DATA' },
        { city: 'LA', job: 'IOS', department: 'DATA' },
    ];

    const columns = [
        { dataIndex: 'city', title: 'City', width: 400, sorter: (a, b) => (a.city > b.city ? 1 : -1) },
        {
            dataIndex: 'job',
            title: 'Job',
            width: 200,
            filters: [
                { text: 'IOS', value: 'IOS' },
                { text: 'Android', value: 'Android' },
            ],
            onFilter: (value, record) => record.job && record.job.indexOf(value) === 0,
        },
        { dataIndex: 'department', title: 'Department' },
    ];

    return (
        <div style={{ padding: '20px 0px' }}>
            <Table
                dataSource={data}
                rowKey={rowKey}
                groupBy={'city'}
                columns={columns}
                renderGroupSection={groupKey => <strong>Jobs in {groupKey}:</strong>}
                onGroupedRow={(group, index) => {
                    return {
                        // onMouseEnter: () => {
                        //     console.log(`Grouped row mouse enter: `, group, index);
                        // },
                        // onMouseLeave: () => {
                        //     console.log(`Grouped row mouse leave: `, group, index);
                        // },
                        onClick: e => {
                            console.log(`Grouped row clicked: `, group, index);
                        },
                    };
                }}
                clickGroupedRowToExpand // if you want to click the entire row to expand
                scroll={{ y: 480 }}
            />
        </div>
    );
}

render(Demo);
```

### Virtualized Table

Virtualization can be used for scenes that need to render large-scale data. You can enable this feature by configuring the `virtualized` parameter. have to be aware of is:

-   Must pass `scroll.y` (number) and`style.width` (number);
-   Need to pass the height of each line `virtualized.itemSize` (when not transmitting, the normal line height defaults to `56`, and the group head line height defaults to `56`), can be of the following types:
    -   `number`
    -   `(index, { sectionRow?: boolean, expandedRow?: boolean }) => number`
-   Table grouping virtualization requires version >= `0.37.0`.

The following is an example of rendering 1000 pieces of data.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tag, Tooltip } from '@douyinfe/semi-ui';

class VirtualizedFixedDemo extends React.Component {
    constructor(props = {}) {
        super(props);

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                fixed: true,
                filters: [
                    {
                        text: 'Code 45',
                        value: '45',
                    },
                    {
                        text: 'King 4',
                        value: 'King 4',
                    },
                ],
                onFilter: (value, record) => record.name.includes(value),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                // width: 200,
                dataIndex: 'address',
            },
            {
                fixed: 'right',
                width: 250,
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.data = [];

        for (let i = 0; i < 1000; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }

        this.scroll = { y: 400, x: 1600 };
        this.style = { width: 750, margin: '0 auto' };
    }

    render() {
        return (
            <Table
                pagination={false}
                columns={this.columns}
                dataSource={this.data}
                scroll={this.scroll}
                style={this.style}
                virtualized
            />
        );
    }
}

render(VirtualizedFixedDemo);
```

### Infinite Scroll

Based on the virtualization feature, we can achieve infinite scroll loading data by passing in `virtualized.onScroll`.

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tag, Tooltip } from '@douyinfe/semi-ui';

class InfiniteScrollDemo extends React.Component {
    constructor(props = {}) {
        super(props);

        this.state = {
            data: [],
        };

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                fixed: true,
                filters: [
                    {
                        text: 'Code 45',
                        value: '45',
                    },
                    {
                        text: 'King 4',
                        value: 'King 4',
                    },
                ],
                onFilter: (value, record) => record.name.includes(value),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
                sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
            },
            {
                title: 'Address',
                // width: 200,
                dataIndex: 'address',
            },
            {
                fixed: 'right',
                width: 250,
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
            },
        ];

        this.scroll = { y: 600, x: 1000 };
        this.style = { width: 750, margin: '0 auto' };

        const itemSize = 56;
        this.virtualized = {
            itemSize,
            onScroll: ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
                const { data } = this.state;

                if (
                    scrollDirection === 'forward' &&
                    scrollOffset >= (data.length - Math.ceil(this.scroll.y / itemSize) * 1.5) * itemSize &&
                    !scrollUpdateWasRequested
                ) {
                    this.loadMore();
                }
            },
        };

        this.loadMore = this.loadMore.bind(this);
    }

    loadMore() {
        const pageSize = 20; // load 20 records every time
        const data = [...this.state.data];
        const currentLenght = data.length;
        for (let i = currentLenght; i < currentLenght + pageSize; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
            let name = `Edward King ${i}`;
            data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }
        this.setState({ data });
    }

    componentDidMount() {
        this.loadMore();
    }

    render() {
        return (
            <Table
                pagination={false}
                columns={this.columns}
                dataSource={this.state.data}
                scroll={this.scroll}
                style={this.style}
                virtualized={this.virtualized}
            />
        );
    }
}

render(InfiniteScrollDemo);
```

### Controlled Dynamic Tables

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Switch, ButtonGroup, Button, Tooltip, Tag } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor(props) {
        super(props);
        const dataTotalSize = 46;
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            },
            {
                title: 'Address',
                dataIndex: 'address',
            },
            {
                render: (text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                ),
                width: 150,
            },
        ];

        const data = [];
        for (let i = 0; i < dataTotalSize; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
            let name = `Edward King ${i}`;
            data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i} Lake Park`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
            });
        }
        this.data = data;

        this.mergeColumns = (column, columns, keys = ['dataIndex']) => {
            columns = [...columns];
            columns.forEach((curColumn, index) => {
                let isTarget = !!(keys && keys.length);

                for (let key of keys) {
                    if (column[key] !== curColumn[key]) {
                        isTarget = false;
                        break;
                    }
                }

                if (isTarget) {
                    columns[index] = { ...curColumn, ...column };
                }
            });

            return columns;
        };

        this.filterData = (filters, dataSource) => {
            dataSource = [...dataSource];
            filters.forEach(filter => {
                let filteredValue = filter.filteredValue;
                let dataIndex = filter.dataIndex;
                if (Array.isArray(filteredValue) && filteredValue.length && dataIndex) {
                    dataSource = dataSource.filter(
                        data => filteredValue.filter(value => String(data[dataIndex]).indexOf(value) > -1).length
                    );
                }
            });

            return dataSource;
        };

        this.getSelfSorterColumn = columns => {
            columns = columns || this.state.columns;
            return columns.filter(column => !!column.sorter)[0];
        };

        this.getSelfFilterColumns = columns => {
            columns = columns || this.state.columns;
            return columns.filter(column => Array.isArray(column.filteredValue) && column.filteredValue.length);
        };

        this.sortData = (sortObj, dataSource) => {
            let { sorter, sortOrder, dataIndex } = sortObj;

            if (sorter && sortOrder && typeof sorter !== 'function') {
                sorter = (a, b) => (a[dataIndex] > b[dataIndex] ? 1 : -1);
            }

            if (typeof sorter === 'function') {
                dataSource = [...dataSource].sort(sorter);

                if (sortOrder === 'descend') {
                    dataSource = dataSource.reverse();
                }
            }

            return dataSource;
        };

        this.fetchData = (currentPage = 1, sorter = {}, filters = []) => {
            // console.log(`FetchData currentPage: `, currentPage);
            let pagination = { ...this.state.pagination, currentPage };
            return new Promise((res, rej) => {
                setTimeout(() => {
                    let data = [...this.data];
                    data = this.sortData(sorter, data);
                    data = this.filterData(filters, data);
                    let dataSource = data.slice(
                        (currentPage - 1) * pagination.pageSize,
                        currentPage * pagination.pageSize
                    );
                    pagination.total = data.length;
                    res({
                        dataSource,
                        pagination,
                        sorter,
                        filters,
                    });
                }, 1500);
            });
        };

        this.setPage = (currentPage, sorter, filters) => {
            if (this.state.loading) {
                return;
            }
            if (typeof currentPage !== 'number') {
                currentPage = (this.state.pagination && this.state.pagination.currentPage) || 1;
            }

            sorter = sorter || this.getSelfSorterColumn();
            filters = filters || this.getSelfFilterColumns();

            this.setState({ loading: true });
            this.fetchData(currentPage, sorter, filters)
                .then(({ dataSource, pagination, sorter, filters }) => {
                    let columns = [...this.state.columns];
                    columns = this.mergeColumns(sorter, columns);
                    for (let filterObj of filters) {
                        columns = this.mergeColumns(filterObj, columns);
                    }
                    this.setState({
                        loading: false,
                        pagination,
                        dataSource,
                        columns,
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ loading: false });
                });
        };

        this.toggleFixHeader = checked => {
            let scroll = { ...this.state.scroll };

            if (checked) {
                scroll.y = 300;
            } else {
                scroll.y = null;
            }

            this.setState({ scroll });
        };

        this.toggleFixColumns = checked => {
            let columns = [...this.state.columns];
            let scroll = { ...this.state.scroll };
            let expandCellFixed = this.state.expandCellFixed;
            let rowSelection = this.state.rowSelection;

            if (checked) {
                columns[0].fixed = true;

                if (rowSelection) {
                    rowSelection = { ...rowSelection, fixed: true };
                }
                if (columns.length > 1) {
                    columns[columns.length - 1].fixed = 'right';
                }
                scroll.x = '150%';
                expandCellFixed = true;
            } else {
                columns.forEach(column => {
                    column.fixed = false;
                });
                scroll.x = null;
                expandCellFixed = false;

                if (rowSelection) {
                    rowSelection = { ...rowSelection, fixed: false };
                }
            }

            this.setState({
                rowSelection,
                expandCellFixed,
                columns,
                scroll,
            });
        };

        this.toggleRowSelection = checked => {
            let rowSelection = this.state.rowSelection;
            // const anyColumnFixed = this.state.columns.some(column => !!column.fixed);

            if (checked) {
                rowSelection = {
                    width: 48,
                    fixed: true,
                    onChange: (selectedRowKeys, selectedRows) =>
                        console.log(
                            'Selection changed, selectedRowKeys: ',
                            selectedRowKeys,
                            'selectedRows: ',
                            selectedRows
                        ),
                };
            } else {
                rowSelection = null;
            }

            this.setState({ rowSelection });
        };

        this.toggleLoading = checked => {
            let loading = this.state.loading;

            if (checked) {
                loading = true;
            } else {
                loading = false;
            }

            this.setState({ loading });
        };

        this.toggleExpandedRowRender = checked => {
            let expandedRowRender = this.state.expandedRowRender;

            if (checked) {
                expandedRowRender = record => {
                    return {
                        children: <p>{record.description}</p>,
                        fixed: 'left',
                    };
                };
            } else {
                expandedRowRender = null;
            }

            this.setState({ expandedRowRender });
        };

        this.toggleShowSorter = checked => {
            let columns = [...this.state.columns];

            if (checked) {
                columns.forEach(column => column.dataIndex === 'age' && (column.sorter = true));
            } else {
                columns.forEach(column => (column.sorter = null));
            }

            this.setState({ columns });
        };

        this.toggleShowFilter = checked => {
            let columns = [...this.state.columns];

            if (checked) {
                columns.forEach(column => {
                    if (column.dataIndex === 'name') {
                        column.filters = [
                            {
                                text: 'Name contains "1"',
                                value: '1',
                            },
                            {
                                text: 'Name contains "2"',
                                value: '2',
                            },
                            {
                                text: 'Name contains "3"',
                                value: '3',
                            },
                        ];
                        column.filteredValue = [];
                    }
                });
            } else {
                columns.forEach(column => {
                    column.filters = null;
                    column.filteredValue = null;
                });
            }

            this.setState({ columns });

            if (!checked) {
                this.setPage(null, null, []);
            }
        };

        this.onChange = (data = {}) => {
            console.log('Table changed: ', data);
            let { pagination, sorter, filters } = data;
            this.setPage(pagination.currentPage, sorter, filters);
        };

        this.onExpandedRowsChange = rows => {
            console.log('Expanded rows changed to: ', rows);

            const expandedRowKeys = (Array.isArray(rows) && rows.map(row => row.key)) || [];

            this.setState({ expandedRowKeys });
        };

        this.toggleExpandedRowKeys = checked => {
            let expandedRowKeys = [];

            if (checked) {
                let dataSource = [...this.state.dataSource];
                expandedRowKeys.push(
                    ...dataSource.reduce((arr, data) => {
                        if (data.key) {
                            arr.push(data.key);
                        }
                        return arr;
                    }, [])
                );
                this.toggleExpandedRowRender(true);
            }
            this.setState({ expandedRowKeys });
        };

        this.toggleBordered = checked => {
            let bordered = false;

            if (checked) {
                bordered = true;
            }

            this.setState({ bordered });
        };

        this.toggleResizable = checked => {
            let resizable = !!checked || false;

            this.setState({ resizable, bordered: resizable });
        };

        this.toggleHideHeader = checked => {
            let showHeader = true;

            if (checked) {
                showHeader = false;
            }

            this.setState({ showHeader });
        };

        this.toggleFooter = checked => {
            const footer = checked ? dataSource => <p style={{ margin: 0 }}>This is footer.</p> : null;

            this.setState({ footer });
        };

        this.toggleTitle = checked => {
            const title = checked ? 'This is title.' : null;

            this.setState({ title });
        };

        this.toggleHidePagination = checked => {
            let pagination = checked
                ? false
                : {
                      currentPage: 1,
                      pageSize: 8,
                      total: data.length,
                      onPageChange: page => this.setPage(page),
                  };

            this.setState({ pagination });
        };

        this.toggleDataSource = checked => {
            if (checked) {
                this.setState({ dataSource: [] });
            } else {
                this.setPage();
            }
        };

        this.switchPagination = position => {
            let pagination = this.state.pagination;

            const defaultPagination = {
                currentPage: 1,
                pageSize: 8,
                total: data.length,
                onPageChange: page => this.setPage(page),
            };

            const positions = ['bottom', 'top', 'both'];

            if (position === true || position === false) {
                pagination = position ? { ...defaultPagination, ...pagination } : false;
            } else if (positions.includes(position)) {
                pagination = { ...defaultPagination, ...pagination, position };
            }

            this.setState({ pagination });
        };

        this.state = {
            loading: false,
            columns,
            scroll: {},
            rowSelection: null,
            expandedRowRender: null,
            expandCellFixed: false,
            defaultExpandedRowKeys: [],
            title: null,
            footer: null,
            expandedRowKeys: [],
            showHeader: true,
            resizable: false,
            pagination: {
                currentPage: 1,
                pageSize: 8,
                total: data.length,
                onPageChange: page => this.setPage(page),
            },
            dataSource: [],
        };

        this.TableSwitch = function TableSwitch({
            text,
            children,
            checked,
            onChange,
            style = { display: 'inline-flex', alignItems: 'center', margin: 5 },
        }) {
            const switchProps = { onChange };

            if (checked != null) {
                switchProps.checked = !!checked;
            }
            return (
                <span style={style}>
                    <span>{text}</span>
                    {children != null ? children : <Switch size="small" {...switchProps} />}
                </span>
            );
        };
    }

    componentDidMount() {
        this.setPage(1);
    }

    render() {
        let {
            columns,
            dataSource,
            pagination,
            loading,
            scroll,
            rowSelection,
            expandedRowRender,
            expandCellFixed,
            expandedRowKeys,
            bordered,
            resizable,
            title,
            footer,
            showHeader,
            defaultExpandedRowKeys,
        } = this.state;

        const wrapStyle = { marginBottom: 15, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' };

        const TableSwitch = this.TableSwitch;

        return (
            <div>
                <div style={wrapStyle}>
                    <TableSwitch text="Fix header:" checked={scroll && scroll.y} onChange={this.toggleFixHeader} />
                    <TableSwitch text="Hide header:" onChange={this.toggleHideHeader} />
                    <TableSwitch text="Display title:" onChange={this.toggleTitle} />
                    <TableSwitch text="Display footer:" onChange={this.toggleFooter} />
                    <TableSwitch text="Fix columns:" onChange={this.toggleFixColumns} />
                    <TableSwitch text="Display selection column:" onChange={this.toggleRowSelection} />
                    <TableSwitch text="Display loading status:" onChange={this.toggleLoading} checked={loading} />
                    <TableSwitch
                        text="No data:"
                        onChange={this.toggleDataSource}
                        checked={!dataSource || !dataSource.length}
                    />
                    <TableSwitch text="Enable sorting:" onChange={this.toggleShowSorter} />
                    <TableSwitch text="Enable filtering:" onChange={this.toggleShowFilter} />
                    <TableSwitch
                        text="Enable row expansion"
                        onChange={this.toggleExpandedRowRender}
                        checked={typeof expandedRowRender === 'function'}
                    />
                    <TableSwitch text="Expand all rows" onChange={this.toggleExpandedRowKeys} />
                    <TableSwitch text="Display border:" onChange={this.toggleBordered} checked={bordered} />
                    <TableSwitch text="Enable resizing:" onChange={this.toggleResizable} />
                    <TableSwitch text="Table pagination:">
                        <ButtonGroup>
                            <Button onClick={() => this.switchPagination('bottom')}>Bottom</Button>
                            <Button onClick={() => this.switchPagination('top')}>Top</Button>
                            <Button onClick={() => this.switchPagination('both')}>Both</Button>
                            <Button onClick={() => this.switchPagination(false)}>None</Button>
                        </ButtonGroup>
                    </TableSwitch>
                </div>
                <Table
                    defaultExpandedRowKeys={defaultExpandedRowKeys}
                    onExpandedRowsChange={this.onExpandedRowsChange}
                    title={title}
                    footer={footer}
                    showHeader={showHeader}
                    bordered={bordered}
                    onChange={this.onChange}
                    expandCellFixed={expandCellFixed}
                    expandedRowRender={expandedRowRender}
                    expandedRowKeys={expandedRowKeys}
                    rowSelection={rowSelection}
                    scroll={scroll}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    loading={loading}
                    resizable={resizable}
                />
            </div>
        );
    }
}

render(App);
```

### Fully custom rendering

**Version:** >=0.34.0

Generally, you can use `Column.render`, but you can also pass`Column.useFullRender = true` to enable full custom rendering mode. At this time, the components such as checkbox button, expand button, indent will be Pass through to the `Column.title` and`Column.render` methods, you can further define the rendering method of the header and cell content.

The input parameters accepted by `Column.title` are:

```tsx
{
    filter: ReactNode, // Filter button
    sorter: ReactNode, // Sort button
    selection: ReactNode, // Select button
}
```

`Column.render` The fourth input parameter is:

```tsx
{
    expandIcon: ReactNode, // Expand button
    selection: ReactNode, // Select button
    indentTex: ReactNode, // Indentation
}
```

> The example below renders the checkbox and content into the same cell and header.

```jsx live=true noInline=true dir="column"
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, Button } from '@douyinfe/semi-ui';

function Demo(props = {}) {
    const [dataSource, setDataSource] = useState([]);
    const [useFullRender, setUseFullRender] = useState(true);
    const total = 46;
    const scroll = {
        // x: '160%',
        // y: 600,
    };
    const pagination = {
        pageSize: 12,
    };

    const rowSelection = useMemo(() => {
        return {
            hidden: useFullRender,
            fixed: 'left',
        };
    }, [useFullRender]);

    useEffect(() => {
        const data = [];
        for (let i = 0; i < total; i++) {
            const age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
            const name = `Edward King ${i}`;
            const no = i + 1;
            data.push({
                key: i,
                name,
                age,
                address: `Beijing, Zhong Guan Cun No. ${no}`,
                description: `My name is ${name}, I am ${age} years old, living in Zhong Guan Cun No. ${no}.`,
            });
        }

        setDataSource(data);
    }, [total]);

    const columns = useMemo(() => {
        const columns = [
            {
                title: ({ sorter, filter, selection }) => (
                    <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 20 }}>
                        {selection}
                        <span style={{ marginLeft: 8 }}>Name</span>
                        {sorter}
                        {filter}
                    </span>
                ),
                dataIndex: 'name',
                filters: [
                    {
                        text: 'Name contains "1"',
                        value: '1',
                    },
                    {
                        text: 'Name contains "2"',
                        value: '2',
                    },
                ],
                onFilter: (value, record) => record.name.indexOf(value) > -1,
                sorter: (a, b) => a.name.length - b.name.length,
                useFullRender,
                render: (text, record, index, { expandIcon, selection, indentText }) => {
                    return useFullRender ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {indentText}
                            {expandIcon}
                            {selection}
                            <span style={{ marginLeft: 8 }}>{text}</span>
                        </span>
                    ) : (
                        text
                    );
                },
                width: 250,
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
        return columns;
    }, [useFullRender]);

    return (
        <Table
            pagination={pagination}
            scroll={scroll}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            onChange={(...args) => console.log(...args)}
            expandedRowRender={record => <article>{record.description}</article>}
        />
    );
}

render(Demo);
```

### Header Merge

**Version: >=1.1.0**

Users can use the header merge function to group the header. The header merge can be combined with fixed column, virtualization, data grouping, column scaling and other functions. It also supports JSX or configurable writing.

#### Combined Header Configuration Writing

```jsx live=true noInline=true dir="column"
import React, { useMemo } from 'react';
import { Table } from '@douyinfe/semi-ui';

function Demo() {
    const data = useMemo(() => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
            let name = `Edward King ${i}`;
            data.push({
                key: '' + i,
                company: {
                    name: 'ByteDance',
                    address: 'No. 48, Zhichun Road',
                },
                name,
                age,
                address: `No ${i + 1}, Zhongguancun Street`,
                description: `My name is ${name}, I am ${age} years old, living in No ${i + 1}, Zhongguancun Street`,
            });
        }
        return data;
    }, []);

    const columns = useMemo(
        () => [
            {
                title: 'Base Information',
                fixed: 'left',
                children: [
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        fixed: 'left',
                        width: 200,
                        filters: [
                            {
                                text: 'Code 45',
                                value: '45',
                            },
                            {
                                text: 'King 4',
                                value: 'King 4',
                            },
                        ],
                        onFilter: (value, record) => record.name.includes(value),
                    },
                    {
                        title: 'Age',
                        dataIndex: 'age',
                        fixed: 'left',
                        width: 100,
                        sorter: (a, b) => (a.age - b.age > 0 ? 1 : -1),
                    },
                ],
            },
            {
                title: 'Company Information',
                children: [
                    {
                        title: 'Company Name',
                        dataIndex: 'company.name',
                    },
                    {
                        title: 'Company Address',
                        dataIndex: 'company.address',
                    },
                ],
            },
            {
                title: 'Address',
                width: 250,
                dataIndex: 'address',
                fixed: 'right',
            },
        ],
        []
    );

    return (
        <Table
            rowSelection={{ fixed: true }}
            expandedRowRender={record => <article>{record.description}</article>}
            dataSource={data}
            scroll={{ x: '120%', y: 400 }}
            onChange={(...args) => console.log(...args)}
            columns={columns}
        />
    );
}

render(Demo);
```

#### Merge Header JSX Writing

```jsx live=true noInline=true dir="column"
import React, { useMemo } from 'react';
import { Table } from '@douyinfe/semi-ui';

function Demo() {
    const data = useMemo(() => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
            let name = `Edward King ${i}`;
            data.push({
                key: '' + i,
                company: {
                    name: 'ByteDance',
                    address: 'No. 48, Zhichun Road',
                },
                name,
                age,
                address: `No ${i + 1}, Zhongguancun Street`,
                description: `My name is ${name}, I am ${age} years old, living in No ${i + 1}, Zhongguancun Street`,
            });
        }
        return data;
    }, []);

    return (
        <Table
            rowSelection={{ fixed: true }}
            expandedRowRender={record => <article>{record.description}</article>}
            dataSource={data}
            scroll={{ x: '120%', y: 400 }}
            onChange={(...args) => console.log(...args)}
        >
            <Table.Column title={'Base Information'} fixed>
                <Table.Column
                    title={'Name'}
                    dataIndex={'name'}
                    fixed
                    width={200}
                    filters={[
                        {
                            text: 'Code 45',
                            value: '45',
                        },
                        {
                            text: 'King 4',
                            value: 'King 4',
                        },
                    ]}
                    onFilter={(value, record) => record.name.includes(value)}
                />
                <Table.Column
                    title={'Age'}
                    dataIndex={'age'}
                    fixed
                    width={100}
                    sorter={(a, b) => (a.age - b.age > 0 ? 1 : -1)}
                />
            </Table.Column>
            <Table.Column title={'Company Information'}>
                <Table.Column title={'Company Name'} dataIndex={'company.name'} />
                <Table.Column title={'Company Address'} dataIndex={'company.address'} />
            </Table.Column>
            <Table.Column title={'Address'} width={250} fixed={'right'} dataIndex={'address'} />
        </Table>
    );
}

render(Demo);
```

### colSpan and rowSpan 

- In addition to merging the headers by writing children, you can merge the headers by setting column.colSpan.
- Table supports row/column merging. When the cell attribute colSpan or rowSpan in render is set to 0, the set table will not be rendered.

```tsx
type Render = (text: string, record: Object, index: number, options?: RenderOptions) => {
    children: React.ReactNode;
    props: {
        colSpan?: number,
        rowSpan?: number,
    },
    [x: string]: any;
}

interface RenderOptions {
    expandIcon?: React.ReactNode;
}
```

```jsx live=true noInline=true dir="column"
import React, { useMemo } from 'react';
import { Table } from '@douyinfe/semi-ui';

const App = () => {
    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };
        if (index === 4) {
            obj.props.colSpan = 0;
        }
        return obj;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, row, index) => {
                if (index < 4) {
                    return <a>{text}</a>;
                }
                return {
                    children: <a>{text}</a>,
                    props: {
                        colSpan: 5,
                    },
                };
            },
        },
        {
            title: 'Age',
            dataIndex: 'age',
            render: renderContent,
        },
        {
            title: 'Home phone',
            colSpan: 2,
            dataIndex: 'tel',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (index === 2) {
                    obj.props.rowSpan = 2;
                }
                // These two are merged into above cell
                if (index === 3) {
                    obj.props.rowSpan = 0;
                }
                if (index === 4) {
                    obj.props.colSpan = 0;
                }
                return obj;
            },
        },
        {
            title: 'Phone',
            colSpan: 0,
            dataIndex: 'phone',
            render: renderContent,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: renderContent,
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park',
        },
        {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park',
        },
    ];
    return (
        <Table dataSource={data} columns={columns} />
    );
};

render(App);
```

## API Reference

## Table

| Properties              | Instructions                                                                                                              | Type                                                                                                            | Default    | Version                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| bordered                | Whether to display outer and column borders                                                                               | boolean                                                                                                         | false      |
| className               | Outermost style name                                                                                                      | string                                                                                                          |            |
| clickGroupedRowToExpand | Group content expands or collapses when the group header row is clicked                                                   | boolean                                                                                                         |            | **0.29.0**                                                 |
| columns                 | For a configuration description of the table column, see [Column](#Column)                                              | Column []                                                                                                       | []         |
| dataSource              | Data                                                                                                                      | RecordType[]                                                                                                 | []         |
| defaultExpandAllRows    | All rows are expanded by default                                                                                          | boolean                                                                                                         | false      |
| defaultExpandAllGroupRows  | All grouped rows are expanded by default                                                          | boolean                                                                                                         | false      | **1.30.0**
| defaultExpandedRowKeys  | Default expansion of row key array                                                                                        | Array <\*>                                                                                                      | []         |
| empty                   | Content displayed when there is no data                                                                                   | ReactNode                                                                                                          | ReactNode  | 'No data yet. '                                                   |
| expandCellFixed         | Whether the column of the expansion icon is fixed or not, the same value as the fixed value in Column                     | boolean\|string                                                                                                 | false      |
| expandIcon              | Custom expansion icon, hidden when it is `false`                                                                          | boolean <br/>\|ReactNode <br/>\| (expanded: boolean) => ReactNode                                               |            |
| expandedRowKeys         | Expanded rows, the row expansion function will be controlled when this parameter is introduced.                           | (string | number)[]                                                                                                 |            |
| expandedRowRender       | Extra unfolding lines                                                                                                     | (record: object, index: number, expanded: boolean) => ReactNode                                                 |            |
| expandAllRows           | All rows are expanded                                                           | boolean                                                                                                         | false      | **1.30.0**
| expandAllGroupRows      | All grouped rows are expanded                                                           | boolean                                                                                                         | false      | **1.30.0**
| expandRowByClick        | Expand row when click row                                                         | boolean                                                                                    |  false  | **1.31.0**
| footer                  | End of form                                                                                                               | string<br/>\|ReactNode<br/>\|(pageData: object) => string\|ReactNode                                            |            |
| groupBy                 | Grouping basis, generally a method of a key name or a return value of a string or number in the dataSource element        | string\|number<br/>\|(record: any) => string\|number                                                                    |            | **0.29.0**                                                 |
| hideExpandedColumn      | Whether to hide the expansion button column and turn off the rendering of the expansion button when it is turned on       | boolean                                                                                                         | true      |
| indentSize              | indent size of TableCell                         | number                                                                                                         | 20      |
| loading                 | Table is loading or not                                                                                                   | boolean                                                                                                         | false      |
| pagination              | Paging component configuration                                                                                            | boolean\|TablePaginationProps                                                                                                 | true       |
| prefixCls               | Style name prefix                                                                                                         | string                                                                                                          |            |
| renderGroupSection      | Header rendering method                                                                                                   | (groupKey?: string \| number, group?: string[] \| number[]) => ReactNode                                        |            | **0.29.0**                                                 |
| renderPagination        | Customize the rendering method of pagination.                                                                             | (paginationProps?: TablePaginationProps) => ReactNode                                        |            | **1.13.0**                              |
| resizable               | Whether to turn on the telescopic column function, the column that needs to be telescopic must provide the value of width | boolean\|[Resizable](#Resizable)                                                                                | false      |
| rowExpandable           | Whether the row can be expanded, turning off the rendering of the expandable button when the value is false               | (record: RecordType): => boolean                                                                                    | () => true | **0.27.0**                                                 |
| rowKey                  | The value of the table row key, which can be a string or a function.                                                      | string \| (record: RecordType) => string                                                                               | 'key'      |
| rowSelection            | See [rowSelection](#rowSelection)                                                                                         | object                                                                                                          | null       |
| scroll                  | Whether the table is scrollable, configure the width or height of the scroll area, see [scroll](#scroll)                  | object                                                                                                          | -          |
| showHeader              | Does it show the header?                                                                                                  | boolean                                                                                                         | true       |
| size                    | Table size, will effect the `padding` of the rows                                                                         | "default"\|"middle"\|"small"                                                                                    | "default"  | **1.0.0**                                                         |
| title                   | Table Title                                                                                                               | string<br/>\|ReactNode<br/>\|(pageData: RecordType[]) => string\|ReactNode                                            |            |
| virtualized             | Virtualization settings                                                                                                   | Virtualized                                                                                                 | false      | **0.33.0**                                                 |
| virtualized.itemSize    | Row height                                                                                                                | number\|(index: number) => number                                                                               | 56         | **0.33.0**                                                 |
| virtualized.onScroll    | Virtualization scroll callback method                                                                                     | ( scrollDirection?: 'foward' \| 'backward', scrollOffset?: number, scrollUpdateWasRequested?: boolean ) => void |            | **0.33.0**                                                 |
| onChange                | Trigger when paging, sorting, filtering changes                                                                           | ({ pagination: TablePaginationProps, <br/>filters: Array<\*>, sorter: object, extra: any }) => void                           |            |
| onExpand                | Trigger when clicking on the row expansion icon                                                                           | (expanded: boolean, record: RecordType, DOMEvent: MouseEvent) => void                                               |            | The third parameter DOMEvent requires version **>=0.28.0** |
| onExpandedRowsChange    | Triggers when unfolding row changes                                                                                       | (rows: RecordType[]) => void                                                                                        |            |
| onGroupedRow            | Similar to onRow, but this parameter is used to define the row attribute of the grouping header alone                     | (record: RecordType, index: number) => object                                                                       |            | **0.29.0**                                                 |
| onHeaderRow             | Set the header row property, and the returned object is merged to the header line                                         | (columns: Column[], index: number) => object                                                                       |            |
| onRow                   | Set the row property, and the returned object is merged to the table row                                                  | (record: RecordType, index: number) => object                                                                       |            |

Some of the type definitions used above:

```typescript
// PaginationProps is the props supported by the Pagination component
interface TablePaginationProps extends PaginationProps {
    position?: PaginationPosition;
    formatPageText?: FormatPageText;
}

type VirtualizedMode = 'list' | 'grid';
type VirtualizedItemSizeFn = (index?: number) => number;
type VirtualizedOnScrollArgs = {
    scrollDirection?: 'forward' | 'backward';
    scrollOffset?: number;
    scrollUpdateWasRequested?: boolean;
};
type VirtualizedOnScroll = (object: VirtualizedOnScrollArgs) => void;

type Virtualized = boolean | {
    mode?: VirtualizedMode;
    itemSize?: number | VirtualizedItemSizeFn;
    onScroll?: VirtualizedOnScroll;
};
```

RecordType is a generic parameter of Table and Column, and the default is object type. You can use RecordType like this:

```typescript
import { ColumnProps } from 'table/interface';

interface Record {
    title?: string;
    dataIndex?: string;
    width?: number;
    render?: Function;
    key?: string;
    name?: string;
    age?: number;
    address?: string;
}

const columns: ColumnProps<Record>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
        },
        // ...
];

const data: Record[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    },
    // ...
];

function App() {

    return (
        <Table<Record> columns={columns} dataSource={data} />
    );
}
```

## onRow/onHeaderRow Usage

> Also in `column.onCell` `column.onHeaderCell` Properties or events supported by td / th can also be returned.

```jsx noInline=true
<Table
    onRow={(record, index) => {
        return {
            onClick: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {},
            className: '',
            // ...
            // Other attributes or events that can be applied to tr
        };
    }}
    onHeaderRow={(columns, index) => {
        return {
            onClick: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {},
            className: '',
            // ...
            // Other attributes or events that can be applied to th
        };
    }}
/>
```

## Column

| Parameters                    | Instructions                                                                                                                                                                                         | Type                                                                                               | Default | Version                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------- |
| align                         | Setting the alignment of columns                                                                                                                                                                     | 'left '\| 'right '\| 'center'                                                                      | 'left'  |
| children                      | Settings for sub-columns when the header is merged                                                                                            | Column[]                                                                                          |        |
| className                     | Column style name                                                                                                                                                                                    | string                                                                                             |         |
| colSpan                       | When header columns merge, set to 0, do not render                                                                                                                                                   | number                                                                                             |         |
| dataIndex                     | The key corresponding to the column data in the data item.                                                                                                                                           | string                                                                                             |         |
| defaultSortOrder              | The default value of sortOrder, one of 'ascend'\|'descend'\|false                                         | boolean\| string                                                                                          |  false  | **1.31.0**
| filterChildrenRecord          | Whether the child data needs to be filtered locally. If this function is enabled, if the child meets the filtering criteria, the parent will retain it even if it does not meet the criteria.        | boolean                                                                                            |         | **0.29.0**                         |
| filterDropdown                | You can customize the filter menu. This function is only responsible for rendering the layer and needs to write a variety of interactions.                                                           | ReactNode                                                                                          |         |
| filterDropdownProps           | Props passing to Dropdown, see more in [Dropdown API](/en-US/show/dropdown#Dropdown)                                                                       | object                                                                                        |        |
| filterDropdownVisible         | Visible of Dropdown, see more in [Dropdown API](/en-US/show/dropdown#Dropdown)                                                                      | boolean                                                                                        |        |
| filterIcon                    | Custom filter icon                                                                                                                                                                                   | boolean\|ReactNode\|(filtered: boolean) => ReactNode                                               |         |
| filterMultiple                | Whether to choose more                                                                                                                                                                               | boolean                                                                                            | true    |
| filteredValue                 | Controlled property of the filter, the filter state of the external control column with a value of the screened value array                                                                          | any[]                                                                                              |         |
| filters                       | Filter menu items for the header                                                                                                                                                                     | Filter[]                                                                                           |         |
| fixed                         | Whether the column is fixed, optional true (equivalent to left) 'left' 'right'                                                                                                                       | boolean\|string                                                                                    | false   |
| key                           | The key required by React, if a unique dataIndex has been set, can ignore this property                                                                                                              | string                                                                                             |         |
| render                        | A rendering function that generates complex data, the parameters are the value of the current row, the current row data, the row index, and the table row / column merge can be set in return object | (text: string, record: RecordType, index: number, { expandIcon?: ReactNode }) => React\|object         |         |
| renderFilterDropdownItem      | Customize the rendering method of each filter item. For usage details, see [Custom Filter Item Rendering](#Custom-Filter-Item-Rendering)                                                             | ({ value: any, text: any, onChange: Function, level: number, ...otherProps }) => ReactNode         | -       | **1.1.0**                         |
| sortChildrenRecord            | Whether to sort child data locally                                                                                                                                                                   | boolean                                                                                            |         | **0.29.0**                         |
| sortOrder                     | The controlled property of the sorting, the sorting of this control column can be set to 'ascend'\|'descended '\|false                                                                               | boolean                                                                                            | false   |
| sorter                        | Sorting function, local sorting uses a function (refer to the compreFunction of Array.sort), requiring a server-side sorting can be set to true                                                      | boolean\|(r1: RecordType, r2: RecordType) => number                                                        | true    |
| title                         | Column header displays text. When a function is passed in, title will use the return value of the function; when other types are passed in, they will be aggregated with sorter and filter           | string \| ReactNode\|({ filter: ReactNode, sorter: ReactNode, selection: ReactNode }) => ReactNode |         | Function type requires **0.34.0** |
| useFullRender                 | Whether to completely customize the rendering, see [Full Custom Rendering](#Fully-custom-rendering) for usage details                                                                                 | boolean                                                                                            | false   | **0.34.0**                        |
| width                         | Column width                                                                                                                                                                                         | string \| number                                                                                   |         |
| onCell                        | Set cell properties                                                                                                                                                                                  | (record: RecordType, rowIndex: number) => object                                                       |         |
| onFilter                      | Determine the running function of the filter in local mode                                                                                                                                           | (filteredValue: any[], record: RecordType) => boolean                                                  |         |
| onFilterDropdownVisibleChange | A callback when a custom filter menu is visible                                                                                                                                                      | (visible: boolean) => void                                                                         |         |
| onHeaderCell                  | Set the head cell property                                                                                                                                                                           | (column: RecordType, columnIndex: number) => object                                                    |         |

Some of the type definitions used above:

```typescript
// RecordType is a generic parameter of Table and Column, the default is object type

type Filter = {
    value: any;
    text: React.ReactNode;
    children?: Filter[];
};
```

## rowSelection

| Parameters       | Instructions                                                                    | Type                                                                                         | Default   | Version            |
| ---------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------- | ------------------ |
| className        | Style name listed                                                               | string                                                                                       |           |
| disabled         | Disabled `Checkbox` in `Table` header or not.                                   | boolean                                                                                      | false     | **0.32.0**  |
| fixed            | Secure the selection box column to the left.                                    | boolean                                                                                      | false     |
| getCheckboxProps | Default property configuration for the selection box                            | (record: RecordType) => object                                                                   |           |                    |
| hidden           | Hide selection column or not                                                    | boolean                                                                                      | false     | **0.34.0** |
| selectedRowKeys  | Specifies the key array of the selected item, which needs to work with onChange | string []                                                                                    |           |                    |
| title            | Custom List Selection Box Title                                                 | string                                                                                       | ReactNode |                    |
| width            | Custom list selection box width                                                 | string                                                                                       | number    |                    |
| onChange         | A callback in the event of a change in the selected item                        | (selectedRowKeys: number[]\|string[], selectedRows: RecordType[]) => void                        |           |                    |
| onSelect         | The user manually selects / unselects the callback of a line                    | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void |           |                    |
| onSelectAll      | User manually selects / unselects callbacks for all rows                        | (selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]) => void                   |           |                    |

## scroll

| Parameters               | Instructions                                                                                         | Type           | Default | Version       |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | -------------- | ------- | ------------- |
| scrollToFirstRowOnChange | Whether to automatically scroll to the top of the table after paging, sorting, and filtering changes | boolean        | false   | 1.1.0 |
| x                        | Set the width of the horizontal scroll area, which can be pixel value, percentage, or 'max-content'  | string\|number |         |               |
| y                        | Set the height of the vertical scroll area, which can be a pixel value                               | number         |         |               |

## pagination

Page-turning component configuration. Pagination suggests not to use literal value.

| Parameters         | Instructions                                                                                                                                                                                                                                                | Type                                                                                         | Default  | Version             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- | ------------------- |
| currentPage        | Current page number                                                                                                                                                                                                                                         | number                                                                                       | -        |                     |
| defaultCurrentPage | Default current page number                                                                                                                                                                                                                                 | number                                                                                       | 1        | **>=1.1.0** |
| formatPageText     | Page-turning area copywriting custom formatting, pass false to close copywriting display; This item affects the copy display on the left of the page turning area of the form. It is different from the `showTotal` parameter of the`Pagination` component. | boolean\| ({ currentStart: number, currentEnd: number, total: number }) => string\|ReactNode | true     | **0.27.0**   |
| pageSize           | Number of entries per page                                                                                                                                                                                                                                  | number                                                                                       | 10       |                     |
| position           | Location                                                                                                                                                                                                                                                    | 'bottom '\|'top '\|'both'                                                                    | 'bottom' |
| total              | Total number of entries                                                                                                                                                                                                                                     | number                                                                                       | 0        | **>=0.25.0**        |

For other configurations, see [Pagination](/en-US/navigation/pagination#API-Reference)

## Resizable

The parameters of the resizable object type, which mainly include event methods when the table column is scaled. These event methods can return an object that merges with the final column.

| Parameters    | Instructions                                               | Type                                             | Default |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------ | ------- |
| onResize      | Triggers when the table column changes its width           | (column: [Column](#Column)) => [Column](#Column) |         |
| onResizeStart | Triggers when the table column starts to change the width. | (column: [Column](#Column)) => [Column](#Column) |         |
| onResizeStop  | Triggers when the table column stops changing the width    | (column: [Column](#Column)) => [Column](#Column) |         |

## Methods

Some internal methods provided by Table can be accessed through ref:

```jsx noInline=true
import React, { useRef, useEffect } from 'react';
import { Table } from '@douyinfe/semi-ui';

function Demo() {
    const ref = useRef();

    useEffect(() => {
        ref.getCurrentPageData(); // => { dataSource: [/*...*/], groups: /*...*/ }
    }, []);

    return (
        <Table
            columns={
                [
                    /*...*/
                ]
            }
            dataSource={
                [
                    /*...*/
                ]
            }
            ref={ref}
        />
    );
}
```

| Parameters           | Instructions                                                                                                                     | Version        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| getCurrentPageData() | Returns the data object of the current page: { dataSource: RecordType[], groups: Map<{groupKey: string, recordKeys: Set<string\>}> } | 0.37.0 |

## Design Tokens
<DesignToken/>

## FAQ
- **Why is the table data not updated?**  
    At present, all parameters of the table component are shallow comparison. That is to say, if the parameter value type is an array or object, you need to manually change its reference to trigger the update. Similarly, if you don't want to trigger additional updates, try not to use literal values when passing parameters directly or define reference parameter values in the render process:
    ```jsx
    // ...render() {
        <Table dataSource={[/*...*/]} columns={[/*...*/]} />}
    ```
    The above writing method will trigger the update of data in the table every time render (the current selected row will be cleared and the row key array will be expanded, etc.). In order to improve performance and avoid some exceptions, please define some reference type parameters outside the render method as far as possible (if hooks are used, please use useMemo or useState for storage).**

- **Why can't my form line be selected and expanded?**

    Please specify a rowKey or set a different "key" attribute for each item of the dataSource. **All rows related operations in the table need to be used.**

- **How to implement custom sorting or pass parameters to the server for sorting when clicking the sort button?**
    
    The input parameters of the onChange method include pagination, filters, and sorter. Users can customize the sorting of the dataSource according to the sorter.

- **How to add className to a row?**
    
    Use onRow or onHeaderRow.

- **How to style the table cell?**
    
    It can be controlled by column.onHeaderCell and column.onCell.

See more Table FAQ and demos, please click <a href="https://bytedance.feishu.cn/docs/doccnsYk1qUmsIDP1ihJ9zjG0Ch" target="_blank">Table FAQ</a>

<!-- ## Related Material
```material
196,110,104,113,226
``` -->