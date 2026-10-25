import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import Table from '../index';

describe('Table sorter keyboard activation', () => {
    let wrapper;
    let container;
    const dataSource = [3, 1, 2].map(value => ({ key: String(value), value }));
    const values = () => wrapper.find('.semi-table-tbody .semi-table-row-cell').map(cell => Number(cell.text()));
    const press = (node, key, charCode) => node.dispatchEvent(new KeyboardEvent('keypress', { key, charCode, bubbles: true }));

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = null;
        container.remove();
    });

    it('activates a sorter-only column through its existing click handler', () => {
        const onChange = rstest.fn();
        const columns = [{ title: 'Value', dataIndex: 'value', sorter: (a, b) => a.value - b.value }];
        wrapper = mount(<Table columns={columns} dataSource={dataSource} pagination={false} onChange={onChange} />, { attachTo: container });
        const sorter = container.querySelector('.semi-table-column-sorter-wrapper');

        sorter.click();
        wrapper.update();
        expect(values()).toEqual([1, 2, 3]);
        press(sorter, 'Enter', 13);
        wrapper.update();

        expect(values()).toEqual([3, 2, 1]);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('activates a column with sorting and filtering once per Enter', () => {
        const onChange = rstest.fn();
        const columns = [{ title: 'Value', dataIndex: 'value', sorter: (a, b) => a.value - b.value,
            filters: [{ text: 'One', value: 1 }], onFilter: (value, record) => record.value === value }];
        wrapper = mount(<Table columns={columns} dataSource={dataSource} pagination={false} onChange={onChange} />, { attachTo: container });

        press(container.querySelector('.semi-table-column-sorter-wrapper'), 'Enter', 13);
        wrapper.update();

        expect(values()).toEqual([1, 2, 3]);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('does not sort when another key is pressed', () => {
        const onChange = rstest.fn();
        const columns = [{ title: 'Value', dataIndex: 'value', sorter: (a, b) => a.value - b.value }];
        wrapper = mount(<Table columns={columns} dataSource={dataSource} pagination={false} onChange={onChange} />, { attachTo: container });

        press(container.querySelector('.semi-table-column-sorter-wrapper'), 'a', 97);
        wrapper.update();

        expect(values()).toEqual([3, 1, 2]);
        expect(onChange).not.toHaveBeenCalled();
    });
});
