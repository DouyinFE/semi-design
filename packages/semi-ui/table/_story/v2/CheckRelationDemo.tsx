import React, { useMemo, useState } from 'react';
import { Table } from '../index';

/**
 * 测试 checkRelation='related' 功能
 * 树形表格选择时，父子节点关联
 */
const CheckRelationDemo = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [unRelatedSelectedKeys, setUnRelatedSelectedKeys] = useState<string[]>([]);

    const columns = useMemo(
        () => [
            {
                title: 'Key',
                dataIndex: 'dataKey',
                key: 'dataKey',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 150,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
            },
        ],
        []
    );

    const data = useMemo(
        () => [
            {
                key: '1',
                dataKey: 'videos_info',
                name: '视频信息',
                type: 'Object',
                description: '视频的元信息',
                children: [
                    {
                        key: '1-1',
                        dataKey: 'status',
                        name: '视频状态',
                        type: 'Enum',
                        description: '视频可见状态',
                    },
                    {
                        key: '1-2',
                        dataKey: 'vid',
                        name: '视频 ID',
                        type: 'String',
                        description: '唯一视频 ID',
                        children: [
                            {
                                key: '1-2-1',
                                dataKey: 'video_url',
                                name: '视频地址',
                                type: 'String',
                                description: '视频链接',
                            },
                            {
                                key: '1-2-2',
                                dataKey: 'video_hash',
                                name: '视频哈希',
                                type: 'String',
                                description: '视频哈希值',
                            },
                        ],
                    },
                ],
            },
            {
                key: '2',
                dataKey: 'text_info',
                name: '文本信息',
                type: 'Object',
                description: '文本的元信息',
                children: [
                    {
                        key: '2-1',
                        dataKey: 'title',
                        name: '标题',
                        type: 'String',
                        description: '文本标题',
                    },
                    {
                        key: '2-2',
                        dataKey: 'description',
                        name: '描述',
                        type: 'String',
                        description: '文本描述',
                    },
                ],
            },
        ],
        []
    );

    const relatedRowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: (newSelectedRowKeys: string[]) => {
                console.log('related mode selectedRowKeys:', newSelectedRowKeys);
                setSelectedRowKeys(newSelectedRowKeys);
            },
            checkRelation: 'related' as const,
        }),
        [selectedRowKeys]
    );

    const unRelatedRowSelection = useMemo(
        () => ({
            selectedRowKeys: unRelatedSelectedKeys,
            onChange: (newSelectedRowKeys: string[]) => {
                console.log('unRelated mode selectedRowKeys:', newSelectedRowKeys);
                setUnRelatedSelectedKeys(newSelectedRowKeys);
            },
            checkRelation: 'unRelated' as const,
        }),
        [unRelatedSelectedKeys]
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>checkRelation='related' 模式（父子关联）</h2>
            <p>选中父节点自动选中所有子节点，选中子节点影响父节点状态（全选/半选/未选）</p>
            <div style={{ marginBottom: 10 }}>
                <strong>已选中的 keys:</strong> {JSON.stringify(selectedRowKeys)}
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowSelection={relatedRowSelection}
                pagination={false}
                defaultExpandAllRows
            />
            
            <h2 style={{ marginTop: 40 }}>checkRelation='unRelated' 模式（默认，父子独立）</h2>
            <p>父子节点选择互不影响</p>
            <div style={{ marginBottom: 10 }}>
                <strong>已选中的 keys:</strong> {JSON.stringify(unRelatedSelectedKeys)}
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowSelection={unRelatedRowSelection}
                pagination={false}
                defaultExpandAllRows
            />
        </div>
    );
};

export default CheckRelationDemo;
