import React from 'react';
import sinon from 'sinon';
import Table from '../index';

const data = [{ key: 'a', name: 'Alpha', group: 'small' }, { key: 'b', name: 'Beta', group: 'small' }, { key: 'c', name: 'Gamma', group: 'large' }];
const columns = [{ dataIndex: 'name', title: 'Name' }];
const props = { columns, dataSource: data, groupBy: 'group', defaultExpandAllGroupRows: true, expandedRowRender: row => <p>{row.name}</p>, hideExpandedColumn: false, pagination: false };
const expand = (wrapper, key) => wrapper.find(`tr[data-row-key="${key}"] .semi-table-expand-icon`).simulate('click');

describe('Table grouped expanded rows', () => {
    it('includes expanded groups when expanding a record', () => {
        const onExpandedRowsChange = sinon.spy();
        const wrapper = mount(<Table {...props} onExpandedRowsChange={onExpandedRowsChange} />);
        try {
            expand(wrapper, 'a');
            expect(onExpandedRowsChange.calledOnce).toEqual(true);
            expect(onExpandedRowsChange.firstCall.args[0]).toEqual([data[0], { groupKey: 'small' }, { groupKey: 'large' }]);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not turn expanded record keys into group records', () => {
        const onExpandedRowsChange = sinon.spy();
        const wrapper = mount(<Table {...props} onExpandedRowsChange={onExpandedRowsChange} />);
        try {
            expand(wrapper, 'a');
            onExpandedRowsChange.resetHistory();
            expand(wrapper, 'large');
            expect(onExpandedRowsChange.calledOnce).toEqual(true);
            expect(onExpandedRowsChange.firstCall.args[0]).toEqual([data[0], { groupKey: 'small' }]);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the remaining group when only groups are expanded', () => {
        const onExpandedRowsChange = sinon.spy();
        const wrapper = mount(<Table {...props} onExpandedRowsChange={onExpandedRowsChange} />);
        try {
            expand(wrapper, 'large');
            expect(onExpandedRowsChange.firstCall.args[0]).toEqual([{ groupKey: 'small' }]);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps normal row expansion unchanged without grouping', () => {
        const onExpandedRowsChange = sinon.spy();
        const wrapper = mount(<Table {...props} groupBy={undefined} onExpandedRowsChange={onExpandedRowsChange} />);
        try {
            expand(wrapper, 'a');
            expect(onExpandedRowsChange.firstCall.args[0]).toEqual([data[0]]);
        } finally {
            wrapper.unmount();
        }
    });
});
