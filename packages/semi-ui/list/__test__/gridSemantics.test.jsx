import React from 'react';
import { mount } from 'enzyme';
import List from '../index';

describe('List grid semantics', () => {
    it('exposes the grid row as the owning list of its items', () => {
        const wrapper = mount(<List header="Heading" footer="Footer" grid={{ span: 12, gutter: 16 }} dataSource={['One', 'Two', 'Three']} renderItem={item => <List.Item>{item}</List.Item>} />);
        try {
            const row = wrapper.find('.semi-row-flex');
            expect(row.prop('role')).toBe('list');
            expect(row.find('li').length).toBe(3);
            expect(row.text()).toBe('OneTwoThree');
        } finally {
            wrapper.unmount();
        }
    });
    it('retains the native ul for a regular list', () => {
        const wrapper = mount(<List><List.Item>One</List.Item></List>);
        try {
            expect(wrapper.find('ul.semi-list-items').length).toBe(1);
            expect(wrapper.find('ul').find('li').text()).toBe('One');
        } finally {
            wrapper.unmount();
        }
    });
    it('preserves grid spans, gutters and row alignment', () => {
        const wrapper = mount(<List grid={{ span: 12, gutter: 16, justify: 'center', align: 'middle' }}><List.Item>One</List.Item><List.Item>Two</List.Item></List>);
        try {
            const row = wrapper.find('.semi-row-flex');
            expect(row.hasClass('semi-row-flex-center')).toBe(true);
            expect(row.hasClass('semi-row-flex-middle')).toBe(true);
            expect(wrapper.find('div.semi-col-12').length).toBe(2);
            expect(wrapper.find('div.semi-col-12').at(0).prop('style').paddingLeft).toBe(8);
        } finally {
            wrapper.unmount();
        }
    });
});
