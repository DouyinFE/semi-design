import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import Table from '../index';
import BaseTable from '../Table';

describe('Table pageSize props updates', () => {
    let wrapper;
    const dataSource = Array.from({ length: 24 }, (_, index) => ({ key: String(index + 1), value: index + 1 }));
    const columns = [{ title: 'Value', dataIndex: 'value' }];
    const values = () => wrapper.find('.semi-table-tbody .semi-table-row-cell').map(cell => Number(cell.text()));
    afterEach(() => { wrapper?.unmount(); });

    it('updates rows and selection keys without replacing dataSource', () => {
        const onChange = rstest.fn();
        const rowSelection = { getCheckboxProps: record => ({ disabled: record.key === '8' }) };
        wrapper = mount(<Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} rowSelection={rowSelection} onChange={onChange} />);

        wrapper.setProps({ pagination: { pageSize: 10 } });
        wrapper.update();

        expect(wrapper.find(BaseTable).state('dataSource').map(record => record.key)).toEqual(dataSource.slice(0, 10).map(record => record.key));
        expect(wrapper.find(BaseTable).state('allRowKeys')).toHaveLength(10);
        expect(wrapper.find(BaseTable).state('disabledRowKeys')).toEqual(['8']);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('resets a page that is no longer valid after pageSize increases', () => {
        wrapper = mount(<Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5, defaultCurrentPage: 5 }} />);

        wrapper.setProps({ pagination: { pageSize: 10, defaultCurrentPage: 5 } });
        wrapper.update();

        expect(values()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(wrapper.find(BaseTable).state('pagination').currentPage).toBe(1);
    });

    it('keeps the filtered and sorted result when resizing the page', () => {
        const filteredColumns = [{ title: 'Value', dataIndex: 'value', sorter: (a, b) => b.value - a.value,
            defaultSortOrder: 'ascend', filters: [{ text: 'First twelve', value: true }],
            filteredValue: [true], onFilter: (_value, record) => record.value <= 12 }];
        wrapper = mount(<Table columns={filteredColumns} dataSource={dataSource} pagination={{ pageSize: 5 }} />);

        wrapper.setProps({ pagination: { pageSize: 10 } });
        wrapper.update();

        expect(values()).toEqual([12, 11, 10, 9, 8, 7, 6, 5, 4, 3]);
    });

    it('keeps server-provided rows when currentPage is controlled', () => {
        const pageData = dataSource.slice(0, 5);
        wrapper = mount(<Table columns={columns} dataSource={pageData} pagination={{ pageSize: 5, currentPage: 1, total: 24 }} />);

        wrapper.setProps({ pagination: { pageSize: 10, currentPage: 1, total: 24 } });
        wrapper.update();

        expect(values()).toEqual([1, 2, 3, 4, 5]);
    });
});
