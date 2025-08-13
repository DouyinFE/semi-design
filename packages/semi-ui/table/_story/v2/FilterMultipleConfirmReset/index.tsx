import React, { useEffect, useState } from 'react';

import { Table, Avatar, Space, Button, Checkbox } from '@douyinfe/semi-ui';
import type { ColumnProps } from '../../../interface';
import * as dateFns from 'date-fns';

export default function App() {
    const [dataSource, setData] = useState<any[]>([]);

    const DAY = 24 * 60 * 60 * 1000;
    const figmaIconUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png';

    const columns: ColumnProps[] = [
        {
            title: '标题',
            dataIndex: 'name',
            width: 400,
            render: (text, record) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={figmaIconUrl} style={{ marginRight: 12 }}></Avatar>
                        {text}
                    </div>
                );
            },
            filters: [
                { text: 'Semi Design 设计稿', value: '设计稿' },
                { text: 'Semi Design 过程稿22', value: '过程稿22' },
                { text: 'Semi Design 过程稿33', value: '过程稿33' },
                { text: 'Semi Design 过程稿44', value: '过程稿44' },
            ],
            filterMultiple: true,
            onFilter: (value, record) => String(record.name).includes(value),
            renderFilterDropdown: ({ tempFilteredValue, setTempFilteredValue, confirm, clear, filters }) => (
                <Space vertical align="start" style={{ padding: 8 }}>
                    <div style={{ maxHeight: 240, overflow: 'auto', paddingRight: 4 }}>
                        {(filters || []).map(f => {
                            const checked = tempFilteredValue.includes(f.value);
                            const onChange = () => {
                                const next = checked
                                    ? tempFilteredValue.filter(v => v !== f.value)
                                    : [...tempFilteredValue, f.value];
                                setTempFilteredValue(next);
                            };
                            return (
                                <Checkbox key={String(f.value)} checked={checked} onChange={onChange}>
                                    {f.text}
                                </Checkbox>
                            );
                        })}
                    </div>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => clear({ closeDropdown: true })}>重置</Button>
                        <Button type="primary" onClick={() => confirm({ closeDropdown: true })}>确定</Button>
                    </Space>
                </Space>
            ),
        },
        {
            title: '大小',
            dataIndex: 'size',
            sorter: (a, b) => (a.size - b.size > 0 ? 1 : -1),
            render: text => `${text} KB`,
        },
        {
            title: '更新日期',
            dataIndex: 'updateTime',
            sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
            render: value => dateFns.format(new Date(value), 'yyyy-MM-dd'),
        },
    ];

    const getData = () => {
        const data: any[] = [];
        for (let i = 0; i < 46; i++) {
            const isDesign = i % 2 === 0;
            const randomNumber = (i * 1000) % 199;
            const suffix = i % 4 === 0 ? '设计稿' : i % 4 === 1 ? '过程稿22' : i % 4 === 2 ? '过程稿33' : '过程稿44';
            data.push({
                key: '' + i,
                name: `Semi Design ${suffix}${i}.fig`,
                size: randomNumber,
                updateTime: new Date('2024-01-25').valueOf() + randomNumber * DAY,
                owner: isDesign ? '姜鹏志' : '郝宣',
                avatarBg: isDesign ? 'grey' : 'red',
            });
        }
        return data;
    };

    useEffect(() => {
        setData(getData());
    }, []);

    return <Table columns={columns} dataSource={dataSource} />;
}


