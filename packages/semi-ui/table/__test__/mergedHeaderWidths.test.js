import React from 'react';
import Table from '../index';

const data = [{ key: 'one', a: 'A', b: 'B', c: 'C', d: 'D' }];
const getColumns = span => [{ title: 'A+B', dataIndex: 'a', width: 120, ...(span === 'colSpan' ? { colSpan: 2 } : {}) }, { title: 'B', dataIndex: 'b', width: 180, ...(span ? { onHeaderCell: () => ({ [span]: 0 }) } : {}) }, { title: 'C', dataIndex: 'c', width: 300, fixed: 'right' }, { title: 'D', dataIndex: 'd', width: 100, fixed: 'right' }];
const getOffset = wrapper => wrapper.find('th').filterWhere(node => node.text() === 'C').prop('style').right;

describe('Table merged header width mapping', () => {
    it.each(['colSpan', 'rowSpan'])('keeps fixed offsets after a hidden %s header', span => {
        const wrapper = mount(<Table columns={getColumns(span)} dataSource={data} pagination={false} scroll={{ x: 700, y: 160 }} />);
        try {
            expect(getOffset(wrapper)).toEqual(100);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps fixed offsets without a merged header', () => {
        const wrapper = mount(<Table columns={getColumns()} dataSource={data} pagination={false} scroll={{ x: 700, y: 160 }} />);
        try {
            expect(getOffset(wrapper)).toEqual(100);
        } finally {
            wrapper.unmount();
        }
    });

    it('updates width mapping when headers are merged dynamically', () => {
        const wrapper = mount(<Table columns={getColumns()} dataSource={data} pagination={false} scroll={{ x: 700, y: 160 }} />);
        try {
            expect(getOffset(wrapper)).toEqual(100);
            wrapper.setProps({ columns: getColumns('colSpan') });
            expect(getOffset(wrapper)).toEqual(100);
        } finally {
            wrapper.unmount();
        }
    });
});
