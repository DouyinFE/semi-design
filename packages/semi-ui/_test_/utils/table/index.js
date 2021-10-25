import React from 'react';
import { Tooltip, Tag, Table } from '../../../index';

const { Column } = Table;

function getRandomNumber(end = 100, start = 0) {
    const number = Math.ceil(Math.random() * (end - start)) + start;
    return number;
}

function getData(total = 25) {
    const _data = [];
    for (let i = 0; i < total; i++) {
        let age = 40 + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(i / 3);
        let name = `Edward King ${i}`;
        _data.push({
            key: String(i),
            name,
            age,
            address: `London, Park Lane no. ${i} Lake Park`,
            description: `My name is ${name}, I am ${age} years old, living in New York No. ${i + 1} Lake Park.`,
        });
    }
    return _data;
}

function getGroupData() {
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
    return data;
}

function getColumns() {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            width: 150,
        },
        {
            title: 'Description',
            dataIndex: 'description',
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
            fixed: 'right',
        },
    ];
    return columns;
}

function getJSXColumns() {
    const jsxColumns = (
        <>
            <Column title={'Name'} dataIndex={'name'} width={150} />
            <Column title={'Age'} dataIndex={'age'} width={150} />
            <Column title={'Address'} dataIndex={'address'} />
            <Column
                render={(text, record) => (
                    <Tooltip content={record.description}>
                        <Tag color="green">Show Info</Tag>
                    </Tooltip>
                )}
                width={150}
            />
        </>
    );
    return jsxColumns;
}

function getGroupColumns() {
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
    return columns;
}

function getNestColumns() {
    const nestColumns = ([
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
    ]);
    return nestColumns;
}

function getNestData(total = 25) {
    const data = [];
    for (let i = 0; i < total; i++) {
        let age = 40 + (Math.random() > 0.5 ? 1 : -1) * (i % 9);
        let name = `Edward King ${i}`;
        data.push({
            key: String(i),
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
}

function getTreeData() {
    const childrenData = [
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
    return childrenData;
}

function getJSXNestColumns() {
    const filters = [
        {
            text: 'Code 45',
            value: '45',
        },
        {
            text: 'King 4',
            value: 'King 4',
        },
    ];
    const jsxNestColumns = (
        <>
            <Column title={'Base Information'} dataIndex={'base'} fixed="left">
                <Column
                    title={'Name'}
                    dataIndex={'name'}
                    fixed="left"
                    width={200}
                    filters={filters}
                    onFilter={(value, record) => record.name.includes(value)}
                />
                <Column
                    title={'Age'}
                    dataIndex={'age'}
                    width={100}
                    fixed="left"
                    sorter={(a, b) => (a.age - b.age > 0 ? 1 : -1)}
                />
            </Column>
            <Column title={'Company Information'} dataIndex={'company'}>
                <Column title={'Company Name'} dataIndex={'company.name'} />
                <Column title={'Company Address'} dataIndex={'company.address'} />
            </Column>
            <Column title={'Address'} dataIndex={'address'} width={250} fixed="right" />
        </>
    );
    return jsxNestColumns;
}

export {
    getRandomNumber,
    getData,
    getGroupData,
    getNestData,
    getTreeData,
    getColumns,
    getJSXColumns,
    getGroupColumns,
    getJSXNestColumns,
    getNestColumns
};
