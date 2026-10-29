import React from 'react';
import { mount } from 'enzyme';
import FloatButtonGroup from '../floatButtonGroup';

const items = [
    { value: 'help', icon: <svg><path d="M0 0h4v4z" /></svg>, content: <span data-value="content">Help</span> },
    { value: 'search', icon: <svg><path d="M0 0h4v4z" /></svg>, content: <span>Search</span>, badge: { count: 3 } },
];

describe('FloatButtonGroup click values and disabled state', () => {
    it.each([
        ['.semi-floatButtonGroup-item', 'help'],
        ['.semi-floatButtonGroup-item span', 'help'],
        ['.semi-floatButtonGroup-item svg path', 'help'],
        ['.semi-badge .semi-floatButtonGroup-item span', 'search'],
    ])('returns the item value when clicking %s', (selector, expected) => {
        const events = [];
        const wrapper = mount(<FloatButtonGroup items={items} onClick={(value, event) => events.push({ value, root: event.currentTarget })} />);
        try {
            const root = wrapper.find('.semi-floatButtonGroup').getDOMNode();
            const target = root.querySelector(selector);
            wrapper.find('.semi-floatButtonGroup').simulate('click', { target });
            expect(events).toEqual([{ value: expected, root }]);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not invoke onClick when the group is disabled', () => {
        const events = [];
        const wrapper = mount(<FloatButtonGroup items={items} disabled onClick={value => events.push(value)} />);
        try {
            const target = wrapper.find('.semi-floatButtonGroup-item').first().getDOMNode();
            wrapper.find('.semi-floatButtonGroup').simulate('click', { target });
            expect(events).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    it('stops clicks after disabled changes to true', () => {
        const events = [];
        const wrapper = mount(<FloatButtonGroup items={items} onClick={value => events.push(value)} />);
        try {
            wrapper.setProps({ disabled: true });
            const target = wrapper.find('.semi-floatButtonGroup-item').first().getDOMNode().querySelector('path');
            wrapper.find('.semi-floatButtonGroup').simulate('click', { target });
            expect(events).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not treat the group background as an item', () => {
        const events = [];
        const wrapper = mount(<FloatButtonGroup items={items} onClick={value => events.push(value)} />);
        try {
            const root = wrapper.find('.semi-floatButtonGroup');
            root.simulate('click', { target: root.getDOMNode() });
            expect(events).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    it('supports an omitted onClick callback', () => {
        const wrapper = mount(<FloatButtonGroup items={items} />);
        try {
            const target = wrapper.find('.semi-floatButtonGroup-item').first().getDOMNode().querySelector('path');
            expect(() => wrapper.find('.semi-floatButtonGroup').simulate('click', { target })).not.toThrow();
        } finally {
            wrapper.unmount();
        }
    });
});
