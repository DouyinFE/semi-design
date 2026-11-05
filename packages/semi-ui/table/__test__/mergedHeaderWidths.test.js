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

    // A custom header cell is not required to forward aria-colindex, and non-numeric widths must be measured.
    it.each(['auto', '20%'])('measures %s width through a custom header cell that drops aria-colindex', width => {
        const measured = { A: 120, C: 300, D: 100 };
        const rectStub = sinon.stub(HTMLElement.prototype, 'getBoundingClientRect').callsFake(function () {
            return { width: measured[this.textContent] || 0 };
        });
        const HeaderCell = ({ 'aria-colindex': ariaColIndex, ...props }) => <th {...props} />;
        const columns = getColumns('colSpan');
        columns[3].width = width;
        const wrapper = mount(<Table columns={columns} components={{ header: { cell: HeaderCell } }} dataSource={data} pagination={false} scroll={{ x: 700, y: 160 }} />);
        try {
            expect(wrapper.find('th').filterWhere(node => node.text() === 'C').prop('style').right).toEqual(100);
            expect(wrapper.find('th').filterWhere(node => node.text() === 'D').prop('style').right).toEqual(0);
        } finally {
            wrapper.unmount();
            rectStub.restore();
        }
    });

    it('measures auto width in multi-level headers through a custom header cell that drops aria-colindex', () => {
        const measured = { A: 120, C: 300, D: 100 };
        const rectStub = sinon.stub(HTMLElement.prototype, 'getBoundingClientRect').callsFake(function () {
            return { width: measured[this.textContent] || 0 };
        });
        const HeaderCell = ({ 'aria-colindex': ariaColIndex, ...props }) => <th {...props} />;
        const [a, b, c, d] = getColumns('colSpan');
        const columns = [a, b, { title: 'G', children: [c, { ...d, width: 'auto' }] }];
        const wrapper = mount(<Table columns={columns} components={{ header: { cell: HeaderCell } }} dataSource={data} pagination={false} scroll={{ x: 700, y: 160 }} />);
        try {
            expect(wrapper.find('th').filterWhere(node => node.text() === 'C').prop('style').right).toEqual(100);
            expect(wrapper.find('th').filterWhere(node => node.text() === 'D').prop('style').right).toEqual(0);
        } finally {
            wrapper.unmount();
            rectStub.restore();
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
