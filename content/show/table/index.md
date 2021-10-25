---
localeCode: zh-CN
order: 56
category: 展示类
title:  Table 表格
icon: doc-table
brief: 展示行列数据。
---


## 何时使用

-   当有大量结构化的数据需要展现时；
-   当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 如何使用

往Table传入表头 `columns` 和数据 `dataSource` 进行渲染。

> 请为 dataSource 中的每个数据项提供一个与其他数据项值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名，表格的行选择、展开等绝大多数行操作功能都会使用到。

```jsx import
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
    }

    render() {
        <Table columns={this.columns} dataSource={this.data} />;
    }
}
```

## 代码演示

### 基本表格

对于表格，最基本的两个参数为 `dataSource` 和 `columns`，前者为数据项，后者为每列的配置，二者皆为数组类型。

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
                    console.log(text, record, index)
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
        return <Table columns={this.columns} dataSource={this.data} pagination={false} />;
    }
}

render(App);
```

### JSX 写法

你也可以使用 JSX 语法定义 `columns`，注意 Table 仅支持 `columns` 的 JSX 语法定义。你不能够使用任何组件包裹 `Table.Column` 组件。

<Notice type="primary" title="注意事项">
    <div>1. JSX 写法的表格暂时不支持 resizable 功能；</div>
    <div>2. 使用 JSX 写法时，请不要与配置写法同时使用；如果同时使用，仅配置写法生效，不会进行聚合操作。</div>
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
            <Table dataSource={this.data} pagination={false}>
                <Column title="Name" dataIndex="name" key="name" render={(text, record, index) => (<a>{text}</a>)} />
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
            </Table>
        );
    }
}

render(App);
```

### 行选择操作

往Table传入 rowSelection 即可打开此功能。

**注意：**请务必为每行数据提供一个与其他行值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名。

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
        return <Table columns={this.columns} dataSource={this.data} rowSelection={this.rowSelection} pagination={false} />;
    }
}

render(App);
```

### 自定义渲染

用户可以使用 Column.render 来自定义某一列单元格的渲染，该功能适用于需要渲染较为复杂的单元格内容时。

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Button } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';

class TableApp extends React.Component {
    constructor(props) {
        super(props);

        this.raw = [{
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
        }];

        this.state = {
            dataSource: [...this.raw],
            columns: [{
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
                render: (text, record) => <Button icon={<IconDelete />} theme='borderless' onClick={() => this.removeRecord(record.key)} />
            }],
        };
    }

    removeRecord(key) {
        let dataSource = [...this.state.dataSource];
        if(key != null) {
            let idx = dataSource.findIndex(data => data.key === key);

             if(idx > -1) {
                 dataSource.splice(idx, 1)
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
                <Button onClick={() => this.resetData()} style={{ marginBottom: 10 }}>重置</Button>
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </>
        );
    }
}

render(TableApp);

```

### 带分页组件的表格

表格分页目前支持两种模式：受控和非受控模式。

-   受控模式下，分页的状态完全由外部传入，依据为是否往Table传入了 pagination.currentPage 这个字段。一般情况下，受控模式适用于远程拉取数据并渲染。
-   非受控模式下，Table 默认会将传入的 dataSource 长度作为 total 传给 Pagination 组件，当然你也可以传入一个 total 字段来覆盖 Table 组件的取值，不过我们并不推荐用户在非受控分页模式下传入这个字段。

**注意：**非受控条件下传入自定义的 pagination.total 字段在 >=0.25.0 版本后才支持

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
                sorter: (a, b) => a.age - b.age > 0 ? 1 : -1,
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
                age: 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i/3),
                address: `London, Park Lane no. ${i}`,
            });
        }

        this.scroll = { y: 300 };

    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} rowSelection={this.rowSelection} scroll={this.scroll} />;
    }
}

render(TableApp);
```

<Notice type="primary" title="注意事项">
    <div>pagination 如果是对象类型则不推荐使用字面量写法，原因是字面量写法会导致表格渲染至初始状态（看起来像是分页器没有生效）。请尽量将引用型参数定义在 render 方法之外，如果使用了 hooks 请利用 useMemo 或 useState 进行存储。</div>
</Notice>

### 拉取远程数据

正常情况下，数据往往不是一次性获取的，我们会在点击页码、过滤器或者排序按钮时从接口重新获取数据，这种情况下请使用**受控模式**来处理分页。用户需往Table传入 pagination.currentPage 这个字段，此时分页组件的渲染完全依赖于传入的 pagination 对象。

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
            this.setState({loading: true});
            let pagination = { ...this.state.pagination, currentPage };
            return new Promise((res, rej) => {
                setTimeout(() => {
                    let dataSource = this.data.slice((currentPage - 1) * pagination.pageSize, currentPage * pagination.pageSize);
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
        }

        this.state = {
            loading: false,
            columns,
            pagination: {
                currentPage: 1,
                pageSize: 5,
                total: data.length,
                onPageChange: page => this.fetchData(page),
            },
            dataSource: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {

        let { columns, dataSource, pagination, loading } = this.state;


        return (<Table columns={columns} dataSource={dataSource} pagination={pagination} loading={loading} />);
    }
}

render(App);
```

### 固定列或表头

可以通过设置 column 的 fixed 属性以及 scoll.x 来进行列固定，通过设置 scoll.y 来进行表头固定。

> -   请确保表格内部的所有元素在渲染后不会对单元格的高度造成影响（例如含有未加载完成的图片等），这种情况下请给定子元素一个确定的高度，以此确保左右固定列单元格不会错乱。
> -   若列头与内容不对齐或出现列重复，请指定固定列的宽度 width。如果指定 width 不生效，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有超长连续字段破坏布局。
> -   建议指定 scroll.x 为大于表格宽度的**固定值**或百分比。推荐设置为 `>=所有固定列宽之和+所有表格列宽之和` 的固定数值。

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
                sorter: (a, b) => a.age - b.age > 0 ? 1 : -1,
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
                render: (text, record) => <Tooltip content={record.description}><Tag color='green'>Show Info</Tag></Tooltip>
            }
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
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i/3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i+1} Lake Park.`,
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

### 带排序和过滤功能的表头

表格内部集成了过滤器和排序控件，用户可以通过在 Column 中传入 filters 以及 onFilter 开启表头的过滤器控件展示，传入 sorter 开启表头的排序控件的展示。

**注意：**请务必为每行数据提供一个与其他行值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名。

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table } from '@douyinfe/semi-ui';

class App extends React.Component {
    constructor() {
        this.state = {
            sortColumns : [
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
                    sorter: (a, b) => a.age - b.age > 0 ? 1 : -1,
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
            ]
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

### 自定义筛选项渲染

自 **1.1.0** 版本后，支持往column中传入 `renderFilterDropdownItem` 自定义每个筛选项的渲染方式。

该方法接受一个 `Object` 型入参，其各个属性的含义如下：

-   `onChange: e => void` 当前筛选项选中/反选事件；
-   `text: ReactNode` 当前筛选项的文案；
-   `value: any` 当前筛选项的值；
-   `checked: boolean` 当前筛选项是否已经选中；
-   `filteredValue: any[]` 当前所有的筛选值；
-   `level: number` 当前筛选项所处层级，如果是嵌套的筛选项，该值会 >= 1；
-   `filterMultiple: boolean` 当前筛选项是否为多选。

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
                        <Tag color="green">Hover To Show Info</Tag>
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

### 可以展开的表格

> 注意：
>
> -   自 0.27.0版本后，展开按钮会默认与第一列文案渲染在同一个单元格内，你可以通过往Table传入 hideExpandedColumn={false} 将展开按钮单独作为一列渲染。
> -   请务必为每行数据提供一个与其他行值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名。

#### 一般可展开行

如果需要渲染可以展开的表格，除了需要在Table传 `expandedRowRender` 这个方法外，还必须要指定 `rowKey`（默认为 `key`），Table 会根据 `rowKey` 取得行唯一标识符。

-   如果 rowKey 为 Function，则会把 `rowKey(record)` 的结果作为行唯一 ID
-   如果 rowKey 为 string 类型，则会把 `record[rowKey]` 作为行唯一 ID

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

        this.expandRowRender = (record, index) => index < 2 ? (<Table columns={this.expandColumns} dataSource={this.expandData} />) : <p>{record.description}</p>
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

#### 展开按钮渲染为单独列

**版本：>=0.27.0**

默认情况，展开按钮会与第列文案渲染在同一个单元格内，你可以通过传入 `hideExpandedColumn={false}` 来渲染为单独一列：

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

        this.expandRowRender = record => <p>{record.description}</p>
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

#### 关闭某一行的可展开按钮渲染

**版本：>=0.27.0**

可传入 rowExpandable 方法，入参为 record，判断返回值是否为 false 来关闭某一行的可展开按钮的渲染。

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

        this.expandRowRender = record => <p>{record.description}</p>
    }
    render() {
        return (
            <Table
                hideExpandedColumn={false}
                rowKey={'name'}
                columns={this.expandColumns}
                rowExpandable={ record => record.name !== 'Jim Green' }
                rowSelection={this.rowSelection}
                expandedRowRender={this.expandRowRender}
                dataSource={this.expandData}
            />
        );
    }
}

render(App);
```

### 树形数据展示

**版本：>=0.27.0**

表格支持树形数据的展示，当数据中有 children 字段时会自动展示为树形表格，如果不需要或使用其他字段可以用 `childrenRecordName` 进行配置。另外可以通过设置 `indentSize` 以控制每一层的缩进宽度。

**注意：**请务必为每行数据提供一个与其他行值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名。

#### 树形数据简单示例

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

    return (
        <Table
            columns={columns}
            defaultExpandAllRows
            dataSource={data}
        />
    );
};

render(Demo);
```

#### 行可交换的树形数据

**版本：>=0.27.0**

你可以通过改变 dataSource 元素的顺序来实现行交换操作。

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

#### 树形选择

**版本：>=0.27.0**

默认情况下，表格的行选中是各自独立的，你可以通过定义 selectedRowKeys 来模拟一个树形选中。

```jsx live=true noInline=true dir="column"
import React, { useMemo, useState, useCallback } from 'react';
import { get, filter, some, map } from 'lodash-es';
import { Table } from '@douyinfe/semi-ui';

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

### 自定义行或单元格事件以及属性

-   传入 onRow/onHeaderRow 可以定义表格或表头行的原生事件或属性。
-   传入 column.onCell/column.onHeaderCell 可以定义表格或表头单元格原生事件或属性。

原则上 tr/td/th 上支持的属性或事件都能够被定义。例如下面这个例子：

-   表头的 tr 定义了 onMouseEnter/onMouseLeave
-   表格的 tr 定义了 className
-   表格的第三行定义了 onClick

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

### 可伸缩列

版本 >= 0.15.0

#### 基本伸缩列

对于一些内容比较多的列，可以选择打开伸缩列功能，在表头进行拉拽实现列宽的实时变化。

不过你需要注意一些参数：

-   `resizable` 设定为 `true` 或者一个 `object`
-   `columns` 里需要伸缩功能的列都要指定 `width` 这个字段（如果不传，该列不具备伸缩功能，且其列宽度会被浏览器自动调整）

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tooltip } from '@douyinfe/semi-ui';

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
                sorter: (a, b) => a.age - b.age > 0 ? 1 : -1,
            },
            {
                title: 'Address',
                width: 200,
                dataIndex: 'address',
            },
            {
                render: (text, record) => <Tooltip content={record.description}><Tag color='green'>Show Info</Tag></Tooltip>
            }
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
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i/3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i+1} Lake Park.`,
            });
        }
    }

    render() {
        return <Table columns={this.columns} dataSource={this.data} resizable bordered />;
    }
}

render(ResizableDemo);
```

#### 进阶的伸缩列

`resizable` 还能为一个 `Object`，包括三个事件方法：

-   onResize
-   onResizeStart
-   onResizeStop

分别触发于`列宽改变中`、`开始改变`和`结束改变`三个时机。开发者可以选择在这个时机修改 column，例如在拉拽时增加一个拖动时的竖线效果等，如下例。

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
                render: (text, record) => <Tooltip content={record.description}><Tag color='green'>Show Info</Tag></Tooltip>
            }
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
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i/3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i+1} Lake Park.`,
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
            }
        };

        this.pagination = {
            pageSize: 5
        };
    }

    render() {
        return (
            <div id="components-table-demo-resizable-column">
                <Table columns={this.columns} dataSource={this.data} resizable={this.resizable} pagination={this.pagination} bordered />
            </div>
        );
    }
}

render(ResizableDemo);
```

本例中使用的 CSS 样式定义：

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

### 拖拽排序

使用自定义元素，我们可以集成 `react-dnd` 来实现拖拽排序。

```jsx live=true dir="column" noInline=true hideInDSM
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
        sorter: (a, b) => a.age - b.age > 0 ? 1 : -1,
    },
    {
        title: 'Address',
        width: 200,
        dataIndex: 'address',
    },
    {
        render: (text, record) => <Tooltip content={record.description}><Tag color='green'>Show Info</Tag></Tooltip>
    }
];

class DragSortingTableDemo extends React.Component {
    constructor() {
        this.data = [];
        for (let i = 0; i < 46; i++) {
            let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i/3);
            let name = `Edward King ${i}`;
            this.data.push({
                key: '' + i,
                name,
                age,
                address: `London, Park Lane no. ${i}`,
                description: `My name is ${name}, I am ${age} years old, living in New York No. ${i+1} Lake Park.`,
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
            pageSize: 5
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

本例中使用的 CSS 样式为：

```css
#components-table-demo-drag-sorting tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
}

#components-table-demo-drag-sorting tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
}
```

### 表格分组

**版本：>=0.29.0**

对于一些数据需要分组展示的表格，可以传入 groupBy 定义分组规则，使用 renderGroupSection 来定义分组表头的渲染。

> **注意：**请务必为每行数据提供一个与其他行值不同的 "key"，或者使用 rowKey 参数指定一个作为主键的属性名。

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
                        onClick: e => { console.log(`Grouped row clicked: `, group, index) }
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

### 虚拟化表格

虚拟化可用于需要渲染大规模数据的场景，通过配置 `virtualized` 参数来开启这个功能。需要注意的是：

-   必须传递 `scroll.y`（number） 与 `style.width`（number）；
-   需要传递每行的高度 `virtualized.itemSize`（不传时普通行高默认为 `56`，组头行高默认为 `56`），可以为如下类型：
    -   `number` 
    -   `(index, { sectionRow?: boolean, expandedRow?: boolean }) => number`
-   表格分组虚拟化需要版本 >= `0.37.0`
-   Semi Table底层借助了react-window的能力来实现虚拟化，因此react-window VariableSizeList 所支持的其他参数也可以通过virtualized(object)传入，例如overscanCount
-   如果需要使用VariableSizeList的API，可以传入`getVirtualizedListRef`获取对应ref，需要版本 >= `1.20`

以下为渲染 1000 条数据的示例。

```jsx live=true noInline=true dir="column"
import React from 'react';
import { Table, Tag, Tooltip, Button } from '@douyinfe/semi-ui';

class VirtualizedFixedDemo extends React.Component {
    constructor(props = {}) {
        super(props);
        this.virtualizedListRef = React.createRef()
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
            <>
                <Button onClick={() => this.virtualizedListRef.current.scrollToItem(100)}>Scroll to 100</Button>
                <Table
                    pagination={false}
                    columns={this.columns}
                    dataSource={this.data}
                    scroll={this.scroll}
                    style={this.style}
                    virtualized
                    getVirtualizedListRef={ref => this.virtualizedListRef = ref}
                />
            </>
        );
    }
}

render(VirtualizedFixedDemo);

```

### 无限滚动

基于虚拟化特性，通过传入 `virtualized.onScroll` 我们可以实现无限滚动加载数据。

```jsx live=true noInline=true dir="column" hideInDSM
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

### 受控的动态表格

```jsx live=true noInline=true dir="column" hideInDSM
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
                                text: '姓名中包含 1',
                                value: '1',
                            },
                            {
                                text: '姓名中包含 2',
                                value: '2',
                            },
                            {
                                text: '姓名中包含 3',
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

            if(!checked) {
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
                    <TableSwitch text="固定表头：" checked={scroll && scroll.y} onChange={this.toggleFixHeader} />
                    <TableSwitch text="隐藏表头：" onChange={this.toggleHideHeader} />
                    <TableSwitch text="显示标题：" onChange={this.toggleTitle} />
                    <TableSwitch text="显示底部：" onChange={this.toggleFooter} />
                    <TableSwitch text="固定列：" onChange={this.toggleFixColumns} />
                    <TableSwitch text="显示选择列：" onChange={this.toggleRowSelection} />
                    <TableSwitch text="显示加载状态：" onChange={this.toggleLoading} checked={loading} />
                    <TableSwitch
                        text="无数据："
                        onChange={this.toggleDataSource}
                        checked={!dataSource || !dataSource.length}
                    />
                    <TableSwitch text="开启排序功能：" onChange={this.toggleShowSorter} />
                    <TableSwitch text="开启过滤功能：" onChange={this.toggleShowFilter} />
                    <TableSwitch
                        text="开启行展开功能："
                        onChange={this.toggleExpandedRowRender}
                        checked={typeof expandedRowRender === 'function'}
                    />
                    <TableSwitch text="展开当前所有行：" onChange={this.toggleExpandedRowKeys} />
                    <TableSwitch text="显示边框：" onChange={this.toggleBordered} checked={bordered} />
                    <TableSwitch text="开启列伸缩功能：" onChange={this.toggleResizable} />
                    <TableSwitch text="分页控件：">
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

### 完全自定义渲染

**版本：**>=0.34.0

一般情况下，使用 `Column.render` 即可，但是你也可以通过传递 `Column.useFullRender=true` 来开启完全自定义渲染模式，此时复选框按钮、展开按钮、缩进等组件将会透传至 `Column.title` 与 `Column.render` 方法中，你可以进一步来定义表头和单元格的内容渲染方式。

其中 `Column.title` 接受的入参为：

```tsx
{
    filter: ReactNode, // 筛选按钮
    sorter: ReactNode, // 排序按钮
    selection: ReactNode, // 选择按钮
}
```

`Column.render` 第四个入参为一个object，结构如下：

```tsx
{
    expandIcon: ReactNode, // 展开按钮
    selection: ReactNode, // 选择按钮
    indentTex: ReactNode, // 缩进
}
```

> 下方的例子则是将复选框与内容渲染至同一单元格和表头中。

```jsx live=true noInline=true dir="column"
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table } from '@douyinfe/semi-ui';

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
                        text: '名字包含"1"',
                        value: '1',
                    },
                    {
                        text: '名字包含"2"',
                        value: '2',
                    },
                ],
                onFilter: (value, record) => record.name.indexOf(value) > -1,
                sorter: (a, b) => a.name.length - b.name.length,
                // 此处将useFullRender设置为true开启完全自定义渲染
                useFullRender: true,
                // 此处从render的第四个形参中解构出 展开按钮、选择按钮、文本等内容
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
                width: 250
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

render(Demo)
```

### 表头合并

**版本：>=1.1.0**

用户可以通过表头合并功能进行表头的分组，表头合并支持与固定列、虚拟化、数据分组、列伸缩等功能复合使用，也同时支持 JSX 或者配置式写法。

#### 合并表头配置式写法

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

render(Demo)
```

#### 合并表头 JSX 写法

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

render(Demo)
```


### 行列合并

- 表头除了通过 children 写法进行合并外，可通过设置 column.colSpan 进行表头的列合并。
- 表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。

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


## API 参考

## Table

| 属性                    | 说明                                                                         | 类型                                                                                                            | 默认值     | 版本                                           |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------- |
| bordered                | 是否展示外边框和列边框                                                       | boolean                                                                                                         | false      |
| childrenRecordName      | 树形表格dataSource中每行元素中表示子级数据的字段，默认为children            |    string     |   'children'         |
| className               | 最外层样式名                                                                 | string                                                                                                          |            |
| clickGroupedRowToExpand | 点击分组表头行时分组内容展开或收起                                           | boolean                                                                                                         |            | **0.29.0**                              |
| columns                 | 表格列的配置描述，详见[Column](#Column)                                      | Column[]                                                                                                        | []         |
| dataSource              | 数据                                                                         | RecordType[]                                                                                                   | []         |
| defaultExpandAllRows    | 默认是否展开所有行                                                           | boolean                                                                                                         | false      |
| defaultExpandAllGroupRows  | 默认是否展开分组行                                                          | boolean                                                                                                         | false      | **1.30.0**
| defaultExpandedRowKeys  | 默认展开的行 key 数组                                                        | Array<\*>                                                                                                       | []         |
| empty                   | 无数据时展示的内容                                                           | ReactNode                                                                                               | '暂无数据' |
| expandCellFixed         | 展开图标所在列是否固定，与 Column 中的 fixed 取值相同                        | boolean\|string                                                                                                 | false      |
| expandIcon              | 自定义展开按钮，传 `false` 关闭默认的渲染                                    | boolean \| ReactNode<br/> \| (expanded: boolean) => ReactNode                                                        |            |
| expandedRowKeys         | 展开的行，传入此参数时行展开功能将受控                                       | (string | number)[]                                                                                                 |            |
| expandedRowRender       | 额外的展开行                                                                 | (record: object, index: number, expanded: boolean) => ReactNode                                                 |            |
| expandAllRows           | 是否展开所有行                                                           | boolean                                                                                                         | false      | **1.30.0**
| expandAllGroupRows      | 是否展开分组行                                                           | boolean                                                                                                         | false      | **1.30.0**
| expandRowByClick        | 点击行时是否展开可展开行                                                 | boolean                                                                                    |  false  | **1.31.0**
| footer                  | 表格尾部                                                                     | ReactNode<br/>\|(pageData: object) => ReactNode                                              |            | 
| getVirtualizedListRef   | 返回虚拟化表格所用VariableSizeList的ref，仅在配置virtualized时有效 | (ref: React.RefObject) => void      |            |   **1.20.0** |
| groupBy                 | 分组依据，一般为 dataSource 元素中某个键名或者返回值为字符串、数字的一个方法 | string\|number<br/>\|(record: RecordType) => string\|number                                                                     |            | **0.29.0**                              |
| hideExpandedColumn      | 当表格可展开时，展开按钮默认会与第一列文案渲染在同一个单元格内，设为false时默认将展开按钮单独作为一列渲染                         | boolean                                                                                                         | true      |
| indentSize              | 树形结构 TableCell 的缩进大小                         | number                                                                                                         | 20      |
| loading                 | 页面是否加载中                                                               | boolean                                                                                                         | false      |
| pagination              | 分页组件配置                                                                 | boolean\|TablePaginationProps                                                                                                 | true       |
| prefixCls               | 样式名前缀                                                                   | string                                                                                                          |            |
| renderGroupSection      | 表头渲染方法                                                                 | (groupKey?: string \| number, group?: string[] \| number[]) => ReactNode                                        |            | **0.29.0**                              |
| renderPagination        | 自定义分页器渲染方法                                                                 | (paginationProps?: TablePaginationProps) => ReactNode                                        |            | **1.13.0**                              |
| resizable               | 是否开启伸缩列功能，需要进行伸缩的列必须要提供 width 的值                    | boolean\|[Resizable](#Resizable)                                                                                | false      |
| rowExpandable           | 传入该参数时，Table作行渲染时会调用该函数，返回值用于判断该行是否可展开，返回值为 false 时关闭可展开按钮的渲染                        | (record: object) => boolean                                                       |  | **0.27.0**                              |
| rowKey                  | 表格行 key 的取值，可以是字符串或一个函数                                    | string<br/>\|(record: RecordType) => string                                                                             | 'key'      |
| rowSelection            | 表格行是否可选择，详见 [rowSelection](#rowSelection)                         | object                                                                                                          | -          |
| scroll                  | 表格是否可滚动，配置滚动区域的宽或高，详见 [scroll](#scroll)                 | object                                                                                                          | -          |
| showHeader              | 是否显示表头                                                                 | boolean                                                                                                         | true       |
| size                    | 表格尺寸，影响表格行 `padding`                                               | "default"\|"middle"\|"small"                                                                                    | "default"  | **1.0.0**                                      |
| title                   | 表格标题                                                                     | ReactNode<br/>\|(pageData: RecordType[]) => ReactNode                                              |            |
| virtualized             | 虚拟化配置                                                                   | Virtualized                                                                                                 | false      | **0.33.0**                              |
| virtualized.itemSize    | 每行的高度                                                                   | number\|(index: number) => number                                                                               | 56         | **0.33.0**                              |
| virtualized.onScroll    | 虚拟化滚动回调方法                                                           | ( scrollDirection?: 'foward' \| 'backward', scrollOffset?: number, scrollUpdateWasRequested?: boolean ) => void |            | **0.33.0**                              |
| onChange                | 分页、排序、筛选变化时触发                                                   | ({ pagination: TablePaginationProps, <br/>filters: Array<\*>, sorter: object, extra: any }) => void                            |            |
| onExpand                | 点击行展开图标时进行触发                                                     | (expanded: boolean, record: RecordType, DOMEvent: MouseEvent) => void                                               |            | 第三个参数 DOMEvent 需版本 **>=0.28.0** |
| onExpandedRowsChange    | 展开的行变化时触发                                                           | (rows: RecordType[]) => void                                                                                        |            |
| onGroupedRow            | 类似于 onRow，不过这个参数单独用于定义分组表头的行属性                       | (record: RecordType, index: number) => object                                                                       |            | **0.29.0**                              |
| onHeaderRow             | 设置头部行属性，返回的对象会被合并传给表头行                                 | (columns: Column[], index: number) => object                                                                       |            |
| onRow                   | 设置行属性，返回的对象会被合并传给表格行                                     | (record: RecordType, index: number) => object                                                                       |            |

一些上面用到的类型定义：

```typescript
// PaginationProps 为 Pagination 组件支持的 props
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

RecordType 为 Table 和 Column 的泛型参数，默认为 object 类型。你可以这样使用 RecordType：

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

function App() {
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

    return (
        <Table<Record>
            columns={columns}
            dataSource={data}
            // ...
        >
    );
}
```

## onHeaderRow / onRow用法

onHeaderRow中可以返回 th 支持的属性或者事件
onRow中可以返回 tr 支持的属性或者事件

```jsx
<Table
    onRow={(record, index) => {
        return {
            onClick: event => {}, // 点击行
            onMouseEnter: event => {}, // 鼠标移入行
            onMouseLeave: event => {}, // 鼠标移出行
            className: '',
            // ...
            // 其他可以作用于 tr 的属性或事件
        };
    }}
    onHeaderRow={(columns, index) => {
        return {
            onClick: event => {}, // 点击表头行
            onMouseEnter: event => {}, // 鼠标移入表头行
            onMouseLeave: event => {}, // 鼠标移出表头行
            className: '',
            // ...
            // 其他可以作用于 th 的属性或事件
        };
    }}
/>
```

## Column

| 属性                          | 说明                                                                                                | 类型                                                                                             | 默认值 | 版本                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ | ----------------------------------- |
| align                         | 设置列的对齐方式                                                                                    | 'left' \| 'right' \| 'center'                                                                    | 'left' |
| className                     | 列样式名                                                                                            | string                                                                                           |        |
| children                      | 表头合并时用于子列的设置                                                                                            | Column[]                                                                                          |        |
| colSpan                       | 表头列合并,设置为 0 时，不渲染                                                                      | number                                                                                           |        |
| dataIndex                     | 列数据在数据项中对应的 key                                                                          | string                                                                                           |        |
| defaultSortOrder              | 排序的默认值，可设置为 'ascend'\|'descend'\|false                                         | boolean\| string                                                                                          |  false  | **1.31.0**
| filterChildrenRecord          | 是否需要对子级数据进行本地过滤，开启该功能后如果子级符合过滤标准，父级即使不符合仍然会保留          | boolean                                                                                          |        | **0.29.0**                   |
| filterDropdown                | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互                                      | ReactNode                                                                                        |        |
| filterDropdownProps           | 透传给 Dropdown 的属性，详情点击[Dropdown API](/zh-CN/show/dropdown#Dropdown)                                                                      | object                                                                                        |        |
| filterDropdownVisible         | 控制 Dropdown 的 visible，详情点击[Dropdown API](/zh-CN/show/dropdown#Dropdown)                                                                      | boolean                                                                                        |        |
| filterIcon                    | 自定义 filter 图标                                                                                  | boolean\|ReactNode\|(filtered: boolean) => ReactNode                                             |        |
| filterMultiple                | 是否多选                                                                                            | boolean                                                                                          | true   |
| filteredValue                 | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组                                 | any[]                                                                                            |        |
| filters                       | 表头的筛选菜单项                                                                                    | Filter[]                                                                                         |        |
| fixed                         | 列是否固定，可选 true(等效于 left) 'left' 'right'                                                   | boolean\|string                                                                                  | false  |
| key                           | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性                                  | string                                                                                           |        |
| render                        | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并 | (text: string, record: RecordType, index: number, { expandIcon?: ReactNode }) => object\|ReactNode   |        |
| renderFilterDropdownItem      | 自定义每个筛选项渲染方式，用法详见[自定义筛选项渲染](#自定义筛选项渲染)                             | ({ value: any, text: any, onChange: Function, level: number, ...otherProps }) => ReactNode       | -      | **1.1.0**                   |
| sortChildrenRecord            | 是否对子级数据进行本地排序                                                                          | boolean                                                                                          |        | **0.29.0**                   |
| sortOrder                     | 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend'\|'descend'\|false                         | boolean\| string                                                                                          | false   |
| sorter                        | 排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true       | boolean\|(r1: RecordType, r2: RecordType) => number                                                      | true   |
| title                         | 列头显示文字。传入 function 时，title 将使用函数的返回值；传入其他类型，将会和 sorter、filter 进行聚合         | ReactNode\|({ filter: ReactNode, sorter: ReactNode, selection: ReactNode }) => ReactNode |        | Function 类型需要**0.34.0** |
| useFullRender                 | 是否完全自定义渲染，用法详见[完全自定义渲染](#完全自定义渲染)                                       | boolean                                                                                          | false  | **0.34.0**                  |
| width                         | 列宽度                                                                                              | string \| number                                                                                 |        |
| onCell                        | 设置单元格属性                                                                                      | (record: RecordType, rowIndex: number) => object                                                     |        |
| onFilter                      | 本地模式下，确定筛选的运行函数                                                                      | (filteredValue: any[], record: RecordType) => boolean                                                |        |
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时回调                                                                        | (visible: boolean) => void                                                                       |        |
| onHeaderCell                  | 设置头部单元格属性                                                                                  | (column: RecordType, columnIndex: number) => object                                                  |        |

一些上面用到的类型定义：

```typescript
type Filter = {
    value: any;
    text: React.ReactNode;
    children?: Filter[];
};
```

## Column.onCell / onHeaderCell 用法

与onRow、onHeaderRow类似，在 `column.onCell` `column.onHeaderCell` 中也能返回 td/th 支持的属性或事件


## rowSelection

| 属性             | 说明                                            | 类型                                                                                         | 默认值 | 版本               |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ | ------------------ |
| className        | 所处列样式名                                    | string                                                                                       |        |                    |
| disabled         | 表头的 `Checkbox` 是否禁用                      | boolean                                                                                      | false  | **0.32.0**  |
| fixed            | 把选择框列固定在左边                            | boolean                                                                                      | false  |                    |
| getCheckboxProps | 选择框的默认属性配置                            | (record: RecordType) => object                                                                   |        |                    |
| hidden           | 是否隐藏选择列                                  | boolean                                                                                      | false  | **0.34.0** |
| selectedRowKeys  | 指定选中项的 key 数组，需要和 onChange 进行配合 | string[]                                                                                     |        |                    |
| title            | 自定义列表选择框标题                            | string\|ReactNode                                                                            |        |                    |
| width            | 自定义列表选择框宽度                            | string\|number                                                                               |        |                    |
| onChange         | 选中项发生变化时的回调                          | (selectedRowKeys: number[]\|string[], selectedRows: RecordType[]) => void                        |        |                    |
| onSelect         | 用户手动选择/取消选择某行的回调                 | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void |        |                    |
| onSelectAll      | 用户手动选择/取消选择所有行的回调               | (selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]) => void                   |        |                    |

## scroll

| 属性                     | 说明                                                       | 类型           | 默认值 | 版本          |
| ------------------------ | ---------------------------------------------------------- | -------------- | ------ | ------------- |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否自动滚动到表格顶部             | boolean        | false  | **1.1.0** |
| x                        | 设置横向滚动区域的宽，可以为像素值、百分比或 'max-content' | string\|number |        |               |
| y                        | 设置纵向滚动区域的高，可以为像素值                         | number         |        |               |

## pagination

翻页组件配置。pagination 建议不要使用字面量写法。

| 属性               | 说明                                                                                                                                         | 类型                                                                                          | 默认值   | 版本                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------- | ------------------- |
| currentPage        | 当前页码                                                                                                                                     | number                                                                                        | -        |                     |
| defaultCurrentPage | 默认的当前页码                                                                                                                               | number                                                                                        | 1        | **>=1.1.0** |
| formatPageText     | 翻页区域文案自定义格式化，传 false 关闭文案显示；该项影响表格翻页区域左侧文案显示，不同于 `Pagination` 组件的 `showTotal` 参数，请注意甄别。 | boolean \| ({ currentStart: number, currentEnd: number, total: number }) => string\|ReactNode | true     | **>=0.27.0** |
| pageSize           | 每页条数                                                                                                                                     | number                                                                                        | 10       |                     |
| position           | 位置                                                                                                                                         | 'bottom'\|'top'\|'both'                                                                       | 'bottom' |                     |
| total              | 数据总数                                                                                                                                     | number                                                                                        | 0        | **>=0.25.0**        |

其他配置详见[Pagination](/zh-CN/navigation/pagination#API参考)

## Resizable

resizable 对象型的参数，主要包括一些表格列伸缩时的事件方法。这些事件方法都可以返回一个对象，该对象会和最终的 column 合并。

| 属性          | 说明                     | 类型                                             | 默认值 |
| ------------- | ------------------------ | ------------------------------------------------ | ------ |
| onResize      | 表格列改变宽度时触发     | (column: [Column](#Column)) => [Column](#Column) |        |
| onResizeStart | 表格列开始改变宽度时触发 | (column: [Column](#Column)) => [Column](#Column) |        |
| onResizeStop  | 表格列停止改变宽度时触发 | (column: [Column](#Column)) => [Column](#Column) |        |

## 方法

通过 ref 可以访问到 Table 提供的一些内部方法：

```jsx
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

| 名称                 | 描述                                                                                                      | 版本           |
| -------------------- | --------------------------------------------------------------------------------------------------------- | -------------- |
| getCurrentPageData() | 返回当前页的数据对象：{ dataSource: RecordType[], groups: Map<{groupKey: string, recordKeys: Set<string\>}> } | 0.37.0 |

## 设计变量
<DesignToken/>

## FAQ

- **表格数据为何没有更新？**  
    Table 组件目前所有参数都为浅层对比，也就是说如果该参数值类型为一个 Array 或者 Object，你需要手动改变其引用才能触发更新。同理，如果你不想触发额外更新，尽量不要直接在传参的时候使用字面量或是在 render 过程中定义引用型参数值：
    ```jsx
    // ...render() {
        <Table dataSource={[/*...*/]} columns={[/*...*/]} />}
    ```
    上述的写法在每次 render 时都会触发表格内部对数据的更新（会清空当前的选中行以及展开行 key 数组等）。为了性能及避免一些异常，**请尽量将一些引用型参数定义在 render 方法之外（如果使用了 hooks 请利用 useMemo 或者 useState 进行存储）。**

- **为何我的表格行不能选中以及展开？**

    请指定 rowKey 或者给 dataSource 的每项设置一个各不相同的 "key" 属性。**表格内所有行相关的操作都需要使用到。**

- **如何实现点击排序按钮时自定义排序或传参给服务端排序？**
    
    onChange 方法的入参包括 pagination、filters、sorter，用户可以根据 sorter 对 dataSource 进行自定义排序。

- **如何给某一行添加 className？**
    
    使用 onRow 或 onHeaderRow。

- **如何给 table cell 设置样式？**
    
    涉及到单个 cell 需要控制样式的，可以通过 column.onHeaderCell、column.onCell 控制。

查看更多 Table FAQ 和用例，点击 <a href="https://bytedance.feishu.cn/docs/doccnsYk1qUmsIDP1ihJ9zjG0Ch" target="_blank">Table FAQ</a>


<!-- ## 相关物料
```material
196,110,104,113,226
``` -->