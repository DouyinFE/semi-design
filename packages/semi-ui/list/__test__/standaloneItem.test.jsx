import React from 'react';
import { mount } from 'enzyme';
import List from '../index';

describe('List.Item without a List provider', () => {
    it('renders its public content inside a native list', () => {
        const wrapper = mount(<ul><List.Item header="Header" main="Main" extra="Extra">Content</List.Item></ul>);
        try {
            expect(wrapper.find('li').text()).toBe('HeaderMainContentExtra');
            expect(wrapper.find('li').prop('className')).toBe('semi-list-item');
        } finally {
            wrapper.unmount();
        }
    });
    it('uses its own handlers without a List provider', () => {
        const calls = [];
        const wrapper = mount(<ul><List.Item onClick={() => calls.push('click')} onRightClick={() => calls.push('right')}>Content</List.Item></ul>);
        try {
            wrapper.find('li').simulate('click');
            wrapper.find('li').simulate('contextmenu');
            expect(calls).toEqual(['click', 'right']);
        } finally {
            wrapper.unmount();
        }
    });
    it('retains inherited handlers and per-item overrides inside List', () => {
        const calls = [];
        const wrapper = mount(<List onClick={() => calls.push('list')}><List.Item>Inherited</List.Item><List.Item onClick={() => calls.push('item')}>Own</List.Item></List>);
        try {
            wrapper.find('li').at(0).simulate('click');
            wrapper.find('li').at(1).simulate('click');
            expect(calls).toEqual(['list', 'item']);
        } finally {
            wrapper.unmount();
        }
    });
});
