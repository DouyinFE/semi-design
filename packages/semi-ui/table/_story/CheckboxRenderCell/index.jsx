import { Table, Button, Tooltip, Checkbox } from '@douyinfe/semi-ui';
import React, { useMemo, useState, useEffect } from 'react';

function App() {
    const [dataTotalSize, setTotalSize] = useState(46);
    const [pagination, setPagination] = useState({ pageSize: 12, total: dataTotalSize, currentPage: 1 });

    const [dataSource, setDataSource] = useState([]);
    const defaultSelectedRowKeys = useMemo(() => ['1', '8', '17'], []);
    const [selectedRowKeys, setSelectedRowKeys] = useState(defaultSelectedRowKeys);
    const footerText = useMemo(() => `当前选中 ${selectedRowKeys.length} 项`, [selectedRowKeys]);

    const columns = useMemo(() => [
        {
            title: 'Name',
            dataIndex: 'name',
            render: text => <span>{text}</span>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            render: () => (
                <input
                    type="checkbox"
                    onClick={(...args) => {
                        console.log('onClick: ', ...args);
                    }}
                    onChange={(...args) => {
                        console.log('onChange: ', ...args);
                    }}
                />
            ),
        },
    ]);

    const data = useMemo(() => {
        const _data = [];
        for (let i = 0; i < dataTotalSize; i++) {
            let age = (i * 1000) % 149;
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
    }, [dataTotalSize]);

    useEffect(() => {
        setPagination({ ...pagination, total: dataTotalSize });
    }, [dataTotalSize]);

    useEffect(() => {
        const dataSource = [];
        const { pageSize } = pagination;
        dataSource.push(...data.slice(0, pageSize));
        setDataSource(dataSource);
    }, [data]);

    const rowSelection = {
        renderCell: (checked, record, index, originNode) => {
            if (record.age < 18) {
                return <Tooltip content="不满18岁不能搬砖哦~"><div>{originNode}</div></Tooltip>;
            }
            return originNode;
        },
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `rowSelection.onChanged: selectedRowKeys: ${JSON.stringify(selectedRowKeys)}`,
                'selectedRows: ',
                selectedRows
            );
            setSelectedRowKeys(selectedRowKeys);
        },
        onSelectAll: (selected, selectedRows, changedRows) => {
            console.log(
                `rowSelection.onSelectAll: selected :${selected}, selectedRows: ${selectedRows}, changedRows: ${changedRows}`
            );
        },
        getCheckboxProps: record => ({
            disabled: record.age < 18,
            name: record.name,
            onClick: (...args) => {
                console.log('Clicked checkbox: ', ...args);
            },
        }),
        onSelect: (record, selected) => {
            console.log('onSelect: ', record, selected);
        },
        disabled: true,
        selectedRowKeys,
        defaultSelectedRowKeys,
    };

    const onChange = (props = {}) => {
        const { pagination = {} } = props;
        const { currentPage, pageSize, total } = pagination;

        // console.log(`Table changed to: `, data);
        setDataSource(data.slice((currentPage - 1) * pageSize, currentPage * pageSize));
        setPagination({ currentPage, pageSize, total });
    };

    return (
        <div>
            <Table
                rowKey={record => record.key}
                columns={columns}
                dataSource={dataSource}
                rowSelection={rowSelection}
                pagination={pagination}
                onChange={onChange}
                footer={footerText}
                onRow={(record, index) => {
                    return {
                        onClick: () => {
                            console.log(`onRow.onClick: `, record, index);
                        },
                    };
                }}
            />
        </div>
    );
}

export default App;
