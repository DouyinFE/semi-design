import { Table, Tooltip } from '@douyinfe/semi-ui';
import React, { useMemo, useState } from 'react';

function App() {
    const defaultSelectedRowKeys = useMemo(() => ['2', '3'], []);
    const [selectedRowKeys, setSelectedRowKeys] = useState(defaultSelectedRowKeys);

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
    ], []);

    const data = useMemo(() => {
        const _data = [];
        for (let i = 0; i < 5; i++) {
            let age = i * 1000;
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

    const rowSelection = {
        renderCell: ({ selected, record, index, originNode }) => {
            if (record.age < 2000) {
                return (
                    <Tooltip content="自定义 renderCell">
                        <div>{originNode}</div>
                    </Tooltip>
                );
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
            disabled: record.age < 2000,
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

    return (
        <div>
            <Table rowKey={record => record.key} columns={columns} dataSource={data} rowSelection={rowSelection} />
        </div>
    );
}

export default App;
