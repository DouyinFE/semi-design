import { Table, Checkbox, SideSheet, Button } from '@douyinfe/semi-ui';
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import * as _ from 'lodash';
import { IconEdit } from '@douyinfe/semi-icons';
import testJson from '../data/big2.json';

const getKey = (record, rowKey) => (typeof rowKey === 'function' ? rowKey(rowKey) : _.get(record, rowKey));

const storeKeys = (parent = null, dataSource = [], map = {}, rowKey = 'key', childrenRecordName = 'children') => {
    if (Array.isArray(dataSource) && dataSource.length) {
        dataSource.forEach(record => {
            const key = getKey(record, rowKey);
            const children = _.get(record, childrenRecordName);

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

function ChildrenDataSelectedDemo(props = {}) {
    const childrenRecordName = 'children';
    const rowKey = 'key';
    const authPoint = 'auth_point_list';
    const checkName = 'role_perm';
    const isZh = true;
    const [expandedRowKeys, setExpandedRowKeys] = useState(['0', '1']);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [allKeys, setAllKeys] = useState([]);
    const [visible, setVisible] = useState(false);
    const tableRef = useRef();
    const getRecordKey = useCallback(record => getKey(record, rowKey), [rowKey]);
    const disabledRecord = useCallback(
        record => {
            // const children = _.get(record, childrenRecordName);
            // return !(Array.isArray(children) && children.length);
            return false;
        },
        [childrenRecordName]
    );
    const [data, setData] = useState([]);

    const getTableData = () => {
        const tableData = _.cloneDeep(testJson.data);
        const allKeys = [];
        for (let i = 0, len = tableData.length; i < len; ++i) {
            const key = `${i}`;
            tableData[i][rowKey] = key;
            allKeys.push(key);
        }
        const queue = [...tableData];
        while (queue.length) {
            const curNode = queue.shift();
            const someSelected = curNode[authPoint].some(item => item[checkName]);
            const everySelected = curNode[authPoint].every(item => item[checkName]);
            curNode.checkAll = {
                checked: curNode[authPoint] && curNode[authPoint].length && everySelected,
                indeterminate: someSelected,
            };
            const parentKey = curNode[rowKey];
            if (curNode.children.length) {
                for (let i = 0, len = curNode.children.length; i < len; ++i) {
                    const key = `${parentKey}.${childrenRecordName}.${i}`;
                    curNode.children[i][rowKey] = key;
                    allKeys.push(key);
                }
                queue.push(...curNode.children);
            }
        }

        setData(tableData);
        setAllKeys(allKeys);
        setExpandedRowKeys([...allKeys]);
    };

    const keysMap = useMemo(() => storeKeys(null, data, {}, rowKey, childrenRecordName), [
        data,
        rowKey,
        childrenRecordName,
    ]);

    const getCheckboxProps = record => {
        const children = _.get(record, childrenRecordName);
        const recordKey = getRecordKey(record);
        const checkboxProps = {};
        if (Array.isArray(children) && children.length) {
            const allChildrenKeys = children.map(getRecordKey);
            const someSelected = allChildrenKeys.some(key => selectedRowKeys.includes(key));
            if (someSelected && !selectedRowKeys.includes(recordKey)) {
                checkboxProps.indeterminate = true;
            }
        }
        return checkboxProps;
    };

    const getSet = (record, set, selected) => {
        const queue = [record];
        while (queue.length) {
            const curNode = queue.shift();
            const key = getRecordKey(curNode);
            // onChangeAll(key, {
            //     target: {
            //         checked: selected,
            //     },
            // });
            if (selected) {
                set.add(key);
            } else {
                set.delete(key);
            }
            if (curNode.children.length) {
                queue.push(...curNode.children);
            }
        }
    };

    const doSelect = (record, selected) => {
        const set = new Set([...selectedRowKeys]);
        getSet(record, set, selected);
        setSelectedRowKeys(Array.from(set));
        setExpandedRowKeys(Array.from(new Set([...expandedRowKeys, ...set])));
    };

    const doSelectAll = (selected, selectedRows, changedRows) => {
        setSelectedRowKeys(selected ? [...allKeys] : []);
        setExpandedRowKeys([...allKeys]);
        for (const key of allKeys) {
            // onChangeAll(key, {
            //     target: {
            //         checked: selected,
            //     },
            // });
        }
    };

    const onChangeOne = (recordKey, text, e) => {
        const tableData = _.cloneDeep(data);
        // const tableData = data;
        const findRecord = _.get(tableData, recordKey);
        const findCheckBox = _.find(findRecord[authPoint], item => {
            return item.code === text;
        });
        findCheckBox[checkName] = e.target.checked;
        const someSelected = findRecord[authPoint].some(item => item[checkName]);
        const everySelected = findRecord[authPoint].every(item => item[checkName]);
        findRecord.checkAll = {
            checked: everySelected,
            indeterminate: someSelected,
        };
        setData(tableData);
        // setData(_.cloneDeep(tableData));
    };

    const onChangeAll = (recordKey, e) => {
        const tableData = _.cloneDeep(data);
        const findRecord = _.get(tableData, recordKey);
        findRecord.checkAll = {
            checked: findRecord[authPoint] && findRecord[authPoint].length && e.target.checked,
        };
        for (const item of findRecord[authPoint]) {
            item[checkName] = e.target.checked;
        }
        setData(tableData);
    };

    const rowSelection = useMemo(
        () => ({
            fixed: true,
            getCheckboxProps,
            selectedRowKeys,
            onSelect: doSelect,
            onSelectAll: doSelectAll,
        }),
        [selectedRowKeys, getCheckboxProps, doSelect, doSelectAll]
    );

    const columns = [
        {
            title: 'authSideSheetTitle',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            fixed: true,
            render: (text, record) => {
                return isZh ? record.name : record.en_name;
            },
        },
        {
            title: 'authSideSheetCheckAll',
            dataIndex: 'checkAll',
            key: 'checkAll',
            width: 100,
            fixed: true,
            render: (text, record) => {
                return <Checkbox {...text} onChange={(...args) => onChangeAll(record.key, ...args)} />;
            },
        },
        {
            title: 'authSideSheetAuthPoint',
            dataIndex: authPoint,
            key: authPoint,
            render: (text, record) => {
                return record[authPoint].map(item => {
                    return (
                        <Checkbox
                            style={{ display: 'inline-flex', marginRight: 20 }}
                            key={item.code}
                            checked={item.role_perm}
                            onChange={(...args) => onChangeOne(record.key, item.code, ...args)}
                        >
                            {isZh ? item.name : item.en_name}
                        </Checkbox>
                    );
                });
            },
        },
        {
            title: `Operations`,
            width: 120,
            key: 'Operations',
            render: () => <Button icon={<IconEdit />} />,
            fixed: 'right',
        },
    ];

    useEffect(() => {
        getTableData();
    }, []);

    return (
        <div>
            <Button onClick={() => setVisible(true)}>切换显示侧边栏</Button>
            <Button onClick={() => console.log(tableRef.current && tableRef.current.getCurrentPageData())}>
                打印当前页数据
            </Button>
            {/* <SideSheet visible={visible} style={{ width: 600 }}> */}
            <div>
                <Button onClick={() => setVisible(false)}>关闭浮层</Button>
                <Table
                    scroll={{ y: 600, x: 1200 }}
                    style={{ width: 800 }}
                    columns={columns}
                    rowKey={rowKey}
                    childrenRecordName={childrenRecordName}
                    // defaultExpandAllRows
                    expandedRowKeys={expandedRowKeys}
                    onExpandedRowsChange={rows => setExpandedRowKeys(rows.map(item => item[rowKey]))}
                    rowSelection={rowSelection}
                    // hideExpandedColumn={false}
                    expandCellFixed={true}
                    dataSource={data}
                    pagination={false}
                    virtualized={{ itemSize: () => 54 }}
                    ref={tableRef}
                />
            </div>
            {/* </SideSheet> */}
        </div>
    );
}

export default ChildrenDataSelectedDemo;
