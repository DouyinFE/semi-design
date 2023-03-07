import React from 'react';
import { Table, Avatar, Space } from '../../../index';
import { ColumnProps } from '../../../table/interface';

export default function App() {
    const columns: ColumnProps[] = [
        {
            title: '标题 align left + fixed left',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <Space spacing={12}>
                        <Avatar
                            size="small"
                            shape="square"
                            src={record.nameIconSrc}
                        ></Avatar>
                        {text}
                    </Space>
                );
            },
            align: 'left',
            fixed: 'left',
            width: 300
        },
        {
            title: '大小 align center',
            dataIndex: 'size',
            align: 'center',
            width: 200,
        },
        {
            title: '所有者 align right',
            dataIndex: 'owner',
            render: (text, record, index) => {
                return (
                    <Space spacing={4}>
                        <Avatar size="small" color={record.avatarBg}>
                            {typeof text === 'string' && text.slice(0, 1)}
                        </Avatar>
                        {text}
                    </Space>
                );
            },
            align: 'right',
        },
        {
            title: '更新日期 align default + fixed right',
            dataIndex: 'updateTime',
            width: 200,
            fixed: 'right',
        }
    ];
    const data = [
        {
            key: '1',
            name: 'Semi Design 设计稿.fig',
            nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png',
            size: '2M',
            owner: '姜鹏志',
            updateTime: '2020-02-02 05:13',
            avatarBg: 'grey',
        },
        {
            key: '2',
            name: 'Semi Design 分享演示文稿',
            nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
            size: '2M',
            owner: '郝宣',
            updateTime: '2020-01-17 05:31',
            avatarBg: 'red',
        },
        {
            key: '3',
            name: '设计文档',
            nameIconSrc: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
            size: '34KB',
            owner: 'Zoey Edwards',
            updateTime: '2020-01-26 11:01',
            avatarBg: 'light-blue',
        },
    ];

    return <Table bordered columns={columns} dataSource={data} scroll={{ y: 300, x: 1200 }} pagination={false} />;
}
