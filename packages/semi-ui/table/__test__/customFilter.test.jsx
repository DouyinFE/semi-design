import React from 'react';
import { mount } from 'enzyme';
import Table from '../index';
import ColumnFilter from '../ColumnFilter';

describe('Table custom filter entry', () => {
    const dataSource = [{ key: '1', name: 'Alpha' }, { key: '2', name: 'Beta' }];

    it('renders a custom filter panel without client-side filtering', () => {
        const onChange = sinon.spy();
        const wrapper = mount(<Table pagination={false} dataSource={dataSource} columns={[{
            title: 'Name', dataIndex: 'name', filterDropdownVisible: true,
            renderFilterDropdown: ({ confirm }) => <button onClick={() => confirm({ filteredValue: ['Alpha'], closeDropdown: true })}>Apply</button>,
        }]} onChange={onChange} />);
        try {
            expect(wrapper.find('.semi-table-column-filter').length).toBe(1);
            wrapper.find('button').simulate('click');
            expect(onChange.calledOnce).toBe(true);
            expect(onChange.firstCall.args[0].filters[0].filteredValue).toEqual(['Alpha']);
            expect(wrapper.find('.semi-table-tbody .semi-table-row').length).toBe(2);
        } finally {
            wrapper.unmount();
        }
    });

    it('renders a filterDropdown element without sorter or filters', () => {
        const onClick = sinon.spy();
        const wrapper = mount(<Table pagination={false} dataSource={dataSource} columns={[{
            title: 'Name', dataIndex: 'name', filterDropdown: <button className="custom-entry" onClick={onClick}>Custom filter</button>,
        }]} />);
        try {
            expect(wrapper.find('button.custom-entry').length).toBe(1);
            wrapper.find('button.custom-entry').simulate('click');
            expect(onClick.calledOnce).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps plain column titles unchanged', () => {
        const wrapper = mount(<Table pagination={false} dataSource={dataSource} columns={[{ title: 'Name', dataIndex: 'name' }]} />);
        try {
            expect(wrapper.find(ColumnFilter).length).toBe(0);
            expect(wrapper.find('.semi-table-row-head').text()).toBe('Name');
        } finally {
            wrapper.unmount();
        }
    });
});
