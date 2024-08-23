import React, { useState, useEffect } from 'react';
import { Table, Avatar, Tag } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';
import { IconTickCircle, IconClear, IconComment } from '@douyinfe/semi-icons';
import { ColumnProps } from 'table/interface';

export default function App() {
    const [dataSource, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setPage] = useState(1);

    const DAY = 24 * 60 * 60 * 1000;
    const figmaIconUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png';
    const pageSize = 5;

    const columns: ColumnProps[] = [
        {
            title: '标题',
            dataIndex: 'name',
            width: 400,
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={figmaIconUrl} style={{ marginRight: 12 }}></Avatar>
                        {text}
                    </div>
                );
            },
            defaultFilteredValue: ['test'],
            filters: [
                {
                    text: 'test',
                    value: 'test',
                },
                {
                    text: 'test2',
                    value: 'test2',
                },
            ],
            onFilter: (value, record) => record.name.includes(value),
        },
        {
            title: '大小',
            dataIndex: 'size',
            sorter: (a, b) => (a.size - b.size > 0 ? 1 : -1),
            render: text => `${text} KB`,
        },
        {
            title: '交付状态',
            dataIndex: 'status',
            render: text => {
                const tagConfig = {
                    success: { color: 'green', prefixIcon: <IconTickCircle />, text: '已交付' },
                    pending: { color: 'pink', prefixIcon: <IconClear />, text: '已延期' },
                    wait: { color: 'cyan', prefixIcon: <IconComment />, text: '待评审' },
                };
                const tagProps = tagConfig[text] || {};
                return (
                    <Tag shape="circle" {...tagProps} style={{ userSelect: 'text' }}>
                        {tagProps.text}
                    </Tag>
                );
            },
        },
        {
            title: '所有者',
            dataIndex: 'owner',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" color={record.avatarBg} style={{ marginRight: 4 }}>
                            {typeof text === 'string' && text.slice(0, 1)}
                        </Avatar>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '更新日期',
            dataIndex: 'updateTime',
            sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
            render: value => {
                return dateFns.format(new Date(value), 'yyyy-MM-dd');
            },
        },
    ];

    const getData = () => {
        const data = [];
        for (let i = 0; i < 46; i++) {
            const isSemiDesign = i % 2 === 0;
            const randomNumber = (i * 1000) % 199;
            data.push({
                key: '' + i,
                name: i === 0 ? 'test' : isSemiDesign ? `Semi Design 设计稿${i}.fig` : `Semi D2C 设计稿${i}.fig`,
                owner: isSemiDesign ? '姜鹏志' : '郝宣',
                size: randomNumber,
                status: isSemiDesign ? 'success' : 'wait',
                updateTime: new Date().valueOf() + randomNumber * DAY,
                avatarBg: isSemiDesign ? 'grey' : 'red',
            });
        }
        return data;
    };

    const data = getData();

    const fetchData = (currentPage = 1) => {
        setLoading(true);
        setPage(currentPage);
        return new Promise((res, rej) => {
            setTimeout(() => {
                const data = getData();
                let dataSource = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                res(dataSource);
            }, 300);
        }).then(dataSource => {
            setLoading(false);
            setData(dataSource);
        });
    };

    const handlePageChange = page => {
        fetchData(page);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{
                currentPage,
                pageSize: 5,
                total: data.length,
                onPageChange: handlePageChange,
            }}
            loading={loading}
        />
    );
}
