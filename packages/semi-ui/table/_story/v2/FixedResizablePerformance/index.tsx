import React, { useEffect, useState } from 'react';
import { Table } from '@douyinfe/semi-ui';

const App = () => {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        setColumns([
            {
                title: '任务ID',
                width: 200,
                dataIndex: 'taskId',
                fixed: true,
            },
            {
                title: '所属项目',
                dataIndex: 'projectName',
                width: 200,
                render: (_: any, record: { projectName: any }) => record.projectName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName1',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName3',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName4',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务1',
                dataIndex: 'taskName5',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName6',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName7',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '所属任务',
                dataIndex: 'taskName8',
                width: 200,
                render: (_: any, record: { taskName: any }) => record.taskName || '-',
            },
            {
                title: '操作',
                dataIndex: 'actions',
                width: 220,
                fixed: 'right',
            },
        ]);
        reload();
    }, []);

    const reload = () => {
        setTimeout(() => {
            setData([
                {
                    taskId: '233',
                    projectName: '2333',
                    taskName: '2323',
                },
                {
                    taskId: '233',
                    projectName: '2333',
                    taskName: '2323',
                },
                {
                    taskId: '233',

                    projectName: '2333',
                    taskName: '2323',
                },
                {
                    taskId: '233',

                    projectName: '2333',
                    taskName: '2323',
                },
            ]);
        }, 1000);
    };
    const onPageChange = () => { };
    const onPageSizeChange = () => { };
    return (
        <Table
            columns={columns}
            dataSource={data}
            resizable
            scroll={{ x: 1200 }}
            pagination={{
                showSizeChanger: true,
                pageSize: 10,
                total: 100,
                currentPage: 1,
                onChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
            }}
        />
    );
};

export default App;