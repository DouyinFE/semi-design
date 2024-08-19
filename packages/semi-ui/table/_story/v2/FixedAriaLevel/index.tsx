import React from 'react';
import { Table } from '@douyinfe/semi-ui';

export default function App() {
    return (
        <Table
            rowKey="key"
            columns={[
                {
                    title: '标题',
                    width: 500,
                    dataIndex: 'name',
                },
            ]}
            dataSource={[
                {
                    key: '112',
                    name: 'Semi Design 设计稿.fig',
                    size: '2M',
                    owner: '姜鹏志',
                    updateTime: '2020-02-02 05:13',
                },
            ]}
            expandAllRows
            pagination={false}
        />
    );
}
