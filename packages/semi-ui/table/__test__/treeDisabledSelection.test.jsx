import React from 'react';
import { mount } from 'enzyme';
import Table from '../index';
import { getAllDisabledRowKeys } from '@douyinfe/semi-foundation/table/utils';

describe('Table disabled tree selection after updating rowSelection', () => {
    const cases = [
        ['default fields', 'key', 'children', record => record.key],
        ['custom fields', 'id', 'nodes', record => record.id],
        ['function rowKey', record => record.id, 'nodes', record => record.id],
    ];

    it.each(cases)('excludes disabled descendants with %s', (name, rowKey, childrenRecordName, getKey) => {
        const dataSource = [{
            key: 'parent', id: 'parent', name: 'Parent',
            [childrenRecordName]: [
                {
                    key: 'child', id: 'child', name: 'Child',
                    [childrenRecordName]: [{ key: 'blocked', id: 'blocked', name: 'Blocked', disabled: true }],
                },
                { key: 'enabled', id: 'enabled', name: 'Enabled' },
            ],
        }];
        const getCheckboxProps = record => ({ disabled: !!record.disabled });
        const onChange = sinon.spy();
        const wrapper = mount(<Table
            dataSource={dataSource}
            columns={[{ title: 'Name', dataIndex: 'name' }]}
            rowKey={rowKey}
            childrenRecordName={childrenRecordName}
            defaultExpandAllRows
            pagination={false}
            rowSelection={{ getCheckboxProps, onChange }}
        />);
        try {
            wrapper.setProps({ rowSelection: { getCheckboxProps, onChange } });
            wrapper.find('thead .semi-checkbox').simulate('click');
            const [keys, rows] = onChange.firstCall.args;
            expect(keys.slice().sort()).toEqual(['child', 'enabled', 'parent']);
            expect(rows.map(getKey).sort()).toEqual(['child', 'enabled', 'parent']);
            const blocked = wrapper.find('tbody tr').filterWhere(row => row.text().includes('Blocked'));
            expect(blocked.find('input').prop('aria-disabled')).toBe(true);
            expect(blocked.find('input').prop('aria-checked')).toBe(false);

            wrapper.find('thead .semi-checkbox').simulate('click');
            expect(onChange.lastCall.args[0]).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    it('collects disabled keys at every depth without losing the field names', () => {
        const getCheckboxProps = record => ({ disabled: record.disabled });
        const dataSource = [{
            id: 1, disabled: true,
            nodes: [{ id: 2, disabled: true, nodes: [{ id: 3, disabled: true }] }],
        }];
        expect(getAllDisabledRowKeys({ dataSource, getCheckboxProps, rowKey: 'id', childrenRecordName: 'nodes' }))
            .toEqual([1, 2, 3]);
    });
});
